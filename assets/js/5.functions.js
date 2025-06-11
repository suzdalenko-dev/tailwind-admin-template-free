async function loadData(custom_route) {
  try {
    let response = await fetch(HTTP_HOST+custom_route);
    let result = await response.json();
    return result;
  } catch (error) {
     showM('e0 '+ error, 'error')
  }
}

async function saveData(custom_route, formData) {
  try {
    let response = await fetch(HTTP_HOST+custom_route, {method:'POST', body:formData});
    let result = await response.json();
    return result;
  } catch (error) {
     showM('e00 '+ error, 'error')
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

function toFL2(x){
    return parseFloat(x).toFixed(2);
}

function toFL(x){
    return parseFloat(x).toFixed(3);
}



function obtenerFechasFuturas() {
  const hoy = new Date();
  const fechas = [];

  function formatearFecha(fecha) {
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  fechas.push(formatearFecha(hoy));

  for (let i = 0; i < 4; i++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i + 1, 0);
    fechas.push(formatearFecha(fecha));
  }

  return fechas;
}



