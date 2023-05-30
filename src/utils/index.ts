import http from 'http';
import https from 'https';
import { Logger } from '@mrtujiawei/utils';

export const logger = Logger.getLogger('@mrtujiawei/bin');

logger.setLevel(Logger.LOG_LEVEL.ALL);

logger.subscribe((content) => {
  console.log(content.getFormattedMessage());
});

class InvalidAgrumentsError extends Error {
  constructor(message = 'Invalid Arguments') {
    super(message);
  }
}

/**
 * @param url - http或https开头的url
 * @returns - 返回http或https开头的域名地址
 */
export const getDomain = (url: string): string => {
  checkUrl(url);
  const match = url.match(/^http[s]?\:\/\/[^/]+/) || [];
  return match[0] || '';
};

/**
 * 是否是m3u8的注释行
 */
export const isComment = (line: string) => {
  if (!line) {
    return false;
  }
  return line.startsWith('#');
};

/**
 * 判断是否是完整的url, http开头
 * @param  url
 * @returns
 */
export const isCompleteUrl = (url: string): boolean => {
  if (!url) {
    return false;
  }
  return url.startsWith('http');
};

/**
 * 判断是否是完整的url, http开头
 * @param {string} url
 */
const checkUrl = (url: string): void => {
  if (!isCompleteUrl(url)) {
    throw new InvalidAgrumentsError();
  }
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
