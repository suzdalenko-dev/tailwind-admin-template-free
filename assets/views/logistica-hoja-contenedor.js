let fechaDesde = '';
let fechaHasta = '';

function logisticaHojaContenedorInit(){
    document.getElementById('slugTitle').innerHTML = '';
    document.title = "Hojas de seguimiento expedientes";

    fechaDesde = getTodayDate();
    fechaHasta = getTodayDate();
    initLHC();
}

function initLHC(){
    document.getElementById('inputDesdeLHC').value = fechaDesde;
    document.getElementById('inputHastaLHC').value = fechaHasta;
    document.getElementById('tableLHC').innerHTML = '<br>Cargando datos..';

    let url = `${HTTP_HOST}/logistica/action/0/0/modelo_hoja_cnt/?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`;
    fetch(url).then(r => r.json()).then(r => {
        if(r && r.data && r.data && r.data.res && r.data.res.length > 0){
            let htmlTable = '';
            r.data.res.map(row => {
                htmlTable += `<tr>
                                <td class="border expanded px-2 py-1 text-center">${formatLongDate(row.FECHA_LLEGADA)}</td>
                                <td class="border expanded px-2 py-1 text-center">${row.NUM_EXPEDIENTE}</td>
                                <td class="border expanded px-2 py-1 text-center">${row.NUM_HOJA}</td>
                                <td class="border expanded px-2 py-1 text-center"><b class="color_blue" onclick="openExcelLHC('${row.NUM_EXPEDIENTE}', '${row.CONTENEDOR}')">${row.CONTENEDOR}</b></td>
                                <td class="border expanded px-2 py-1 text-center">${row.PROVEEDOR} ${row.D_PROVEEDOR}</td>
                                <td class="border expanded px-2 py-1 text-center">${row.SITUACION_LOGISTICA} ${row.D_SITUACION_LOGISTICA}</td>
                            </tr>`;
                console.log(row);
            });
            document.getElementById('tableLHC').innerHTML = htmlTable;
        } else {
            document.getElementById('tableLHC').innerHTML = '<br>No hay datos que mostrar.';
        }
        console.log(r);
    }).catch(e => showM(e, 'error'));
}

function openExcelLHC(expediente, contenedor){
    // documentar aqui los cambios Z:\Informatica\LIBRA
    let url = `${HTTP_HOST}/logistica/action/0/0/modelo_hoja_excel/?expediente=${expediente}&contenedor=${contenedor}`;
    window.open(url, '_blank');
}

function funcDesdeLHC(){
    fechaDesde = document.getElementById('inputDesdeLHC').value;
    initLHC();
}

function funcHastaLHC(){
    fechaHasta = document.getElementById('inputHastaLHC').value;
    initLHC();
}