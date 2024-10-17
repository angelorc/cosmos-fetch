#!/bin/bash

rm -rf tmp

wget https://github.com/cosmos/cosmos-sdk/archive/refs/tags/v0.45.16.zip -O cosmos-sdk_v0.45.16.zip
unzip cosmos-sdk_v0.45.16.zip

mkdir -p ./tmp/cosmos-sdk-0.45.16
mv cosmos-sdk-0.45.16/proto tmp/cosmos-sdk-0.45.16/
mv cosmos-sdk-0.45.16/third_party/proto/* tmp/cosmos-sdk-0.45.16/proto/

rm -rf cosmos-sdk-0.45.16 cosmos-sdk_v0.45.16.zip cosmos-sdk-0.45.16-proto