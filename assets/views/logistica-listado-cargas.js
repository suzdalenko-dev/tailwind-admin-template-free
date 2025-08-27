var lastLoadIdZXC = 0;
function logisticaListadoCargasInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
         slugTitle.innerHTML = '';
    }

    document.title = 'Listado cargas';
    geRefreshGemaRoutes();
}

function geRefreshGemaRoutes(){
    fetch(HTTP_HOST+'logistica/get/0/0/get_and_refresh_gema_routes/').then(r => r.json()).then(r => {
        let htmlLoadContent = '';
        let i = 0;
        if(r && r.data && r.data.length > 0){
            let listLoads        = r.data;
            listLoads.map(x => {
                htmlLoadContent += `<tr>
                                        <td class="border expanded px-2 py-1 text-center"><a href="#logistica-listado-viajes?load_id=${x.load_id}&load_date=${x.load_date}"><b class="color_blue">${x.load_id}</b></a></td>
                                        <td class="border expanded px-2 py-1 text-center"></td>
                                        <td class="border expanded px-2 py-1 text-center">${x.load_week}</td>
                                        <td class="border expanded px-2 py-1 text-center">${(formatDateToEuropean(x.load_date))}</td>
                                        <td class="border expanded px-2 py-1 text-center"></td>
                                        <td class="border expanded px-2 py-1 text-center"></td>
                                    </tr>`;
                if(x && x.travel_names && x.travel_names.length > 0){
                    let colorGreenLine = '';
                    x.travel_names.map(y => {
                        colorGreenLine = '';
                        if(y.clicked == 1){
                            colorGreenLine = `class="class_green" style="color:white;"`;
                        }
                        htmlLoadContent += `<tr ${colorGreenLine}>
                                                <td class="border expanded px-2 py-1 text-center"></td>
                                                <td class="border expanded px-2 py-1 text-left"><a href="#logistica-viaje-detalle?load_id=${x.load_id}&truck_id=${y.truck_id}"><b class="color_blue" ${colorGreenLine}>${y.truck_id}. ${y.truck_name}</b></a></td>
                                                <td class="border expanded px-2 py-1 text-center"></td>
                                                <td class="border expanded px-2 py-1 text-center"></td>
                                                <td class="border expanded px-2 py-1 text-center">${y.palets}</td>
                                                <td class="border expanded px-2 py-1 text-center">${y.sum_input_pal}</td>
                                            </tr>`;
                    });
                }
            });
            console.log(listLoads)
        }
        let list22Loads = document.getElementById('list22Loads');
        if(list22Loads){
            list22Loads.innerHTML = htmlLoadContent;
        }
    }).catch(e => {
        showM('eB '+e, 'error');
    });
}


setInterval(() => { geRefreshGemaRoutes(); }, 333000);
