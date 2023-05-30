#!/bin/bash
#Filename: package/packages/bin/src/shell/git-downlow.sh
#Author: Mr Prince
#Date: 2022-02-11 16:56:33
#Description: git 下载，出错之后重试

while [ 1 -eq 1 ]
do
  git clone $@
  if [ 0 -eq $? ]
  then
    break
  else
    echo "git clone $@ failed"
  fi
done
