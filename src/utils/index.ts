import http from 'http';
import https from 'https';
import { Logger, M3u8FileUtils, URLUtils } from '@mrtujiawei/utils';

export const logger = Logger.getLogger('@mrtujiawei/bin');

logger.setDefaultConfig();

/**
 * 是否是m3u8的注释行
 */
export const isComment = (line: string) => {
  return M3u8FileUtils.isCommentLine(line);
};

/**
 * 判断是否是完整的url, http开头
 * @param  url
 * @returns
 */
export const isCompleteUrl = (url: string): boolean => {
  return URLUtils.hasProtocal(url);
};

export async function sendRequest(
  options: https.RequestOptions,
  body?: Record<string, unknown>,
  secure?: boolean
) {
  let sender = secure ? https : http;
  return new Promise((resolve, reject) => {
    const client = sender
      .request(options, (res) => {
        let data: any[] = [];
        res.on('data', (chunk) => {
          data.push(chunk.toString());
        });
        res.on('end', () => {
          resolve(data.join(''));
        });
      })
      .end(JSON.stringify(body))
      .on('timeout', () => {
        logger.info('请求超时');
        reject(new Error('请求超时'));
        client.destroy();
      })
      .on('error', (err) => {
        console.log({ err });
        reject(err);
      });
  });
}
