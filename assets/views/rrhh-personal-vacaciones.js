function rrhhPersonalVacacionesInit(){
    document.title = 'Dias de vacaciones';

    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = '';
    }

    getTableRRHH0();
}

function getTableRRHH0(){
    let tableRRHH0 = document.getElementById('tableRRHH0');
    if(tableRRHH0){
        tableRRHH0.innerHTML = `<tr><td colspan="2" class="px-2 py-2 text-center">Cargando..</td></tr>`;
    }

    fetch(HTTP_HOST + 'automatic/get/0/get_holidays/')
        .then(r => r.json())
        .then(r => {
            let html = '';

            if(r && r.data && r.data.holidays && r.data.holidays.length > 0){
                r.data.holidays.map(x => {
                    let nombre = x.nombre ? x.nombre : '';
                    let pendientes = x.pendientes ? x.pendientes : '';

                    html += `<tr>
                                <td class="border px-1 py-1">${nombre}</td>
                                <td class="border px-1 py-1 text-center">${pendientes}</td>
                             </tr>`;
                });
            }else{
                html = `<tr>
                            <td colspan="2" class="border px-1 py-1 text-center">No hay datos</td>
                        </tr>`;
            }

            if(tableRRHH0){
                tableRRHH0.innerHTML = html;
            }
        })
        .catch(e => {
            if(tableRRHH0){
                tableRRHH0.innerHTML = `<tr>
                                            <td colspan="2" class="border px-1 py-1 text-center">Error al cargar</td>
                                        </tr>`;
            }
            showM('eB ' + e, 'error');
        });
}