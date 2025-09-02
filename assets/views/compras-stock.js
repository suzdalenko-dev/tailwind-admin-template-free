/* ========================================================================
   STOCK – JS completo
   NUEVO requisito: los nombres de almacén SIEMPRE se muestran todos
   (universo completo) y, al filtrar por artículo/familia/subfamilia,
   solo quedan **marcados** los que participan en los artículos visibles.
   Al desmarcar manualmente un almacén, el checkbox NO desaparece.
   ======================================================================== */

/* ===== Estado ===== */
let articlesCS     = [];   // datos originales del servidor (tras el fetch por almacén)
let filteredCS     = [];   // lista visible (filtrada por texto/familia/subfamilia)

// arrays completos (no visibles) – se reconstruyen al cargar/fetch
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

/* ===== Almacenes ===== */
let warehousesUniverse = [];        // [{code:'00', name:'CARTES'}, ...] (solo del primer fetch)
let selectedWarehouses = new Set(); // lo que enviaremos al backend en el próximo fetch
let participatingWarehouses = new Set(); // los que participan en la lista visible (para "checked")
let warehousesReady    = false;     // para construir el universo una sola vez

/* ===== Filtros activos ===== */
let filterText = "";
let filterFamily = "";
let filterSubfamily = "";

/* ===== Helpers ===== */
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

