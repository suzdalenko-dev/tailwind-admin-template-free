let yearLDCR;
let load_idLDCR;

function logisticaDetalleCargaRegionalInit(){
    document.title = 'Cargas en Regional Detalle'
    document.getElementById('slugTitle').innerHTML = '';

    let hashDate = parseHashRoute();
    if(hashDate && hashDate.params && hashDate.params.year){ yearLDCR = hashDate.params.year; }
    if(hashDate && hashDate.params && hashDate.params.load_id){ load_idLDCR = hashDate.params.load_id; }
    
    getLDCR();
}

function getLDCR(){
    document.getElementById('tableLDCR').innerHTML = 'Cargando..';

    suzdalenkoGet(`/logistica/get/${yearLDCR}/${load_idLDCR}/custom_carga_serie/`, (res) => {
        let html = '';
        
        console.log(res.data.res)

        if(res && res.data && res.data.res && res.data.res.length > 0){
            res.data.res.map(x => {
                console.log(x)

                html += `<tr>
                    <td class="border expanded px-2 py-1 text-center">${x.NUMERO_PROPUESTA}</td>
                    <td class="border expanded px-2 py-1 text-left">${x.DESCRIPCION_ARTICULO} ${x.ARTICULO}</td>
                    <td class="border expanded px-2 py-1 text-center">${x.PREPARADO > 0 ? x.PREPARADO : ''}</td>
                    <td class="border expanded px-2 py-1 text-center">${x.PEDIDO > 0 ? x.PEDIDO: ''}</td>
                    
                    <td class="border expanded px-2 py-1 text-center">${x.UND_PED > 0 ? x.UND_PED : ''}</td>
                    <td class="border expanded px-2 py-1 text-center">${x.CAJAS_PED > 0 ? x.CAJAS_PED : ''}</td>
                </tr>`;
            });
            document.getElementById('tableLDCR').innerHTML = html;
        } else {
            document.getElementById('tableLDCR').innerHTML = 'No hay datos..';
        }
    });
}