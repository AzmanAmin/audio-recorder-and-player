const express = require("express");
const { readFileSync, createWriteStream, existsSync } = require("fs");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const recorder = require("node-record-lpcm16");
const { AudioContext } = require("node-web-audio-api");

const app = express();
const server = createServer(app);
const ioServer = new Server(server);
const port = 3009;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

ioServer.on("connection", (socket) => {
  socket.emit("connected", {
    message: "Client is connected!",
  });

  const options = {
    sampleRate: 44100,
    recorder: "sox",
    audioType: "wav",
  };

  let recording;

  socket.on("startRecording", () => {
    try {
      recording = recorder.record(options);
      recording
        .stream()
        .on("error", (err) => console.log("Recorder error happened: ", err))
        .pipe(audioFileToStore());
    } catch (error) {
      console.log("Error happened while recording: ", error);
    }
  });

  socket.on("stopRecording", async () => {
    const filePath = path.join(__dirname, "audiofiles", "recorded_audio.wav");

    recording.stop();
    await playAudio(filePath);
  });

  socket.on("playAudio", async () => {
    const filePath = path.join(__dirname, "audiofiles", "recorded_audio.wav");
    if (!existsSync(filePath)) {
      socket.emit("audioNotFound", "Audio file not found!");
      return;
    }

    await playAudio(filePath);
  });

  const audioFileToStore = () => {
    const filePath = path.join(__dirname, "audiofiles", "recorded_audio.wav");
    return createWriteStream(filePath, { encoding: "binary" });
  };

  const playAudio = async (filePath) => {
    // const filePath = path.join(__dirname, "audiofiles", "recorded_audio.wav");
    try {
      const audioContext = new AudioContext();

      const audioArrayBuffer = readFileSync(filePath).buffer;
      const buffer = await audioContext.decodeAudioData(audioArrayBuffer);

      const bufferSource = audioContext.createBufferSource();
      bufferSource.connect(audioContext.destination);
      bufferSource.buffer = buffer;
      bufferSource.start();
    } catch (error) {
      console.log("Error while playing audio: ", error);
    }
  };
});