function toNumRaw(v){
  if (v === null || v === undefined || v === '') return NaN;
  const n = Number(String(v).replace(/\s+/g,'').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}
function toNum0(v){ const n = toNumRaw(v); return Number.isNaN(n) ? 0 : n; }
function fmt0(v){
  const n = toNumRaw(v);
  return Number.isNaN(n) ? '' : n.toLocaleString('es-ES', { maximumFractionDigits: 0 });
}
function fmt1(v){
  const n = toNumRaw(v);
  return Number.isNaN(n) ? '' : n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
function fmt3(v){
  const n = toNumRaw(v);
  return Number.isNaN(n) ? '' : n.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}
function pvpNum(a){
  const p = (toNumRaw(a.PVP_NACIONAL) === 0) ? a.PVP_REGIONAL : a.PVP_NACIONAL;
  return toNum0(p);
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

/** === Almacenes: parseo desde artículos (ALMACENES_TXT) === */
function parseWarehousesFromArticles(list){
  const map = new Map(); // code -> name
  for (const a of list){
    const txt = String(a.ALMACENES_TXT || '').trim();
    if (!txt) continue;
    for (const chunk of txt.split(';')){
      const s = chunk.trim();
      if (!s) continue;
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

/** Render de los checkboxes de almacén
 *  Siempre pinta el UNIVERSO de almacenes. El estado "checked" se decide
 *  por participatingWarehouses (los que están en los artículos visibles).
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
    const checked = participatingWarehouses.has(w.code) ? 'checked' : '';
    html += `<label class="wh-item">
      <input type="checkbox" value="${w.code}" ${checked} onchange="onWarehouseToggle(event)">
      ${w.code} ${w.name}
    </label>`;
  }
  html += `</div>`;
  cont.innerHTML = html;
}

/* ===== Util de UI para marcar/desmarcar todos sin re-render ===== */
function setAllWarehouseCheckboxes(checked){
  const cont = document.getElementById('listCheskBoxAlmecenes');
  if (!cont) return;
  cont.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = checked);
}

/* ===== Init ===== */
function comprasStockInit(){
  document.getElementById('slugTitle').innerHTML = `
    <span class="b-top-page" onclick="createExcelCS()">📥 Excel </span>
    <span class="b-top-page" onclick="createPdfCS()">📄 PDF </span>
  `;
  document.title = 'Stock';
  getDataCS();
}

/* ===== Data fetch ===== */
async function getDataCS(){
  // Parametriza por almacenes seleccionados
  let qs = '';
  if (selectedWarehouses.size > 0){
    const codes = [...selectedWarehouses].join(',');
    qs = `?warehouse=${encodeURIComponent(codes)}`;
  }

  fetch(HTTP_HOST + 'compras/get/0/0/stock_calculation/' + qs)
    .then(r => r.json())
    .then(x => {
      if (x && x.data && x.data.stock && x.data.stock.length > 0){
        articlesCS = x.data.stock;

        // Universo de almacenes SOLO en el primer fetch
        if (!warehousesReady){
          warehousesUniverse = parseWarehousesFromArticles(articlesCS);
          selectedWarehouses = new Set(warehousesUniverse.map(w => w.code)); // por defecto: todos
          warehousesReady = true;
        }

        // índices del dataset completo (referencia)
        ({ mapFamToSubs: famToSubs, mapSubToFams: subToFams, families: arrayFamily, subfamilies: arraySubfamily } = buildIndexesFrom(articlesCS));

        // Estado visible inicial según filtros actuales
        applyFiltersCS(true); // también actualiza la tira de almacenes (sin ocultar ninguno)
      } else {
        showM('No hay datos para mostrar', 'warning');
        articlesCS = [];
        filteredCS = [];
        participatingWarehouses = new Set();
        renderWarehouseCheckboxes(); // muestra universo (si se hubiera creado) con todos desmarcados
        fillTableCS([]);
      }
    })
    .catch(err => showM('Error: ' + err, 'error'));
}

/* ===== Filtros ===== */
function hasActiveFilters(){
  return Boolean(filterText || filterFamily || filterSubfamily);
}

/**
 * Aplica filtros de texto/familia/subfamilia a articlesCS,
 * recalcula selects visibles y SINCRONIZA los "checked" de almacenes
 * con los que participan en los artículos en pantalla.
 *
 * @param {boolean} fromFetch - si se llama justo después de un fetch
 */
function applyFiltersCS(fromFetch = false) {
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
    const sf = document.getElementById('selectFamCS'); if (sf) sf.value = "";
  }
  if (filterSubfamily && !visSubfamilies.includes(filterSubfamily)) {
    filterSubfamily = "";
    const ssf = document.getElementById('selectSubFamCS'); if (ssf) ssf.value = "";
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

  // 4) Mostrar SIEMPRE todos los almacenes, marcando solo los que participan
  const whVisible = parseWarehousesFromArticles(filteredCS);
  participatingWarehouses = new Set(whVisible.map(w => w.code));
  renderWarehouseCheckboxes();

  // 5) Opcional: sin filtros y en primer fetch, si no hay selección del usuario, marcamos todos
  if (fromFetch && !hasActiveFilters() && selectedWarehouses.size === 0 && warehousesUniverse.length){
    selectedWarehouses = new Set(warehousesUniverse.map(w => w.code));
  }
}

/* ===== Selects (dependientes y sensibles al texto) ===== */
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

/* ===== Pintar tabla ===== */
function fillTableCS(list){
  let html      = '';
  let oldFamily = '';

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
      <td class="border px-2 py-1 text-right">${fmt1(a.UND_DESDE_CAJAS)}</td>
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

  const tbl = document.getElementById('tableNormalCS');
  if (tbl) tbl.innerHTML = html;
  const div = document.getElementById('divCS');
  if (div) div.innerHTML = '';
}

/* ===== Handlers UI ===== */
function changeSearchedInputCS(event){
  filterText = event.target.value || "";
  applyFiltersCS(); // también actualiza selects visibles y "checked" de almacenes
}

function chagedFamilyCS(event){
  filterFamily = event.target.value || "";

  // si la subfamilia seleccionada no pertenece a esta familia (dentro de lo visible), limpiarla
  if (filterFamily && filterSubfamily){
    const subs = visFamToSubs.get(filterFamily);
    if (!subs || !subs.has(filterSubfamily)) {
      filterSubfamily = "";
      const ssf = document.getElementById('selectSubFamCS'); if (ssf) ssf.value = "";
    }
  }

  applyFiltersCS();
}

function chagedSubFamilyCS(event){
  filterSubfamily = event.target.value || "";

  // si la familia seleccionada no contiene esta subfamilia (dentro de lo visible), limpiarla
  if (filterSubfamily && filterFamily){
    const fams = visSubToFams.get(filterSubfamily);
    if (!fams || !fams.has(filterFamily)) {
      filterFamily = "";
      const sf = document.getElementById('selectFamCS'); if (sf) sf.value = "";
    }
  }

  applyFiltersCS();
}

/* ===== Handlers Almacenes ===== */
function onWarehouseToggle(ev){
  const code = ev.target.value;
  const isChecked = ev.target.checked;

  if (isChecked) selectedWarehouses.add(code);
  else selectedWarehouses.delete(code);

  // Hacemos fetch con los seleccionados.
  // Si no queda ninguno marcado => sin parámetro => backend devuelve todos.
  getDataCS();
}



// Escoba: limpiar filtros (solo UI/cliente, no toca selección de almacenes)
function clickBroomCS(){
  const si = document.getElementById('searchInputL'); if (si) si.value = "";
  const sf = document.getElementById('selectFamCS'); if (sf) sf.value = "";
  const ssf = document.getElementById('selectSubFamCS'); if (ssf) ssf.value = "";

  filterText = "";
  filterFamily = "";
  filterSubfamily = "";

  // índices visibles vuelven a ser todos
  ({ mapFamToSubs: visFamToSubs, mapSubToFams: visSubToFams, families: visFamilies, subfamilies: visSubfamilies } = buildIndexesFrom(articlesCS));
  buildSelectsCS();

  filteredCS = sortForView(articlesCS);
  fillTableCS(filteredCS);

  // Recalcular participación y pintar (SIEMPRE lista completa)
  const whVisible = parseWarehousesFromArticles(filteredCS);
  participatingWarehouses = new Set(whVisible.map(w => w.code));
  renderWarehouseCheckboxes();
}

/* ===== Excel ===== */
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
  const pvpN = a => {
    const p = (toNumRaw(a.PVP_NACIONAL) === 0) ? a.PVP_REGIONAL : a.PVP_NACIONAL;
    return num(p);
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
    const pvp = pvpN(a);

    AOA.push([
      '',                                              // fam vacío en detalle
      `${a.DESCRIP_COMERCIAL} ${a.CODIGO_ARTICULO}`,   // Artículo
      num(a.STOCK_UNIDAD2),                            // Caj.
      und,                                             // Und. (entero)
      num(a.STOCK_UNIDAD1),                            // Kg
      num(a.PMP),              num((toNum0(a.PMP)) * (toNum0(a.STOCK_UNIDAD1))),             // PMP €/Kg / Valor
      num(a.UPC),              num((toNum0(a.UPC)) * (toNum0(a.STOCK_UNIDAD1))),             // UPC €/Kg / Valor
      num(a.PRECIO_STANDARD),  num((toNum0(a.PRECIO_STANDARD)) * (toNum0(a.STOCK_UNIDAD1))), // Estándar €/Kg / Valor
      pvp,                     num((toNum0(pvp)) * (toNum0(a.STOCK_UNIDAD1)))                // PVP / Valor PVP
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

/* ===== PDF ===== */
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

  const units = a => Math.round(Number(a.UNIDADES_CALCULADAS ?? a.UND_DESDE_CAJAS ?? 0));
  const pvpN = a => (toNumRaw(a.PVP_NACIONAL) === 0 ? a.PVP_REGIONAL : a.PVP_NACIONAL);

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
    const kg = toNum0(a.STOCK_UNIDAD1);
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

  doc.save(`stock_actual_${ts}.pdf`);
}

/* ===== Utilidad mínima de mensajes ===== */
function showM(msg, type='info'){
  // Ajusta esto a tu sistema de notificaciones si lo tienes (toasts, etc.)
  const fn = (type === 'error') ? console.error : (type === 'warning') ? console.warn : console.log;
  fn(msg);
}

/* ===== Exportar init (si usas módulos, cambia esto) ===== */
// window.comprasStockInit = comprasStockInit;
// window.changeSearchedInputCS = changeSearchedInputCS;
// window.chagedFamilyCS = chagedFamilyCS;
// window.chagedSubFamilyCS = chagedSubFamilyCS;
// window.clickBroomCS = clickBroomCS;
// window.createExcelCS = createExcelCS;
// window.createPdfCS = createPdfCS;
// window.onWarehouseToggle = onWarehouseToggle;
// window.whSelectAll = whSelectAll;
// window.whSelectNone = whSelectNone;
