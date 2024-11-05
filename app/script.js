const WS_URL = "ws://localhost:3001";

const sendButton = document.getElementById("send-button");
const messageInput = document.getElementById("message-input");
const chatArea = document.getElementById("chat-area");
const inputArea = document.getElementById("input-area");
const footerArea = document.getElementById("footer-area");
messageInput.value = null;

sendButton.addEventListener("click", handleSocketSendMessage);

let socket = new WebSocket(WS_URL);

function handleSocketOpen() {
  console.log("Websocket conectado.");
}

function handleSocketError(error) {
  console.error("Erro no Websocket:", error);
}

function handleSocketClose() {
  console.log("Websocket fechado.");
  footerArea.removeChild(inputArea)
  const html = document.createElement("div");
  html.classList.add("text-center");
  var innerHtml = `<p class="text-gray-700">Sessão encerrada! Para uma nova sessão recarrege seu navegador.</p>  `;
  html.innerHTML = innerHtml;
  footerArea.append(html);
}

function handleSocketReceiveMessage(event) {
  const html = document.createElement("div");
  html.classList.add("flex");
  html.classList.add("mb-4");
  var innerHtml = `
  <div class="flex max-w-96 bg-gray-300 rounded-lg p-3 gap-3">
    ${event.data}
  </div>
  `;
  html.innerHTML = innerHtml;
  chatArea.append(html);
}

function handleSocketSendMessage(event) {
  const message = messageInput.value;
  if (socket.readyState === WebSocket.OPEN && message) {
    const html = document.createElement("div");
    html.classList.add("flex");
    html.classList.add("mb-4");
    html.classList.add("justify-end");
    var innerHtml = `
    <div class="flex max-w-96 bg-blue-800 text-white rounded-lg p-3 gap-3">
      <p>${message}</p>
    </div>
    `;
    html.innerHTML = innerHtml;
    chatArea.append(html);

    socket.send(JSON.stringify({message}));
    messageInput.value = null;
  } else {
    console.warn(
      "Websocket não está aberto. Aguarde e tente novamente em instantes."
    );
  }
}

function connectWebSocket() {
  socket = new WebSocket(WS_URL);

  socket.addEventListener("open", handleSocketOpen);
  socket.addEventListener("message", handleSocketReceiveMessage);
  socket.addEventListener("error", handleSocketError);
  socket.addEventListener("close", handleSocketClose);
}

connectWebSocket();

