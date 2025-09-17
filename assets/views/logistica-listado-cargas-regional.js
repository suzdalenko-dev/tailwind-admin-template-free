function logisticaListadoCargasRegionalInit(){
    document.title = 'Cargas en Regional'
    document.getElementById('slugTitle').innerHTML = '';

    getLLCR();
}

function getLLCR(){
    document.getElementById('tableLLCR').innerHTML = 'Cargando..';

    suzdalenkoGet('logistica/get/0/0/hojas_carga_serie_02/', (res) => {
        let html = '';
        
        console.log(res.data.res)

        if(res && res.data && res.data.res && res.data.res.length > 0){
            res.data.res.map(x => {
                console.log(x)

                html += `<tr>
                    <td class="border expanded px-2 py-1 text-center"><a href="#logistica-detalle-carga-regional?year=${x.EJERCICIO}&load_id=${x.NUMERO_PROPUESTA}"><b class="color_blue">${((x.FECHA_CARGA))}</b></a></td>    
                    <td class="border expanded px-2 py-1 text-center"><a href="#logistica-detalle-carga-regional?year=${x.EJERCICIO}&load_id=${x.NUMERO_PROPUESTA}"><b class="color_blue">${x.NUMERO_PROPUESTA}</b></a></td>
                    <td class="border expanded px-2 py-1 text-center">${x.CONDUCTOR} ${x.MATRICULA}</td>
                </tr>`;
            });
            document.getElementById('tableLLCR').innerHTML = html;
        } else {
            document.getElementById('tableLLCR').innerHTML = 'No hay datos..';
        }
    });
}