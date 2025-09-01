// ===== Estado =====
let articlesCS     = [];   // datos originales del servidor
let filteredCS     = [];   // lista visible (filtrada)

// arrays completos (no visibles) – se reconstruyen al cargar
let arrayFamily    = [];
let arraySubfamily = [];

// índices globales (del dataset completo)
let famToSubs = new Map(); // fam -> Set(subs)
let subToFams = new Map(); // sub -> Set(fams)

// índices visibles (tras filtrar por texto)
let visFamToSubs = new Map();
let visSubToFams = new Map();
let visFamilies = [];
let visSubfamilies = [];

// filtros activos
let filterText = "";
let filterFamily = "";
let filterSubfamily = "";

// ===== Helpers =====
const norm = s => (s ?? "")
  .toString()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, ""); // quita acentos

const keyFamFull  = a => `${a.D_CODIGO_FAMILIA} ${a.FAMILIA} ${a.D_CODIGO_SUBFAMILIA} ${a.SUBFAMILIA}`.replaceAll('/', '/ ');
const keyFamOnly  = a => `${a.D_CODIGO_FAMILIA} ${a.FAMILIA}`;
const keySubOnly  = a => `${a.D_CODIGO_SUBFAMILIA} ${a.SUBFAMILIA}`;

function sortForView(list){
  return [...list].sort((x, y) => {
    const a1 = norm(`${x.D_CODIGO_FAMILIA} ${x.FAMILIA}`);
    const b1 = norm(`${y.D_CODIGO_FAMILIA} ${y.FAMILIA}`);
    if (a1 !== b1) return a1 < b1 ? -1 : 1;

    const a2 = norm(`${x.D_CODIGO_SUBFAMILIA} ${x.SUBFAMILIA}`);
    const b2 = norm(`${y.D_CODIGO_SUBFAMILIA} ${y.SUBFAMILIA}`);
    if (a2 !== b2) return a2 < b2 ? -1 : 1;

    const a3 = norm(`${x.DESCRIP_COMERCIAL} ${x.CODIGO_ARTICULO}`);
    const b3 = norm(`${y.DESCRIP_COMERCIAL} ${y.CODIGO_ARTICULO}`);
    return a3.localeCompare(b3);
  });
}

function setSelectOptions(id, options, placeholder, selected){
  const el = document.getElementById(id);
  let html = `<option value="" ${!selected ? "selected" : ""}>${placeholder}</option>`;
  for (const opt of options) {
    const sel = (selected && opt === selected) ? "selected" : "";
    html += `<option value="${opt}" ${sel}>${opt}</option>`;
  }
  el.innerHTML = html;
}

/** Construye índices fam<->sub para una lista base */
function buildIndexesFrom(list){
  const mapFamToSubs = new Map();
  const mapSubToFams = new Map();

  for (const a of list){
    const fam = keyFamOnly(a);
    const sub = keySubOnly(a);

    if (!mapFamToSubs.has(fam)) mapFamToSubs.set(fam, new Set());
    mapFamToSubs.get(fam).add(sub);

    if (!mapSubToFams.has(sub)) mapSubToFams.set(sub, new Set());
    mapSubToFams.get(sub).add(fam);
  }

  const families    = [...mapFamToSubs.keys()].sort((a,b)=>norm(a).localeCompare(norm(b)));
  const subfamilies = [...mapSubToFams.keys()].sort((a,b)=>norm(a).localeCompare(norm(b)));

  return { mapFamToSubs, mapSubToFams, families, subfamilies };
}

// ===== Init =====
function comprasStockInit(){
  document.getElementById('slugTitle').innerHTML = `
    <span class="b-top-page" onclick="createExcelCS()">📥 Excel </span>
    <span class="b-top-page" onclick="createPdfCS()">📄 PDF </span>
  `;
  document.title = 'Stock';
  getDataCS();
}

