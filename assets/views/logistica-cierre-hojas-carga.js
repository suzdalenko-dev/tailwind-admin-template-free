let fechaDesdeLCHC;
let fechaHastaLCHC;

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

function initLCHC(){
    document.getElementById('inputFromLCHC').value = fechaDesdeLCHC;
    document.getElementById('inputToLCHC').value   = fechaHastaLCHC;
    document.getElementById('tableLCJC').innerHTML = '<br>Cargando datos..';

    fetch(HTTP_HOST+'logistica/get/0/0/repaso_hc_sin_cerrar/?date_from='+fechaDesdeLCHC+'&date_to='+fechaHastaLCHC).then(r => r.json()).then(r => {
        console.log(r)
        if(r && r.data && r.data.out && r.data.out.length){
            let html = '';
            r.data.out.map(x => {
                html += `<tr>
                        <td class="border px-2 py-1 text-center">${x.fecha}</td>
                        <td class="border px-2 py-1 text-center">${x.serie}</td>
                        <td class="border px-2 py-1 text-center"></td>
                        <td class="border px-2 py-1 text-center"></td><td class="border px-2 py-1 text-center"></td><td class="border px-2 py-1 text-center"></td><td class="border px-2 py-1 text-center"></td><td class="border px-2 py-1 text-center"></td>
                    </tr>`;
                    if(x.articulos){
                        x.articulos.map(a => { console.log(a)
                            html += `<tr>
                                <td class="border px-2 py-1 text-center"></td>
                                <td class="border px-2 py-1 text-center"></td>
                                <td class="border px-2 py-1 text-left">${a.CLIENTE} ${a.RAZON_SOCIAL}</td>
                                <td class="border px-2 py-1 text-center">${a.ARTICULO}</td>
                                <td class="border px-2 py-1 text-left">${a.DESCRIPCION}</td>
                                <td class="border px-2 py-1 text-center">${a.PREPARADOS_KG}</td>
                                <td class="border px-2 py-1 text-center">${a.PEDIDOS_KG}</td>
                                <td class="border px-2 py-1 text-center">${a.DIF_KG}</td>
                            </tr>`
                        });
                    }
            });
            document.getElementById('tableLCJC').innerHTML = html;
            console.log(r.data.out)
        } else {
            document.getElementById('tableLCJC').innerHTML = '<br>No hay datos que mostrar.';
        }
    }).catch(e => {
        showM(e, 'error');
    });
}