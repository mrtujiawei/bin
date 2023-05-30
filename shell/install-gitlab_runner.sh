#!/bin/bash
#Filename: github/package/packages/bin/shell/install-gitlab_runner.sh
#Author: Mr Prince
#Date: 2022-11-08 15:31:14
#Description: gitlab runner 安装
#Link https://docs.gitlab.com/runner/install/linux-repository.html

curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt-get install gitlab-runner

# 注册runner
sudo gitlab-runner register
sudo gitlab-runner start

# 验证
# gitlab-runner verify

# 删除runner
# gitlab-runner verify --delete --name [name]

# 卸载
# gitlab-runner uninstall

# 重新安装
# gitlab-runner install -u gitlab-runner

# 权限问题修复

# # 查看当前 runner 用户
# ps aux | grep gitlab-runner
#
# # 删除 gitlab-runner
# sudo gitlab-runner uninstall
#
# # 安装并设置--user(例如我想设置为 root)
# sudo gitlab-runner install --working-directory /home/gitlab-runner --user root
#
# #重启 gitlab-runner
# sudo service gitlab-runner restart
#
# # 再次执行会发现--user 的用户名已经更换成 root 了
# ps aux | grep gitlab-runner
