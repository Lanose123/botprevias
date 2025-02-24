const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');
const textos = require('./texto.json');

// Configuração do Bot
const bot = new TelegramBot(config.telegramToken, { polling: true });

// Função para pegar vídeos aleatórios da pasta 'previas'
function getRandomVideos() {
  const videosFolder = path.join(__dirname, './previa');
  const videos = fs.readdirSync(videosFolder).filter(file => file.endsWith('.mp4'));
  
  // Seleciona aleatoriamente entre 2 a 4 vídeos
  const numVideos = Math.floor(Math.random() * 3) + 2; // Entre 2 e 4 vídeos
  const selectedVideos = [];
  
  while (selectedVideos.length < numVideos) {
    const randomIndex = Math.floor(Math.random() * videos.length);
    const video = videos[randomIndex];
    if (!selectedVideos.includes(video)) {
      selectedVideos.push(video);
    }
  }

  return selectedVideos.map(video => path.join(videosFolder, video));
}

// Função para pegar um texto aleatório do arquivo texto.json
function getRandomText() {
  const randomIndex = Math.floor(Math.random() * textos.length);
  return textos[randomIndex];
}

// Função para enviar vídeos e texto para o grupo do Telegram
function sendVideosAndText() {
  const videos = getRandomVideos();
  const text = getRandomText();

  // Envia os vídeos primeiro
  const videoPromises = videos.map(video => bot.sendVideo(config.groupId, video));

  Promise.all(videoPromises)
    .then(() => {
      // Depois de enviar os vídeos, envia o texto e o link
      return bot.sendMessage(config.groupId, text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Acessar Link VIP', url: 'https://bit.ly/larivipofc' }]  // URL completa
          ]
        }
      });
    })
    .catch(err => {
      console.error('Erro ao enviar vídeos ou texto:', err);
    });
}

// Função para iniciar o loop de envio
function startLoop() {
  sendVideosAndText();
  setInterval(sendVideosAndText, 50 * 60 * 1000); // 50 minutos em milissegundos
}

// Inicia o loop assim que o bot for ligado
startLoop();
