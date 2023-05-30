#!/bin/bash
# @filename: toggleMirror.sh
# @author: Mr Prince
# @date: 2020年08月08日 星期六 21时37分24秒
# 写一个切换镜像的脚本

echo

COMMAND=$1

if [[ -z $COMMAND ]]
then
  COMMAND="-h"
fi

if [[ '-h' == $COMMAND ]]
then
  echo "Usage: toggle-npm-mirror [registry]"
  echo "       toggle-npm-mirror ls"
  echo
  exit 0
elif [[ 'ls' == $COMMAND ]]
then
  echo "npm ---------- https://registry.npmjs.org/"
  echo "cnpm --------- https://r.cnpmjs.org/"
  echo "yarn --------- https://registry.yarnpkg.com/"
  echo "taobao ------- https://registry.npmmirror.com/"
  echo "tencent ------ https://mirrors.cloud.tencent.com/npm/"
  echo "npmMirror ---- https://skimdb.npmjs.com/registry/"
  echo
  echo "current ------ "$(npm config get registry)
  echo
  exit 0
elif [[ 'npm' == $COMMAND ]]
then
  npm config set registry https://registry.npmjs.org/
elif [[ 'cnpm' == $COMMAND ]]
then
  npm config set registry https://r.cnpmjs.org/
elif [[ 'yarn' == $COMMAND ]]
then
  npm config set registry https://registry.yarnpkg.com/
elif [[ 'taobao' == $COMMAND ]]
then
  npm config set registry https://registry.npmmirror.com/
elif [[ 'tencent' == $COMMAND ]]
then
  npm config set registry https://mirrors.cloud.tencent.com/npm/
elif [[ 'npmMirror' == $COMMAND ]]
then
  npm config set registry https://skimdb.npmjs.com/registry/
fi

echo "current ------ "$(npm config get registry)
echo
