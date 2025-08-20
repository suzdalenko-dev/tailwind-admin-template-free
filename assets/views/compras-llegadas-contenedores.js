var allLinesCLC = [];

function comprasLlegadasContenedoresInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExcelAllArrivals()">📥 Excel </span>
        <span class="b-top-page" onclick="createPDFArrivals()">📄 PDF </span>
    `;
    document.title = "LLegada de los contenedores";

    setInputDate();
    setSearchedDate();
    getAllContainer();
}
/* 1. trabajo con fechas */
function setInputDate(){
    let firstDataInput = document.getElementById('firstDataInput');
    let secondDataInput = document.getElementById('secondDataInput');

    window.localStorage.setItem('first_date', getTodayDate());
    firstDataInput.value = window.localStorage.getItem('first_date');


    if(window.localStorage.getItem('second_date')){
        secondDataInput.value = window.localStorage.getItem('second_date');
    } else {
        secondDataInput.value = addMonthsFunc(11);
        window.localStorage.setItem('second_date', addMonthsFunc(11));
    }
}

function firstDateChange(event){
    let firstDate = event.target.value;
    window.localStorage.setItem('first_date', firstDate);
    getAllContainer();
}

function secondDateChange(event){
    let secondDate = event.target.value;
    window.localStorage.setItem('second_date', secondDate);
    getAllContainer();
}

/* 2. trabajo de busqueda */
function setSearchedDate(){
    let searchInputL = document.getElementById('searchInputL');
    searchInputL.value = window.localStorage.getItem('searched_line') || '';
}

function changeSearchedInput(event){
    let searched = event.target.value.trim();
    window.localStorage.setItem('searched_line', searched);
    show2Tables();
}

function clickBroom(){
    document.getElementById('searchInputL').value = '';
    window.localStorage.setItem('searched_line', '');
    show2Tables();
}



/* 3. traer datos */
function getAllContainer(){
    let first  = window.localStorage.getItem('first_date');
    let second = window.localStorage.getItem('second_date');
    fetch(HTTP_HOST+`compras/get/0/0/latest_arrivals/?first=${first}&second=${second}`).then(r => r.json()).then(r => {
        allLinesCLC = r;
        show2Tables();
        let x = 1 / 0
    }).catch(e => {
        showM('err1 ' +e, 'error');
    });
};

function show2Tables() {
  const inputValue = (localStorage.getItem('searched_line') || '').toLowerCase();
  let html = '';
  const r = allLinesCLC;

  if (!r || !r.data) {
    document.getElementById('tableNormal').innerHTML = '';
    return;
  }

  // Función de filtrado
  const match = (y) => {
    if (!inputValue) return true;
    const lineData = (
      y.ARTICULO  +
      y.DESCRIP_COMERCIAL+
      y.CONTENEDOR +
      y.D_CLAVE_ARANCEL +
      y.FECHA_PREV_LLEGADA +
      y.D_PLANTILLA  +
      y.PROVEEDOR +
      y.D_PROVEEDOR_HOJA +
      y.NUM_EXPEDIENTE+'-'+y.NUM_HOJA
    ).toLowerCase();
    return lineData.includes(inputValue);
  };

  // 🔹 recorrer array de grupos
  r.data.forEach(group => {
    const filtered = group.lines.filter(match);
    if (filtered.length === 0) return;

    // Filas
    filtered.forEach(y => {
      html += `<tr>
        <td class="border px-2 py-1 text-left">${y.ARTICULO ?? ''} ${(y.DESCRIP_COMERCIAL || '').slice(0, 33)}</td>
        <td class="border px-2 py-1 text-center">${y.CONTENEDOR ?? ''}</td>
        <td class="border px-2 py-1 text-center">${fEurEntero(y.CANTIDAD1)}</td>
        <td class="border px-2 py-1 text-center">${fEur000(y.PRECIO)}</td>
        <td class="border px-2 py-1 text-center">${fEur0000(y.VALOR_CAMBIO)}</td>
        <td class="border px-2 py-1 text-center">${fEur000(y.PRECIO_CON_GASTOS)}</td>
        <td class="border px-2 py-1 text-center">${notNone(y.DOCUMENTACION_X_CONTENEDOR)}</td>
        <td class="border px-2 py-1 text-left">${replaceEntr(y.LUGAR_EMBARQUE)}</td>
        <td class="border px-2 py-1 text-center">${fLDate(y.FECHA_EMBARQUE)}</td>
        <td class="border px-2 py-1 text-center">${fLDate(y.FECHA_PREV_LLEGADA)}</td>
        <td class="border px-2 py-1 text-left">${replaceEntr(y.LUGAR_DESEMBARQUE)}</td>
        <td class="border px-2 py-1 text-left">${(y.D_PROVEEDOR_HOJA || '').slice(0, 22)}</td>
        <td class="border px-2 py-1 text-left">${y.D_DESCRIPCION_EXPEDIENTE ?? ''}</td>
        <td class="border px-2 py-1 text-center">${y.NUM_EXPEDIENTE}-${y.NUM_HOJA}</td>
      </tr>`;
    });

    html += '<br>';
  });

  document.getElementById('tableNormal').innerHTML = html;
}



/* EXCEL */

function createExcelAllArrivals() {
  const r = allLinesCLC;
  if (!r || !r.data) return;

  const first  = (localStorage.getItem('first_date')  || '').trim();
  const second = (localStorage.getItem('second_date') || '').trim();
  const inputValue = (localStorage.getItem('searched_line') || '').toLowerCase();

  // ===== Helpers (alineados con la tabla) =====
  const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;
  const nnum = v => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') return v;
    const s = String(v).replace(/\s+/g,'').replace(',', '.');
    const n = parseFloat(s);
    return isFinite(n) ? n : '';
  };
  const toDateStr = v => {
    const s = nn(v);
    if (!s) return '';
    const m = String(s).slice(0,10).split('-'); // YYYY-MM-DD
    return (m.length === 3) ? `${m[2]}/${m[1]}/${m[0]}` : s; // dd/mm/yyyy
  };
  const replaceEntr = v => String(nn(v)).replace(/\r?\n/g, ' ').trim();
  const notNone = v => nn(v);

  // Mismo filtro que show2Tables
  const match = (y) => {
    if (!inputValue) return true;
    const lineData = (
      (y.ARTICULO  || '') +
      (y.DESCRIP_COMERCIAL || '') +
      (y.CONTENEDOR || '') +
      (y.D_CLAVE_ARANCEL || '') +
      (y.FECHA_PREV_LLEGADA || '') +
      (y.D_PLANTILLA || '') +
      (y.PROVEEDOR || '') +
      (y.D_PROVEEDOR_HOJA || '') +
      ((y.NUM_EXPEDIENTE || '') + '-' + (y.NUM_HOJA || ''))
    ).toLowerCase();
    return lineData.includes(inputValue);
  };

  // Soporta array de grupos o objeto {desc: [lines]}
  const groups = Array.isArray(r.data)
    ? r.data
    : Object.entries(r.data).map(([id, lines]) => ({ id, lines }));

  // Cabecera EXACTA a la tabla principal
  const HEAD = [
    'Artículo',
    'Cont.',
    'Kg',
    'Precio',
    'Cambio',
    'Coste c/g',
    'Doc.',
    'Origen',
    'Embarque',
    'Llegada',
    'Puerto',
    'Proveedor',
    'Cont.Prov.',
    'Exp.'
  ];

  const AOA = [HEAD];

  // Preparamos solo los grupos que tienen filas tras el filtro
  const groupsWithRows = groups
    .map(g => ({ rows: (g.lines || []).filter(match) }))
    .filter(x => x.rows.length > 0);

  // Relleno de datos + fila en blanco entre grupos presentes
  groupsWithRows.forEach((entry, idx) => {
    entry.rows.forEach(y => {
      const col1 = `${nn(y.ARTICULO)} ${(nn(y.DESCRIP_COMERCIAL)).slice(0,33)}`.trim();
      AOA.push([
        col1,
        nn(String(y.CONTENEDOR || '').trim()),
        nnum(y.CANTIDAD1),
        nnum(y.PRECIO),
        nnum(y.VALOR_CAMBIO),
        nnum(y.PRECIO_CON_GASTOS),
        notNone(y.DOCUMENTACION_X_CONTENEDOR),
        replaceEntr(y.LUGAR_EMBARQUE),
        toDateStr(y.FECHA_EMBARQUE),
        toDateStr(y.FECHA_PREV_LLEGADA),
        replaceEntr(y.LUGAR_DESEMBARQUE),
        nn(y.D_PROVEEDOR_HOJA),
        nn(y.D_DESCRIPCION_EXPEDIENTE),
        `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`
      ]);
    });

    // Fila en blanco SOLO si no es el último grupo con filas
    if (idx < groupsWithRows.length - 1) {
      AOA.push(new Array(HEAD.length).fill(''));
    }
  });

  // === Excel ===
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(AOA);

  // Congelar cabecera
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // Anchuras aproximadas
  ws['!cols'] = [
    { wch: 40 }, // ARTÍCULO / DESCRIPCIÓN
    { wch: 15 }, // CONTENEDOR
    { wch: 12 }, // CANTIDAD
    { wch: 10 }, // PRECIO
    { wch: 12 }, // VALOR CAMBIO
    { wch: 16 }, // PRECIO CON GASTOS
    { wch: 18 }, // DOC X CONTENEDOR
    { wch: 18 }, // LUGAR EMBARQUE
    { wch: 14 }, // FECHA EMBARQUE
    { wch: 16 }, // FECHA PREV LLEGADA
    { wch: 18 }, // LUGAR DESEMBARQUE
    { wch: 22 }, // PROVEEDOR HOJA
    { wch: 24 }, // DESCRIPC EXPEDIENTE
    { wch: 18 }  // EXPEDIENTE-HOJA
  ];

  const tabBase = `Llegadas ${first} a ${second}`;
  const safeTab = tabBase.replace(/[\\/?*\[\]:]/g, '-').slice(0, 31) || 'Llegadas';
  XLSX.utils.book_append_sheet(wb, ws, safeTab);

  const fileName = `llegadas_contenedores_${first || 'desde'}_${second || 'hasta'}.xlsx`;
  XLSX.writeFile(wb, fileName);
}























/* PDF */


function createPDFArrivals() {
  // ======= Comprobaciones =======
  const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);
  if (!hasJsPDF) { console.error('jsPDF no está cargado.'); return; }
  const { jsPDF } = window.jspdf;
  if (!(jsPDF.API && typeof jsPDF.API.autoTable === 'function')) {
    console.error('jspdf-autotable no está cargado.');
    return;
  }

  const r = allLinesCLC;
  if (!r || !r.data) return;

  const first  = (fLDate(localStorage.getItem('first_date'))  || '').trim();
  const second = (fLDate(localStorage.getItem('second_date')) || '').trim();
  const inputValue = (localStorage.getItem('searched_line') || '').toLowerCase();

  // ======= Helpers (alineados con la tabla/Excel) =======
  const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;
  const parseNum = v => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === 'number') return v;
    const s = String(v).replace(/\s+/g,'').replace(',', '.');
    return parseFloat(s);
  };
  const fmt0 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{maximumFractionDigits:0}) : ''; };
  const fmt2 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}) : ''; };
  const fmt3 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:3}) : ''; };
  const fmt4 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{minimumFractionDigits:4,maximumFractionDigits:4}) : ''; };
  const toDateStr = v => {
    const s = nn(v); if (!s) return '';
    const [Y,M,D] = String(s).slice(0,10).split('-');
    return (Y && M && D) ? `${D}/${M}/${Y}` : s;
  };
  const replaceEntr = v => String(nn(v)).replace(/\r?\n/g, ' ').trim();
  const notNone = v => nn(v);

  // === Mismo filtro que show2Tables ===
  const match = y => {
    if (!inputValue) return true;
    const line = (
      (y.ARTICULO||'')+(y.DESCRIP_COMERCIAL||'')+(y.CONTENEDOR||'')+(y.D_CLAVE_ARANCEL||'')+
      (y.FECHA_PREV_LLEGADA||'')+(y.D_PLANTILLA||'')+(y.PROVEEDOR||'')+
      (y.D_PROVEEDOR_HOJA||'')+((y.NUM_EXPEDIENTE||'')+'-'+(y.NUM_HOJA||''))
    ).toLowerCase();
    return line.includes(inputValue);
  };

  const groups = Array.isArray(r.data) ? r.data : Object.entries(r.data).map(([id, lines]) => ({ id, lines }));

  // ======= PDF base =======
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 11;

  // Cabecera / pie
  const drawHeader = (pageNo = 1) => {
    doc.setFillColor(248);
    doc.rect(0, 0, pageW, 46, 'F');

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`FROXA S.A.   ${getCurrentDateTime()}`, margin, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const title = `Recepción de mercancías (${first} - ${second})${inputValue ? `   •   Filtro: "${inputValue}"` : ''}`;
    doc.text(title, pageW / 2, 32, { align: "center" });

    doc.setDrawColor(210);
    doc.setLineWidth(0.5);
    doc.line(margin, 38, pageW - margin, 38);
  };
  const drawFooter = (pageNo=1) => {
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Página ${pageNo}`, pageW - margin, pageH - 10, { align: 'right' });
    doc.setTextColor(0);
  };

  // Cabecera EXACTA (14 columnas)
  const HEAD = [
    'Artículo',
    'Cont.',
    'Kg',
    'Precio',
    'Cambio',
    'Coste c/g',
    'Doc.',
    'Origen',
    'Embarque',
    'Llegada',
    'Puerto',
    'Proveedor',
    'Cont. Prov.',
    'Exp.'
  ];

  // Preparamos solo grupos con filas tras el filtro
  const groupsWithRows = groups
    .map(g => ({ rows: (g.lines || []).filter(match) }))
    .filter(x => x.rows.length > 0);

  // Construcción del body con SEPARADOR NEGRO entre grupos
  const body = [];
  groupsWithRows.forEach((entry, idx) => {
    entry.rows.forEach(y => {
      const col1 = `${nn(y.ARTICULO)} ${(nn(y.DESCRIP_COMERCIAL)).slice(0,55)}`.trim();
      body.push([
        col1,
        nn(String(y.CONTENEDOR || '').trim()),
        fmt0(y.CANTIDAD1),
        fmt3(y.PRECIO),
        fmt4(y.VALOR_CAMBIO),
        fmt3(y.PRECIO_CON_GASTOS),
        notNone(y.DOCUMENTACION_X_CONTENEDOR),
        replaceEntr(y.LUGAR_EMBARQUE),
        toDateStr(y.FECHA_EMBARQUE),
        toDateStr(y.FECHA_PREV_LLEGADA),
        replaceEntr(y.LUGAR_DESEMBARQUE),
        nn(y.D_PROVEEDOR_HOJA),
        nn(y.D_DESCRIPCION_EXPEDIENTE),
        `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`
      ]);
    });

    // ---- línea negra de separación (no después del último grupo) ----
    if (idx < groupsWithRows.length - 1) {
      const GAP = 0; // espacio (pt) arriba y abajo de la línea

      // 1) blanco arriba
      body.push([{ content: '', colSpan: HEAD.length, styles: { minCellHeight: GAP } }]);

     // 2) la línea negra (queda en medio porque tiene blanco arriba y abajo)
      body.push([{
        content: '',
        colSpan: HEAD.length,
        styles: {
          lineWidth: { top: 1 },       // grosor de la línea
          lineColor: [0, 0, 0],        // negro
          minCellHeight: 0             // sin alto extra
        }
      }]);
   
      // 3) blanco abajo
      // body.push([{ content: '', colSpan: HEAD.length, styles: { minCellHeight: GAP } }]);
    }
  });

  // AutoTable
  doc.autoTable({
    head: [HEAD],
    body,
    margin: { left: margin, right: margin, top: 48 },
    theme: 'plain',
    showHead: 'everyPage',
    styles: {
      fontSize: 6,
      cellPadding: { top: 1, right: 0.1, bottom: 1, left: 0.1 }, // menos aire
      minCellHeight: 10,
      overflow: 'ellipsize'  // por defecto; ver overrides abajo
    },
     headStyles: {
      fillColor: [67,56,202],
      textColor: [255,255,255],
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: { top: 1, right: 0.1, bottom: 1, left: 0.1 }
    },

    bodyStyles: { textColor: [0,0,0] },
    columnStyles: {
      0:{cellWidth:151, overflow: 'linebreak'},                // articulo
      1:{cellWidth:55},                 // contenedor
      2:{cellWidth:33, halign:'center'},                  // kg
      3:{cellWidth:33, halign:'center'},                  // precio
      4:{cellWidth:33, halign:'center'},                  // cambio
      5:{cellWidth:37, halign:'center'},                  // precio con gastos
      6:{cellWidth:22, halign:'center'},                  // Doc
      7:{cellWidth:55},                                   // origen
      8:{cellWidth:55, halign:'center'},                  // Embarque
      9:{cellWidth:55, halign:'center'},                  // LLegada
      10:{cellWidth:55},                                  // puerto
      11:{cellWidth:151, overflow: 'linebreak'},          // proveedor
      12:{cellWidth:55},                                  // contrato
      13:{cellWidth:33, halign:'center'}                  // expediente
    },
    didDrawPage: hookData => {
      drawHeader(hookData.pageNumber);
      drawFooter(hookData.pageNumber);
    }
  });

  const fileName = `llegadas_contenedores_${first || 'desde'}_${second || 'hasta'}.pdf`;
  doc.save(fileName);
}
