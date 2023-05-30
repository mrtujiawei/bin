import http from 'http';

const port = 4444;

http
  .createServer((req, res) => {
    const fileName = '.' + req.url;

    if (fileName === './stream') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'charset': 'utf-8',
      });

      // 重连事件
      res.write('retry: 10000\n');

      // 触发事件
      res.write('event: connecttime\n');

      // 发送数据
      res.write('data: ' + new Date().toISOString() + '\n\n');
      res.write('data: ' + new Date().toISOString() + '\n\n');
      res.write('id:msg1\n');
      let count = 0;
      const interval = setInterval(() => {
        // 发送ID:相当于保存个锚点,出错了从这里开始恢复
        res.write('id:msg' + count + '\n');
        res.write('data: ' + new Date().toISOString() + '---' + count + '---' + '\n\n');
        count++;
      }, 1000);

      req.socket.addListener('close', () => {
        clearInterval(interval);
      });
    } else {
      res.writeHead(200);
      res.write('Hello World');
      res.end();
    }
  })
  .listen(port);

// 客户端接收推送
// const eventSource = new EventSource(`http://localhost:${port}/stream`);
// eventSource.addEventListener('message', (event) => {
//   const data = event.data;
//   console.log(data);
// });
