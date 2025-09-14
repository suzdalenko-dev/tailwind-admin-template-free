let materialsCEP     = [];
let allLinesCEP      = [];
let currentYearCEP   = new Date().getFullYear();
let searchValCEP     = '';
let filteredAllLines = [];
let providerFiltered = [];

function calidadEvaluacionProveedorInit(){
    document.title = "Evaluación de proveedores";
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="createExcelAllCEP()">📥 Excel</span>';
    searchValCEP = '';
    setTitleCEP();
    getDataCEP();
}

function changeYearCEP(x){
    currentYearCEP = currentYearCEP+x;
    setTitleCEP();
}
function setTitleCEP(){
    window.location.href = `/dashboard/#calidad-evaluacion-proveedor?year=${currentYearCEP}`;
    document.getElementById('titleCEP').innerHTML = `Evaluación de proveedores año ${currentYearCEP}`;
}

function getDataCEP(){
    let [from, to]   = getYearBoundsStr(currentYearCEP);
    let url          = `calidad/get/of/0/evaluacion_proveedor/?from=${from}&to=${to}`;

    suzdalenkoGet(url, (data) => {
        if(data && data.data && data.data.all && data.data.all.length > 0){
            allLinesCEP = data.data.all;
            materialsCEP = sortedByNameSuzdalenko(data.data.material_suppliers);
        } else {
            showM('No hay datos para mostrar', 'warning');
            allLinesCEP  = [];
            materialsCEP = [];
        }
        paintCEP();
    });   
}

function paintCEP(){
    let htmlAll      = '';
    let htmlProvider = '';
    filteredAllLines = allLinesCEP;
    providerFiltered = materialsCEP;
    // Paint all lines
    if(searchValCEP){
        filteredAllLines = allLinesCEP.filter(x => formatLongDate(x.FECHA_PARTE).toLowerCase().includes(searchValCEP) || x.NUMERO_PARTE.toLowerCase().includes(searchValCEP) || x.LOTE_INTERNO.toLowerCase().includes(searchValCEP) || x.CODIGO_PROVEEDOR.toLowerCase().includes(searchValCEP) || x.D_PROVEEDOR.toLowerCase().includes(searchValCEP) || x.CODIGO_ARTICULO.toLowerCase().includes(searchValCEP) || x.D_ARTICULO.toLowerCase().includes(searchValCEP) || x.LOTE_INTERNO.toLowerCase().includes(searchValCEP));
        providerFiltered = materialsCEP.filter(x => x.code.toLowerCase().includes(searchValCEP) || x.name.toLowerCase().includes(searchValCEP));
    }

    filteredAllLines.map(x => {
        htmlAll += `<tr>
                        <td class="border px-2 py-1 text-center">${formatLongDate(x.FECHA_PARTE)}</td>
                        <td class="border px-2 py-1 text-center">${x.NUMERO_PARTE}</td>
                        <td class="border px-2 py-1 text-left">${x.CODIGO_PROVEEDOR} ${x.D_PROVEEDOR} </td>
                        <td class="border px-2 py-1 text-left">${x.CODIGO_ARTICULO} ${x.D_ARTICULO}</td>
                        <td class="border px-2 py-1 text-left">${x.LOTE_INTERNO}</td> 
                        <td class="border px-2 py-1 text-center">${fmt0(x.CANT_RECIBIDA)}</td>
                        <td class="border px-2 py-1 text-left">${fmt1(x.VALOR_OBTENIDO)}</td>
                    </tr>`;
    });
    // Paint material_suppliers resumen
    providerFiltered.map(y => {
        htmlProvider += `<tr>
                            <td class="border px-2 py-1 text-left">${y.code ?? ''} ${(y.name || '')}</td>
                            <td class="border px-2 py-1 text-center">${fmt1(y.final_valuation) ?? ''}</td>
                        </tr>`;
    });
    document.getElementById('tableProvCEP').innerHTML = htmlProvider;
    document.getElementById('tableAllCEP').innerHTML = htmlAll;
}

