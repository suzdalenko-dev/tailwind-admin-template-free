var travelIdVD = 0;
var trackIdVD  = 0;

function logisticaViajeDetalleInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = `<a href="/dashboard/#logistica-listado-cargas"><span class="b-top-page">🗺️ Listado Cargas </span></a>
        <span class="b-top-page" onclick="createCustomTravel()">📥 Excel </span>`;
    }

    let hashDate = parseHashRoute();
    if(hashDate && hashDate.params && hashDate.params.travelId){ travelIdVD = hashDate.params.travelId; }
    if(hashDate && hashDate.params && hashDate.params.truck){ trackIdVD = hashDate.params.truck; }

    getCustomTravelDetail();

}

function getCustomTravelDetail(){
    let REAL_SITUATION = []
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
                    if(x && x.click_situation && x.click_situation.length > 0){
                        REAL_SITUATION = x.click_situation;
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
                                            <td class="border px-2 py-1 text-letf"></td>
                                        </tr>`;
                        if(client && client.detail && client.detail.length > 0){
                            let orders = client.detail;
                            orders.map(orderDetail => {
                                if(orderDetail && orderDetail.length > 0){
                                    orderDetail.map(orderUniq => {
                                        let colorGreenLine = '';
                                        if(REAL_SITUATION && REAL_SITUATION.length > 0){
                                            REAL_SITUATION.map(rs => {
                                                if(orderUniq.ID_PEDIDO == rs.order_id && orderUniq.ARTICULO == rs.article_id && trackIdVD == rs.track_id && rs.state == 'clicked'){
                                                    colorGreenLine = `style="background:green;color:white;"`;
                                                }
                                            });
                                        }
                                        htmlTravel += `<tr ${colorGreenLine}>
                                                <td class="border px-2 py-1 text-center"></td>
                                                <td class="border px-2 py-1 text-letf"></td>
                                                <td class="border px-2 py-1 text-letf hovered" onclick="paintToGreen(${travelIdVD}, ${trackIdVD}, '${orderUniq.ID_PEDIDO}', ${orderUniq.ARTICULO})"><b>${orderUniq.ID_PEDIDO}</b></td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ID_ALBARAN}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ARTICULO} ${orderUniq.DESCRIPCION_ARTICULO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.UNIDADES_SERVIDAS}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.PRESENTACION_PEDIDO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.UNI_SERALM}</td>
                                                <td class="border px-2 py-1 text-letf">${formatToOneDecimal(orderUniq.CAJAS_CALCULADAS)}</td>
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


function createCustomTravel() {
    fetch(HTTP_HOST + `logistica/get/${trackIdVD}/${travelIdVD}/get_all_of_route/`)
        .then(r => r.json())
        .then(r => {
            if (!r || !r.data || r.data.length === 0) {
                showM('No hay datos para exportar', 'warning');
                return;
            }

            const listTravel = r.data;
            const rows = [
                ["Nombre camión", "Cliente", "Pedido", "Albarán", "Artículo", "Cantidad", "Presentación", "Kg", "Cajas Calc."]
            ];

            listTravel.forEach(camion => {
                const nombreCamion = `${camion.__camion}. ${camion.__nombre__camion}`;
                if (camion.res?.length) {
                    camion.res.forEach(cliente => {
                        const nombreCliente = cliente.name;
                        if (cliente.detail?.length) {
                            cliente.detail.forEach(ordenes => {
                                ordenes.forEach(order => {
                                    rows.push([
                                        nombreCamion,
                                        nombreCliente,
                                        order.ID_PEDIDO,
                                        order.ID_ALBARAN,
                                        `${order.ARTICULO} ${order.DESCRIPCION_ARTICULO}`,
                                        order.UNIDADES_SERVIDAS,
                                        order.PRESENTACION_PEDIDO,
                                        order.UNI_SERALM,
                                        formatToOneDecimal(order.CAJAS_CALCULADAS)
                                    ]);
                                });
                            });
                        } else {
                            rows.push([nombreCamion, nombreCliente, "", "", "", "", "", ""]);
                        }
                    });
                } else {
                    rows.push([nombreCamion, "", "", "", "", "", "", ""]);
                }
            });

            const worksheet = XLSX.utils.aoa_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "ViajeDetalle");

            const now = new Date();
            const timestamp = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
            const filename = `viaje_detalle_${travelIdVD}_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, filename);
        })
        .catch(e => {
            showM('❌ Error al generar Excel: ' + e, 'error');
        });
}


function paintToGreen(loadId, truckId, orderId, articleId){
    fetch(HTTP_HOST+`logistica/put/0/0/click_actions/?load_id=${loadId}&track_id=${truckId}&order_id=${orderId}&article_id=${articleId}`).then(r => r.json()).then(r => {
        getCustomTravelDetail();
    }).catch(e => {
        showM('ev'+e, 'error');
    })
}