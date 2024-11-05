# Chatbot - a simple chatbot using websockets

A ideia é desenvolver um chatbot simples, que responde a perguntas do usuário. Para isso, no servidor (ou seja, no bot), devem estar cadastradas previamente algumas perguntas e possíveis respostas. Confira alguns exemplos de questões que podem estar cadastradas (P - perguntas, R - respostas):

    P: Tudo bem? R: Sim, tudo ótimo!
    P: Quais filmes estão em cartaz? R: Hoje, está em cartaz o filme da Patrulha Canina.
    P: Quanto custa o Aerolin? R: O Aerolin custa R$29,00.
    P: Sair. R: Obrigado por utilizar nosso sistema!

## Frameworks e Linguagem
### Aplicalção gráfica: 
- HTML 
- CSS (tailwind)
- Javascript
### API: 
- NodeJs (ws para websockets, fastify para inicialização da api e nodemon para auto-reload quando alteramos o código)
- Javascript

## Setup e Inicialização
### Requisitos: 
node >= 20
npm >= 9.5
OS: Windows ou Distro Linux (Testado em wsl2 com Ubuntu 22-04)

### Rodando a API:
Abra o seu terminal na raiz do projeto e execute o seguinte comando:
```sh
npm run dev
```

### Abrindo interface gráfica:
Abra o arquivo index.html que está dentro da pasta app no seu navegador.

## Informações importantes:
- Estou considerando apenas um usuário por sessão. Então se houver mais de um usuário tentando se conectar com o socket provavelmente terá um comportamento inesperado 🤡.