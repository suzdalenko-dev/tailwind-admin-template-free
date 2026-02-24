// ================================
// HISTÓRICO COMPRAS (CHC)
// - NO guarda fechas en localStorage
// - SOLO guarda el search en localStorage
// - Search filtra por: DESCRIP_COMERCIAL, CODIGO_ARTICULO, CODIGO_PROVEEDOR, NOMBRE
// - Excel respeta: fechas actuales + search
// ================================

let dateFromCHC = getTodayMinusYears(3);
let dateToCHC   = getTodayDate();
let dataCHC     = [];

const LS_SEARCH_CHC = 'searched_chc';

// -------------------------------
// INIT
// -------------------------------
function comprasHistoricoDeComprasInit(){
  document.title = 'Histórico de compras';
  const slug = document.getElementById('slugTitle');
  if(slug) slug.innerHTML = `<span class="b-top-page" onclick="excelCHC()">📥 Excel </span>`;

  setDateHtmlCHC();
  setSearchHtmlCHC();     // 👈 restaura search desde localStorage
  getDataCHC();
}

// -------------------------------
// FECHAS (SIN localStorage)
// -------------------------------
function setDateHtmlCHC(){
  dateFromCHC = getTodayMinusYears(3);
  dateToCHC   = getTodayDate();

  const from = document.getElementById('fromInputCHC');
  const to   = document.getElementById('toInputCHC');
  if(from) from.value = dateFromCHC;
  if(to)   to.value   = dateToCHC;
}

function dateChangeCHC(){
  const from = document.getElementById('fromInputCHC');
  const to   = document.getElementById('toInputCHC');

  dateFromCHC = from ? from.value : dateFromCHC;
  dateToCHC   = to   ? to.value   : dateToCHC;

  getDataCHC();
}

// -------------------------------
// SEARCH (SOLO localStorage)
// -------------------------------
function setSearchHtmlCHC(){
  const input = document.getElementById('searchCHC');
  if(!input) return;
  input.value = localStorage.getItem(LS_SEARCH_CHC) || '';
}

function changeSearchCHC(event){
  const v = (event?.target?.value || '').trim();
  localStorage.setItem(LS_SEARCH_CHC, v);
  renderCHCTable(); // solo repinta, no llama backend
}

function clickBroomCHC(){
  const input = document.getElementById('searchCHC');
  if(input) input.value = '';
  localStorage.setItem(LS_SEARCH_CHC, '');
  renderCHCTable(); // solo repinta
}

// -------------------------------
// BACKEND LOAD
// -------------------------------
function getDataCHC(){
  const tbody = document.getElementById('tableCHC');
  if(tbody) tbody.innerHTML = '<br> Cargando..';

  suzdalenkoGet(
    `compras/get/0/0/historico_compras/?from_date=${dateFromCHC}&to_date=${dateToCHC}`,
    r => {
      dataCHC = (r && r.data && Array.isArray(r.data.res)) ? r.data.res : [];
      renderCHCTable();
    }
  );
}

// -------------------------------
// RENDER (aplica filtro local)
// -------------------------------
function renderCHCTable(){
  const tbody = document.getElementById('tableCHC');
  if(!tbody) return;

  const q = (localStorage.getItem(LS_SEARCH_CHC) || '').toLowerCase().trim();

  if(!dataCHC || dataCHC.length === 0){
    tbody.innerHTML = '<br> Datos no encontrados';
    return;
  }

  const match = (l) => {
    if(!q) return true;

    const lineData = (
      (l.DESCRIP_COMERCIAL || '') + ' ' +
      (l.CODIGO_ARTICULO   || '') + ' ' +
      (l.CODIGO_PROVEEDOR  || '') + ' ' +
      (l.NOMBRE            || '')
    ).toLowerCase();

    return lineData.includes(q);
  };

  const filtered = dataCHC.filter(match);

  if(filtered.length === 0){
    tbody.innerHTML = '<br> Datos no encontrados';
    return;
  }

  let html = '';
  filtered.forEach(l => {
    html += `<tr>
      <td class="border px-2 py-1 text-center">${formatLongDate(l.FECHA)}</td>
      <td class="border px-2 py-1 text-left">${l.CODIGO_PROVEEDOR} ${l.NOMBRE}</td>
      <td class="border px-2 py-1 text-left">${l.NUMERO_DOC_EXT}</td>
      <td class="border px-2 py-1 text-left">${l.CODIGO_ARTICULO} ${(l.DESCRIP_COMERCIAL || '').trim()}</td>
      <td class="border px-2 py-1 text-right">${fENN(l.UNIDADES_ALMACEN)}</td>
      <td class="border px-2 py-1 text-left">${fEur000(l.PRECIO_VALORACION)}</td>
      <td class="border px-2 py-1 text-left">${fEur0000(l.CAMBIO)}</td>
      <td class="border px-2 py-1 text-left">${fEur000(l.PRECIO_EUR)}</td>
    </tr>`;
  });

  tbody.innerHTML = html;
}

// -------------------------------
// EXCEL (respeta filtro + fechas)
// Requiere XLSX + helper toNumberForExcel (ya lo tienes en tu base)
// -------------------------------
function excelCHC(){
  if(!window.XLSX){
    showM('No está cargado XLSX', 'error');
    return;
  }
  if(!dataCHC || dataCHC.length === 0){
    showM('No hay datos para exportar', 'warning');
    return;
  }

  const q = (localStorage.getItem(LS_SEARCH_CHC) || '').toLowerCase().trim();

  const rows = dataCHC.filter(l => {
    if(!q) return true;
    const lineData = (
      (l.DESCRIP_COMERCIAL || '') + ' ' +
      (l.CODIGO_ARTICULO   || '') + ' ' +
      (l.CODIGO_PROVEEDOR  || '') + ' ' +
      (l.NOMBRE            || '')
    ).toLowerCase();
    return lineData.includes(q);
  });

  const HEAD = ['Fecha','Proveedor','Exp','Artículo','Cantidad','Precio','Cambio','Precio €'];
  const AOA = [HEAD];

  rows.forEach(l => {
    AOA.push([
      formatLongDate(l.FECHA),
      `${l.CODIGO_PROVEEDOR} ${l.NOMBRE}`,
      l.NUMERO_DOC_EXT,
      `${l.CODIGO_ARTICULO} ${(l.DESCRIP_COMERCIAL || '').trim()}`,
      toNumberForExcel(l.UNIDADES_ALMACEN),
      toNumberForExcel(l.PRECIO_VALORACION),
      toNumberForExcel(l.CAMBIO),
      toNumberForExcel(l.PRECIO_EUR)
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(AOA);

  // congelar cabecera
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // anchos básicos
  ws['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 28 }, // Proveedor
    { wch: 14 }, // Exp
    { wch: 42 }, // Artículo
    { wch: 12 }, // Cantidad
    { wch: 12 }, // Precio
    { wch: 12 }, // Cambio
    { wch: 12 }  // Precio €
  ];

  const tabName = (`CHC ${dateFromCHC} a ${dateToCHC}`).replace(/[\\/?*\[\]:]/g,'-').slice(0,31);
  XLSX.utils.book_append_sheet(wb, ws, tabName || 'CHC');

  const fileName = `historico_compras_${dateFromCHC}_${dateToCHC}${q ? '_filtrado' : ''}.xlsx`;
  XLSX.writeFile(wb, fileName);
}