// ===== Data fetch =====
async function getDataCS(){
  fetch(HTTP_HOST + 'compras/get/0/0/stock_calculation/')
    .then(r => r.json())
    .then(x => {
      if (x && x.data && x.data.stock && x.data.stock.length > 0){
        articlesCS = x.data.stock;

        // índices del dataset completo (referencia)
        ({ mapFamToSubs: famToSubs, mapSubToFams: subToFams, families: arrayFamily, subfamilies: arraySubfamily } = buildIndexesFrom(articlesCS));

        filteredCS = sortForView(articlesCS);

        // índices visibles = inicialmente todos (sin texto)
        ({ mapFamToSubs: visFamToSubs, mapSubToFams: visSubToFams, families: visFamilies, subfamilies: visSubfamilies } = buildIndexesFrom(articlesCS));

        buildSelectsCS();     // llenar selects con todas las opciones
        fillTableCS(filteredCS);
      } else {
        showM('No hay datos para mostrar', 'warning');
      }
    })
    .catch(err => showM('Error: ' + err, 'error'));
}

// ===== Filtros =====
function applyFiltersCS() {
  const t = norm(filterText);

  // 1) Filtrar SOLO por texto para determinar las opciones visibles en selects
  const textFiltered = articlesCS.filter(a =>
    !t || [
      a.DESCRIP_COMERCIAL,
      a.CODIGO_ARTICULO,
      a.D_CODIGO_FAMILIA, a.FAMILIA,
      a.D_CODIGO_SUBFAMILIA, a.SUBFAMILIA
    ].some(v => norm(v).includes(t))
  );

  // Recalcular índices visibles según el texto
  ({ mapFamToSubs: visFamToSubs, mapSubToFams: visSubToFams, families: visFamilies, subfamilies: visSubfamilies } = buildIndexesFrom(textFiltered));

  // Si la selección actual ya no existe con el filtro de texto, limpiarla
  if (filterFamily && !visFamilies.includes(filterFamily)) {
    filterFamily = "";
    document.getElementById('selectFamCS').value = "";
  }
  if (filterSubfamily && !visSubfamilies.includes(filterSubfamily)) {
    filterSubfamily = "";
    document.getElementById('selectSubFamCS').value = "";
  }

  // 2) Reconstruir selects dependientes según lo visible
  buildSelectsCS();

  // 3) Ahora sí, filtrar por texto + familia + subfamilia
  filteredCS = textFiltered.filter(a => {
    const famStr = keyFamOnly(a);
    const subStr = keySubOnly(a);
    const okFam = !filterFamily || famStr === filterFamily;
    const okSub = !filterSubfamily || subStr === filterSubfamily;
    return okFam && okSub;
  });

  filteredCS = sortForView(filteredCS);
  fillTableCS(filteredCS);
}

// ===== Selects (dependientes y sensibles al texto) =====
function buildSelectsCS(){
  // Familias visibles (si hay subfamilia seleccionada, limitar a las compatibles dentro de lo visible)
  const families = filterSubfamily
    ? [...(visSubToFams.get(filterSubfamily) || new Set())].sort((a,b)=>norm(a).localeCompare(norm(b)))
    : visFamilies;

  setSelectOptions('selectFamCS', families, 'FAMILIAS', filterFamily);

  // Subfamilias visibles (si hay familia seleccionada, limitar a las suyas dentro de lo visible)
  const subfamilies = filterFamily
    ? [...(visFamToSubs.get(filterFamily) || new Set())].sort((a,b)=>norm(a).localeCompare(norm(b)))
    : visSubfamilies;

  setSelectOptions('selectSubFamCS', subfamilies, 'SUBFAMILIAS', filterSubfamily);
}

