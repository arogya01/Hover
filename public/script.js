const socket = io("/");

let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;

const videoGrid = document.getElementById("video-grid");

var peer = new Peer();

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", function (call) {
      call.answer(stream);
      const video = document.createElement("video");
      console.log("log1");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  console.log("calling the other peer");
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

let input = document.getElementById("chat__message");
let register_message = document.getElementById("input_message");

register_message.addEventListener("click", (e) => {
  let val = input.value;
  console.log(val);
  socket.emit("message", val);
  input.value='';
});

socket.on("createMessage", (message) => {
  let list = document.createElement("li");
  list.textContent = message;
  list.className = "message";
  let container = document.querySelector(".messages");
  container.append(list);
});

