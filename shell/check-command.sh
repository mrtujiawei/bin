#!/bin/bash
#Filename: /home/tujiawei/github/package/packages/bin/src/shell/check-command.sh
#Author: Mr Prince
#Date: 2022-02-25 15:34:58

# 判断命令是否存在
command_exists() {
  command -v "$@" >/dev/null 2>&1
}

# 检查命令是否存在，不存在则安装
check_command() {
  command_exists "$@"
  if [ ! -z $? ]
  then
    apt install -y "$1"
  fi
}
