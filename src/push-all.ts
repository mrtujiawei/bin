/**
 * 自动提交一个文件夹下的所有项目代码
 * @filename: push-all.js
 * @author: Mr Prince
 * @date: 2022年01月04日 星期日 20时05分36秒
 */
import { getCwd, getDirs, pathResolve, exec, } from '@mrtujiawei/node-utils';
import { ExecOptionsWithStringEncoding } from 'child_process';
import { logger } from './utils';

/**
 * 提交单个git仓库
 */
const push = async (cwd: string) => {
  const options: ExecOptionsWithStringEncoding = {
    cwd,
    encoding: 'utf8',
  };
  logger.info(`${cwd} 开始提交`);
  try {
    logger.info('git add .');
    await exec('git add .', options);
    logger.info(`git commit -m 'feat(all):自动提交'`);
    await exec(`git commit -m 'feat(all):自动提交'`, options);
    logger.info('git push');
    await exec('git push', options);
    logger.info(`${cwd} 提交成功`);
  } catch (e) {
    logger.error('提交终止' + e);
  }
};

/**
 * 提交指定目录下的所有git仓库
 */
const pushAll = async () => {
  const cwd = getCwd();

  const dirs = await getDirs(cwd);
  for (let i = 0; i < dirs.length; i++) {
    const dir = pathResolve(cwd, dirs[i]);
    await push(dir);
  }
};

export default pushAll;
