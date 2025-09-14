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



function createExcelAllCEP() {
  const year = currentYearCEP;

  if (!window.XLSX) {
    showM('No se encontró XLSX. No se puede generar Excel.', 'error');
    return;
  }

  // ---- Datos tabla izquierda (líneas) ----
  const leftHeaders = ['Fecha','Parte','Proveedor','Artículo','Lote','Kg','Nota'];
  const leftRowsSrc = (searchValCEP ? (filteredAllLines || []) : (allLinesCEP || []));
  const leftRows = leftRowsSrc.map(x => [
    formatLongDate(x.FECHA_PARTE),
    x.NUMERO_PARTE ?? '',
    `${x.CODIGO_PROVEEDOR ?? ''} ${x.D_PROVEEDOR ?? ''}`.trim(),
    `${x.CODIGO_ARTICULO ?? ''} ${x.D_ARTICULO ?? ''}`.trim(),
    x.LOTE_INTERNO ?? '',
    (x.CANT_RECIBIDA ?? 0) * 1,
    (x.VALOR_OBTENIDO ?? 0) * 1
  ]);

  // ---- Datos tabla derecha (resumen proveedores) ----
  const rightHeaders = ['Nombre proveedor','Nota media'];
  const rightRowsSrc = (searchValCEP ? (providerFiltered || []) : (materialsCEP || []));
  const rightRows = rightRowsSrc.map(y => [
    `${y.code ?? ''} ${y.name ?? ''}`.trim(),
    (y.final_valuation ?? 0) * 1
  ]);

  // ===== Libro y Hoja 1: "evaluacion proveedores año {year}" =====
  const wb = XLSX.utils.book_new();

  // Colocamos la izquierda desde A1
  const wsMain = XLSX.utils.aoa_to_sheet([leftHeaders, ...leftRows]);

  // Añadimos la derecha dejando 1 columna vacía entre ambas
  const rightOrigin = { r: 0, c: leftHeaders.length + 1 };
  XLSX.utils.sheet_add_aoa(wsMain, [rightHeaders, ...rightRows], { origin: rightOrigin });

  // Anchos de columna (izquierda 7) + separador + derecha 2
  wsMain['!cols'] = [
    { wch: 12 }, { wch: 10 }, { wch: 28 }, { wch: 28 }, { wch: 16 }, { wch: 10 }, { wch: 8 },
    { wch: 33 },   // columna separadora (vacía visual)
    { wch: 36 }, { wch: 12 }
  ];

  // Autofiltro para la tabla izquierda (encabezado fila 1)
  const afRef = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: leftRows.length, c: leftHeaders.length - 1 }
  });
  wsMain['!autofilter'] = { ref: afRef };

  // Congelar fila 1 (opcional)
  wsMain['!freeze'] = { ySplit: 1 };

  const wsnameMain = `evaluacion proveedores año ${year}`.slice(0, 31);
  XLSX.utils.book_append_sheet(wb, wsMain, wsnameMain);

  // ===== Hoja 2: "ranking proveedores" (ordenado desc por nota) =====
  const rankingHeaders = ['#', 'Proveedor', 'Nota media'];
  const rankingSrc = [...rightRowsSrc].sort(
    (a, b) => ((b.final_valuation ?? -Infinity) - (a.final_valuation ?? -Infinity))
  );
  const rankingRows = rankingSrc.map((y, i) => [
    i + 1,
    `${y.code ?? ''} ${y.name ?? ''}`.trim(),
    (y.final_valuation ?? 0) * 1
  ]);

  const wsRank = XLSX.utils.aoa_to_sheet([rankingHeaders, ...rankingRows]);
  wsRank['!cols'] = [{ wch: 6 }, { wch: 40 }, { wch: 12 }];
  // Autofiltro en ranking
  wsRank['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rankingRows.length, c: rankingHeaders.length - 1 } }) };
  // Congelar fila 1
  wsRank['!freeze'] = { ySplit: 1 };

  const wsnameRank = 'ranking proveedores'; // <= 31 chars
  XLSX.utils.book_append_sheet(wb, wsRank, wsnameRank);

  // ===== Guardar archivo =====
  XLSX.writeFile(wb, `evaluacion_proveedores_${year}.xlsx`);
}
