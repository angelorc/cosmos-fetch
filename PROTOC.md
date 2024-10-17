# generate from proto

```
protoc \
    --plugin=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=./tttt \
    --ts_proto_opt=esModuleInterop=true,outputService=grpc-js,env=both,forceLong=bigint,outputServices=generic-definitions,outputServices=default \
    --proto_path=./tmp/cosmos-sdk-0.45.16/proto/ \
    ./tmp/cosmos-sdk-0.45.16/proto/cosmos/auth/v1beta1/query.proto
```