#!/bin/env node

import { Command } from 'commander';
import path from 'path';
import Server from './impl/server';

const program = new Command('server');

program
  .description('静态文件服务，支持https，请求代理')
  .option('-s, --https', '开启https', false)
  .option('-p, --port <port>', '监听端口号', '3000')
  .option('-d, --dir <directory...>', '项目根目录', [process.cwd()])
  .option('-t, --target <url>', '代理目录地址')
  .option('--prefix <prefix>', '需要代理的路径前缀', '/api')
  .option('--rewrite', '是否移除前缀', false)
  .action((options) => {
    options.port = Number(options.port);
    for (let i = 0; i < options.dir.length; i++) {
      if (!path.isAbsolute(options.dir[i])) {
        options.dir[i] = path.resolve(process.cwd(), options.dir[i]);
      }
    }
    Server(options);
  })
  .parse(process.argv);
