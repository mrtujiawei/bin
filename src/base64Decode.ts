/**
 * base64 解码
 * @filename packages/bin/src/base64Decode.ts
 * @author Mr Prince
 * @date 2023-01-30 15:23:37
 */
import { decode as base64Decode } from 'base-64';
import { decode as utf8Decode } from 'utf8';

/**
 * @param input base64 编码的字符串
 * @returns 解码后的字符串
 */
const decode = (input: string) => {
  let result = base64Decode(input);
  result = utf8Decode(result);
  return result;
};

export default decode;
