function setTimeUserName() {
  let el = document.getElementById('userNameApp');
  let raw = window.localStorage.getItem('username') ?? '';
  let name = raw.trim();
  let pretty = name.length ? name[0].toLocaleUpperCase() + name.slice(1) : '';
  el.textContent = pretty;

  el = document.getElementById('appTime');
  el.innerHTML = nowHHMMSS();
}

setInterval(() => {
    setTimeUserName();
}, 1000);

