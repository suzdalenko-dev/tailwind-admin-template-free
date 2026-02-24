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



// ================================
// EXCEL CHC (ExcelJS) - con colores + filtros
// ================================
async function excelCHC(){
  try{
    if(!window.ExcelJS){
      showM('ExcelJS no está cargado', 'error');
      return;
    }
    if(!dataCHC || !Array.isArray(dataCHC) || dataCHC.length === 0){
      showM('No hay datos para exportar', 'warning');
      return;
    }

    const q = (localStorage.getItem(LS_SEARCH_CHC) || '').toLowerCase().trim();

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

    const rows = dataCHC.filter(match);
    if(rows.length === 0){
      showM('No hay filas con ese filtro', 'warning');
      return;
    }

    // --- helper number: tolera 1.234,56 / 1234,56 / 1234.56 ---
    const toNum = (v) => {
      if(v === null || v === undefined || v === '' || v === 'None') return null;
      if(typeof v === 'number') return Number.isFinite(v) ? v : null;

      let s = String(v).trim().replace(/\s+/g,'');
      const hasComma = s.includes(',');
      const hasDot   = s.includes('.');

      if(hasComma && hasDot){
        // último separador = decimal
        if(s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g,'').replace(',', '.');
        else s = s.replace(/,/g,'');
      } else if(hasComma){
        s = s.replace(',', '.');
      }

      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    };

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Histórico compras');

    // === estilos cabecera ===
    // ExcelJS usa ARGB (AARRGGBB). NO vale "rgb(...)"
    const COLOR_HEADER = 'FF6D3F3F'; // rgb(109,63,63)
      
    const headerStyle = (cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_HEADER } };
      cell.border = {
        top:{style:'thin'}, left:{style:'thin'},
        bottom:{style:'thin'}, right:{style:'thin'}
      };
    };
    
    // === cabecera ===
    const HEAD = ['Fecha','Proveedor','Exp','Artículo','Cantidad','Precio','Cambio','Precio €'];
    sheet.addRow(HEAD);
    sheet.getRow(1).height = 18;
    sheet.getRow(1).eachCell(c => headerStyle(c));

    // === congelar fila 1 (cabecera) ===
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    // === autofiltro (fila 1) ===
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to:   { row: 1, column: HEAD.length }
    };

    // === datos ===
    rows.forEach(l => {
      const fecha = formatLongDate(l.FECHA); // dd/mm/yyyy
      const proveedor = `${l.CODIGO_PROVEEDOR || ''} ${l.NOMBRE || ''}`.trim();
      const exp = l.NUMERO_DOC_EXT || '';
      const articulo = `${l.CODIGO_ARTICULO || ''} ${(l.DESCRIP_COMERCIAL || '').trim()}`.trim();

      const cantidad  = toNum(l.UNIDADES_ALMACEN);
      const precio    = toNum(l.PRECIO_VALORACION);
      const cambio    = toNum(l.CAMBIO);
      const precioEur = toNum(l.PRECIO_EUR);

      const r = sheet.addRow([fecha, proveedor, exp, articulo, cantidad, precio, cambio, precioEur]);

      // bordes
      r.eachCell(cell => {
        cell.border = {
          top:{style:'thin'}, left:{style:'thin'},
          bottom:{style:'thin'}, right:{style:'thin'}
        };
      });

      // alineaciones
      r.getCell(1).alignment = { horizontal: 'center' };
      r.getCell(5).alignment = { horizontal: 'right' };
      r.getCell(6).alignment = { horizontal: 'right' };
      r.getCell(7).alignment = { horizontal: 'right' };
      r.getCell(8).alignment = { horizontal: 'right' };

      // formatos numéricos (como tu captura)
      if(r.getCell(5).value !== null) r.getCell(5).numFmt = '#,##0';            // Cantidad entero
      if(r.getCell(6).value !== null) r.getCell(6).numFmt = '#,##0.000';        // Precio 3 dec
      if(r.getCell(7).value !== null) r.getCell(7).numFmt = '#,##0.000000000';  // Cambio 9 dec
      if(r.getCell(8).value !== null) r.getCell(8).numFmt = '#,##0.00';         // Precio € 2 dec
    });

    // === anchos ===
    sheet.columns = [
      { width: 12 }, // Fecha
      { width: 32 }, // Proveedor
      { width: 14 }, // Exp
      { width: 55 }, // Artículo
      { width: 12 }, // Cantidad
      { width: 12 }, // Precio
      { width: 14 }, // Cambio
      { width: 12 }  // Precio €
    ];

    // === descargar ===
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const suf = q ? '_filtrado' : '';
    a.download = `historico_compras_${dateFromCHC}_${dateToCHC}${suf}.xlsx`;
    a.click();

  } catch(err){
    console.error(err);
    showM('Error creando Excel CHC', 'error');
  }
}