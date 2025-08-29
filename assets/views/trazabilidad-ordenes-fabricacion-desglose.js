let trazData = [];

function trazabilidadOrdenesFabricacionDesgloseInit(){
    let ofId = parseHashRoute();
    ofId = ofId.params.id
  
    showCustomOfTOFD(ofId);
}

function realoadPageTOFD(){
    location.href ='/dashboard/#trazabilidad-ordenes-fabricacion';
}

async function showCustomOfTOFD(ofId){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="realoadPageTOFD()">🔗 Trazabilidad </a></span>
        <span class="b-top-page" onclick="createExcel()">📥 Excel </span>`;

    trazData = await fetch(HTTP_HOST+'calidad/get/of/'+ofId+'/of_trazabilidad/');
    trazData = await trazData.json();

    let htmlOfsTop = '';
    if(trazData.data[0]['OF']){
        trazData.data[0]['OF'].map(of => {
        htmlOfsTop += `<tr><td class="border px-2 py-1 text-center">${of.ORDEN_DE_FABRICACION}</td>
                           <td class="border px-2 py-1 text-center">${formatLongDate(of.FECHA_INI_FABRI_PREVISTA)}</td>
                           <td class="border px-2 py-1 text-center">${formatLongDate(of.FECHA_INI_FABRI_PREVISTA)}</td>
                           <td class="border px-2 py-1 text-center">${of.CODIGO_ARTICULO}</td>
                           <td class="border px-2 py-1 text-center">${of.NOMBRE_ARTICULO}</td>
                           <td class="border px-2 py-1 text-center">${fEur0(of.CANTIDAD_A_FABRICAR)} ${of.CODIGO_PRESENTACION}</td>
                           <td class="border px-2 py-1 text-center">${getOfState(of.SITUACION_OF)}</td></tr>`;
        });
    }
    
    let htmlMP = '';
    if(trazData.data[0]['MATERIAL_PEDIDO']){
        trazData.data[0]['MATERIAL_PEDIDO'].map(mp => {
         htmlMP += `<tr><td class="border px-2 py-1 text-center">${mp.CODIGO_COMPONENTE}</td>
                        <td class="border px-2 py-1 text-left">${mp.COMPO_DESC_COMERCIAL}</td>
                        <td class="border px-2 py-1 text-center">${fEur0(mp.CANTIDAD_TECNICA)} ${mp.CODIGO_PRESENTACION_COMPO}</td></tr>`;
        });
    }
    

    let htmlMC = '';
    if(trazData.data[0]['MATERIAL_CONSUMIDO']){
        trazData.data[0]['MATERIAL_CONSUMIDO'].map(mc => {
         htmlMC += `<tr><td class="border px-2 py-1 text-center">${formatLongDate(mc.FECHA_CREACION)}</td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(mc.FECHA_CADUCIDAD)}</td>
                        <td class="border px-2 py-1 text-center">${mc.CODIGO_ARTICULO_CONSUMIDO}</td>
                        <td class="border px-2 py-1 text-left">${mc.DESCRIP_CONSUMIDO}</td>
                        <td class="border px-2 py-1 text-center">${mc.NUMERO_LOTE_INT_CONSUMIDO}</td>
                        <td class="border px-2 py-1 text-center">${fEur0(mc.CANTIDAD_UNIDAD1)} ${mc.CODIGO_PRESENTACION}</td>
                    </tr>`;
        });
    }
    

    let htmlMProd = '';
    if(trazData.data[0]['MATERIAL_PRODUCIDO']){
        trazData.data[0]['MATERIAL_PRODUCIDO'].map(mc => {
            htmlMProd += `<tr><td class="border px-2 py-1 text-center">${formatLongDate(mc.FECHA_CREACION)}</td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(mc.FECHA_CADUCIDAD)}</td>
                        <td class="border px-2 py-1 text-center">${mc.CODIGO_ARTICULO}</td>
                        <td class="border px-2 py-1 text-left">${mc.DESCRIP_COMERCIAL}</td>
                        <td class="border px-2 py-1 text-center">${mc.NUMERO_LOTE_INT}</td>
                        <td class="border px-2 py-1 text-center">${fEur0(mc.CANTIDAD_UNIDAD1)} ${mc.CODIGO_PRESENTACION}</td>
                        <td class="border px-2 py-1 text-center">${mc.NUMERO_PALET}</td>
                    </tr>`;
        });
    }
    

    let htmlPI = '';
    if(trazData.data[0]['PARTE_INSPECCION']){
         trazData.data[0]['PARTE_INSPECCION'].map(piA => {
         htmlPI += `<tr><td class="border px-2 py-1 text-center">${piA.ORDEN_FABRICACION}</td>
                        <td class="border px-2 py-1 text-center">${piA.NUMERO_PARTE}</td>
                        <td class="border px-2 py-1 text-center">${piA.CODIGO_ARTICULO}</td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(piA.FECHA_ENTRADA)}</td>
                        <td class="border px-2 py-1 text-center">${formatLongDate(piA.FECHA_VERIFICACION)}</td>
                        <td class="border px-2 py-1 text-center">${fEur0(piA.CANT_ACEPTADA)} ${piA.CODIGO_PRESENTACION}</td>
                        <td class="border px-2 py-1 text-center">${fEur0(piA.CANT_RECIBIDA)} ${piA.CODIGO_PRESENTACION}</td>
                        <td class="border px-2 py-1 text-center">${piA.CODIGO_VERIFICADOR}</td>
                    </tr>`;
        });
    }
   

    let ofDetailHtml = `
        <h2 class="text-xl mb-6">Trazabilidad de Producción OF id=${ofId}</h2>
        <div class="space-y-6">
            <div>
                <h3 class="text-sm mb-2">OF</h3>
                <table class="w-full table-auto border border-gray-300 text-sm ">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Id</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Entrega</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th class="topRight">Estado</th>
                        </tr>
                    </thead>
                    <tbody>${htmlOfsTop}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Materiales pedidos</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Código</th>
                            <th>Nombre</th>
                            <th class="topRight">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>${htmlMP}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Materiales consumidos</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Fecha creación</th>
                            <th>Fecha caducidad</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Lote</th>
                            <th class="topRight">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>${htmlMC}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Materiales producidos</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Fecha creación</th>
                            <th>Fecha caducidad</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Lote</th>
                            <th>Cantidad</th>
                            <th class="topRight">Paleta</th>
                        </tr>
                    </thead>
                    <tbody>${htmlMProd}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Parte inspección</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">OF id</th>
                            <th>Parte</th>
                            <th>Código</th>
                            <th>Fecha entrada</th>
                            <th>Fecha verificacion</th>
                            <th>Cantidad aceptada</th>
                            <th>Cantidad recibida</th>
                            <th class="topRight">Usuario</th>
                        </tr>
                    </thead>
                    <tbody>${htmlPI}</tbody>
                </table>
            </div>
        </div><br><br><br><br><br>`;

    if(document.getElementById('htmlContent')) document.getElementById('htmlContent').innerHTML = ofDetailHtml;
}




/* 3. CREATE EXCEL FUNCTION */
 


function createExcel() {
  const raw = trazData.data[0];
  const sheetData = [];

  // Agrega sección con título y tabla
  function addSection(title, dataArray) {
    if (sheetData.length > 0) sheetData.push([]); // línea en blanco
    sheetData.push([title.toUpperCase()]);
    if (dataArray.length === 0) return;
    sheetData.push(Object.keys(dataArray[0]));
    dataArray.forEach(obj => {
      sheetData.push(Object.values(obj));
    });
  }

  // Sección OF
  const of = raw.OF.map(item => ({
    "Id": item.ORDEN_DE_FABRICACION,
    "Fecha Inicio": item.FECHA_INI_FABRI_PREVISTA,
    "Fecha Entrega": item.FECHA_ENTREGA_PREVISTA,
    "Código": item.CODIGO_ARTICULO,
    "Nombre": item.NOMBRE_ARTICULO.trim(),
    "Cantidad": `${item.CANTIDAD_A_FABRICAR} ${item.CODIGO_PRESENTACION}`,
    "Estado": item.SITUACION_OF === 'C' ? 'Cerrada' : item.SITUACION_OF
  }));
  addSection("OF", of);

  // Sección Materiales pedidos
  const pedidos = raw.MATERIAL_PEDIDO.map(item => ({
    "Código": item.CODIGO_COMPONENTE,
    "Nombre": item.COMPO_DESC_COMERCIAL.trim(),
    "Cantidad": `${item.CANTIDAD_TECNICA} ${item.CODIGO_PRESENTACION_COMPO}`
  }));
  addSection("Materiales pedidos", pedidos);

  // Sección Materiales consumidos
  const consumidos = raw.MATERIAL_CONSUMIDO.map(item => ({
    "Fecha creación": item.FECHA_CREACION,
    "Fecha caducidad": item.FECHA_CADUCIDAD,
    "Código": item.CODIGO_ARTICULO_CONSUMIDO,
    "Nombre": item.DESCRIP_CONSUMIDO.trim(),
    "Lote": item.NUMERO_LOTE_INT_CONSUMIDO,
    "Cantidad": `${item.CANTIDAD_UNIDAD1} ${item.CODIGO_PRESENTACION}`
  }));
  addSection("Materiales consumidos", consumidos);

  // Sección Materiales producidos
  const producidos = raw.MATERIAL_PRODUCIDO.map(item => ({
    "Fecha creación": item.FECHA_CREACION,
    "Fecha caducidad": item.FECHA_CADUCIDAD,
    "Código": item.CODIGO_ARTICULO,
    "Nombre": item.DESCRIP_COMERCIAL.trim(),
    "Lote": item.NUMERO_LOTE_INT,
    "Cantidad": `${item.CANTIDAD_UNIDAD1} ${item.CODIGO_PRESENTACION}`,
    "Paleta": item.NUMERO_PALET
  }));
  addSection("Materiales producidos", producidos);

  // Sección Parte inspección
  const inspeccion = raw.PARTE_INSPECCION.map(item => ({
    "OF id": item.ORDEN_FABRICACION,
    "Parte": item.NUMERO_PARTE,
    "Código": item.CODIGO_ARTICULO,
    "Fecha entrada": item.FECHA_ENTRADA,
    "Fecha verificación": item.FECHA_VERIFICACION,
    "Cantidad aceptada": `${item.CANT_ACEPTADA} ${item.CODIGO_PRESENTACION}`,
    "Cantidad recibida": `${item.CANT_RECIBIDA} ${item.CODIGO_PRESENTACION}`,
    "Usuario": item.CODIGO_VERIFICADOR
  }));
  addSection("Parte inspección", inspeccion);

  // Crear y exportar Excel
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trazabilidad");

  XLSX.writeFile(workbook, `Trazabilidad_OF_${raw.OF[0].ORDEN_DE_FABRICACION}.xlsx`);
}
