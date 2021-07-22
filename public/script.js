const socket = io("/");

let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;

const videoGrid = document.getElementById("video-grid");

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});


peer.on('open', function(id){
  console.log('hey');
}
);



navigator.mediaDevices
.getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
  });

// socket.emit('join-room',ROOM_ID);

socket.on("user-connected", (userId) => {
   
  connectToNewUser(userId);
});

const connectToNewUser = (userId) => {
  console.log(`${userId} Entered the room`);
};





const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
