/* ========================================================================
   STOCK – JS completo
   Flujo:
   - Primer fetch (o tras cambiar radio): SOLO ?stock_situacion=<valor>.
   - Backend devuelve artículos + familias/subfamilias + almacenes (derivables).
   - Marcamos TODOS los almacenes por defecto.
   - A partir de ahí, si cambias checkboxes => fetch con
       ?stock_situacion=<valor>&warehouse=00,01,...
   - Si cambias de radio => resetea selección de almacenes y filtros de texto/fam/sub;
     primer fetch de la nueva situación vuelve SIN warehouse.
   ======================================================================== */

/* ===== Estado ===== */
let articlesCS     = [];   // dataset actual del backend
let filteredCS     = [];   // lista visible

// índices visibles
let visFamToSubs = new Map();
let visSubToFams = new Map();
let visFamilies = [];
let visSubfamilies = [];

/* ===== Almacenes ===== */
let warehousesUniverse = [];        // universo para la situación actual (persistente mientras no cambie la situación)
let selectedWarehouses = new Set(); // selección del usuario que enviamos al backend
let participatingWarehouses = new Set(); // almacenes presentes en la lista visible
let warehousesReady    = false;     // false => primer fetch de una situación (no mandar warehouse)

/* ===== Filtros activos ===== */
let filterText = "";
let filterFamily = "";
let filterSubfamily = "";

/* ===== Situación de stock ===== */
let stockSituacion = 'DISPG'; // por defecto

/* ===== Helpers ===== */
const norm = s => (s ?? "")
  .toString()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "");

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

function toNumRaw(v){
  if (v === null || v === undefined || v === '') return NaN;
  const n = Number(String(v).replace(/\s+/g,'').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}
function toNum0(v){ const n = toNumRaw(v); return Number.isNaN(n) ? 0 : n; }
function fmt0(v){ const n = toNumRaw(v); return Number.isNaN(n) ? '' : n.toLocaleString('es-ES', { maximumFractionDigits: 0 }); }
function fmt1(v){ const n = toNumRaw(v); return Number.isNaN(n) ? '' : n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
function fmt3(v){ const n = toNumRaw(v); return Number.isNaN(n) ? '' : n.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 }); }
function pvpNum(a){ const p = (toNumRaw(a.PVP_NACIONAL) === 0) ? a.PVP_REGIONAL : a.PVP_NACIONAL; return toNum0(p); }

/** Índices fam<->sub desde una lista */
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

/** Almacenes desde ALMACENES_TXT de artículos */
function parseWarehousesFromArticles(list){
  const map = new Map();
  for (const a of list){
    const txt = String(a.ALMACENES_TXT || '').trim();
    if (!txt) continue;
    for (const chunk of txt.split(';')){
      const s = chunk.trim(); if (!s) continue;
      const sp = s.indexOf(' ');
      const code = sp === -1 ? s : s.slice(0, sp);
      const name = sp === -1 ? '' : s.slice(sp+1);
      if (!map.has(code)) map.set(code, name);
    }
  }
  return Array.from(map, ([code, name]) => ({code, name})).sort((a,b)=>{
    const an = /^\d+$/.test(a.code) ? parseInt(a.code,10) : null;
    const bn = /^\d+$/.test(b.code) ? parseInt(b.code,10) : null;
    if (an!=null && bn!=null) return an-bn;
    return a.code.localeCompare(b.code, 'es');
  });
}

/** Render checkboxes de almacén
 *  - checked = selectedWarehouses
 *  - (opcional) si quieres marcar “sin stock en vista”, podrías comparar con participatingWarehouses
 */
function renderWarehouseCheckboxes(){
  const cont = document.getElementById('listCheskBoxAlmecenes');
  if (!cont) return;

  let html = `
    <div class="w-full flex items-center gap-3 mb-1">
      <span class="font-medium">Almacenes:</span>
    </div>
    <div class="flex flex-wrap gap-x-4 gap-y-1">
  `;

  if (!warehousesUniverse.length){
    html += `<div class="text-sm text-gray-500">— No hay almacenes —</div></div>`;
    cont.innerHTML = html;
    return;
  }

  for (const w of warehousesUniverse){
    const checked = selectedWarehouses.has(w.code) ? 'checked' : '';
    html += `<label class="wh-item">
      <input type="checkbox" value="${w.code}" ${checked} onchange="onWarehouseToggle(event)">
      ${w.code} ${w.name}
    </label>`;
  }
  html += `</div>`;
  cont.innerHTML = html;
}

