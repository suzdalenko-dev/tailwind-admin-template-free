var HTTP_HOST = window.location.host.includes("127.0.0.1:3000") ? 'http://127.0.0.1:8000/' : window.location.origin+'/api/';

var CURRENT_YEAR =  new Date().getFullYear();

var LIST_ARTICLES = [];

/* GET AND POST SUZDALENKO API START */

function suzdalenkoGet(url, callback) {
  fetch(HTTP_HOST+url).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then(callback)
  .catch(error => {
    showM('Error POST REQUEST API '+ error, 'error');
  });
}

function suzdalenkoPost(url, objectValues = {}, callback) {
  const formData = new FormData();
  Object.keys(objectValues).forEach(key => formData.append(key, objectValues[key]));

  fetch(HTTP_HOST + url, {method: 'POST', body: formData}).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then(callback)
    .catch(error => {
      alert('Error GET REQUEST API ' + error);
  });
}

/* GET AND POST SUZDALENKO API END */