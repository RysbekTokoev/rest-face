const video = document.getElementById('video')
const log = document.getElementById('log')

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri('./static/models/'),
  // faceapi.nets.tinyFaceDetector.loadFromUri('./static/models/'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./static/models/'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./static/models/')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie != '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          let cookie = jQuery.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
          }
      }
  }
  return cookieValue;
}const csrftoken = getCookie('csrftoken');

function sendFace(detected){
  const Url = '/api/fromencoding/';
  let otherPram={
    method: "POST",
    headers: {
      'X-CSRFToken': csrftoken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'encoding': detected}),
  }
  return fetch(Url, otherPram).then(data => {return data.json()});
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)

  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors()
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    if (detections.length > 0) {
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      faceapi.draw.drawDetections(canvas, resizedDetections)
      resizedDetections.forEach(fd => {
        sendFace(fd.descriptor).then(data => {
          let li = document.createElement('li');
          li.appendChild(document.createTextNode(data))
          $(li).prependTo($(log));
        })
      })
    }
  }, 300) //check every half of a second
})