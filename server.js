// --- LA CENTRALITA (SERVIDOR DE SEÑALIZACIÓN) ---
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Configuramos Socket.io para que acepte conexiones de nuestra página web
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('📞 Un nuevo jugador ha contactado con la centralita.');

  // Cuando un jugador envía su señal de voz, el servidor hace de puente y se la pasa al resto de la sala
  socket.on('enviar-señal', (datos) => {
    socket.broadcast.emit('recibir-señal', datos);
  });

  // Escuchar cuando alguien crea una sala nueva
  socket.on('crear-sala', (datosSala) => {
    console.log('Nueva sala creada:', datosSala.nombre);
    // Rebotar la información de la nueva sala a TODOS los demás jugadores
    socket.broadcast.emit('sala-nueva-creada', datosSala);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Un jugador ha colgado o se ha desconectado.');
  });
});

// Arrancamos el servidor en el puerto 3000
server.listen(3000, () => {
  console.log('✅ El Telefonista está activo y escuchando en http://localhost:3000');
});