/* ===== Helpers UI ===== */
function resetTextFamFiltersOnly(){
  const si = document.getElementById('searchInputL'); if (si) si.value = "";
  const sf = document.getElementById('selectFamCS');  if (sf) sf.value = "";
  const ssf = document.getElementById('selectSubFamCS'); if (ssf) ssf.value = "";
  filterText = ""; filterFamily = ""; filterSubfamily = "";
}
function getSelectedStockSituacion(){
  const el = document.querySelector('input[name="stock_situacion"]:checked');
  return el ? el.value : 'DISPG';
}

/* ===== Init ===== */
function comprasStockInit(){
  document.getElementById('slugTitle').innerHTML = `
    <span class="b-top-page" onclick="createExcelCS()">📥 Excel </span>
    <span class="b-top-page" onclick="createPdfCS()">📄 PDF </span>
    <span class="ml-11">
      <input class="radio-input" name="stock_situacion" type="radio" id="DISPG" value="DISPG" checked>
      <label class="radio-label" for="DISPG">DISPONIBLE GENERAL</label>
      <input class="radio-input" name="stock_situacion" type="radio" id="DEPA" value="DEPA">
      <label class="radio-label" for="DEPA">DEPÓSITO ADUANERO</label>
      <input class="radio-input" name="stock_situacion" type="radio" id="FINAL" value="FINAL">
      <label class="radio-label" for="FINAL">DESTINO FINAL (CONTINGENTE)</label>
    </span>
  `;
  document.querySelectorAll('input[name="stock_situacion"]').forEach(r => {
    r.addEventListener('change', onStockSituacionChange);
  });
  document.title = 'Stock';
  // Estado inicial: aún no hay universo de almacenes
  warehousesReady = false;
  selectedWarehouses.clear();
  getDataCS(); // primer fetch sólo con situación
}

function onStockSituacionChange(e){
  stockSituacion = e.target && e.target.value ? e.target.value : 'DISPG';
  // reset: no mandar warehouse en el próximo fetch
  warehousesReady = false;
  selectedWarehouses.clear();
  resetTextFamFiltersOnly(); // limpiar texto/familia/subfamilia
  getDataCS(); // primer fetch de la nueva situación (sin warehouse)
}

/* ===== Data fetch ===== */
async function getDataCS(){
  const situ = getSelectedStockSituacion() || stockSituacion || 'DISPG';

  // Si ya tenemos universo y selección => incluir warehouses; si no, sólo situación
  let qs = `?stock_situacion=${encodeURIComponent(situ)}`;
  if (warehousesReady && selectedWarehouses.size > 0){
    const codes = [...selectedWarehouses].join(',');
    qs += `&warehouse=${encodeURIComponent(codes)}`;
  }

  fetch(HTTP_HOST + 'compras/get/0/0/stock_calculation/' + qs)
    .then(r => r.json())
    .then(x => {
      if (x && x.data && x.data.stock && x.data.stock.length > 0){
        articlesCS = x.data.stock;

        // Si todavía no teníamos universo/selección para esta situación, créalos ahora
        if (!warehousesReady){
          warehousesUniverse = parseWarehousesFromArticles(articlesCS);
          selectedWarehouses = new Set(warehousesUniverse.map(w => w.code)); // por defecto: todos
          warehousesReady = true; // a partir de ahora, al tocar checkboxes se mandará warehouse
        }

        // Recalcular selects/familias/subfamilias en base al dataset recibido
        applyFiltersCS(true);
      } else {
        showM('No hay datos para mostrar', 'warning');
        articlesCS = [];
        filteredCS = [];
        // Universo queda como esté; si es primer fetch de situación, lo vaciamos
        if (!warehousesReady){ warehousesUniverse = []; selectedWarehouses.clear(); }
        participatingWarehouses = new Set();
        renderWarehouseCheckboxes();
        fillTableCS([]);
      }
    })
    .catch(err => showM('Error: ' + err, 'error'));
}

