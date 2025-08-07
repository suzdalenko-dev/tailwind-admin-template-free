var travelId = 0;
function logisticaListadoViajesInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = '';
    }

    let hashDate = parseHashRoute();
    
    let dateVal  = '';
    if(hashDate && hashDate.params && hashDate.params.travelId){ travelId = hashDate.params.travelId; }
    if(hashDate && hashDate.params && hashDate.params.date){ dateVal = hashDate.params.date; }

    let pageTitleD = document.getElementById('pageTitleD');
    if(pageTitleD){
        pageTitleD.innerHTML = 'Listado de viajes para la carga ('+travelId+') fecha '+formatDateToEuropean(dateVal);
    }

    getListTravels(travelId);
}

function getListTravels(travelId){
    fetch(HTTP_HOST+`logistica/get/0/${travelId}/get_all_of_route/`).then(r => r.json()).then(r => {
        let htmlTravel = '';
        if(r && r.data && r.data.length > 0){
            let listTravel = r.data;
            listTravel.map(x => {
                htmlTravel += `<tr>
                                    <td class="border px-2 py-1 text-letf">${x.__camion}. ${x.__nombre__camion}</td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-center"></td>
                                    <td class="border px-2 py-1 text-letf"></td>
                                </tr>`;
                if(x && x.res && x.res.length > 0){
                    let listClients = x.res;
                    listClients.map(client => {
                        htmlTravel += `<tr>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-letf">${client.name}</td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                        </tr>`;
                        if(client && client.detail && client.detail.length > 0){
                            let orders = client.detail;
                            orders.map(orderDetail => {
                                if(orderDetail && orderDetail.length > 0){
                                    orderDetail.map(orderUniq => {
                                        htmlTravel += `<tr>
                                                <td class="border px-2 py-1 text-center"></td>
                                                <td class="border px-2 py-1 text-letf"></td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ID_PEDIDO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ID_ALBARAN}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ARTICULO} ${orderUniq.DESCRIPCION_ARTICULO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.UNIDADES_SERVIDAS}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.PRESENTACION_PEDIDO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.UNI_SERALM}</td>
                                            </tr>`;
                                        console.log(orderUniq)
                                    });
                                }
                            });
                        }
                    });
                }
                
            });
        }
        let blockTravel = document.getElementById('blockTravel');
        if(blockTravel){
            blockTravel.innerHTML = htmlTravel;
        }
    }).catch(e => {
        showM('eX '+e, 'error');
    });
}


setInterval(() => { getListTravels(travelId); }, 1320000);