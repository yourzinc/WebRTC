const socket = io('/')  // get a reference (root path / our server root path localhost.3000) 

const videoGrid1 = document.getElementById('left_up')
const videoGrid2 = document.getElementById('left_down')
const videoGrid3 = document.getElementById('right_up')
const videoGrid4 = document.getElementById('right_down')

let v1 = false;
let v2 = false;
let v3 = false;
let v4 = false;

const myPeer = new Peer();

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(stream => {
  addVideoStream(myVideo, stream)

    // receive

    myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

    // send
    socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

// socket.emit('join-room', ROOM_ID, 10) // HARD CORDING -> USING PEER JS
// pass the room id and user id

socket.on('user-connected', userId => { // connection 하면 socket.on 함수에서 console.log 찍는다
      console.log('User connected: ' + userId)
 })

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

// Function

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}


function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  if(!v1){
    videoGrid1.append(video);
    v1=true;
    console.log("v1", v1);
  }
  else if(!v2){
    videoGrid2.append(video)
    v2=true
    console.log("v2", v2);
  }
  else if(!v3){
    videoGrid3.append(video)
    v3=true
  }
  else if(!v4){
    videoGrid4.append(video)
    v4=true
  }
}