/* ===== Filtros ===== */
function hasActiveFilters(){ return Boolean(filterText || filterFamily || filterSubfamily); }

function applyFiltersCS(fromFetch = false) {
  const t = norm(filterText);

  // 1) Texto
  const textFiltered = articlesCS.filter(a =>
    !t || [
      a.DESCRIP_COMERCIAL, a.CODIGO_ARTICULO,
      a.D_CODIGO_FAMILIA, a.FAMILIA,
      a.D_CODIGO_SUBFAMILIA, a.SUBFAMILIA
    ].some(v => norm(v).includes(t))
  );

  // 2) Índices visibles
  ({ mapFamToSubs: visFamToSubs, mapSubToFams: visSubToFams, families: visFamilies, subfamilies: visSubfamilies } = buildIndexesFrom(textFiltered));

  // 3) Normalizar selects si lo elegido ya no existe
  if (filterFamily && !visFamilies.includes(filterFamily)) {
    filterFamily = ""; const sf = document.getElementById('selectFamCS'); if (sf) sf.value = "";
  }
  if (filterSubfamily && !visSubfamilies.includes(filterSubfamily)) {
    filterSubfamily = ""; const ssf = document.getElementById('selectSubFamCS'); if (ssf) ssf.value = "";
  }

  // 4) Pintar selects dependientes
  buildSelectsCS();

  // 5) Aplicar fam/sub
  filteredCS = textFiltered.filter(a => {
    const famStr = keyFamOnly(a);
    const subStr = keySubOnly(a);
    const okFam = !filterFamily || famStr === filterFamily;
    const okSub = !filterSubfamily || subStr === filterSubfamily;
    return okFam && okSub;
  });

  filteredCS = sortForView(filteredCS);
  fillTableCS(filteredCS);

  // 6) Almacenes participantes (sólo informativo/estético)
  const whVisible = parseWarehousesFromArticles(filteredCS);
  participatingWarehouses = new Set(whVisible.map(w => w.code));
  renderWarehouseCheckboxes();
}

/* ===== Selects ===== */
function buildSelectsCS(){
  const families = filterSubfamily
    ? [...(visSubToFams.get(filterSubfamily) || new Set())].sort((a,b)=>norm(a).localeCompare(norm(b)))
    : visFamilies;
  setSelectOptions('selectFamCS', families, 'FAMILIAS', filterFamily);

  const subfamilies = filterFamily
    ? [...(visFamToSubs.get(filterFamily) || new Set())].sort((a,b)=>norm(a).localeCompare(norm(b)))
    : visSubfamilies;
  setSelectOptions('selectSubFamCS', subfamilies, 'SUBFAMILIAS', filterSubfamily);
}

/* ===== Tabla ===== */
function fillTableCS(list){
  let html = '', oldFamily = '';
  for (const a of list){
    const familyFull = keyFamFull(a);
    if (familyFull !== oldFamily){
      html += `<tr>
        <td class="border px-2 py-1 text-left">${familyFull}</td>
        ${'<td class="border px-2 py-1"></td>'.repeat(12)}
      </tr>`;
    }
    const kg = toNum0(a.STOCK_UNIDAD1);
    const pvp = pvpNum(a);
    html += `<tr>
      <td class="border px-2 py-1"></td>
      <td class="border px-2 py-1 text-left">${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}</td>
      <td class="border px-2 py-1 text-right">${fmt1(a.STOCK_UNIDAD2)}</td>
      <td class="border px-2 py-1 text-right">${fmt1(a.UND_DESDE_KG)}</td>
      <td class="border px-2 py-1 text-right">${fmt1(kg)}</td>
      <td class="border px-2 py-1 text-right">${fmt3(a.PMP)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(toNum0(a.PMP) * kg)}</td>
      <td class="border px-2 py-1 text-right">${fmt3(a.UPC)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(toNum0(a.UPC) * kg)}</td>
      <td class="border px-2 py-1 text-right">${fmt3(a.PRECIO_STANDARD)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(toNum0(a.PRECIO_STANDARD) * kg)}</td>
      <td class="border px-2 py-1 text-right">${fmt3(pvp)}</td>
      <td class="border px-2 py-1 text-right">${fmt0(pvp * kg)}</td>
    </tr>`;
    oldFamily = familyFull;
  }
  const tbl = document.getElementById('tableNormalCS'); if (tbl) tbl.innerHTML = html;
  const div = document.getElementById('divCS'); if (div) div.innerHTML = '';
}

