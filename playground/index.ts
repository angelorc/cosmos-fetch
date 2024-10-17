import { cfetch, createStorage } from "../src";

import * as protobuf from 'protobufjs';
import * as fs from 'fs/promises';

interface Method {
  name: string;
  path: string;
  params: string[];
}

interface Service {
  name: string;
  methods: Method[];
}
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function parseProto(protoContent: string): Service[] {
  const root = protobuf.parse(protoContent).root;
  const services: Service[] = [];

  root.nestedArray.forEach((obj) => {
    if (obj instanceof protobuf.Service) {
      const service: Service = { name: obj.name, methods: [] };
      obj.methodsArray.forEach((method) => {
        const options = method.options || {};
        const httpPath = options['(google.api.http).get'] || null
        if (!httpPath) {
          return;
        }

        console.log(httpPath);
        const params = httpPath.match(/\{([^}]+)\}/g)?.map((p: string) => p.slice(1, -1)) || [];

        console.log(params);
        service.methods.push({
          name: method.name,
          path: httpPath,
          params: params,
        });
      });
      services.push(service);
    }
  });

  return services;
}

export async function generateTypeScriptFile(protoContent: string, outputPath: string): Promise<void> {
  const services = parseProto(protoContent);

  let output = 'export const protoApi = {\n';

  services.forEach((service) => {
    output += `  ${service.name.toLowerCase()}: {\n`;
    service.methods.forEach((method) => {
      const camelCaseName = toCamelCase(method.name);
      const paramString = method.params.length > 0 ? method.params.join(', ') : '';
      const functionBody = method.params.length > 0
        ? `\`${method.path.replace(/\{([^}]+)\}/g, '${$1}')}\``
        : `"${method.path}"`;
      output += `    ${camelCaseName}: (${paramString}) => ${functionBody},\n`;
    });
    output += '  },\n';
  });

  output += '};\n';

  await fs.writeFile(outputPath, output, 'utf-8');
}

// const response = await cfetch("/cosmos/staking/v1beta1/params", {
//   chain: "bitsong",
//   cache: createStorage({ driver: fsDriver({ base: "./.cache" }) }),
// });

// console.log(response);

const sampleProto = `
service Query {
  // Accounts returns all the existing accounts
  //
  // Since: cosmos-sdk 0.43
  rpc Accounts(QueryAccountsRequest) returns (QueryAccountsResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/accounts";
  }

  // Account returns account details based on address.
  rpc Account(QueryAccountRequest) returns (QueryAccountResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/accounts/{address}";
  }

  // Params queries all parameters.
  rpc Params(QueryParamsRequest) returns (QueryParamsResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/params";
  }

  // ModuleAccountByName returns the module account info by module name
  rpc ModuleAccountByName(QueryModuleAccountByNameRequest) returns (QueryModuleAccountByNameResponse) {
    option (google.api.http).get = "/cosmos/auth/v1beta1/module_accounts/{name}";
  }
}
`;

async function main() {
  try {
    await generateTypeScriptFile(sampleProto, 'src/generatedProtoApi.ts');
    console.log('Proto API TypeScript file generated successfully!');
  } catch (error) {
    console.error('Error generating Proto API TypeScript file:', error);
  }
}

main();