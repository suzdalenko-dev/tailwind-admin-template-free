let timeCounter = 0;
function setTimeUserName() {
  let el = document.getElementById('userNameApp');
  let raw = window.localStorage.getItem('username') ?? '';
  let name = raw.trim();
  let pretty = name.length ? name[0].toLocaleUpperCase() + name.slice(1) : '';
  el.textContent = pretty;

  el = document.getElementById('appTime');
  let [x, y]= nowHHMMSS();

  let white = `${x}<span class="text-xl clwhite">:</span>${y}`;
  let black = `${x}<span class="text-xl clblack">:</span>${y}`;


  if(timeCounter == 0){
    timeCounter = 1;
    el.innerHTML = black;
  }
  else if(timeCounter == 1) {
    timeCounter = 0;
    el.innerHTML = white;
  }
}

setInterval(() => { setTimeUserName(); }, 500);
setTimeUserName();