/* ===== Handlers ===== */
function changeSearchedInputCS(e){ filterText = e.target.value || ""; applyFiltersCS(); }

function chagedFamilyCS(e){
  filterFamily = e.target.value || "";
  if (filterFamily && filterSubfamily){
    const subs = visFamToSubs.get(filterFamily);
    if (!subs || !subs.has(filterSubfamily)) { filterSubfamily = ""; const ssf = document.getElementById('selectSubFamCS'); if (ssf) ssf.value = ""; }
  }
  applyFiltersCS();
}

function chagedSubFamilyCS(e){
  filterSubfamily = e.target.value || "";
  if (filterSubfamily && filterFamily){
    const fams = visSubToFams.get(filterSubfamily);
    if (!fams || !fams.has(filterFamily)) { filterFamily = ""; const sf = document.getElementById('selectFamCS'); if (sf) sf.value = ""; }
  }
  applyFiltersCS();
}

/* === Almacenes: selección del usuario => fetch con warehouse === */
function onWarehouseToggle(ev){
  const code = ev.target.value;
  const isChecked = ev.target.checked;
  if (isChecked) selectedWarehouses.add(code);
  else selectedWarehouses.delete(code);
  // Ya tenemos universo (warehousesReady = true), así que ahora sí mandamos warehouse
  getDataCS();
}

/* Escoba: limpiar texto/fam/sub (no toca almacenes ni situación) */
function clickBroomCS(){
  resetTextFamFiltersOnly();
  ({ mapFamToSubs: visFamToSubs, mapSubToFams: visSubToFams, families: visFamilies, subfamilies: visSubfamilies } = buildIndexesFrom(articlesCS));
  buildSelectsCS();
  filteredCS = sortForView(articlesCS);
  fillTableCS(filteredCS);
  const whVisible = parseWarehousesFromArticles(filteredCS);
  participatingWarehouses = new Set(whVisible.map(w => w.code));
  renderWarehouseCheckboxes();
}

/* ===== Excel / PDF / Mensajes ===== */
// ... (tus funciones createExcelCS / createPdfCS / showM se mantienen igual que ya las tienes)

