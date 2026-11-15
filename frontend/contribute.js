//https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos

const width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

let streaming = false;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");
const startButton = document.getElementById("start-button");
const uploadButton = document.getElementById("upload-img-button");
uploadButton.addEventListener("click", async () => {
  if (!photo.src || photo.src === window.location.href) {
    alert("Capture a photo before uploading it.");
    return;
  }

  uploadButton.disabled = true;
  try {
    const response = await fetch(photo.src);
    const imageBlob = await response.blob();
    const formData = new FormData();
    formData.append("image", imageBlob, "vending-machine.png");

    const analysisResponse = await fetch("/api/analyse/image/", {
      method: "POST",
      body: formData,
    });

    if (!analysisResponse.ok) {
      throw new Error(`Image analysis failed (${analysisResponse.status})`);
    }

    const detectedItems = await analysisResponse.json();
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      });
    });

    const machineResponse = await fetch("/api/locations/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "New Vending Machine",
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        cash: false,
        tap: false,
        mng: false,
        items: detectedItems.map((itemName) => ({
          name: itemName,
          price: 0,
        })),
      }),
    });

    if (!machineResponse.ok) {
      throw new Error(`Machine creation failed (${machineResponse.status})`);
    }

    const machineId = await machineResponse.json();
    if (!machineId) {
      throw new Error("Machine creation returned no ID");
    }

    window.location.assign(
      `machine-info.html?machine_id=${encodeURIComponent(machineId)}`,
    );
  } catch (error) {
    console.error(error);
    alert("The image could not be analysed.");
  } finally {
    uploadButton.disabled = false;
  }
});
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
  } catch (error) {
    console.error("Unable to access the camera:", error);
  }
}

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

startCamera();

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