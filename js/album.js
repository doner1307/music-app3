let container = document.querySelector(`.album`);

let album = getAlbum();

if (!album) {
  renderError();
} else {
  renderAlbumInfo();
  renderTracks();
  setupAudio();
}

function getAlbum() {  
  let search = new URLSearchParams(window.location.search);
  let i = search.get(`i`);

  return albums[i];
}

function renderError() {
  container.innerHTML = `АШИПКА!!!!!!!!!!!!!!!!!`;
  setTimeout(() => {
    window.location.pathname = `index.html`
  }, 5000);
};

function renderAlbumInfo() {
  container.innerHTML = `
    <div class="card mb-3">
      <div class="row">
        <div class="col-4">
          <img src="${album.src}" alt="" class="img-fluid  rounded-start">
        </div>
        <div class="col-8">
          <div class="card-body">
            <h5 class="card-title">
              ${album.title}
            </h5>
            <p class="card-text">
              ${album.description}
            </p>
            <p class="card-text">
              <small class="text-muted">Сборник выпущен в ${album.year} году</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderTracks() {  
  let playlist = document.querySelector(`.playlist`);
  let tracks = album.tracks;

  for (let j = 0; j < tracks.length; j++) {
    let track = tracks[j];
    playlist.innerHTML += `
      <li class="track list-group-item d-flex align-items-center">
        <img src="assets/play-button.png" alt="" class="img-play-pause me-3" height="30px">
        <div class="">
          <div class="">${track.title}</div>
          <div class="text-secondary">${track.author}</div>
        </div>
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: 0%;"></div>
        </div>
        <div class="time ms-auto">${track.time}</div>
        <audio class="audio" src="${track.src}"></audio>
      </li>
    `;
  }
}

function setupAudio() {
  let tracks = album.tracks;
  // Найди коллекцию с треками
  let trackNodes = document.querySelectorAll(`.track`); 
  for (let i = 0; i < trackNodes.length; i++) { 
    // Один элемент
    let track = tracks[i];
    let node = trackNodes[i];   
    let timeNode = node.querySelector(`.time`);
    let imgPlayPause = node.querySelector(`.img-play-pause`);
    let progressBar = node.querySelector(`.progress-bar`);
    // Тег аудио внутри этого элемента
    let audio = node.querySelector(`.audio`); 

    // продолжи самостоятельно
    node.addEventListener(`click`, function () {
      // Если трек сейчас играет...
      if (track.isPlaying) {
        track.isPlaying = false;
        // Поставить на паузу
        audio.pause();
        imgPlayPause.src = `assets/play-button.png`;
        // Если трек сейчас не играет...
      } else {
        track.isPlaying = true;
        // Включить проигрывание
        audio.play();
        imgPlayPause.src = `assets/playing-button.png`;
        updateProgress();
      }
    });

    function updateProgress() {
      // Нарисовать актуальное время
      let time = getTime(audio.currentTime);
      if (timeNode.innerHTML != time) {
        timeNode.innerHTML = time;
        progressBar.style.width = audio.currentTime*100/audio.duration + `%`
      }
    
      // Нужно ли вызвать её ещё раз?
      if (track.isPlaying) {
        requestAnimationFrame(updateProgress);
      }
      
    }
  }
}

function getTime(time) {
  let currentSeconds = Math.floor(time);
  let minutes = Math.floor(currentSeconds/60);
  let seconds = Math.floor(currentSeconds%60);
  if (minutes < 10) {
    minutes = `0` + minutes;
  }
  if (seconds < 10) {
    seconds = `0` + seconds;
  }
  return `${minutes}:${seconds}`
}
