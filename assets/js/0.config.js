var HTTP_HOST = window.location.host.includes("127.0.0.1:3000") ? 'http://127.0.0.1:8000/' : window.location.origin+'/api/';

var CURRENT_YEAR =  new Date().getFullYear();

var LIST_ARTICLES = [];

/* GET AND POST SUZDALENKO API START */

function suzdalenkoGet(url, callback) {
  fetch(HTTP_HOST+url).then(response => response.json()).then(callback).catch(error => {
    showM('AppGet '+ error, 'error')
  });
}

function suzdalenkoPost(url, objectValues = {}, callback) {
  const formData = new FormData();
  Object.keys(objectValues).forEach(key => formData.append(key, objectValues[key]));

  fetch(HTTP_HOST + url, {method: 'POST', body: formData}).then(response => response.json()).then(callback).catch(error => {
    showM('suzdalenkoPost ' + error, 'error');
  });
}

/* GET AND POST SUZDALENKO API END */