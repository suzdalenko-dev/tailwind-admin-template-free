let fechaDesdeLCHC;
let fechaHastaLCHC;
let serieLCHC = 'all';
let stateLCHC = 'all_states';
let rawLCHCData = [];


function logisticaCierreHojasCargaInit(){
    document.title = 'Repaso de cierre de hojas de carga';
    document.getElementById('slugTitle').innerHTML = '';

    fechaDesdeLCHC = getTodayDate();
    fechaHastaLCHC = getTodayDate();

    initLCHC();
}

function changedLCHC(){
    fechaDesdeLCHC =  document.getElementById('inputFromLCHC').value; 
    fechaHastaLCHC = document.getElementById('inputToLCHC').value;
    initLCHC();
}

function changeState(val){
    document.getElementById('tableLCJC').innerHTML = '<br>Cargando datos..';
    setTimeout(() => {
        stateLCHC = val;
        applyFilters();
    }, 100);
}

function initLCHC(){
    document.getElementById('inputFromLCHC').value = fechaDesdeLCHC;
    document.getElementById('inputToLCHC').value   = fechaHastaLCHC;
    document.getElementById('tableLCJC').innerHTML = '<br>Cargando datos..';

    fetch(HTTP_HOST+'logistica/get/0/0/repaso_hc_sin_cerrar/?date_from='+fechaDesdeLCHC+'&date_to='+fechaHastaLCHC+'&serie='+serieLCHC).then(r => r.json()).then(r => {
        if(r && r.data && r.data.out){
            rawLCHCData = r.data.out;   // guardamos datos crudos
            applyFilters();             // aplicamos filtros iniciales
        } else {
            document.getElementById('tableLCJC').innerHTML = '<br>No hay datos que mostrar.';
        }
    }).catch(e => showM(e,'error'));
}

function applyFilters(){
    let filtered = rawLCHCData;
    // filtrar por estado
    if(stateLCHC !== 'all_states'){
        filtered = filtered.map(item => {
            return {
                ...item,
                articulos: item.articulos.filter(a => a.LINE_STATE == stateLCHC)
            };
        }).filter(x => x.articulos.length > 0);
    }

    renderLCHCTable(filtered);
}

function renderLCHCTable(data){
    if(!data || data.length == 0){
        document.getElementById('tableLCJC').innerHTML = '<br>No hay datos que mostrar.';
        return;
    }

    let html = '';

    data.map(x => {
        // fila principal
        html += `
        <tr>
            <td class="border px-2 py-1 text-center">${x.fecha}</td>
            <td class="border px-2 py-1 text-center">${x.serie}</td>
            <td class="border px-2 py-1 text-center"></td>
            <td class="border px-2 py-1 text-center"></td>
            <td class="border px-2 py-1 text-center"></td>
            <td class="border px-2 py-1 text-center"></td>
            <td class="border px-2 py-1 text-center"></td>
            <td class="border px-2 py-1 text-center"></td>
            <td class="border px-2 py-1 text-center"></td>
        </tr>`;
        // detalles de articulos
        x.articulos.map(a => {
            html += `
            <tr>
                <td class="border px-2 py-1 text-center"></td>
                <td class="border px-2 py-1 text-center"></td>
                <td class="border px-2 py-1 text-left">${a.CLIENTE} ${a.RAZON_SOCIAL}</td>
                <td class="border px-2 py-1 text-center">${a.ARTICULO}</td>
                <td class="border px-2 py-1 text-left">${a.DESCRIPCION}</td>
                <td class="border px-2 py-1 text-center">${a.PREPARADOS_KG}</td>
                <td class="border px-2 py-1 text-center">${a.PEDIDOS_KG}</td>
                <td class="border px-2 py-1 text-center">${a.DIF_KG}</td>
                <td class="border px-2 py-1 text-center">${a.LINE_STATE}</td>
            </tr>`;
        });
    });

    document.getElementById('tableLCJC').innerHTML = html;
}


function changeSerieLCHC(val){
    serieLCHC = val;
    initLCHC();
}

function serieNameLCHC(x) {
    switch (x) {
        case '01': return 'NACIONAL';
        case '02': return 'REGIONAL';
        case '03': return 'CUBA';
        case '04': return 'EXPORTACION';
        default:   return '';  
    }
}