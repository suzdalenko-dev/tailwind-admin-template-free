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