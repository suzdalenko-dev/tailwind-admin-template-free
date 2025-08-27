let searchAlmValue = '';
let ivr_data = [];   // guardamos todos los datos recibidos del fetch

function almacenImportacionVsRestoInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExcelAlmacen98()">📥 Excel </span>
        <span class="b-top-page" onclick="createPdf98()">📄 PDF </span>
    `;
    document.title = "Comparación";

    searchAlmValue = window.localStorage.getItem('buscar_almacen_val') || '';
    document.getElementById('searchAlmVal').value = searchAlmValue;

    getDataAIVR();
}

function getDataAIVR(){
  let currentYear = new Date().getFullYear()
  fetch(HTTP_HOST+`logistica/recalculate/0/0/comparacion_almacen_98/?year=${currentYear}`)
    .then(r => r.json())
    .then(r => {
      if (r && Array.isArray(r.data)) {
        ivr_data = r.data;   // ⬅ guardamos para poder filtrar luego
        paintIVRTable();
      }
      document.getElementById('divIVR').innerHTML   = '';
    })
    .catch(e => showM(e, 'error'));
}

function paintIVRTable(){
    let html = '';
    let filtered = ivr_data;

    if (searchAlmValue) {
        const q = searchAlmValue.toLowerCase();
        filtered = ivr_data.filter(i => {
            const values = [
              i?.exped?.NUMERO_DOC_EXT,
              i?.exped?.NUMERO_DOC_INTERNO,
              i?.exped?.CODIGO_PROVEEDOR,
              i?.exped?.D_CODIGO_PROVEEDOR,
              ...(i.stock || []).map(s => [s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN, s.CODIGO_PROVEEDOR, s.D_CODIGO_PROVEEDOR]).flat(),
              ...(i.textos || []).map(t => [t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN, t.CODIGO_PROVEEDOR, t.D_CODIGO_PROVEEDOR]).flat()
            ];
            return values.some(v => String(v ?? '').toLowerCase().includes(q));
        });
    }

    filtered.forEach(i => {
      const exped    = i?.exped || {};
      const stockArr = Array.isArray(i?.stock)  ? i.stock  : [];
      const textArr  = Array.isArray(i?.textos) ? i.textos : [];
      const rows = Math.max(stockArr.length, textArr.length, 1);

      for (let k = 0; k < rows; k++) {
        const s = stockArr[k] || {};
        const t = textArr[k]  || {};
        const j = (...v) => v.filter(Boolean).join(' ');
        const td = (v, extra='text-left') => `<td class="border px-2 py-1 ${extra}">${v ?? ''}</td>`;

        html += `<tr>
          ${td(formatLongDate(exped.FECHA_SUPERVISION), 'text-center')}
          ${td(exped.NUMERO_DOC_EXT,   'text-center')}
          ${td(exped.NUMERO_DOC_INTERNO)}
          ${td(j(exped.CODIGO_PROVEEDOR, exped.D_CODIGO_PROVEEDOR))}
          ${td(j(s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN))}
          ${td(j(s.CODIGO_PROVEEDOR, s.D_CODIGO_PROVEEDOR))}
          ${td(j(t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN))}
          ${td(j(t.CODIGO_PROVEEDOR, t.D_CODIGO_PROVEEDOR))}
        </tr>`;
      }
    });

    document.getElementById('tableIVR').innerHTML = html;
}

/* 🔍 Buscar */
function changeSearchedAlmVal(event){
    searchAlmValue = event.target.value.trim();
    window.localStorage.setItem('buscar_almacen_val', searchAlmValue);  // ⬅ guardamos en localStorage
    paintIVRTable();
}

/* 🧹 Limpiar */
function cleanAlmValSearch(){
    searchAlmValue = '';
    document.getElementById('searchAlmVal').value = '';
    window.localStorage.setItem('buscar_almacen_val', '');  // ⬅ limpiar localStorage
    paintIVRTable();
}




/* ===========================
   EXPORTAR A EXCEL (XLSX)
   =========================== */
function createExcelAlmacen98() {
  if (!ivr_data || !Array.isArray(ivr_data)) return;

  // --- Filtro persistente ---
  const inputValue = (localStorage.getItem('buscar_almacen_val') || '').toLowerCase();

  // --- Helpers ---
  const nn = v => (v === null || v === undefined ? '' : v);
  const joinVals = (...v) => v.filter(Boolean).join(' ').trim();
  const toDateDDMMYYYY = (v) => {
    const s = String(nn(v));
    if (!s) return '';
    // intenta parsear YYYY-MM-DD...
    const p = s.slice(0, 10).split('-');
    if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
    // si ya viene formateada por tu backend, devuelve tal cual
    return s;
  };

  // Igual que en paintIVRTable
  const match = (i) => {
    if (!inputValue) return true;
    const values = [
      i?.exped?.NUMERO_DOC_EXT,
      i?.exped?.NUMERO_DOC_INTERNO,
      i?.exped?.CODIGO_PROVEEDOR,
      i?.exped?.D_CODIGO_PROVEEDOR,
      ...(i.stock || []).map(s => [s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN, s.CODIGO_PROVEEDOR, s.D_CODIGO_PROVEEDOR]).flat(),
      ...(i.textos || []).map(t => [t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN, t.CODIGO_PROVEEDOR, t.D_CODIGO_PROVEEDOR]).flat()
    ];
    return values.some(v => String(v ?? '').toLowerCase().includes(inputValue));
  };

  // Cabecera EXACTA a tu tabla (8 columnas)
  const HEAD = [
    'Fecha',
    'D. Ext.',
    'D. Int.',
    'Proveedor. 98',
    'Documento Interno Alm.',
    'Proveedor',
    'D. Int. Gastos',
    'Proveedor Gastos'
  ];

  const AOA = [HEAD];

  // Recorremos cada expediente y “alineamos” stock/textos como en la tabla
  ivr_data.filter(match).forEach(i => {
    const exped    = i?.exped || {};
    const stockArr = Array.isArray(i?.stock)  ? i.stock  : [];
    const textArr  = Array.isArray(i?.textos) ? i.textos : [];
    const rows = Math.max(stockArr.length, textArr.length, 1);

    for (let k = 0; k < rows; k++) {
      const s = stockArr[k] || {};
      const t = textArr[k]  || {};
      AOA.push([
        toDateDDMMYYYY(exped.FECHA_SUPERVISION),
        nn(exped.NUMERO_DOC_EXT),
        nn(exped.NUMERO_DOC_INTERNO),
        joinVals(exped.CODIGO_PROVEEDOR, exped.D_CODIGO_PROVEEDOR),

        joinVals(s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN),
        joinVals(s.CODIGO_PROVEEDOR,   s.D_CODIGO_PROVEEDOR),

        joinVals(t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN),
        joinVals(t.CODIGO_PROVEEDOR,   t.D_CODIGO_PROVEEDOR),
      ]);
    }
    // (opcional) fila en blanco separadora
    // AOA.push(new Array(HEAD.length).fill(''));
  });

  // === Excel (SheetJS) ===
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(AOA);

  // Congelar cabecera
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // Anchos aproximados por columna
  ws['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 16 }, // D. Ext.
    { wch: 18 }, // D. Int.
    { wch: 28 }, // Proveedor. 98
    { wch: 26 }, // Documento Interno Alm.
    { wch: 26 }, // Proveedor
    { wch: 26 }, // D. Int. Gastos
    { wch: 26 }, // Proveedor Gastos
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Comparación A98');

  const ts = new Date();
  const stamp = `${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}-${String(ts.getDate()).padStart(2,'0')}__${String(ts.getHours()).padStart(2,'0')}-${String(ts.getMinutes()).padStart(2,'0')}`;
  const fileName = `comparacion_almacen_98_${stamp}${inputValue ? `_f_${inputValue}` : ''}.xlsx`;
  XLSX.writeFile(wb, fileName);
}


/* ===========================
   EXPORTAR A PDF (jsPDF)
   =========================== */
function createPdf98() {
  if (!ivr_data || !Array.isArray(ivr_data)) return;

  // Verifica jsPDF + autotable
  const hasJsPDF = !!(window.jspdf && window.jspdf.jsPDF);
  if (!hasJsPDF) { console.error('jsPDF no está cargado.'); return; }
  const { jsPDF } = window.jspdf;
  if (!(jsPDF.API && typeof jsPDF.API.autoTable === 'function')) {
    console.error('jspdf-autotable no está cargado.');
    return;
  }

  const inputValue = (localStorage.getItem('buscar_almacen_val') || '').toLowerCase();

  // Helpers
  const nn = v => (v === null || v === undefined ? '' : v);
  const joinVals = (...v) => v.filter(Boolean).join(' ').trim();
  const toDateDDMMYYYY = (v) => {
    const s = String(nn(v));
    if (!s) return '';
    const p = s.slice(0, 10).split('-');
    return (p.length === 3) ? `${p[2]}/${p[1]}/${p[0]}` : s;
  };

  const match = (i) => {
    if (!inputValue) return true;
    const values = [
      i?.exped?.NUMERO_DOC_EXT,
      i?.exped?.NUMERO_DOC_INTERNO,
      i?.exped?.CODIGO_PROVEEDOR,
      i?.exped?.D_CODIGO_PROVEEDOR,
      ...(i.stock || []).map(s => [s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN, s.CODIGO_PROVEEDOR, s.D_CODIGO_PROVEEDOR]).flat(),
      ...(i.textos || []).map(t => [t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN, t.CODIGO_PROVEEDOR, t.D_CODIGO_PROVEEDOR]).flat()
    ];
    return values.some(v => String(v ?? '').toLowerCase().includes(inputValue));
  };

  // Base PDF
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;

  const drawHeader = (pageNo=1) => {
    doc.setFillColor(248);
    doc.rect(0, 0, pageW, 48, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FROXA S.A.', margin, 18);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const title = `Comparación almacén 98 ${inputValue ? `• Filtro: "${inputValue}"` : ''}`;
    doc.text(title, pageW/2, 32, { align: 'center' });

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

  // Cabecera (8 columnas)
  const HEAD = [
    'Fecha',
    'D. Ext.',
    'D. Int.',
    'Proveedor. 98',
    'Documento Interno Alm.',
    'Proveedor',
    'D. Int. Gastos',
    'Proveedor Gastos'
  ];

  // Construcción del body igual que la tabla
  const body = [];
  ivr_data.filter(match).forEach(i => {
    const exped    = i?.exped || {};
    const stockArr = Array.isArray(i?.stock)  ? i.stock  : [];
    const textArr  = Array.isArray(i?.textos) ? i.textos : [];
    const rows = Math.max(stockArr.length, textArr.length, 1);

    for (let k = 0; k < rows; k++) {
      const s = stockArr[k] || {};
      const t = textArr[k]  || {};
      body.push([
        toDateDDMMYYYY(exped.FECHA_SUPERVISION),
        nn(exped.NUMERO_DOC_EXT),
        nn(exped.NUMERO_DOC_INTERNO),
        joinVals(exped.CODIGO_PROVEEDOR, exped.D_CODIGO_PROVEEDOR),
        joinVals(s.NUMERO_DOC_INTERNO, s.CODIGO_ALMACEN, s.D_ALMACEN),
        joinVals(s.CODIGO_PROVEEDOR,   s.D_CODIGO_PROVEEDOR),
        joinVals(t.NUMERO_DOC_INTERNO, t.CODIGO_ALMACEN, t.D_ALMACEN),
        joinVals(t.CODIGO_PROVEEDOR,   t.D_CODIGO_PROVEEDOR),
      ]);
    }

    // Separador visual entre bloques (opcional)
    // body.push([{ content: '', colSpan: HEAD.length }]);
  });

  // AutoTable
  doc.autoTable({
    head: [HEAD],
    body,
    margin: { left: margin, right: margin, top: 52, bottom: 20 },
    theme: 'plain',
    showHead: 'everyPage',
    styles: {
      fontSize: 7,
      cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
      minCellHeight: 12,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [67, 56, 202], // índigo suave
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 40,  halign: 'center' }, // Fecha
      1: { cellWidth: 30,  halign: 'center' }, // D. Ext.
      2: { cellWidth: 30 },                    // D. Int.
      3: { cellWidth: 160 },                   // Proveedor 98
      4: { cellWidth: 160 },                   // Doc Interno Alm.
      5: { cellWidth: 160 },                   // Proveedor
      6: { cellWidth: 110 },                   // D. Int. Gastos
      7: { cellWidth: 110 },                   // Proveedor Gastos
    },
    didDrawPage: (hook) => {
      drawHeader(hook.pageNumber);
      drawFooter(hook.pageNumber);
    }
  });

  const ts = new Date();
  const stamp = `${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}-${String(ts.getDate()).padStart(2,'0')}__${String(ts.getHours()).padStart(2,'0')}-${String(ts.getMinutes()).padStart(2,'0')}`;
  const fileName = `comparacion_almacen_98_${stamp}${inputValue ? `_f_${inputValue}` : ''}.pdf`;
  doc.save(fileName);
}
