#!/bin/sh

rm -rf generated/*

# --ts_proto_opt=esModuleInterop=true,outputService=grpc-js,env=both,forceLong=bigint,outputServices=generic-definitions,outputServices=default

protoc \
    --plugin=../ts-proto/protoc-gen-ts_proto \
    --ts_proto_out=./generated \
    --ts_proto_opt=onlyTypes=true,outputServices=generic-google-api-http-definitions \
    ./tmp/cosmos-sdk-0.45.16/proto/cosmos/base/v1beta1/*.proto