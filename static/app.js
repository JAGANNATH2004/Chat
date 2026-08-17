const messagesContainer = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const statusText = document.getElementById('status');
const clearBtn = document.getElementById('clearBtn');

let socket = null;

function connect() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  socket = new WebSocket(`${protocol}//${window.location.host}/ws`);

  socket.onopen = () => {
    statusText.textContent = 'Online';
    statusText.className = 'status online';
  };

  socket.onmessage = (event) => {
    if (event.data === '__CLEAR__') {
      messagesContainer.innerHTML = '';
    } else {
      appendMessage(event.data);
    }
  };

  socket.onclose = () => {
    statusText.textContent = 'Offline (Reconnecting...)';
    statusText.className = 'status offline';
    setTimeout(connect, 2000);
  };

  socket.onerror = () => {
    socket.close();
  };
}

function appendMessage(text) {
  const div = document.createElement('div');
  div.className = 'message-item';
  div.textContent = text;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

clearBtn.addEventListener('click', () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send('__CLEAR__');
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(text);
    messageInput.value = '';
    messageInput.focus();
  }
});

connect();
