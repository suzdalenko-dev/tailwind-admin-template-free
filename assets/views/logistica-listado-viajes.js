var load_idLLV = 0;
var load_dateLLV = '';

function logisticaListadoViajesInit(){
    let slugTitle = document.getElementById('slugTitle');
    if(slugTitle){
        slugTitle.innerHTML = `
        <a href="/dashboard/#logistica-listado-cargas"><span class="b-top-page">🗺️ Listado Cargas </span></a>
        <span class="b-top-page" onclick="createAllTravels()">📥 Excel </span>
        `;
    }

    let hashDate = parseHashRoute();
    

    if(hashDate && hashDate.params && hashDate.params.load_id){ load_idLLV = hashDate.params.load_id; }
    if(hashDate && hashDate.params && hashDate.params.load_date){ load_dateLLV = hashDate.params.load_date; }

    if(pageTitleD){
        pageTitleD.innerHTML = 'Listado de viajes para la carga ('+load_idLLV+') fecha '+formatDateToEuropean(load_dateLLV);
    }

    getLoadData();
}

function getLoadData(){
    fetch(HTTP_HOST+`logistica/get/${load_idLLV}/0/load_truck_details/`).then(r => r.json()).then(r => {
        let inputId = 0;
        let html = '';
        let i = 0;
        let colorGreen = ''
        let json_data = null;
        let click_info = null;
        let clientId   = 0;
        let truckId    = 0;
        let inputsPalets = ''
        if(r && r.data && r.data.length > 0){
            r.data.map(x => {
                if(x && x.data && x.data.length > 0 && i == 0){
                    console.log(x.data[0])
                    let pageTitle = document.getElementById('pageTitle');
                    if(pageTitle){
                        pageTitle.innerHTML = `Listado de pedidos en la carga (${load_idLVD}) camíon ${x.data[0].truck_id}. ${x.data[0].truck_name}`;
                    }
                }
                html += `<tr>
                            <td class="border px-2 py-1 text-letf">${x.truck_name}</td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-letf"></td>
                            <td class="border px-2 py-1 text-letf"></td>
                            <td class="border px-2 py-1 text-letf"></td>
                        </tr>`;
                i++;
                 if(x && x.client_lines && x.client_lines.length > 0){
                    x.client_lines.map(y => { 
                        inputId++;
                        clientId = 0;
                        truckId  = 0;
                        if(y && y.lines && y.lines.length > 0 && y.lines[0] && y.lines[0].client_id && y.lines[0].truck_id){
                            clientId = y.lines[0].client_id;
                            truckId  = y.lines[0].truck_id;
                        }
                        inputsPalets = '';
                        if(y && y.lines && y.lines.length > 0 && y.lines[0] && y.lines[0].input_palets){
                            inputsPalets = y.lines[0].input_palets;
                        }
                        html += `<tr>
                            <td class="border px-2 py-1 text-center hovered"></td>
                            <td class="border px-2 py-1 text-letf">${y.cli}</td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-center"></td>
                            <td class="border px-2 py-1 text-letf"></td>
                            <td class="border px-2 py-1 text-center">${y.sum_pal}</td>
                            <td class="border px-2 py-1 text-center"><input value="${inputsPalets}" class="input_pal" type="number" id="input${inputId}"></td>
                            <td class="border px-2 py-1 text-center"><span onclick="savedPressed0(${load_idLLV}, ${truckId}, '${clientId}', ${inputId})">💾</span></td>
                        </tr>`;
                        if(y && y.lines && y.lines.length > 0){
                            y.lines.map(z => {
                                json_data  = JSON.parse(z.articles);
                                if(json_data && json_data.length > 0){
                                    click_info = z && z.click_info ? JSON.parse(z.click_info): null;
                                    json_data.map(js => {
                                        colorGreen = '';
                                        if(click_info && click_info.length > 0){
                                            click_info.map(v => {
                                                if(v.code == js.ARTICULO && v.value == 1){
                                                    colorGreen = 'class="class_green" style="color:white;"'
                                                }
                                            })
                                        }
                                        html += `<tr ${colorGreen}>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-center hovered" onclick="orderClicked0(${load_idLLV}, '${z.order_id}', ${js.ARTICULO})">${z.order_id}</td>
                                            <td class="border px-2 py-1 text-left">${js.DESCRIPCION_ARTICULO}</td>
                                            <td class="border px-2 py-1 text-center">${js.UNIDADES_SERVIDAS}</td>
                                            <td class="border px-2 py-1 text-center">${js.PRESENTACION_PEDIDO}</td>
                                            <td class="border px-2 py-1 text-center">${js.UNI_SERALM}</td>
                                            <td class="border px-2 py-1 text-letf">${formatToOneDecimal(js.CAJAS_CALCULADAS)}</td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                        </tr>`
                                    });
                                } else {
                                    html += `<tr ${colorGreen}>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-center hovered">${z.order_id}</td>
                                            <td class="border px-2 py-1 text-left"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-center"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                            <td class="border px-2 py-1 text-letf"></td>
                                        </tr>`
                                }
                            });
                        }
                    });
                }
            });
        }
        let loadData = document.getElementById('loadData');
        if(loadData){
            loadData.innerHTML = html;
        }
    }).catch(e => {
        showM('eC '+e, 'error');
    });
}


