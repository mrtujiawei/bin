import http from 'http';
import https from 'https';
import path from 'path';
import Koa from 'koa';
import Static from 'koa-static';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { getIps } from '@mrtujiawei/node-utils';
import { logger, sendRequest } from '../utils';
import { Buffer } from 'buffer';
import { CA_CERT, PRIVATE_KEY } from '../config';
import { RawData, WebSocket, WebSocketServer } from 'ws';

interface Options {
  https: boolean;
  port: number;
  dir: string[];
  target?: string;
  prefix: string;
  rewrite: boolean;
}

export default function server(options: Options) {
  const app = new Koa();
  const router = new Router();

  options.dir.forEach((dir) => {
    logger.info(`static dir: ${dir}`);
    app.use(Static(dir));
  });

  // 默认的静态页面
  app.use(Static(path.resolve(__dirname, '../../public/')));

  app
    .use(cors())
    .use(bodyParser())
    .use(router.routes())
    .use((context, next) => {
      const req = context.req;
      const path = context.path;
      const method = req.method;
      const querystring = context.querystring;

      logger.trace(`${method} ${path}${querystring ? `?${querystring}` : ''}`);

      return next();
    })
    .use(router.allowedMethods());

  // 需要开代理
  if (options.target) {
    app.use(async (context, next) => {
      const { request } = context;
      const prefixReg = new RegExp(`^${options.prefix}`);
      if (prefixReg.test(request.url)) {
        if (options.rewrite) {
          request.url = request.url.replace(prefixReg, '');
        }
        const url = new URL(options.target!);
        let requestOptions: https.RequestOptions = {
          method: request.method,
          path: path.resolve(url.pathname, request.url),
          hostname: url.hostname,
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const skipKeys = new Set([
          'host',
          'referer',
          'accept-encoding',
          'Content-Length',
        ]);
        for (const key in request.headers) {
          if (skipKeys.has(key)) {
            continue;
          }
          requestOptions.headers![key] = request.headers[key];
        }

        try {
          const data = await sendRequest(
            requestOptions,
            request.body,
            options.target?.startsWith('https')
          );
          context.body = data;
        } catch (e) {
          context.body = e;
        }
      } else {
        await next();
      }
    });
  }

  let server: http.Server | https.Server;

  if (options.https) {
    const httpsOptions = {
      key: Buffer.alloc(PRIVATE_KEY.length, PRIVATE_KEY),
      cert: Buffer.alloc(CA_CERT.length, CA_CERT),
    };

    server = https.createServer(httpsOptions, app.callback());
  } else {
    server = http.createServer(app.callback());
  }

  const ws = new WebSocketServer({ server });
  const messages: RawData[] = [];
  ws.addListener('connection', (client) => {
    client.on('message', (data) => {
      messages.push(data);
      ws.clients.forEach((client) => {
        if (client.readyState == WebSocket.OPEN) {
          client.send(data);
        }
      });
    });
    if (messages.length > 0) {
      messages.forEach((message) => {
        client.send(message);
      });
    }
  });

  server.listen(options.port, () => {
    logger.info('Server is running at:');
    const ips = getIps();
    ips.forEach((ip) => {
      logger.info(`http${options.https ? 's' : ''}://${ip}:${options.port}`);
    });

    logger.info('');
    logger.info('Default socket page is serving at:');
    ips.forEach((ip) => {
      logger.info(
        `http${options.https ? 's' : ''}://${ip}:${options.port}/socket`
      );
    });
  });
}
