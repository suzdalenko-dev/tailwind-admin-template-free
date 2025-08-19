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

    if(window.localStorage.getItem('first_date')){
        firstDataInput.value = window.localStorage.getItem('first_date');
    } else {
        firstDataInput.value = addMonthsFunc(-11);
        window.localStorage.setItem('first_date', addMonthsFunc(-11));
    }

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
    }).catch(e => {
        // alert('err1 ' +e);
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
      (y.ARTICULO || '') +
      (y.DESCRIP_COMERCIAL || '') +
      (y.CONTENEDOR || '') +
      (y.D_CLAVE_ARANCEL || '') +
      (y.FECHA_PREV_LLEGADA || '') +
      (y.D_PLANTILLA || '') +
      (y.COD_PROV || '') +
      (y.PROVEEDOR || '') +
      (y.D_PROVEEDOR_HOJA || '') +
      (y.NUM_EXPEDIENTE || '')
    ).toLowerCase();
    return lineData.includes(inputValue);
  };

  // 🔹 recorrer array de grupos
  r.data.forEach(group => {
    const filtered = group.lines.filter(match);
    if (filtered.length === 0) return;

    // Cabecera del grupo
    // html += `<tr class="bg-gray-100">
    //   <td class="px-2 py-1 font-semibold" colspan="15">${group.id || '(sin descripción)'}</td>
    // </tr>`;

    // Filas
    filtered.forEach(y => {
      html += `<tr>
        <td class="border px-2 py-1 text-center">${y.ARTICULO ?? ''}</td>
        <td class="border px-2 py-1 text-left">${(y.DESCRIP_COMERCIAL || '').slice(0, 33)}</td>
        <td class="border px-2 py-1 text-left"></td>
        <td class="border px-2 py-1 text-left">${y.CONTENEDOR ?? ''}</td>
        <td class="border px-2 py-1 text-left">${fEurEntero(y.CANTIDAD1)}</td>
        <td class="border px-2 py-1 text-left">${fEur000(y.PRECIO)}</td>
        <td class="border px-2 py-1 text-left">${fEur000(y.IMPORTE)}</td>
        <td class="border px-2 py-1 text-left">${fEur0000(y.VALOR_CAMBIO)}</td>
        <td class="border px-2 py-1 text-left">${fEur000(y.PRECIO_CON_GASTOS)}</td>
        <td class="border px-2 py-1 text-left">${notNone(y.D_CLAVE_ARANCEL)}</td>
        <td class="border px-2 py-1 text-left">${fLDate(y.FECHA_PREV_LLEGADA)}</td>
        <td class="border px-2 py-1 text-left">${replaceEntr(y.D_PLANTILLA)}</td>
        <td class="border px-2 py-1 text-left">${(y.PROVEEDOR || '')} ${(y.D_PROVEEDOR_HOJA || '').slice(0, 22)}</td>
        <td class="border px-2 py-1 text-left">${y.D_DESCRIPCION_EXPEDIENTE ?? ''}</td>
        <td class="border px-2 py-1 text-left"></td>
        <td class="border px-2 py-1 text-left">${y.NUM_EXPEDIENTE}-${y.NUM_HOJA}</td>
      </tr>`;
    });

    html += '<br>';
  });

  document.getElementById('tableNormal').innerHTML = html;
}


  function createExcelAllArrivals() {
    const r = allLinesCLC;
    if (!r || !r.data) return;

    const first  = (localStorage.getItem('first_date')  || '').trim();
    const second = (localStorage.getItem('second_date') || '').trim();

    const inputValue = (localStorage.getItem('searched_line') || '').toLowerCase();

    // === helpers ===
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
      // v suele venir "YYYY-MM-DD HH:MM:SS"
      const m = String(s).slice(0,10).split('-'); // YYYY-MM-DD
      if (m.length === 3) return `${m[2]}/${m[1]}/${m[0]}`; // dd/mm/yyyy
      return s;
    };
    const match = (y) => {
      if (!inputValue) return true;
      const lineData = (
        (y.ARTICULO || '') +
        (y.DESCRIP_COMERCIAL || '') +
        (y.CONTENEDOR || '') +
        (y.D_CLAVE_ARANCEL || '') +
        (y.FECHA_PREV_LLEGADA || '') +
        (y.D_PLANTILLA || '') +
        (y.COD_PROV || '') +
        (y.PROVEEDOR || '') +
        (y.D_PROVEEDOR_HOJA || '') +
        (y.NUM_EXPEDIENTE || '')
      ).toLowerCase();
      return lineData.includes(inputValue);
    };

    // Soporta tanto array de grupos [{id,lines}] como objeto {desc: [lines]}
    const groups = Array.isArray(r.data)
      ? r.data
      : Object.entries(r.data).map(([id, lines]) => ({ id, lines }));

    // === cabecera con las mismas columnas que tu tabla ===
    const HEAD = [
      'ARTICULO',
      'DESCRIP. COMERCIAL',
      '',                              // columna vacía (como en la tabla)
      'CONTENEDOR',
      'CANTIDAD',
      'PRECIO',
      'IMPORTE',
      'VALOR CAMBIO',
      'PRECIO CON GASTOS',
      'ORIGEN',
      'FECHA PREV LLEGADA',
      'PUERTO',
      'PROVEEDOR',
      'CONT. PROVEEDOR',
      '',                              // otra vacía (como en la tabla)
      'NUM. EXPEDIENTE HOJA'
    ];

    const AOA = [HEAD];

    // === recorrer grupos respetando separación por línea vacía ===
    groups.forEach(group => {
      const rows = (group.lines || []).filter(match);
      if (rows.length === 0) return;

      rows.forEach(y => {
        AOA.push([
          nn(y.ARTICULO),
          nn(y.DESCRIP_COMERCIAL),
          '', // vacía
          nn(String(y.CONTENEDOR || '').trim()),
          nnum(y.CANTIDAD1),
          nnum(y.PRECIO),
          nnum(y.IMPORTE),
          nnum(y.VALOR_CAMBIO),
          nnum(y.PRECIO_CON_GASTOS),
          nn(y.D_CLAVE_ARANCEL),
          toDateStr(y.FECHA_PREV_LLEGADA),
          nn(y.D_PLANTILLA),
          `${nn(y.PROVEEDOR)} ${nn(y.D_PROVEEDOR_HOJA)}`,
          nn(y.D_DESCRIPCION_EXPEDIENTE),
          '', // vacía
          `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`
        ]);
      });

      // línea en blanco para separar grupos (misma longitud que HEAD)
      AOA.push(new Array(HEAD.length).fill(''));
    });

    // Si la última fila es en blanco, no pasa nada.
    // === crear workbook/sheet ===
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(AOA);

    // Congelar fila de cabecera
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Ancho de columnas (estimado)
    ws['!cols'] = [
      { wch: 10 }, // ARTICULO
      { wch: 33 }, // DESCRIP_COMERCIAL
      { wch: 2  }, // vacía
      { wch: 15 }, // CONTENEDOR
      { wch: 12 }, // CANTIDAD
      { wch: 10 }, // PRECIO
      { wch: 12 }, // IMPORTE
      { wch: 12 }, // VALOR_CAMBIO
      { wch: 16 }, // PRECIO_CON_GASTOS
      { wch: 10 }, // D_CLAVE_ARANCEL
      { wch: 14 }, // FECHA_PREV_LLEGADA
      { wch: 18 }, // D_PLANTILLA
      { wch: 28 }, // PROVEEDOR Y NOMBRE
      { wch: 20 }, // D_DESCRIPCION_EXPEDIENTE
      { wch: 2  }, // vacía
      { wch: 16 }  // NUM_EXPEDIENTE-HOJA
    ];

    // Nombre de pestaña con fechas (máx 31 chars, sin caracteres no permitidos)
    const tabBase = `Llegadas ${first} a ${second}`;
    const safeTab = tabBase
      .replace(/[\\/?*\[\]:]/g, '-')   // limpiar inválidos
      .slice(0, 31) || 'Llegadas';

    XLSX.utils.book_append_sheet(wb, ws, safeTab);

    // Nombre del archivo
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

  // ======= Helpers =======
  const nn = v => (v === null || v === undefined || v === 'None') ? '' : v;
  const parseNum = v => {
    if (v === null || v === undefined) return NaN;
    if (typeof v === 'number') return v;
    const s = String(v).replace(/\s+/g,'').replace(',', '.');
    return parseFloat(s);
  };
  const fmt0 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{maximumFractionDigits:0}) : ''; };
  const fmt2 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2}) : ''; };
  const fmt4 = v => { const n = parseNum(v); return isFinite(n) ? n.toLocaleString('es-ES',{minimumFractionDigits:4,maximumFractionDigits:4}) : ''; };
  const toDateStr = v => {
    const s = nn(v); if (!s) return '';
    const [Y,M,D] = String(s).slice(0,10).split('-');
    return (Y && M && D) ? `${D}/${M}/${Y}` : s;
  };
  const match = y => {
    if (!inputValue) return true;
    const line = (
      (y.ARTICULO||'')+(y.DESCRIP_COMERCIAL||'')+(y.CONTENEDOR||'')+(y.D_CLAVE_ARANCEL||'')+
      (y.FECHA_PREV_LLEGADA||'')+(y.D_PLANTILLA||'')+(y.COD_PROV||'')+(y.PROVEEDOR||'')+
      (y.D_PROVEEDOR_HOJA||'')+(y.NUM_EXPEDIENTE||'')
    ).toLowerCase();
    return line.includes(inputValue);
  };

  const groups = Array.isArray(r.data) ? r.data : Object.entries(r.data).map(([id, lines]) => ({ id, lines }));

  // ======= PDF base =======
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 11;

  // Cabecera PDF
  const drawHeader = (pageNo = 1) => {
    doc.setFillColor(248);
    doc.rect(0, 0, pageW, 46, 'F');

    // Empresa + fecha (arriba izq)
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`FROXA S.A.   ${getCurrentDateTime()}`, margin, 18);

    // Título centrado
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const title = `Recepción de mercancías (${first} - ${second})${inputValue ? `   •   Filtro: "${inputValue}"` : ''}`;
    doc.text(title, pageW / 2, 32, { align: "center" });

    // Línea divisoria inferior
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

  const HEAD = [
    'Artículo','Descr. comercial','', 'Contenedor','Cantidad','Precio','Importe','Val. cambio','Precio C/G','Origen','Llegada','Puerto','Proveedor','Contrato','', 'Exped.'
  ];

  // AutoTable global con callback de página
  let pageCount = 1;
  doc.autoTable({
    head: [HEAD],
    body: groups.flatMap(g => {
      const rows = (g.lines || []).filter(match);
      if (!rows.length) return [];
      const body = rows.map(y => ([
        nn(y.ARTICULO),
        nn(y.DESCRIP_COMERCIAL),
        '',
        nn(String(y.CONTENEDOR || '').trim()),
        fmt0(y.CANTIDAD1),
        fmt2(y.PRECIO),
        fmt2(y.IMPORTE),
        fmt4(y.VALOR_CAMBIO),
        fmt2(y.PRECIO_CON_GASTOS),
        nn(y.D_CLAVE_ARANCEL),
        toDateStr(y.FECHA_PREV_LLEGADA),
        nn(y.D_PLANTILLA),
        nn(y.PROVEEDOR+' '+y.D_PROVEEDOR_HOJA),
        nn(y.D_DESCRIPCION_EXPEDIENTE),
        '',
        `${nn(y.NUM_EXPEDIENTE)}-${nn(y.NUM_HOJA)}`
      ]));
      // línea separadora entre bloques
      body.push([{ content: '', colSpan: HEAD.length, styles: { halign: 'center', lineWidth: { top: 1 }, lineColor: [0,0,0] } }]);
      return body;
    }),
    margin: { left: margin, right: margin, top: 48 },
    theme: 'plain',
    showHead: 'everyPage',
    styles: {
      fontSize: 6,
      cellPadding: { top: 1.5, right: 3, bottom: 1.5, left: 3 },
      minCellHeight: 12,
      overflow: 'ellipsize'
    },
    headStyles: {
      fillColor: [67,56,202],   // [79,70,229],
      textColor: [255,255,255], // blanco
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: { textColor: [0,0,0] },
    columnStyles: {
      0:{cellWidth:33}, 1:{cellWidth:111}, 2:{cellWidth:8}, 3:{cellWidth:55},
      4:{cellWidth:44,halign:'right'}, 5:{cellWidth:44,halign:'right'}, 6:{cellWidth:44,halign:'right'}, 
      7:{cellWidth:53,halign:'right'}, 8:{cellWidth:55,halign:'right'}, 9:{cellWidth:44,halign:'center'},
      10:{cellWidth:55,halign:'center'}, 11:{cellWidth:77}, 
      12:{cellWidth:99}, 
      13:{cellWidth:55}, 
      14:{cellWidth:8}, 
      15:{cellWidth:33,halign:'center'}
    },
    didParseCell: data => {
      if (data.section === 'body' && [4,5,6,7,8].includes(data.column.index)) {
        data.cell.styles.halign = 'right';
      }
    },
    didDrawPage: hookData => { 
      drawHeader(hookData.pageNumber); 
      drawFooter(hookData.pageNumber);
    }
  });

  const fileName = `llegadas_contenedores_${first || 'desde'}_${second || 'hasta'}.pdf`;
  doc.save(fileName);
}