// ===== Pintar tabla =====
function fillTableCS(list){
  let html      = '';
  let oldFamily = '';

  for (const a of list){
    const familyFull = keyFamFull(a);

    if (familyFull !== oldFamily){
      html += `<tr>
        <td class="border px-2 py-1 text-left">${familyFull}</td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
        <td class="border px-2 py-1"></td>
      </tr>`;
    }

    const pvp = a.PVP_NACIONAL == 0 ? a.PVP_REGIONAL : a.PVP_NACIONAL;

    html += `<tr>
      <td class="border px-2 py-1"></td>
      <td class="border px-2 py-1 text-left">${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}</td>

      <td class="border px-2 py-1 text-right">${fmt1(a.STOCK_UNIDAD2)}</td>
      <td class="border px-2 py-1 text-right">${fmt1(a.UND_DESDE_CAJAS)}</td>
      <td class="border px-2 py-1 text-right">${fmt1(a.STOCK_UNIDAD1)}</td>

      <td class="border px-2 py-1 text-right">${fmt3(a.PMP)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(a.PMP * a.STOCK_UNIDAD1)}</td>

      <td class="border px-2 py-1 text-right">${fmt3(a.UPC)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(a.UPC * a.STOCK_UNIDAD1)}</td>

      <td class="border px-2 py-1 text-right">${fmt3(a.PRECIO_STANDARD)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(a.PRECIO_STANDARD * a.STOCK_UNIDAD1)}</td>

      <td class="border px-2 py-1 text-right">${fmt3(pvp)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(pvp * a.STOCK_UNIDAD1)}</td>
    </tr>`;

    oldFamily = familyFull;
  }

  document.getElementById('tableNormalCS').innerHTML = html;
  document.getElementById('divCS').innerHTML = '';
}

// ===== Handlers UI =====
function changeSearchedInputCS(event){
  filterText = event.target.value || "";
  applyFiltersCS();     // también actualiza selects visibles
}

function chagedFamilyCS(event){
  filterFamily = event.target.value || "";

  // si la subfamilia seleccionada no pertenece a esta familia (dentro de lo visible), limpiarla
  if (filterFamily && filterSubfamily){
    const subs = visFamToSubs.get(filterFamily);
    if (!subs || !subs.has(filterSubfamily)) {
      filterSubfamily = "";
      document.getElementById('selectSubFamCS').value = "";
    }
  }

  applyFiltersCS();     // recalcula opciones y tabla con el texto actual
}

function chagedSubFamilyCS(event){
  filterSubfamily = event.target.value || "";

  // si la familia seleccionada no contiene esta subfamilia (dentro de lo visible), limpiarla
  if (filterSubfamily && filterFamily){
    const fams = visSubToFams.get(filterSubfamily);
    if (!fams || !fams.has(filterFamily)) {
      filterFamily = "";
      document.getElementById('selectFamCS').value = "";
    }
  }

  applyFiltersCS();     // recalcula opciones y tabla con el texto actual
}

// Escoba: limpiar filtros sin recargar del servidor
function clickBroomCS(){
  document.getElementById('searchInputL').value = "";
  document.getElementById('selectFamCS').value = "";
  document.getElementById('selectSubFamCS').value = "";

  filterText = "";
  filterFamily = "";
  filterSubfamily = "";

  // índices visibles vuelven a ser todos
  ({ mapFamToSubs: visFamToSubs, mapSubToFams: visSubToFams, families: visFamilies, subfamilies: visSubfamilies } = buildIndexesFrom(articlesCS));
  buildSelectsCS();

  filteredCS = sortForView(articlesCS);
  fillTableCS(filteredCS);
}



/* EXCEL */

