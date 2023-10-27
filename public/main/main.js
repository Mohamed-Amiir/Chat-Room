const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("message");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const message = input.value;

  // Emit the chat message to the server
  socket.emit('chat message', message);

  // Clear the input field
  input.value = '';
});

// Listen for incoming chat messages from the server
socket.on('chat message', (msg) => {
  const messageElement = document.createElement('li');
  messageElement.textContent = msg;
  messages.appendChild(messageElement);
});
