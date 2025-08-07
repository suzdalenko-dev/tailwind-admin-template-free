var travelId = 0;
var dateVal  = '';

function logisticaListadoViajesInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = `
        <a href="/dashboard/#logistica-listado-cargas"><span class="b-top-page">🗺️ Listado Cargas </span></a>
        <span class="b-top-page" onclick="createAllTravels()">📥 Excel </span>
        `;
    }

    let hashDate = parseHashRoute();
    
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
                                        htmlTravel += `<tr>
                                                <td class="border px-2 py-1 text-center"></td>
                                                <td class="border px-2 py-1 text-letf"></td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ID_PEDIDO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ID_ALBARAN}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.ARTICULO} ${orderUniq.DESCRIPCION_ARTICULO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.UNIDADES_SERVIDAS}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.PRESENTACION_PEDIDO}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.UNI_SERALM}</td>
                                                <td class="border px-2 py-1 text-letf">${orderUniq.CAJAS_CALCULADAS}</td>
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


function createAllTravels() {
    fetch(HTTP_HOST + `logistica/get/0/${travelId}/get_all_of_route/`)
        .then(r => r.json())
        .then(r => {
            if (!r || !r.data || r.data.length === 0) {
                showM('No hay datos para exportar', 'warning');
                return;
            }

            const listTravel = r.data;
            const rows = [
                ["Nombre camión", "Cliente", "Pedido", "Albarán", "Artículo", "Cantidad", "Presentación", "Kg"]
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
                                        order.UNI_SERALM
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
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Carga-'+travelId+' fecha-'+dateVal);

            const now = new Date();
            const timestamp = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
            const filename = `listado_viajes_${timestamp}.xlsx`;

            XLSX.writeFile(workbook, filename);
        })
        .catch(e => {
            showM('Error al generar Excel: ' + e, 'error');
        });
}
