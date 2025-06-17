async function loadData(custom_route) {
  try {
    let response = await fetch(HTTP_HOST+custom_route);
    let result   = await response.json();
    return result;
  } catch (error) {
     showM('e0 '+ error, 'error')
  }
}

async function saveData(custom_route, formData) {
  try {
    let response = await fetch(HTTP_HOST+custom_route, {method:'POST', body:formData});
    let result   = await response.json();
    return result;
  } catch (error) {
     showM('e00 '+ error, 'error')
  }
}

async function deleteData(custom_route, formData) {
  try {
    let response = await fetch(HTTP_HOST+custom_route, {method:'POST', body:formData});
    let result   = await response.json();
    return result;
  } catch (error) {
     showM('e01 '+ error, 'error')
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

function toFL0(x){
    return parseFloat(x).toFixed(0);
}

function toFL2(x){
    return parseFloat(x).toFixed(2);
}

function toFL(x){
    return parseFloat(x).toFixed(3);
}

function fEurEntero(num) {
  if (!num) return "0";
  let entero = Math.trunc(num).toString(); // Elimina parte decimal
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function fEE(num) {
  if (!num) return "0";
  let entero = Math.trunc(num).toString(); // Elimina parte decimal
  return entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


function fEur0(numero) {
  const partes = numero.toString().split(".");
  const entero = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimal = partes[1] || "000";
  return `${entero},${decimal}`;
}

function fEur000(num) {
  if (!num) return "0,00";
  let [entero, decimal = ""] = num.toString().split(".");
  entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  decimal = decimal.substring(0, 3);
  return decimal ? `${entero},${decimal}` : `${entero},00`;
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



function setTopDates4(){
    let today = new Date();
    for (let i = 0; i < 4; i++) {
      let year = today.getFullYear();
      let month = today.getMonth() + i;
      let lastDay = new Date(year, month + 1, 0);
      let formatted = ('0' + (lastDay.getMonth() + 1)).slice(-2) + '/25';
      let element = document.getElementById(`topDate${i}`);
      if (element) {
        element.textContent = formatted;
      }
    }
}


window.onerror = function (message, source, lineno, colno, error) {
  console.log("🔴 Error detectado:");
  console.log("Mensaje:", message);
  console.log("Fuente:", source);
  console.log("Línea:", lineno);
  console.log("Columna:", colno);
  console.log("Objeto Error:", error);
  // localStorage.clear();
  return false;
};


function userDontLogin(userRole){
  let KEYS = { 
    sarakey: '1475369*'
  }
  let currentKeyX = window.localStorage.getItem('user_value');
  if(userRole == 'produccion' && currentKeyX == KEYS.sarakey){
    return false;
  }  

  let userInsertKey = prompt('¿Contraseña?');
  if(userRole == 'produccion' && userInsertKey == KEYS.sarakey){
    window.localStorage.setItem('user_value', userInsertKey);
    return false;
  }
    
  
  alert('Contraseña incorrecta')
  return true;
}