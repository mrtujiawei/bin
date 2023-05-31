const messages = document.querySelector('.messages');
const input = document.querySelector('.input');
const sendBtn = document.querySelector('.send-btn');
const protocol = window.location.protocol == 'https:' ? 'wss' : 'ws';

const webSocketUrl = `${protocol}://${window.location.host}`;

const createWebSocket = (url, callback) => {
  const socket = new WebSocket(url);
  const events = ['open', 'close', 'message', 'error'];

  const callbacks = events.map((type) => {
    const cb = (event) => {
      callback({ type, event });
    };
    socket.addEventListener(type, cb);
    return cb;
  });

  return {
    socket,
    close() {
      events.forEach((type, index) => {
        socket.removeEventListener(type, callbacks[index]);
      });
      socket.close();
    },
  };
};

const onMessage = (message) => {
  const element = message.toElement();
  messages.appendChild(element);
  const rect = element.getBoundingClientRect();
  const delta = 30;
  if (rect.top < messages.clientHeight + delta) {
    messages.scrollBy({
      top: element.clientHeight,
      behavior: 'smooth',
    });
  }
};

class Message {
  type;
  content;
  time = new Date();
  constructor(type, content) {
    this.type = type;
    this.content = content;
  }

  toElement() {
    const li = document.createElement('li');
    li.innerHTML = `${this.time.toLocaleTimeString()}: ${this.content}`;
    if (0 == this.type) {
      li.className = 'message message-system';
    } else {
      li.className = 'message message-user';
    }
    return li;
  }
}

let sendMessage;
let reconnectCount = 0;

const init = async () => {
  let connect = false;
  const { socket } = createWebSocket(webSocketUrl, ({ type, event }) => {
    console.log(`Socket ${type}`, event);
    if (type == 'open') {
      connect = true;
      onMessage(new Message(0, '连接成功'));
    } else if (type == 'error') {
      if (connect) {
        onMessage(new Message(0, '连接错误'));
      } else {
        onMessage(new Message(0, '连接失败'));
      }
    } else if (type == 'message') {
      onMessage(new Message(1, event.data));
    } else if (type == 'close') {
      connect = false;
      unlisten();
      if (connect) {
        onMessage(new Message(0, '连接已关闭'));
      }
      setTimeout(() => {
        onMessage(new Message(0, '正在重试中...'));
        init();
      }, reconnectCount++ * 1000);
    } else {
      // 不可能出现未知的type
    }
  });

  sendMessage = () => {
    if (!input.value) {
      return;
    }
    socket.send(input.value);
    input.value = '';
  };

  sendBtn.addEventListener('click', sendMessage);

  const callback = (event) => {
    if (event.key == 'Enter') {
      sendMessage();
    }
  };
  input.addEventListener('keyup', callback);

  const unlisten = () => {
    sendBtn.removeEventListener('click', sendMessage);
    input.removeEventListener('keyup', callback);
  };
};

init();
