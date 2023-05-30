/**
 * 跳过一些特定的头部字段
 *
 * @filename package/packages/bin/src/skipBytes.ts
 * @author Mr Prince
 * @date 2022-12-13 14:35:06
 */

import { openSync, readdirSync, readSync, writeFileSync } from 'fs';
import { parse } from 'path';

/**
 * .png 文件其实就是 ts文件加了png的魔法头 `89 50 4e 47 0d 0a 1a 0a`
 * @param position 魔法头长度
 */
const transfer = (name: string, position: number, ext: string = '.png') => {
  // 单次读取的长度
  const length = 1024 * 1024;

  const dataView = new DataView(new ArrayBuffer(length));
  const input = openSync(`${name}${ext}`, 'r');
  const output = openSync(`${name}.ts`, 'w');

  let result = readSync(input, dataView, 0, length, position);

  // 修改 bytes 内容， 实际上是不需要的
  // for (let i = 0; i < dataView.buffer.byteLength; i++) {
  //   const value = String.fromCharCode(dataView.getInt8(i));
  //   if (value == 'H') {
  //     const start = i + 4;
  //     // FFmpeg.Service
  //     for (let j = result - 1; j > start; j--) {
  //       dataView.setInt8(j + 12, dataView.getInt8(j));
  //     }
  //     const key = 'FFmpeg.Service01w|C';
  //     for (let j = 0; j < key.length; j++) {
  //       dataView.setInt8(start + j, key[j] == '.' ? 9 : key.charCodeAt(j));
  //     }
  //     result += 12;
  //     break;
  //   }
  // }

  writeFileSync(output, new DataView(dataView.buffer, 0, result));
  while (result == length) {
    position += result;
    result = readSync(input, dataView, 0, length, position);
    writeFileSync(output, new DataView(dataView.buffer, 0, result));
  }
};

export default (position: number) => {
  const files = readdirSync('.');

  files.forEach((file) => {
    const info = parse(file);
    if (info.ext != '.m3u8' && info.ext != '.ts') {
      transfer(info.name, position, info.ext);
    }
  });
};
