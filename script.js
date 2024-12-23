const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');
const playlist = document.getElementById('playlist');
const uploadInput = document.getElementById('upload');
const searchInput = document.getElementById('search'); // Search input field

// Initial songs in the playlist
let songs = [
  { title: 'hey', src: 'music/hey.mp3', cover: 'images/hey.jpg' },
  { title: 'summer', src: 'music/summer.mp3', cover: 'images/summer.jpg' },
  { title: 'ukulele', src: 'music/ukulele.mp3', cover: 'images/ukulele.jpg' }
];

// Keep track of the current song
let songIndex = 2;

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Load song details into DOM
function loadSong(song) {
  title.innerText = song.title;
  audio.src = song.src;
  cover.src = song.cover;
  updateActiveSong();
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;
  if (songIndex < 0) songIndex = songs.length - 1;
  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex++;
  if (songIndex >= songs.length) songIndex = 0;
  loadSong(songs[songIndex]);
  playSong();
}

// Update active song in the playlist
function updateActiveSong() {
  const playlistItems = document.querySelectorAll('#playlist li');
  playlistItems.forEach((item, index) => {
    item.classList.toggle('active', index === songIndex);
  });
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Update time display for current and duration
function updateTimeDisplay(e) {
  const { duration, currentTime } = e.srcElement;

  let min = Math.floor(currentTime / 60);
  let sec = Math.floor(currentTime % 60);
  let min_d = Math.floor(duration / 60);
  let sec_d = Math.floor(duration % 60);

  // Format time to always show two digits
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;
  min_d = min_d < 10 ? '0' + min_d : min_d;
  sec_d = sec_d < 10 ? '0' + sec_d : sec_d;

  currTime.innerHTML = `${min}:${sec}`;
  durTime.innerHTML = `${min_d}:${sec_d}`;
}

// Event listeners for play/pause and song navigation
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Update progress bar and time display during playback
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('timeupdate', updateTimeDisplay);

// Click on progress bar to set current time
progressContainer.addEventListener('click', setProgress);

// Automatically move to next song when the current one ends
audio.addEventListener('ended', nextSong);

// Playlist click event for song selection
function updatePlaylist(filteredSongs = songs) {
  playlist.innerHTML = ''; // Clear existing playlist

  filteredSongs.forEach((song) => {
    const li = document.createElement('li');
    li.textContent = song.title;
    li.dataset.src = song.src; // Store the actual source of the song
    li.dataset.cover = song.cover; // Store the cover image for later use
    li.dataset.title = song.title; // Store the title for later use

    li.addEventListener('click', () => {
      // Load and play the selected song directly
      loadSong({
        title: li.dataset.title,
        src: li.dataset.src,
        cover: li.dataset.cover,
      });
      playSong();
    });

    playlist.appendChild(li);
  });
}

uploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const newSong = {
      title: file.name.split('.').slice(0, -1).join('.'), // Using file name without extension as title
      src: URL.createObjectURL(file), // Convert file to object URL for playback
      cover: 'images/default.jpg', // Optional: Add logic to upload and display cover
    };

    // Add new song to the songs array
    songs.push(newSong);
    updatePlaylist(); // Update the playlist with the new song
  }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(query)
  );
  updatePlaylist(filteredSongs); // Update playlist based on search query
});

// Initial playlist update

// Volume control functionality
volumeSlider.addEventListener('input', (e) => {
  const volume = e.target.value;
  audio.volume = volume; // Update the volume of the audio element
});
// Select the playlist and toggle button

updatePlaylist();
