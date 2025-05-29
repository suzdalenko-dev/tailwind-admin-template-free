async function loadData(custom_route) {
  try {
    let response = await fetch(HTTP_HOST+custom_route);
    let result = await response.json();
    return result;
  } catch (error) {
     showM(error, 'error')
  }
}


function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    return date.toISOString().slice(0, 10);
}

function toLN(str) {
    if (!str) return 0;
    let clean = str.replace(/\./g, '').replace(',', '.');
    return parseFloat(clean).toFixed(2);
}

function toFL(x){
    return parseFloat(x).toFixed(2);
}