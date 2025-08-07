var travelIdVD = 0;
var trackIdVD  = 0;

function logisticaViajeDetalleInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = '';
    }

    let hashDate = parseHashRoute();
    if(hashDate && hashDate.params && hashDate.params.travelId){ travelIdVD = hashDate.params.travelId; }
    if(hashDate && hashDate.params && hashDate.params.truck){ trackIdVD = hashDate.params.truck; }

    getCustomTravelDetail();

    console.log(trackIdVD)
}

function getCustomTravelDetail(){
    fetch(HTTP_HOST+`logistica/get/${trackIdVD}/${travelIdVD}/get_all_of_route/`).then(r => r.json()).then(r => {
        let htmlTravel = '';
        if(r && r.data && r.data.length > 0){
            let listTravel = r.data;
            let i = 0;
            listTravel.map(x => {
                if(i == 0){
                    let pageTitle = document.getElementById('pageTitle');
                    if(pageTitle){
                        pageTitle.innerHTML = 'Listado de pedidos en la carga ('+travelIdVD+') camíon '+x.__nombre__camion;
                    }
                }

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

                                    });
                                }
                            });
                        }
                    });
                }
                i++;
            });
        }
        let blockTravelDetail = document.getElementById('blockTravelDetail');
        if(blockTravelDetail){
            blockTravelDetail.innerHTML = htmlTravel;
        }
    }).catch(e => {
        showM('eC '+e, 'error');
    });
}