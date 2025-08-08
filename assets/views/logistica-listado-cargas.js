function logisticaListadoCargasInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
         slugTitle.innerHTML = '';
    }

    document.title = 'Listado cargas';
    getLastLoads();
}

function getLastLoads(){
    fetch(HTTP_HOST+'logistica/get/0/0/get_belin_routes/').then(r => r.json()).then(r => {
        let htmlLoadContent = '';
        if(r && r.data && r.data.length > 0){
            let listLoads        = r.data;
            let TRAVEL_SITUATION = []
            listLoads.map(x => {
                if(x && x.travel_situation && x.travel_situation.length > 0){
                    TRAVEL_SITUATION = x.travel_situation;
                } else {
                    TRAVEL_SITUATION = [];
                }
                htmlLoadContent += `<tr>
                                        <td class="border px-2 py-1 text-center"><a href="#logistica-listado-viajes?travelId=${x.id}&date=${x.__fecha}"><b class="color_blue">${x.id}</b></a></td>
                                        <td class="border px-2 py-1 text-center"></td>
                                        <td class="border px-2 py-1 text-center">${x.__semana}</td>
                                        <td class="border px-2 py-1 text-center">${formatDateToEuropean(x.__fecha)}</td>
                                        <td class="border px-2 py-1 text-center">${x.__entregapaletas}</td>
                                    </tr>`;
                if(x && x.travel_names && x.travel_names.length > 0){
                    let listTravels = x.travel_names;
                    listTravels.map(travelX => {
                        let colorGreenLine = '';
                        if(TRAVEL_SITUATION && TRAVEL_SITUATION.length > 0){
                            TRAVEL_SITUATION.map(situation => {
                                if(x.id == situation.load_id && travelX.__camion == situation.track_id && situation.number_all_order == situation.number_clicked_order && situation.number_clicked_order > 0){
                                    colorGreenLine = `style="background:green;color:white;"`;
                                }
                            });
                        }
                        htmlLoadContent += `<tr ${colorGreenLine}>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-left"><a href="#logistica-viaje-detalle?travelId=${x.id}&truck=${travelX.__camion}"><b class="color_blue" ${colorGreenLine}>${travelX.__camion}. ${travelX.__nombre__camion}</b></a></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                        </tr>`;
                    })
                    
                }
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


setInterval(() => { getLastLoads(); }, 60000)