function createExcelCS(){
  if (typeof XLSX === 'undefined') { console.error('XLSX no está cargado'); return; }

  // Timestamp: 2025-01-01__11-30-44
  const ts = (() => {
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}__${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  })();

  // Datos visibles (si no hay filtro activo, filteredCS será = articlesCS)
  const list = (filteredCS && filteredCS.length ? filteredCS : articlesCS);
  const rows = [...list]; // ya vienen ordenados por sortForView()

  const HEAD = [
    'Fam. subfamilia','Artículo','Caj.','Und.','Kg',
    '€/Kg PMP','Valor PMP','€/Kg UPC','Valor UPC',
    '€/Kg Estándar','Valor Estándar','€/Kg PVP','Valor PVP'
  ];

  const num = v => {
    if (v === null || v === undefined || v === '') return '';
    const n = Number(String(v).replace(/\s+/g,'').replace(',', '.'));
    return Number.isFinite(n) ? n : '';
  };
  const units = a => {
    const val = (a.UNIDADES_CALCULADAS ?? a.UND_DESDE_CAJAS ?? 0);
    return Math.round(Number(val) || 0); // unidades como entero
  };
  const pvpNum = a => num((a.PVP_NACIONAL == 0 ? a.PVP_REGIONAL : a.PVP_NACIONAL));

  const AOA = [HEAD];
  let lastFam = '';

  rows.forEach(a => {
    const fam = `${a.D_CODIGO_FAMILIA} ${a.FAMILIA} ${a.D_CODIGO_SUBFAMILIA} ${a.SUBFAMILIA}`.replaceAll('/', '/ ');
    if (fam !== lastFam){
      AOA.push([fam, ...new Array(HEAD.length-1).fill('')]); // fila de grupo
      lastFam = fam;
    }
    const und = units(a);
    const pvp = pvpNum(a);

    AOA.push([
      '',                                              // fam vacío en detalle
      `${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}`,   // Artículo
      num(a.STOCK_UNIDAD2),                            // Caj.
      und,                                             // Und. (entero)
      num(a.STOCK_UNIDAD1),                            // Kg
      num(a.PMP),              num((a.PMP||0) * (a.STOCK_UNIDAD1||0)),             // PMP €/Kg / Valor
      num(a.UPC),              num((a.UPC||0) * (a.STOCK_UNIDAD1||0)),             // UPC €/Kg / Valor
      num(a.PRECIO_STANDARD),  num((a.PRECIO_STANDARD||0) * (a.STOCK_UNIDAD1||0)), // Estándar €/Kg / Valor
      pvp,                     num((pvp||0) * (a.STOCK_UNIDAD1||0))                // PVP / Valor PVP
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(AOA);

  // Congela cabecera y define anchuras
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  ws['!cols'] = [
    { wch: 36 }, // Fam. subfamilia
    { wch: 40 }, // Artículo
    { wch: 10 }, // Caj.
    { wch: 10 }, // Und.
    { wch: 10 }, // Kg
    { wch: 11 }, { wch: 12 }, // PMP €/Kg / Valor
    { wch: 11 }, { wch: 12 }, // UPC €/Kg / Valor
    { wch: 13 }, { wch: 14 }, // Estándar €/Kg / Valor
    { wch: 10 }, { wch: 12 }  // PVP / Valor PVP
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Stock');
  XLSX.writeFile(wb, `stock_actual_${ts}.xlsx`);
}





function createPdfCS(){
  if (!(window.jspdf && window.jspdf.jsPDF)) { console.error('jsPDF no está cargado'); return; }
  if (!(window.jspdf.jsPDF.API && typeof window.jspdf.jsPDF.API.autoTable === 'function')) {
    console.error('jspdf-autotable no está cargado'); return;
  }
  const { jsPDF } = window.jspdf;

  // Timestamp: 2025-01-01__11-30-44
  const ts = (() => {
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}__${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  })();

  const list = (filteredCS && filteredCS.length ? filteredCS : articlesCS);
  const rows = [...list];

  const HEAD = [
    'Fam. subfamilia','Artículo','Caj.','Und.','Kg',
    '€/Kg PMP','Valor PMP','€/Kg UPC','Valor UPC',
    '€/Kg Estándar','Valor Estándar','PVP','Valor PVP'
  ];

  const toNum = v => {
    if (v === null || v === undefined || v === '') return NaN;
    const n = Number(String(v).replace(/\s+/g,'').replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  };
  
  const units = a => Math.round(Number(a.UNIDADES_CALCULADAS ?? a.UND_DESDE_CAJAS ?? 0));
  const pvpNum = a => (a.PVP_NACIONAL == 0 ? a.PVP_REGIONAL : a.PVP_NACIONAL);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;

  const drawHeader = (pageNo=1) => {
    doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text(`Stock actual ${ts}`, margin, 22);
    doc.setFontSize(6); doc.setFont('helvetica','normal');
    let filtros = [];
    if (filterText) filtros.push(`Texto: "${filterText}"`);
    if (filterFamily) filtros.push(`Fam: ${filterFamily}`);
    if (filterSubfamily) filtros.push(`Subfam: ${filterSubfamily}`);
    if (filtros.length) doc.text(filtros.join('   •   '), margin, 38);
    doc.setDrawColor(200); doc.line(margin, 44, pageW - margin, 44);
  };
  const drawFooter = (pageNo=1) => {
    doc.setFontSize(7); doc.setTextColor(120);
    doc.text(`Página ${pageNo}`, pageW - margin, pageH - 10, { align: 'right' });
    doc.setTextColor(0);
  };

  // Body con filas de grupo (familia) y detalle (artículo)
  const body = [];
  let lastFam = '';

  rows.forEach(a => {
    const fam = `${a.D_CODIGO_FAMILIA} ${a.FAMILIA} ${a.D_CODIGO_SUBFAMILIA} ${a.SUBFAMILIA}`.replaceAll('/', '/ ');
    if (fam !== lastFam){
      // Fila de grupo: una sola celda que ocupa todo el ancho
      body.push([{
        content: fam,
        colSpan: HEAD.length,
        styles: { fillColor: [240,240,240], fontStyle: 'bold', halign: 'left' }
      }]);
      lastFam = fam;
    }

    const und = units(a);
    const pvp = pvpNum(a);

    // Fila de detalle: el nombre del artículo VA A LA IZQUIERDA
    // usando colSpan=2 para ocupar las columnas "Fam. subfamilia" + "Artículo"
    body.push([
      {
        content: `${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}`,
        colSpan: 2,
        styles: { overflow: 'linebreak', halign: 'left' }
      },
      // ¡OJO! Como colSpan=2 ocupa col 0 y 1, a partir de aquí
      // añadimos las celdas de las columnas 2..12:
      fmt1(a.STOCK_UNIDAD2),           // Caj.
      fmt1(und),                       // Und. (entero, sin decimales)
      fmt1(a.STOCK_UNIDAD1),           // Kg
      fmt3(a.PMP), fmt0((toNum(a.PMP)||0) * (toNum(a.STOCK_UNIDAD1)||0)),
      fmt3(a.UPC),              fmt0((a.UPC||0) * (a.STOCK_UNIDAD1||0)),             // UPC €/Kg / Valor
      fmt3(a.PRECIO_STANDARD), fmt0((toNum(a.PRECIO_STANDARD)||0) * (toNum(a.STOCK_UNIDAD1)||0)),
      fmt3(pvp), fmt0((toNum(pvp)||0) * (toNum(a.STOCK_UNIDAD1)||0))
    ]);
  });

  doc.autoTable({
    head: [HEAD],
    body,
    theme: 'plain',
    margin: { left: margin, right: margin, top: 52 },
    headStyles: {
      fillColor: [67,56,202], textColor:[255,255,255],
      halign: 'center', fontStyle:'bold'
    },
    styles: { fontSize: 7, cellPadding: 2, overflow: 'ellipsize' },
    columnStyles: {
      // La primera celda de detalle tiene colSpan=2 (0 y 1),
      // así que definimos anchos para ambas columnas sumando el espacio que necesitas
      0:{ cellWidth: 99 },      // parte izquierda (bajo "Fam. subfamilia")
      1:{ cellWidth: 99 },      // parte derecha (bajo "Artículo")
      2:{ halign:'right', cellWidth: 33 }, // Caj.
      3:{ halign:'right', cellWidth: 33 }, // Und.
      4:{ halign:'right', cellWidth: 44 }, // Kg
      5:{ halign:'right', cellWidth: 44 }, 
      6:{ halign:'right', cellWidth: 55 },
      7:{ halign:'right', cellWidth: 44 }, 
      8:{ halign:'right', cellWidth: 60 },
      9:{ halign:'right', cellWidth: 65 },
      10:{ halign:'right', cellWidth: 50 },
      11:{ halign:'right', cellWidth: 41 },
      12:{ halign:'right', cellWidth: 41 }
    },
    didDrawPage: ({ pageNumber }) => { drawHeader(pageNumber); drawFooter(pageNumber); }
  });

  doc.save(`stock_actual_${ts}.pdf`);
}












