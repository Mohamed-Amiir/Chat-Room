const client = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const recipientSelect = document.getElementById("recipient");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    // Get the recipient of the private message
    const recipient = recipientSelect.value;

    // Emit the message to the recipient's private chat room
    client.emit("private message", {
      message: input.value,
      to: recipient,
    });

    // Display the message on the sender's screen
    displayMessage(input.value, 'sender');

    // Clear the input field
    input.value = "";
  }
});

client.on("private message", (msg) => {
  // Display the message on the receiver's screen
  displayMessage(msg, 'receiver');
  window.scrollTo(0, document.body.scrollHeight);
});

function displayMessage(msg, className) {
  const item = document.createElement("li");
  item.textContent = msg;
  item.classList.add(className);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

// Populate the recipient select element with a list of all other users in the application
client.on("users", (users) => {
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = user;
    recipientSelect.appendChild(option);
  });
});
