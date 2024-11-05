const http = require("http");
const fastify = require("fastify");
const WebSocket = require("ws");

const app = fastify();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const APP_PORT =  3001;

const database = require("./database/db.json");

server.listen(3001, () =>
  console.log(`Server up::${APP_PORT}`)
);

let session = null;

wss.on("connection", (ws) => {
  session = ws;
  sendWelcomeMessage()

  ws.on("close", () => {
    session = null
  });

  ws.on("message", handleIncomingMessage.bind(null, ws));
});

function handleIncomingMessage(ws, msg) {
  const _msg = JSON.parse(msg);
  const message = _msg.message.toLowerCase();
  handleMessageText(message)
}

function handleMessageText(message) {
    switch (true) {
      case message === 'ping': return sendPongMessage();
      case message.includes('help'): return sendHelpMessage();
      case message.includes('sair'): return closeSession();
  
      case message.includes('listar todos'): return sendAllGames();
      case message.includes('listar gêneros'): return sendAllGenres();
      case message.includes('listar desenvolvedores'): return sendAllDevelopers();
      case message.includes('listar anos'): return sendAllReleaseYear();

      case message.includes('informações do jogo'): return sendGameInfo(message);
      case message.includes('jogos do gênero'): return sendGameOfGenre(message);
      case message.includes('jogos do desenvolvedor'): return sendGamesOfDeveloper(message);
      case message.includes('jogos do ano'): return sendGamesOfYear(message);
      default: return sendUnknownCommandMessage()
    }
}

function closeSession() {
  socket.close()
}

function sendUnknownCommandMessage() {
  session.send('<p class="text-gray-700">Não entendi o que você disse. <br> Digite <b>"help"</b> para ajuda.</p>');
}

function sendWelcomeMessage() {
  session.send('<p class="text-gray-700">Olá! Sou o assistente virtual de jogos! A qualquer momento pode solicitar ajuda digitando <b>"help"</b>.</p>');
}

function sendPongMessage(){
  session.send('<p class="text-gray-700">Pong!</p>');
}

function sendHelpMessage(){
  session.send('<p class="text-gray-700">Digite qualquer comando abaixo saberei como responder 😊</p>')
  session.send(`
    <ul class="text-gray-700">
    <li><b>help:</b> Exibe o texto de ajuda.</li>
    <li><b>listar todos:</b> Lista todos os jogos cadastrados no meu banco de dados.</li>
    <li><b>listar gêneros:</b> Lista todos os gêneros que os jogos cadastrados possuem.</li>
    <li><b>listar desenvolvedores:</b> Lista todos os desenvolvedores cadastrados no meu banco de dados.</li>
    <li><b>listar anos:</b> Lista todos os anos de lançamento dos jogos cadastrados no meu banco de dados.</li>
    <li><b>informações do jogo [jogo]:</b> Busca a informação do jogo escolhido.</li>
    <li><b>jogos do gênero [gênero]:</b> Lista todos os jogos pertencente ao gênero escolhido.</li>
    <li><b>jogos do desenvolvedor [desenvolvedor]:</b> Lista todos os anos do desenvolvedor escolhido.</li>
    <li><b>jogos do ano [ano]:</b> Lista todos os jogos que foram lançados no ano escolhido.</li>
    <li><b>sair:</b> Encerrar sessão.</li>
    <li><b>ping:</b> Teste de conexão.</li>
    </ul>
    `)
}

function sendAllGames(){
  database.forEach(game => {
    session.send(`
    <p class="text-gray-700">
    <b>Nome:</b> ${game.name}<br>
    <b>Desenvolvedor:</b> ${game.developer}<br>
    <b>Ano de lançamento:</b>${game.releaseYear} <br>
    <b>Gênero:</b> ${game.genre}<br>
    <b>Preço:</b> ${game.price}<br>
    <b>Avaliação:</b> ${game.rating}<br>
    </p>
    `)
  })
}

function sendAllGenres(){
  const genres = [...new Set(database.map(game => game.genre))];
  const message = `<p class="text-gray-700">${genres.join(', ')}</p>`
  session.send(message)
}

function sendAllDevelopers(){
  const developers = [...new Set(database.map(game => game.developer))];
  const message = `<p class="text-gray-700">${developers.join(', ')}</p>`
  session.send(message)
}

function sendAllReleaseYear(){
  const releaseYears = [...new Set(database.map(game => game.releaseYear))];
  const message = `<p class="text-gray-700">${releaseYears.join(', ')}</p>`
  session.send(message)
}

function sendGameInfo(msg){
 const param = msg.split('informações do jogo ')[1].toLowerCase();
 const game = database.find(game => game.name.toLowerCase() === param);
 if(!game){
  return session.send(`<p class="text-gray-700">Não encontrei o jogo ${param} ☹️.</p>`)
 }
 session.send(`
  <p class="text-gray-700">
  <b>Nome:</b> ${game.name}<br>
  <b>Desenvolvedor:</b> ${game.developer}<br>
  <b>Ano de lançamento:</b> ${game.releaseYear} <br>
  <b>Gênero:</b> ${game.genre}<br>
  <b>Preço:</b> ${game.price}<br>
  <b>Avaliação:</b> ${game.rating}<br>
  </p>
  `)
}

function sendGameOfGenre(msg){
 const param = msg.split('jogos do gênero ')[1].toLowerCase();
 const genre = database.filter(game => game.genre.toLowerCase() === param);

 if(!genre.length){
  return session.send(`<p class="text-gray-700">Não encontrei o gênero ${param} ☹️.</p>`)
 }

 const games = genre.map(game => game.name).join("<br>");
 session.send(`
  <p class="text-gray-700">Os jogos de <b>${param}</b> são:<br>${games}</p>
  `)
}

function sendGamesOfDeveloper(msg){
 const param = msg.split('jogos do desenvolvedor ')[1].toLowerCase();
 const developer = database.filter(game => game.developer.toLowerCase() === param);

 if(!developer.length){
  return session.send(`<p class="text-gray-700">Não encontrei o desenvolvedor ${param} ☹️.</p>`)
 }

 const games = developer.map(game => game.name).join("<br>");
 session.send(`
  <p class="text-gray-700">Os jogos do(a) <b>${param}</b> são:<br>${games}</p>
  `)
}

function sendGamesOfYear(msg){
 const param = msg.split('jogos do ano ')[1];
 const releaseYear = database.filter(game => game.releaseYear === param);

 console.log(param)
 console.log(releaseYear)
 if(!releaseYear.length){
  return session.send(`<p class="text-gray-700">Não encontrei o ano ${param} ☹️.</p>`)
 }

 const games = releaseYear.map(game => game.name).join("<br>");
 session.send(`
  <p class="text-gray-700">Os jogos lançados em <b>${param}</b> são:<br>${games}</p>
  `)
}