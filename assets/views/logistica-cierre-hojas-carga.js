let fechaDesde;
let fechaHasta;

function logisticaCierreHojasCargaInit(){
    document.title = 'Repaso de cierre de hojas de carga';
    document.getElementById('slugTitle').innerHTML = '';

    fechaDesde = getTodayDate();
    fechaHasta = getTodayDate();

    initLCHC();
}

function changedLCHC(){
    fechaDesde =  document.getElementById('inputFromLCHC').value; 
    fechaHasta = document.getElementById('inputToLCHC').value;
    initLCHC();
}

function initLCHC(){
    document.getElementById('inputFromLCHC').value = fechaDesde;
    document.getElementById('inputToLCHC').value   = fechaHasta;
    document.getElementById('tableLCJC').innerHTML = '<br>Cargando datos..';

    fetch(HTTP_HOST+'logistica/get/0/0/repaso_hc_sin_cerrar/?date_from='+fechaDesde+'&date_to='+fechaHasta).then(r => r.json()).then(r => {
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
            document.getElementById('tableLCJC').innerHTML = '<br>Datos no encontrados.';
        }
    }).catch(e => {
        showM(e, 'error');
    });
}