const messagesContainer = document.getElementById('messages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const statusText = document.getElementById('status');

let socket = null;

function connect() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  socket = new WebSocket(`${protocol}//${window.location.host}/ws`);

  socket.onopen = () => {
    statusText.textContent = 'Online';
    statusText.className = 'status online';
  };

  socket.onmessage = (event) => {
    appendMessage(event.data);
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
