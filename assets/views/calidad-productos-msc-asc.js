var linesArtMSC = [];
var timeFromMSC = getCurrentYearBounds()[0];
var timeToMSC   = getCurrentYearBounds()[1];

function calidadProductosMscAscInit(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="createExcelMSC()">📥 Excel </span>`;
    document.title = "Informe productos MSC / ASC";



    
    setInputTimeMSC();
    getMSC();
}

function setInputTimeMSC(){
    document.getElementById('fromIdDateMS').value = timeFromMSC;
    document.getElementById('toIdDateMSC').value  = timeToMSC;
}

function changeDateMSC(){
    timeFromMSC = document.getElementById('fromIdDateMS').value;
    timeToMSC   = document.getElementById('toIdDateMSC').value;
    getMSC();
}

function getMSC(){
    document.getElementById('tableMSC').innerHTML = '<br>Cargando..';
    linesArtMSC = [];

    fetch(HTTP_HOST+'calidad/get/0/0/ventas_msc_asc/?date_from='+timeFromMSC+'&date_to='+timeToMSC).then(res => res.json()).then(r => {
        if(r && r.data && r.data.lines && r.data.lines.length > 0){
            linesArtMSC = r.data.lines;
            let html = '';
            r.data.lines.map(l => {
               html += `<tr>
                            <td class="border px-2 py-1 text-center">${l.FECHA_PEDIDO ?? ''}</td>
                            <td class="border px-2 py-1 text-center">${l.ARTICULO ?? ''}</td>
                            <td class="border px-2 py-1 text-left">${l.DESCRIPCION_ARTICULO ?? ''}</td>
                            <td class="border px-2 py-1 text-center">${l.UNI_SERALM ?? ''}</td>
                            <td class="border px-2 py-1 text-center">${l.PRESENTACION_PEDIDO ?? ''}</td>
                            <td class="border px-2 py-1 text-center">${l.EJERCICIO}/${l.NUMERO_SERIE}/${l.NUMERO_ALBARAN}</td>
                            <td class="border px-2 py-1 text-center">${l.ORGANIZACION_COMERCIAL ?? ''}</td>
                            <td class="border px-2 py-1 text-left">${l.CLIENTE} ${l.NOMBRE_CLIENTE}</td>
                          </tr>`;
            });
            document.getElementById('tableMSC').innerHTML = html;
        } else {
            document.getElementById('tableMSC').innerHTML = '<br>No hay ventas en el periodo indicado';
        }
    }).catch(e => {
        showM('Error MSC '+e, 'error');
        document.getElementById('tableMSC').innerHTML = e;
    });
}


/* ===========================
   EXPORTAR EXCEL MSC / ASC
   =========================== */
function createExcelMSC(){
  if (!linesArtMSC || !Array.isArray(linesArtMSC) || linesArtMSC.length === 0) {
    showM('No hay datos para exportar', 'warning');
    return;
  }

  // --- Helpers ---
  const nn = v => (v === null || v === undefined ? '' : v);

  const toDateDDMMYYYY = (v) => {
    const s = String(nn(v));
    if (!s) return '';
    // ya viene DD/MM/YYYY desde backend, lo dejamos tal cual
    return s;
  };

  const toNum = (v) => {
    if (typeof v === 'number') return v;
    const s = String(v ?? '').trim();
    if (!s) return '';
    const n = Number(s.replace(/\./g, '').replace(',', '.'));
    return Number.isFinite(n) ? n : '';
  };

  // --- Cabecera EXACTA a la tabla ---
  const HEAD = [
    'Fecha',
    'Código artículo',
    'Descripción',
    'Cantidad',
    'Presentación',
    'Albarán',
    'Org. Comercial',
    'Cliente'
  ];

  const AOA = [HEAD];

  // --- Datos ---
  linesArtMSC.forEach(l => {
    AOA.push([
      toDateDDMMYYYY(l.FECHA_PEDIDO),
      nn(l.ARTICULO),
      nn(l.DESCRIPCION_ARTICULO),
      toNum(l.UNI_SERALM),
      nn(l.PRESENTACION_PEDIDO),
      `${nn(l.EJERCICIO)}/${nn(l.NUMERO_SERIE)}/${nn(l.NUMERO_ALBARAN)}`,
      nn(l.ORGANIZACION_COMERCIAL),
      `${nn(l.CLIENTE)} ${nn(l.NOMBRE_CLIENTE)}`
    ]);
  });

  // --- Excel (SheetJS) ---
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(AOA);

  // Congelar cabecera
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };

  // Anchos de columna
  ws['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 14 }, // Código
    { wch: 60 }, // Descripción
    { wch: 12 }, // Cantidad
    { wch: 18 }, // Presentación
    { wch: 20 }, // Albarán
    { wch: 12 }, // Org. Com.
    { wch: 35 }, // Cliente
  ];

  // Formato numérico para Cantidad (columna D)
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    const addr = `D${R + 1}`;
    const cell = ws[addr];
    if (cell && typeof cell.v === 'number') {
      cell.t = 'n';
      cell.z = '#,##0.00';
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, 'Ventas MSC-ASC');

  // Nombre de archivo
  const ts = new Date();
  const stamp = `${ts.getFullYear()}-${String(ts.getMonth()+1).padStart(2,'0')}-${String(ts.getDate()).padStart(2,'0')}__${String(ts.getHours()).padStart(2,'0')}-${String(ts.getMinutes()).padStart(2,'0')}`;
  const fileName = `ventas_msc_asc_${timeFromMSC}_a_${timeToMSC}_${stamp}.xlsx`;

  XLSX.writeFile(wb, fileName);
}
