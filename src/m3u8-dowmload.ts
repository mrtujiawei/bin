import { logger, isComment, getDomain, isCompleteUrl } from './utils';
import {
  mkdir,
  rmdir,
  getCwd,
  request,
  writeFile,
  pathResolve,
  getFileName,
} from '@mrtujiawei/node-utils';
import { Lock } from '@mrtujiawei/utils';

const getDownloader = (domain: string, relativePrefix: string, dir: string) => {
  const lock = new Lock(4);
  return async (url: string) => {
    if (!url || isComment(url)) {
      return;
    }
    if (!isCompleteUrl(url)) {
      if (url.startsWith('/')) {
        url = domain + url;
      } else {
        url = relativePrefix + url;
      }
    }
    const fileName = getFileName(url);
    try {
      await lock.lock();
      let tsData = await request(url);
      let path = pathResolve(dir, fileName);
      await writeFile(path, tsData);
      logger.trace(`下载成功 ${fileName}`);
    } catch (e) {
      logger.error(`下载失败: ${fileName}`);
      logger.error(`失败地址: ${url}`);
      logger.error('' + e);
    } finally {
      lock.unlock();
    }
  };
};

/**
 * 额外的参数只支持 -dir 指定下载目录
 */
const download = async (m3u8: string, params: { dir?: string }) => {
  const domain = getDomain(m3u8);
  const relativePrefix = m3u8.replace(/[^/]*$/, '');

  const buffers = await request(m3u8);
  const m3u8List = buffers.join('');

  // 处理特殊的m3u8内容
  const playList = m3u8List.split(/\r?\n/);

  const dir = pathResolve(
    getCwd(),
    params.dir || m3u8.split(/[/.]/).slice(-2, -1)[0]
  );
  await rmdir(dir);
  logger.trace('删除目录 ' + dir + ' 成功');
  await mkdir(dir);
  logger.trace('创建目录 ' + dir + ' 成功');

  const filePlayList = playList.map((line) => {
    const url = line;
    if (!url || isComment(url)) {
      return line;
    }
    return `/${getFileName(url)}`;
  });

  await writeFile(pathResolve(dir, 'index.m3u8'), filePlayList.join('\n'));
  logger.trace('写入index.m3u8成功');

  const downloader = getDownloader(domain, relativePrefix, dir);
  playList.forEach((url) => {
    downloader(url);
  });
};

export default download;
