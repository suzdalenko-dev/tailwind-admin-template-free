let yearLDCR;
let load_idLDCR;
let colorGreenLDCR = '';
let inputBackColor = '';

function logisticaDetalleCargaRegionalInit(){
    document.title = 'Carga Regional Detalle'
    document.getElementById('slugTitle').innerHTML = '<a href="/dashboard/#logistica-listado-cargas-regional"><span class="b-top-page">🗺️ Listado Cargas Regional</span></a>';

    let hashDate = parseHashRoute();
    if(hashDate && hashDate.params && hashDate.params.year){ yearLDCR = hashDate.params.year; }
    if(hashDate && hashDate.params && hashDate.params.load_id){ load_idLDCR = hashDate.params.load_id; }
    
    getLDCR();
}

function getLDCR(){
    suzdalenkoGet(`/logistica/get/${yearLDCR}/${load_idLDCR}/get_refresh_custom_load_02/`, (res) => {
        let html = '';
        let htmlDesg = '';
        let inputIdLDCR1 = 0;
        let desglose = [];
        let desglose_ticado = [];
        let cajasI = 0;
        let kgI    = 0;
        
        if(res && res.data && res.data.lines && res.data.lines.length > 0){
            res.data.lines.map(x => {
                inputIdLDCR1++;
                colorGreenLDCR = '';
                inputBackColor = '';
                if(x.clicked == 1){
                    colorGreenLDCR = 'class="class_green" style="color:white;"';
                    inputBackColor = 'class_green';
                }

                desglose = [];
                desglose_ticado = [];
                desglose = JSON.parse(x.desglose);
                
                if (desglose && desglose.length > 0){
                    desglose_ticado = JSON.parse(x.desglose_ticado);

                    // desglosado por cliente
                    htmlDesg = '';
                    desglose.map(d => {
                        cajasI = 0;
                        kgI    = 0;
                        if(desglose_ticado && desglose_ticado.length > 0){
                            desglose_ticado.map(item => {                          
                                if(item.cliente == d.CLIENTE){  
                                    cajasI = item.cajas;
                                    kgI    = item.kg;
                                }
                            });
                        }

                        inputIdLDCR1++;
                        htmlDesg += `<tr ${colorGreenLDCR}>
                                        <td class="border expanded px-2 py-1 text-center"></td>
                                        <td class="border expanded px-2 py-1 text-center"></td>
                                        <td class="border expanded px-2 py-1 text-center"></td>
                                        <td class="border expanded px-2 py-1 text-left">${d.NOMBRE_CLIENTE} ${d.CLIENTE}</td>
                                        <td class="border expanded px-2 py-1 text-center">${d.PREPARADO > 0 ? d.PREPARADO : ''}</td>
                                        <td class="border expanded px-2 py-1 text-center">${d.PEDIDO > 0 ? d.PEDIDO : ''}</td>
                                        <td class="border expanded px-2 py-1 text-center">${d.UND_PED > 0 ? d.UND_PED : ''}</td>
                                        <td class="border expanded px-2 py-1 text-center">${d.CAJAS_PED > 0 ? d.CAJAS_PED : ''}</td>

                                        <td class="border expanded px-2 py-1 text-center"><input value="${cajasI}" class="input_pal ${inputBackColor}" type="number" id="inputCajas${inputIdLDCR1}"></td>
                                        <td class="border expanded px-2 py-1 text-center"><input value="${kgI}" class="input_pal ${inputBackColor}" type="number" id="inputKg${inputIdLDCR1}"></td>
                                        <td class="border px-2 py-1 text-center hovered"><span onclick="ticadoJsonLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}', ${inputIdLDCR1}, '${d.CLIENTE}')">💾</span></td>
                                    </tr>`;
                        console.log(d)
                    });

                    html += `<tr ${colorGreenLDCR}>
                        <td class="border expanded px-2 py-1 text-center hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')">${formatDateToEuropean(x.load_date)}</td>
                        <td class="border expanded px-2 py-1 text-center hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')">${x.load_id}</td>
                        <td class="border expanded px-2 py-1 text-left hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')"><span class="hovered">${x.article_name} ${x.article_code}</span></td>
                        <td class="border expanded px-2 py-1 text-center hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')"></td>
                        <td class="border expanded px-2 py-1 text-center">${x.preparado > 0 ? x.preparado : ''}</td>
                        <td class="border expanded px-2 py-1 text-center">${x.pedido > 0 ? x.pedido: ''}</td>
                        <td class="border expanded px-2 py-1 text-center">${x.und_ped > 0 ? x.und_ped : ''}</td>
                        <td class="border expanded px-2 py-1 text-center">${x.cajas_ped > 0 ? x.cajas_ped : ''}</td>
                        <td class="border expanded px-2 py-1 text-center">${x.cajas_real > 0 ? x.cajas_real: '' }</td>
                        <td class="border expanded px-2 py-1 text-center">${x.kg_real > 0 ? x.kg_real: '' }</td>
                        <td class="border expanded px-2 py-1 text-center"></td>
                    </tr>`;

                    html += htmlDesg;
                } else {
                    // lineas solo articulos
                    html += `<tr ${colorGreenLDCR}>
                        <td class="border expanded px-2 py-1 text-center hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')">${formatDateToEuropean(x.load_date)}</td>
                        <td class="border expanded px-2 py-1 text-center hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')">${x.load_id}</td>
                        <td class="border expanded px-2 py-1 text-left hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')"><span class="hovered">${x.article_name} ${x.article_code}</span></td>
                        <td class="border expanded px-2 py-1 text-center hovered" onclick="orderClickedLDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}')"></td>
                        <td class="border expanded px-2 py-1 text-center">${x.preparado > 0 ? x.preparado : ''}</td>
                        <td class="border expanded px-2 py-1 text-center">${x.pedido > 0 ? x.pedido: ''}</td>

                        <td class="border expanded px-2 py-1 text-center">${x.und_ped > 0 ? x.und_ped : ''}</td>
                        <td class="border expanded px-2 py-1 text-center">${x.cajas_ped > 0 ? x.cajas_ped : ''}</td>

                        <td class="border expanded px-2 py-1 text-center"><input value="${x.cajas_real}" class="input_pal ${inputBackColor}" type="number" id="inputCajas${inputIdLDCR1}"></td>
                        <td class="border expanded px-2 py-1 text-center"><input value="${x.kg_real}" class="input_pal ${inputBackColor}" type="number" id="inputKg${inputIdLDCR1}"></td>
                        <td class="border px-2 py-1 text-center hovered"><span onclick="savedPressed2LDCR(${x.ejercicio}, '${x.load_id}', '${x.article_code}', ${inputIdLDCR1})">💾</span></td>
                    </tr>`;
                }
                
            });
            document.getElementById('tableLDCR').innerHTML = html;
        } else {
            document.getElementById('tableLDCR').innerHTML = 'No hay datos..';
        }
    });
}