function cleanCEP(){
    searchValCEP = '';
    document.getElementById('searchCEP').value = '';
    getDataCEP();
}

function changeCEP(event){
    searchValCEP = event.target.value.trim().toLowerCase();
    paintCEP();
}


/**
 * Creates and downloads an Excel (.xlsx) file with supplier evaluation data for the current year.
 * The Excel file contains two tables side-by-side:
 * 1. A detailed list of all evaluation entries (lines).
 * 2. A summary of the average score for each supplier.
 * If a search filter is active, the exported data will be filtered accordingly.
 * The function uses the XLSX.js library if available; otherwise, it falls back to generating a CSV file.
 * The generated Excel includes an autofilter on the detailed data table.
 *
 * @returns {void} This function does not return a value but triggers a file download in the browser.
 */
function createExcelAllCEP() {
  const year = currentYearCEP;

  // ---- Datos tabla izquierda (líneas) ----
  const leftHeaders = ['Fecha','Parte','Proveedor','Artículo','Lote','Kg','Nota'];
  const leftRowsSrc = (searchValCEP ? (filteredAllLines || []) : (allLinesCEP || []));
  const leftRows = leftRowsSrc.map(x => [
    formatLongDate(x.FECHA_PARTE),
    x.NUMERO_PARTE ?? '',
    `${x.CODIGO_PROVEEDOR ?? ''} ${x.D_PROVEEDOR ?? ''}`.trim(),
    `${x.CODIGO_ARTICULO ?? ''} ${x.D_ARTICULO ?? ''}`.trim(),
    x.LOTE_INTERNO ?? '',
    x.CANT_RECIBIDA * 1,
    x.VALOR_OBTENIDO * 1
  ]);

  // ---- Datos tabla derecha (resumen proveedores) ----
  const rightHeaders = ['Nombre proveedor','Nota media'];
  const rightRowsSrc = (searchValCEP ? (providerFiltered || []) : (materialsCEP || []));
  const rightRows = rightRowsSrc.map(y => [
    `${y.code ?? ''} ${y.name ?? ''}`.trim(),
    y.final_valuation * 1
  ]);

  // ---- Si está la librería XLSX -> crear .xlsx ----
  if (window.XLSX) {
    const wb = XLSX.utils.book_new();

    // Colocamos la izquierda desde A1
    const ws = XLSX.utils.aoa_to_sheet([leftHeaders, ...leftRows]);

    // Columna vacía entre tablas -> origen de la derecha es (fila 0, col leftHeaders.length + 1)
    const rightOrigin = { r: 0, c: leftHeaders.length + 1 };
    XLSX.utils.sheet_add_aoa(ws, [rightHeaders, ...rightRows], { origin: rightOrigin });

    // Anchos de columna (opcional): izquierda (7 cols) + 1 vacía + derecha (2 cols)
    ws['!cols'] = [
      { wch: 12 }, { wch: 10 }, { wch: 28 }, { wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 8 },
      { wch: 22 },  // columna separadora
      { wch: 32 }, { wch: 10 }
    ];

    // Nombre de pestaña (máx 31 chars en Excel)
    const wsname = `evaluacion proveedores año ${year}`.slice(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, wsname);

    // Nombre del archivo
    XLSX.writeFile(wb, `evaluacion_proveedores_${year}.xlsx`);
    return;
  }

  // ---- Fallback: CSV (no soporta autofiltros) ----
  const leftBlock  = [leftHeaders,  ...leftRows];
  const rightBlock = [rightHeaders, ...rightRows];
  const totalRows  = Math.max(leftBlock.length, rightBlock.length);
  const leftW = leftHeaders.length;
  const rightW = rightHeaders.length;

  let csv = '';
  for (let i = 0; i < totalRows; i++) {
    const L = leftBlock[i]  || new Array(leftW).fill('');
    const R = rightBlock[i] || new Array(rightW).fill('');
    const row = [...L, '', ...R].map(v => {
      const s = (v ?? '').toString().replace(/"/g, '""');
      return `"${s}"`;
    }).join(',');
    csv += row + '\n';
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `evaluacion_proveedores_${year}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
