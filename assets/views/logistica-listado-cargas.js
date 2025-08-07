function logisticaListadoCargasInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = '';
    }

    getLastLoads();
}

function getLastLoads(){
    fetch(HTTP_HOST+'logistica/get/0/0/get_belin_routes/').then(r => r.json()).then(r => {
        let htmlLoadContent = '';
        if(r && r.data && r.data.length > 0){
            let listLoads       = r.data;
            listLoads.map(x => {
                htmlLoadContent += `<tr>
                                        <td class="border px-2 py-1 text-center"><a href="#logistica-listado-viajes?travelId=${x.id}&date=${x.__fecha}" onclick="goToTravelList()"><b class="color_blue">${x.id}</b></a></td>
                                        <td class="border px-2 py-1 text-center">${x.__semana}</td>
                                        <td class="border px-2 py-1 text-center">${formatDateToEuropean(x.__fecha)}</td>
                                        <td class="border px-2 py-1 text-center">${x.__entregapaletas}</td>
                                    </tr>`;
            });
        }
        let blockLogistics = document.getElementById('blockLogistics');
        if(blockLogistics){
            blockLogistics.innerHTML = htmlLoadContent;
        }
    }).catch(e => {
        showM('eZ '+e, 'error');
    })
}

function goToTravelList(){
    loadView('logistica-listado-viajes');
}