function savedPressed2LDCR(ejercicio, load_id, article_code, inputIdLDCR1){
    let cajasInput = document.getElementById('inputCajas'+inputIdLDCR1).value;
    if(!cajasInput) cajasInput = 0;
    let kgInput    = document.getElementById('inputKg'+inputIdLDCR1).value;
    if(!kgInput) kgInput = 0;
    let obj        = {ejercicio: ejercicio, load_id: load_id, article_code: article_code, cajas: cajasInput, kg: kgInput, action: 'update_linea', cliente: 'x'}

    suzdalenkoPost(`logistica/action/0/0/regional_update/`, obj, (res) => {
        getLDCR();
    });
}

function ticadoJsonLDCR(ejercicio, load_id, article_code, inputIdLDCR1, cliente){
    let cajasInput = document.getElementById('inputCajas'+inputIdLDCR1).value;
    if(!cajasInput) cajasInput = 0;
    let kgInput    = document.getElementById('inputKg'+inputIdLDCR1).value;
    if(!kgInput) kgInput = 0;
    let obj        = {ejercicio: ejercicio, load_id: load_id, article_code: article_code, cajas: cajasInput, kg: kgInput, action: 'update_desglose', cliente: cliente}

    suzdalenkoPost(`logistica/action/0/0/regional_update/`, obj, (res) => {
        getLDCR();
    });
}

function orderClickedLDCR(ejercicio, load_id, article_code){
    suzdalenkoGet(`logistica/action/0/0/regional_clicked/?ejercicio=${ejercicio}&load_id=${load_id}&article_code=${article_code}`, (res) => {
        getLDCR();
    });
}

