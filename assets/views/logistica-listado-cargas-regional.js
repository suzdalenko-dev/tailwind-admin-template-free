let colorGreenLDCR2 = ''

function logisticaListadoCargasRegionalInit(){
    document.title = 'Cargas en Regional'
    document.getElementById('slugTitle').innerHTML = '';

    getLLCR();
}

function getLLCR(){
    document.getElementById('tableLLCR').innerHTML = 'Cargando..';

    suzdalenkoGet('logistica/get/0/0/get_refresh_head_02/', (res) => {  
        let html = '';
        
        if(res && res.data && res.data.res && res.data.res.length > 0){

            res.data.res.map(x => {
                html += `<tr>
                    <td class="border expanded px-2 py-1 text-center">${formatDateToEuropean(x.date)}</td>    
                    <td class="border expanded px-2 py-1 text-center"></td>
                    <td class="border expanded px-2 py-1 text-center"></td>
                </tr>`;

                if(x.loads && x.loads.length > 0){
                    x.loads.map(y => {

                        colorGreenLDCR2 = '';
                        if(y.clicked == 1){
                            colorGreenLDCR2 = 'class="class_green" style="color:white;"'
                        }


                        html += `<tr ${colorGreenLDCR2}>
                                    <td class="border expanded px-2 py-1 text-center"></td>    
                                    <td class="border expanded px-2 py-1 text-center"><a href="#logistica-detalle-carga-regional?year=${y.ejercicio}&load_id=${y.load_id}"><b class="color_blue" ${colorGreenLDCR2}>${y.load_id}</b></a></td>
                                    <td class="border expanded px-2 py-1 text-center">${y.conductor == 'None' ? '': y.conductor} ${y.matricula}</td>

                                    <td class="border expanded px-2 py-1 text-center">${y.cajas_real > 0 ? y.cajas_real: ''}</td>
                                    <td class="border expanded px-2 py-1 text-center">${y.kg_real > 0 ? y.kg_real : ''}</td>
                                </tr>`;
                    });
                };

    
            });
            document.getElementById('tableLLCR').innerHTML = html;
        } else {
            document.getElementById('tableLLCR').innerHTML = 'No hay datos..';
        }
    });
}