/* ===================== Excel ===================== */
function createExcelCS(){
  if (typeof XLSX === 'undefined') { showM?.('XLSX no está cargado', 'error'); return; }

  // Timestamp: 2025-01-01__11-30-44
  const ts = (() => {
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}__${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  })();

  const situ = (typeof getSelectedStockSituacion === 'function' ? getSelectedStockSituacion() : (stockSituacion || 'DISPG'));
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

  const units = a => Math.round(Number(a.UND_DESDE_KG ?? 0));
  const kgNum = a => toNum0(a.STOCK_UNIDAD1);
  const pvpN  = a => {
    const p = (toNumRaw(a.PVP_NACIONAL) === 0) ? a.PVP_REGIONAL : a.PVP_NACIONAL;
    return toNum0(p);
  };

  const AOA = [HEAD];
  let lastFam = '';

  rows.forEach(a => {
    const fam = `${a.D_CODIGO_FAMILIA} ${a.FAMILIA} ${a.D_CODIGO_SUBFAMILIA} ${a.SUBFAMILIA}`.replaceAll('/', '/ ');
    if (fam !== lastFam){
      AOA.push([fam, ...new Array(HEAD.length-1).fill('')]); // fila de grupo
      lastFam = fam;
    }
    const und = units(a);
    const kg  = kgNum(a);
    const pvp = pvpN(a);
    const pmp = toNum0(a.PMP);
    const upc = toNum0(a.UPC);
    const est = toNum0(a.PRECIO_STANDARD);

    AOA.push([
      '',                                              // fam vacío en detalle
      `${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}`,   // Artículo
      num(a.STOCK_UNIDAD2),                            // Caj.
      und,                                             // Und.
      num(kg),                                         // Kg
      num(pmp),              num(pmp * kg),            // PMP €/Kg / Valor
      num(upc),              num(upc * kg),            // UPC €/Kg / Valor
      num(est),              num(est * kg),            // Estándar €/Kg / Valor
      num(pvp),              num(pvp * kg)             // PVP €/Kg / Valor
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
    { wch: 10 }, { wch: 12 }  // PVP €/Kg / Valor PVP
  ];

  XLSX.utils.book_append_sheet(wb, ws, `Stock_${situ}`);
  XLSX.writeFile(wb, `stock_actual_${situ}_${ts}.xlsx`);
}

/* ===================== PDF ===================== */
function createPdfCS(){
  if (!(window.jspdf && window.jspdf.jsPDF)) { showM?.('jsPDF no está cargado', 'error'); return; }
  if (!(window.jspdf.jsPDF.API && typeof window.jspdf.jsPDF.API.autoTable === 'function')) {
    showM?.('jspdf-autotable no está cargado', 'error'); return;
  }
  const { jsPDF } = window.jspdf;

  const ts = (() => {
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}__${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  })();

  const situ = (typeof getSelectedStockSituacion === 'function' ? getSelectedStockSituacion() : (stockSituacion || 'DISPG'));
  const list = (filteredCS && filteredCS.length ? filteredCS : articlesCS);
  const rows = [...list];

  const HEAD = [
    'Fam. subfamilia','Artículo','Caj.','Und.','Kg',
    '€/Kg PMP','Valor PMP','€/Kg UPC','Valor UPC',
    '€/Kg Estándar','Valor Estándar','€/Kg PVP','Valor PVP'
  ];

  const units = a => Math.round(Number(a.UND_DESDE_KG ?? 0));
  const pvpN  = a => (toNumRaw(a.PVP_NACIONAL) === 0 ? a.PVP_REGIONAL : a.PVP_NACIONAL);

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;

  const drawHeader = (pageNo=1) => {
    doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text(`Stock actual (${situ}) ${ts}`, margin, 22);
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

  const body = [];
  let lastFam = '';

  rows.forEach(a => {
    const fam = `${a.D_CODIGO_FAMILIA} ${a.FAMILIA} ${a.D_CODIGO_SUBFAMILIA} ${a.SUBFAMILIA}`.replaceAll('/', '/ ');
    if (fam !== lastFam){
      body.push([{
        content: fam,
        colSpan: HEAD.length,
        styles: { fillColor: [240,240,240], fontStyle: 'bold', halign: 'left' }
      }]);
      lastFam = fam;
    }

    const und = units(a);
    const kg  = toNum0(a.STOCK_UNIDAD1);
    const pvp = toNum0(pvpN(a));

    body.push([
      { content: `${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}`, colSpan: 2, styles: { overflow: 'linebreak', halign: 'left' } },
      fmt1(a.STOCK_UNIDAD2),
      fmt1(und),
      fmt1(kg),
      fmt3(a.PMP),             fmt0((toNum0(a.PMP)) * kg),
      fmt3(a.UPC),             fmt0((toNum0(a.UPC)) * kg),
      fmt3(a.PRECIO_STANDARD), fmt0((toNum0(a.PRECIO_STANDARD)) * kg),
      fmt3(pvp),               fmt0(pvp * kg)
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
      0:{ cellWidth: 99 }, 1:{ cellWidth: 99 },
      2:{ halign:'right', cellWidth: 33 },
      3:{ halign:'right', cellWidth: 33 },
      4:{ halign:'right', cellWidth: 44 },
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

  doc.save(`stock_actual_${situ}_${ts}.pdf`);
}
