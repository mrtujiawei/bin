#!/bin/bash
#Filename: bin/src/shell/tmux-sessionizer.sh
#Author: Mr Prince
#Date: 2022-01-29 16:55:44
# 运行这个脚本的前提是我已经在tmux里面了

SESSION=$(find ~/github ~/work -type d | fzf)
SESSION_NAME=$(basename "$SESSION" | tr . _)

tmux has-session -t "$SESSION_NAME" > /dev/null 2>&1

if [ $? -eq 0 ]
then
  if [ -z "$TMUX" ]
  then
    tmux attach -t "$SESSION_NAME"
  else
    tmux switch-client -t "$SESSION_NAME"
  fi
else
  tmux new-session -s "$SESSION_NAME" -c "$SESSION"
fi

