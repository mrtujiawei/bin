#!/bin/bash
# 写一些初始化系统的操作
# 以后直接拿着这个脚本就可以完成所有软件的安装
# 这个文件需要有root权限
# @filename: install.sh
# @author: Mr Prince
# @date: 2022-02-25 10:58:43

# 只是安装软件，不包括配置

apt update

# 备份一下sources.list
cp /etc/apt/sources.list /etc/apt/sources.list.back

# 使用阿里云镜像
echo "
deb-src http://archive.ubuntu.com/ubuntu focal main restricted #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ focal restricted main multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ focal universe
deb http://mirrors.aliyun.com/ubuntu/ focal multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security restricted main multiverse universe #Added by software-properties
deb http://mirrors.aliyun.com/ubuntu/ focal-security universe
deb http://mirrors.aliyun.com/ubuntu/ focal-security multiverse
deb http://security.ubuntu.com/ubuntu/ focal-security restricted main multiverse universe
" > /etc/apt/sources.list

apt update
# universal-ctags: 大部分时候并没有用,但有用的时候非常好用
# tmux: 终端复用，但是用 vim 会有点问题
# zsh: 美化终端，但是还是有点坑的，一些功能没法用
# sshpass: 方便用ssh, 可以直接写密码，但是其实可以配置key就可以免密了
# ranger: 文件浏览器，蛮好用的
# fd-find: 查找工具，据说比 find 快很多，有空钻研一下
# ripgrep: 内容搜索工具
# silversearcher-ag: 貌似和rg差不多
apt install -y wget git nodejs universal-ctags tmux zsh sshpass ranger fd-find ripgrep silversearcher-ag

# 终端翻译工具,需要安装依赖
# 用法: fanyi 'word'
apt install -y festival festvox-kallpc16k fanyi

# 安装指定版本的 node
# 修改版本改 20
wget -qO- https://deb.nodesource.com/setup_20.x | bash -

# 切换镜像
npm config set registry http://registry.npm.taobao.org/

# 安装时锁定版本，不依赖 *.lock 文件
npm config set save-exact true

# 安装yarn是为了代码提示
# @mrtujiawei/bin: 我自己写的一些脚本
# vtop: top 可视化
# speed-test: 测网速
npm i -g yarn @mrtujiawe/bin vtop speed-test

# ohmyzsh (zsh配置)
# ohmyzsh 会改 git branch 的行为
# 恢复: git config --global core.pager 'less'
./git-download.sh https://github.com/ohmyzsh/ohmyzsh.git --depth 1
./ohmyzsh/tools/install.sh
rm -rf ohmyzsh

# tmux 支持256色 或者 tmux -2 强制开启256色
echo "export TERM=\"xterm-256color\"" >> ~/.zshrc

echo
echo "运行以下命令完成vim安装及配置:"
echo "    git clone https://github.com/mrtujiawei/vimrc.git --depth 1 ~/.vim"
echo "    ~/.vim/scripts/vim-install.sh"
echo "    ~/.vim/scripts/install.sh"
echo
