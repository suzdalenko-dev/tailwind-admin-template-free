function rrhhPersonalVacacionesInit(){
    document.title = 'Dias de vacaciones';
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){ slugTitle.innerHTML = ''; }
    getTableRRHH0();
}

function getTableRRHH0(){
    let tableRRHH0 = document.getElementById('tableRRHH0');
    if(tableRRHH0){
        tableRRHH0.innerHTML = `<br>Cargando..`;
    }

    let user_id = window.localStorage.getItem('user_id') || 0;

    fetch(HTTP_HOST + 'automatic/get/0/get_holidays/?user_id='+user_id)
        .then(r => r.json())
        .then(r => {
            let html = '';

            if(r && r.data && r.data.holidays && r.data.holidays.length > 0){
                r.data.holidays.map(x => {
                    let productor = x.productor ? x.productor : '';
                    let nombre = x.nombre ? x.nombre : '';
                    let disfrutados = x.disfrutados ? x.disfrutados: '';
                    let pendientes = x.pendientes ? x.pendientes : '';

                    html += `<tr>
                                <td class="border px-1 py-1 text-center">${productor}</td>
                                <td class="border px-1 py-1">${nombre}</td>
                                <td class="border px-1 py-1 text-center">${disfrutados}</td>
                                <td class="border px-1 py-1 text-center">${pendientes}</td>
                             </tr>`;
                });
            }else{
                html = `<br> No hay datos`;
            }

            if(tableRRHH0){
                tableRRHH0.innerHTML = html;
            }
        })
        .catch(e => {
            if(tableRRHH0){
                tableRRHH0.innerHTML = `<br>Error al cargar`;
            }
            showM('eB ' + e, 'error');
        });
}