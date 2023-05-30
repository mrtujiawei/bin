#!/bin/bash
#Filename: shell/gen.sh
#Author: Mr Prince
#Date: 2022-11-09 13:56:41
#Description: 生成 SSL 证书

openssl genrsa -out private_key.pem 1024
openssl req -new -out ca-req.csr -key private_key.pem
openssl x509 -req -in ca-req.csr -out ca-cert.pem -signkey private_key.pem -days 36500
