/**
 * @filename /home/tujiawei/github/package/packages/bin/src/index.ts
 * @author Mr Prince
 * @date 2022-11-25 21:01:36
 */
import { Command } from 'commander';
import path from 'path';
import server from './impl/server';
import download from './m3u8-dowmload';
import pushAll from './push-all';
import skipBytes from './skipBytes';
import runJava from './javaRunner';

const program = new Command();

program.name('t').description('').version(require('../package.json').version);

program
  .command('download-m3u8')
  .description('下载m3u8文件')
  .argument('<url>', 'index.m3u8')
  .option('--dir <dir>', '指定下载目录')
  .action((url: string, options: { dir?: string }) => {
    return download(url, options);
  });

program
  .command('pushAll')
  .description('提交指定目录下的所有git仓库')
  .action(() => {
    pushAll();
  });

program
  .command('server')
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
    server(options);
  });

program
  .command('skip-bytes')
  .description('转换非.ts文件到.ts')
  .requiredOption('-p --position <position>', '起始位置')
  .action((options: { position: string }) => {
    skipBytes(Number(options.position));
  });

program
  .command('run-java')
  .description('运行 java maven 项目中的单个文件')
  .argument('<filename>', '文件名 *.java')
  .action((filename: string) => {
    runJava(filename);
  });

program.parse(process.argv);