function savedPressed0(load_idLVD, truckId, clientIdX, inputId){
  let inputEl = document.getElementById('input'+inputId);
  if(inputEl){
    let numPal = inputEl.value;

    fetch(HTTP_HOST+`logistica/put/${load_idLVD}/${truckId}/change_palets/?client_id=${clientIdX}&num_pal=${numPal}`).then(r => r.json()).then(r => {
        getLoadData();
    }).catch(e => {
        showM('ev'+e, 'error');
    });
  }
}


function orderClicked0(loadId, orderId, articleId){
    fetch(HTTP_HOST+`logistica/put/${loadId}/0/order_clicked/?order_id=${orderId}&article_id=${articleId}`).then(r => r.json()).then(r => {
        getLoadData();
    }).catch(e => {
        showM('ev'+e, 'error');
    })
}


function createAllTravels() {
  fetch(HTTP_HOST + `logistica/get/${load_idLLV}/0/load_truck_details/`)
    .then(r => r.json())
    .then(r => {
      if (!r || !r.data || r.data.length === 0) {
        showM('No hay datos para exportar', 'error');
        return;
      }

      const excelRows = [];

      // Cabecera
      excelRows.push([
        "Nombre camión", "Cliente", "Pedido", "Artículo",
        "Cantidad", "Pres.", "Kg", "Caj. Calc.",
        "Pal. Orient.", "Pal. Input"
      ]);

      // Recorrer datos y llenar filas
      r.data.forEach(truck => {
        // Fila del camión
        excelRows.push([truck.truck_name, "", "", "", "", "", "", "", "", ""]);

        if (truck.client_lines && truck.client_lines.length > 0) {
          truck.client_lines.forEach(client => {
            let inputsPalets = "";
            if (client.lines && client.lines.length > 0 && client.lines[0] && client.lines[0].input_palets) {
              inputsPalets = client.lines[0].input_palets;
            }

            // Fila del cliente
            excelRows.push([
              "", client.cli || "", "", "", "", "", "", "",
              client.sum_pal || "", inputsPalets || ""
            ]);

            // Filas de artículos / pedidos (incluye el caso ELSE cuando no hay artículos)
            if (client.lines && client.lines.length > 0) {
              client.lines.forEach(order => {
                let articles = [];
                try {
                  articles = order.articles ? JSON.parse(order.articles) : [];
                } catch (e) {
                  articles = [];
                }

                if (articles && articles.length > 0) {
                  articles.forEach(art => {
                    excelRows.push([
                      "", "", order.order_id || "", art.DESCRIPCION_ARTICULO || "",
                      art.UNIDADES_SERVIDAS || "", art.PRESENTACION_PEDIDO || "",
                      art.UNI_SERALM || "", formatToOneDecimal(art.CAJAS_CALCULADAS || 0),
                      "", ""
                    ]);
                  });
                } else {
                  // Caso sin artículos (equivalente al else del getLoadData())
                  excelRows.push([
                    "", "", order.order_id || "", "", "", "", "", "", "", ""
                  ]);
                }
              });
            }
          });
        }
      });

      // Crear hoja y libro
      const ws = XLSX.utils.aoa_to_sheet(excelRows);
      ws['!cols'] = [
        { wch: 25 }, { wch: 35 }, { wch: 15 }, { wch: 50 },
        { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 10 },
        { wch: 12 }, { wch: 12 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Viajes");

      const fecha = load_dateLLV ? formatDateToEuropean(load_dateLLV).replace(/\//g, '-') : '';
      const fileName = `viajes_carga_${load_idLLV}${fecha ? '_' + fecha : ''}.xlsx`;

      XLSX.writeFile(wb, fileName);
    })
    .catch(e => {
      showM('Error exportando: ' + e, 'error');
    });
}
