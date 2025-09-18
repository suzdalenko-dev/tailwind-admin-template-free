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

function toFL5(x){
    return parseFloat(x).toFixed(5);
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
  if(num == 'None') return " "
  let [entero, decimal = ""] = num.toString().split(".");
  entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  decimal = decimal.substring(0, 3);
  return decimal ? `${entero},${decimal}` : `${entero},00`;
}

function fEur0000(num) {
  if (!num) return "0,00";
  let [entero, decimal = ""] = num.toString().split(".");
  entero = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  decimal = decimal.substring(0, 4);
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


function userDontLogin(){
  let userPass   = window.localStorage.getItem('password');
  let actionPass = window.localStorage.getItem('action_pass');
  if(userPass && actionPass && userPass == actionPass){
    return false;
  }  

  showM('Faltan permisos de edición', 'warning');
  return true;
}

function formatDateToEuropean(dateStr) {
    [year, month, day] = ["00", "00", "00"]
    dateStr && dateStr.split("-").length == 3 ? [year, month, day] = dateStr.split("-"): 10 / 2 
    return `${day}/${month}/${year}`;
}

function formatToOneDecimal(value) {
    if(value) return Number.parseFloat(value).toFixed(1);
    else return ' ';
}

function fLDate(x){
  if(x){
     let first10 = String(x).trim().slice(0, 10);
     let l = first10.split('-'); 
     return `${l[2]}/${l[1]}/${l[0]}`;
  } 
  return '';
}
  
function replaceEntr(x){
  if(x){
    x = x.replaceAll('None', '').trim();
    return x;
  }
  return ''
}

function addMonthsFunc(months) {
  let now = new Date();
  now.setMonth(now.getMonth() + months);
  let formatted = now.toISOString().slice(0, 10);
  return formatted;
}

function notNone(x){
  if(x == 'None' || !x) return '';
  else return String(x).trim();
}


function getCurrentDateTime() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const HH = pad(now.getHours());
  const ii = pad(now.getMinutes());
  const ss = pad(now.getSeconds());   // segundos
  const DD = pad(now.getDate());
  const MM = pad(now.getMonth() + 1); // meses empiezan en 0
  const YYYY = now.getFullYear();
  return `${HH}:${ii}:${ss} ${DD}/${MM}/${YYYY}`;
}

function getTodayDate(){
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formatted = `${yyyy}-${mm}-${dd}`;
  return formatted;
}

function getTodayMinusOneMonth() {
  const today = new Date();
  today.setMonth(today.getMonth() - 1); 
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


function formatLongDate(x) {
  if (!x || !x.includes("-")) return "";
  const parts = x.substring(0, 10).split("-");
  if (parts.length !== 3) return "";
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}


function getFirstDayOfCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); 
  return `${year}-${month}-01`;
}

function getLastDayOfCurrentMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
}



function formatEuro(num) {
  if (num == null || num === '' || isNaN(num)) return "0,00";
  // Asegura que sea número
  const n = parseFloat(num);
  // Usa Intl.NumberFormat con formato europeo
  return new Intl.NumberFormat('de-DE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(n);
}


function getOfState(x){
    if(x == 'A') return 'Abierta';
    if(x == 'C') return 'Cerrada';
    if(x == 'B') return 'Anulada';
    if(x == 'R') return 'Retenida';
    return 'None';
}


const toNum = (v) => {
  if (v === null || v === undefined || v === '' || v === 'None') return NaN;
  if (typeof v === 'number') return v;

  // Normaliza strings: admite "1.234,56" y "1,234.56"
  let s = String(v).trim().replace(/\s+/g, '');
  const hasComma = s.includes(',');
  const hasDot   = s.includes('.');

  if (hasComma && hasDot) {
    // Toma el último símbolo como separador decimal
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.');  // 1.234,56 -> 1234.56
    } else {
      s = s.replace(/,/g, '');                     // 1,234.56 -> 1234.56
    }
  } else if (hasComma) {
    s = s.replace(',', '.');                       // 123,45 -> 123.45
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

function fmtFixed(v, dec = 0) {
  const n = toNum(v);
  if (!Number.isFinite(n)) return '';
  // Algunos motores aún no soportan 'always'; hacemos fallback a true
  try {
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      useGrouping: 'always'   // fuerza 1.193 en vez de 1193
    });
  } catch (e) {
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      useGrouping: true
    });
  }
}
function fmt0 (v) { return fmtFixed(v, 0); }  // 5.555
function fmt1 (v) { return fmtFixed(v, 1); }  // 5.555,0
function fmt2 (v) { return fmtFixed(v, 2); }  // 5.555,00
function fmt3 (v) { return fmtFixed(v, 3); }  // 123.456,123
function fmt4 (v) { return fmtFixed(v, 4); }  // 5.555,0000



const toNumberForExcel = (value) => {
  let s = String(value).trim().replace(/\s/g, '');

  const hasDot = s.includes('.');
  const hasComma = s.includes(',');

  if (hasDot && hasComma) {
    // Asume '.' = miles, ',' = decimal  → "1.234,56" -> "1234.56"
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    // Solo coma → úsala como decimal  → "1234,56" -> "1234.56"
    s = s.replace(',', '.');
  } // si solo hay punto, ya sirve como decimal

  const n = Number(s);
  return Number.isFinite(n) ? n : NaN; // o lanza error si prefieres
};


function toCents(v){
  let y = Math.round((parseFloat(v) || 0) * 100)
  return y / 100 ;
}


function nowHHMMSS() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return [hh, mm] // :${ss}`;
}

function getCurrentYearMonth(){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // +1 porque enero = 0
  const current = `${month}/${year}`;
  return current;
}




function sortedByNameSuzdalenko(list) {
  return list.sort((a, b) => {
    const an = (a.name ?? '').toString().trim();
    const bn = (b.name ?? '').toString().trim();
    const cmp = an.localeCompare(bn, 'es', {
      sensitivity: 'base',
      ignorePunctuation: true,
      numeric: true,
    });
    if (cmp !== 0) return cmp;
    return (a.code ?? '').toString().localeCompare((b.code ?? '').toString(), 'es', {
      numeric: true,
    });
  });
}

/* Get first and last day of the year */
function getYearBoundsStr(year) {
  const y = parseInt(year, 10);
  if (!Number.isFinite(y)) throw new Error('Año inválido');
  const first = new Date(Date.UTC(y, 0, 1));
  const last  = new Date(Date.UTC(y, 11, 31));
  const toYMD = d => d.toISOString().slice(0, 10); 
  return [toYMD(first), toYMD(last)];
}
