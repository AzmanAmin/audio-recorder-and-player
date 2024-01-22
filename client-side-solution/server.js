const express = require("express");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const { join } = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const ioServer = new Server(server);
const port = 3001;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

ioServer.on("connection", (socket) => {
  socket.emit("connected", {
    message: "Client is connected!",
  });

  socket.on("audioData", (data) => {
    const dataURL = data.audio.dataURL.split(",").pop();

    // Save the audio to a file
    storeAudio(Buffer.from(dataURL, "base64"));

    socket.emit("audioSaved", Buffer.from(dataURL, "base64"));
  });

  socket.on("playAudio", () => {
    const filePath = join(__dirname, "audioFiles", "recorded_audio.wav");
    if (!existsSync(filePath)) {
      socket.emit("audioNotFound", "Audio file not found!");
      return;
    }

    const audioBuffer = readFileSync(filePath).buffer;
    socket.emit("playAudio", audioBuffer);
  });

  const storeAudio = (audioBlob) => {
    const filePath = join(__dirname, "audioFiles", "recorded_audio.wav");
    writeFileSync(filePath, audioBlob);
  };

  // socket.on("audioData", (audioChunk) => {
  //   const audioBlob = Buffer.concat(audioChunk);
  //   storeAudio(audioBlob);

  //   //   socket.emit("audioSaved", Buffer.from(audioBlob));
  //   socket.emit("audioSaved", {
  //     message: "Audio recorded and saved successfully.",
  //     blob: audioBlob,
  //   });
  // });
});
