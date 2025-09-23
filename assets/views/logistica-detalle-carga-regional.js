let yearLDCR;
let load_idLDCR;
let colorGreenLDCR = ''

function logisticaDetalleCargaRegionalInit(){
    document.title = 'Carga Regional Detalle'
    document.getElementById('slugTitle').innerHTML = '<a href="/dashboard/#logistica-listado-cargas-regional"><span class="b-top-page">🗺️ Listado Cargas Regional</span></a>';

    let hashDate = parseHashRoute();
    if(hashDate && hashDate.params && hashDate.params.year){ yearLDCR = hashDate.params.year; }
    if(hashDate && hashDate.params && hashDate.params.load_id){ load_idLDCR = hashDate.params.load_id; }
    
    getLDCR();
}

function getLDCR(){
    suzdalenkoGet(`/logistica/get/${yearLDCR}/${load_idLDCR}/get_refresh_custom_load_02/`, (res) => {
        let html = '';
        
        if(res && res.data && res.data.lines && res.data.lines.length > 0){
            res.data.lines.map(x => {
                colorGreenLDCR = '';
                if(x.clicked == 1){
                    colorGreenLDCR = 'class="class_green" style="color:white;"'
                }

                html += `<tr ${colorGreenLDCR}>
                    <td class="border expanded px-2 py-1 text-center">${formatDateToEuropean(x.load_date)}</td>
                    <td class="border expanded px-2 py-1 text-center">${x.load_id}</td>
                    <td class="border expanded px-2 py-1 text-left" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')"><span class="hovered">${x.article_name} ${x.article_code}</span></td>
                    <td class="border expanded px-2 py-1 text-center">${x.preparado > 0 ? x.preparado : ''}</td>
                    <td class="border expanded px-2 py-1 text-center">${x.pedido > 0 ? x.pedido: ''}</td>
                    
                    <td class="border expanded px-2 py-1 text-center">${x.und_ped > 0 ? x.und_ped : ''}</td>
                    <td class="border expanded px-2 py-1 text-center">${x.cajas_ped > 0 ? x.cajas_ped : ''}</td>
                </tr>`;
            });
            document.getElementById('tableLDCR').innerHTML = html;
        } else {
            document.getElementById('tableLDCR').innerHTML = 'No hay datos..';
        }
    });
}

function orderClickedLDCR(ejercicio, load_id, article_code){
    suzdalenkoGet(`logistica/action/0/0/regional_clicked/?ejercicio=${ejercicio}&load_id=${load_id}&article_code=${article_code}`, (res) => {
        getLDCR();
    });
}