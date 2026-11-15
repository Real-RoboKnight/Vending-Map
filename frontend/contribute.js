//https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

const width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

let streaming = false;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const startButton = document.getElementById("start-button");
const allowButton = document.getElementById("permissions-button");
const uploadButton = document.getElementById("upload-img-button");
uploadButton.addEventListener("click", ()=> {
  console.log(photo.src);
  
})
allowButton.addEventListener("click", () => {

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      alert("a");
      video.srcObject = stream;
      video.play();
      alert("b");
    })
    
});

video.addEventListener("canplay", (ev) => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    streaming = true;
  }
});

startButton.addEventListener("click", (ev) => {
  takePicture();
  ev.preventDefault();
});

function clearPhoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#aaaaaa";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

clearPhoto();

function takePicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  } else {
    clearPhoto();
  }
}