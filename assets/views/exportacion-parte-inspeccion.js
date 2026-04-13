let informeArtLoteData = null;
let ialAutoSearchTimer = null;

const IAL_ARTICLE_KEY = 'ial_article';
const IAL_LOT_KEY     = 'ial_lot';

/* =====================================================
   INIT
===================================================== */

function exportacionParteInspeccionInit(){
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="createExcelEPIA()">📥 Excel</span>';
    document.title = "Informe artículo y lote";

    setSearchedIAL();
    autoLoadIAL();
}

/* =====================================================
   STORAGE
===================================================== */

function getStoredIAL(){
    return {
        article: (localStorage.getItem(IAL_ARTICLE_KEY) || '').trim().toUpperCase(),
        lot:     (localStorage.getItem(IAL_LOT_KEY) || '').trim().toUpperCase()
    };
}

function saveStoredIAL(article, lot){
    localStorage.setItem(IAL_ARTICLE_KEY, (article || '').trim().toUpperCase());
    localStorage.setItem(IAL_LOT_KEY, (lot || '').trim().toUpperCase());
}

function clearStoredIAL(){
    localStorage.removeItem(IAL_ARTICLE_KEY);
    localStorage.removeItem(IAL_LOT_KEY);
}

/* =====================================================
   HELPERS
===================================================== */

function resetIALScreen(message = 'Introduce un artículo para comenzar.'){
    informeArtLoteData = null;
    document.getElementById('tableLotsIAL').innerHTML = '';
    document.getElementById('htmlContentIAL').innerHTML = `<div class="bg-white p-2 border">${message}</div>`;
}

function scheduleIALSearch(){
    clearTimeout(ialAutoSearchTimer);

    ialAutoSearchTimer = setTimeout(() => {
        runAutoSearchIAL();
    }, 250);
}

function runAutoSearchIAL(){
    const article = (document.getElementById('searchArticleIAL')?.value || '').trim().toUpperCase();
    const lot     = (document.getElementById('searchLotIAL')?.value || '').trim().toUpperCase();

    saveStoredIAL(article, lot);

    if(article.length < 3){
        resetIALScreen('Introduce al menos 3 caracteres de artículo.');
        return;
    }

    if(lot.length === 0){
        getInformeArtLote(article, '');
        return;
    }

    if(lot.length >= 3){
        getInformeArtLote(article, lot);
        return;
    }

    getInformeArtLote(article, '');
}

/* =====================================================
   AUTOLOAD
===================================================== */

function autoLoadIAL(){
    const { article, lot } = getStoredIAL();

    if(document.getElementById('searchArticleIAL')){
        document.getElementById('searchArticleIAL').value = article;
    }

    if(document.getElementById('searchLotIAL')){
        document.getElementById('searchLotIAL').value = lot;
    }

    if(article.length >= 3){
        if(lot.length >= 3){
            getInformeArtLote(article, lot);
        } else {
            getInformeArtLote(article, '');
        }
    } else {
        resetIALScreen();
    }
}

/* =====================================================
   INPUTS
===================================================== */

function setSearchedIAL(){
    const { article, lot } = getStoredIAL();

    if(document.getElementById('searchArticleIAL')){
        document.getElementById('searchArticleIAL').value = article;
    }

    if(document.getElementById('searchLotIAL')){
        document.getElementById('searchLotIAL').value = lot;
    }
}

function changeArticleIAL(event){
    const article = (event.target.value || '').trim().toUpperCase();
    const lot     = (document.getElementById('searchLotIAL')?.value || '').trim().toUpperCase();

    event.target.value = article;
    saveStoredIAL(article, lot);
    scheduleIALSearch();
}

function changeLotIAL(event){
    const lot     = (event.target.value || '').trim().toUpperCase();
    const article = (document.getElementById('searchArticleIAL')?.value || '').trim().toUpperCase();

    event.target.value = lot;
    saveStoredIAL(article, lot);
    scheduleIALSearch();
}

function clickBroomIAL(){
    clearTimeout(ialAutoSearchTimer);
    clearStoredIAL();

    if(document.getElementById('searchArticleIAL')) document.getElementById('searchArticleIAL').value = '';
    if(document.getElementById('searchLotIAL')) document.getElementById('searchLotIAL').value = '';

    resetIALScreen();
}

function searchIAL(){
    const article = (document.getElementById('searchArticleIAL').value || '').trim().toUpperCase();
    const lot     = (document.getElementById('searchLotIAL').value || '').trim().toUpperCase();

    saveStoredIAL(article, lot);

    if(article.length < 3){
        showM('Introduce al menos 3 caracteres de artículo', 'warning');
        return;
    }

    if(lot.length > 0 && lot.length < 3){
        getInformeArtLote(article, '');
        return;
    }

    getInformeArtLote(article, lot);
}

/* =====================================================
   FETCH
===================================================== */

function getInformeArtLote(article, lot){
    article = (article || '').trim().toUpperCase();
    lot     = (lot || '').trim().toUpperCase();

    saveStoredIAL(article, lot);

    document.getElementById('tableLotsIAL').innerHTML = `<tr><td colspan="2">Cargando...</td></tr>`;
    document.getElementById('htmlContentIAL').innerHTML = `<div class="bg-white p-2 border">Cargando...</div>`;

    const lotUse = lot && lot.length > 0 ? lot : '0';

    fetch(HTTP_HOST + `exportacion/${article}/${lotUse}/informe_art_lote/`)
        .then(r => r.json())
        .then(r => {
            if(!r || !r.data){
                informeArtLoteData = null;
                document.getElementById('tableLotsIAL').innerHTML = `<tr><td colspan="2">Sin datos</td></tr>`;
                document.getElementById('htmlContentIAL').innerHTML = `<div class="bg-white p-2 border">Sin datos</div>`;
                return;
            }

            informeArtLoteData = r.data;

            showLotsIAL(r.data.lots || []);
            showInfoIAL(r.data);
        })
        .catch(e => {
            showM('IAL ERROR ' + e, 'error');
            document.getElementById('tableLotsIAL').innerHTML = `<tr><td colspan="2">Error</td></tr>`;
            document.getElementById('htmlContentIAL').innerHTML = `<div class="bg-white p-2 border">Error</div>`;
        });
}

/* =====================================================
   TABLA LOTES
===================================================== */

function showLotsIAL(lots){
    let html = '';

    if(lots && lots.length > 0){
        lots.map(x => {
            const lote = (x.NUMERO_LOTE_INT || '').replace(/'/g, "\\'");
            html += `<tr onclick="selectLotIAL('${lote}')" class="hovered">
                        <td class="border px-2 py-1 text-center">${x.CODIGO_ARTICULO || ''}</td>
                        <td class="border px-2 py-1 text-center">${x.NUMERO_LOTE_INT || ''}</td>
                    </tr>`;
        });
    }

    document.getElementById('tableLotsIAL').innerHTML = html || `<tr><td colspan="2">Sin lotes con stock</td></tr>`;
}

function selectLotIAL(lot){
    lot = (lot || '').trim().toUpperCase();

    document.getElementById('searchLotIAL').value = lot;

    const article = (document.getElementById('searchArticleIAL').value || '').trim().toUpperCase();

    saveStoredIAL(article, lot);

    if(article.length >= 3){
        getInformeArtLote(article, lot);
    }
}

/* =====================================================
   HTML DETALLE
===================================================== */

function showInfoIAL(data){
    const info            = data.info || [];
    const caracteristicas = data.caracteristicas || [];
    const partes          = data.partes_inspeccion || [];

    let htmlInfo = '';
    if(info.length > 0){
        info.map(x => {
            htmlInfo += `<tr>
                <td class="border px-2 py-1 text-center">${x.CODIGO_ARTICULO || ''}</td>
                <td class="border px-2 py-1 text-center">${x.D_CODIGO_ARTICULO || ''}</td>
                <td class="border px-2 py-1 text-center">${x.NUMERO_LOTE_INT || ''}</td>
                <td class="border px-2 py-1 text-center">${x.CODIGO_PROVEEDOR || ''}</td>
                <td class="border px-2 py-1 text-center">${formatLongDate(x.FECHA_CREACION)}</td>
                <td class="border px-2 py-1 text-center">${formatLongDate(x.FECHA_CADUCIDAD)}</td>
                <td class="border px-2 py-1 text-center">${x.NUMERO_LOTE_PRO || ''}</td>
                <td class="border px-2 py-1 text-center">${x.DESCRIPCION_LOTE || ''}</td>
                <td class="border px-2 py-1 text-center">${x.NUMERO_LOTE_INT_ORIGEN || ''}</td>
                <td class="border px-2 py-1 text-center">${x.DESCRIPCION_LOTE2 || ''}</td>
            </tr>`;
        });
    }

    let htmlCar = '';
    if(caracteristicas.length > 0){
        caracteristicas.map(x => {
            htmlCar += `<tr>
                <td class="border px-2 py-1 text-center">${x.METODO_PRODUCCION || ''}</td>
                <td class="border px-2 py-1 text-left">${x.D_VALOR_ALFA_1 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.FAO || ''}</td>
                <td class="border px-2 py-1 text-left">${x.D_VALOR_ALFA_2 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.ARTE_PESCA || ''}</td>
                <td class="border px-2 py-1 text-left">${x.D_VALOR_ALFA_3 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.PAIS_ORIGEN || ''}</td>
                <td class="border px-2 py-1 text-left">${x.D_VALOR_ALFA_4 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.CONTENEDOR  == 'None' ? '' : x.CONTENEDOR}</td>
                <td class="border px-2 py-1 text-left">${x.D_VALOR_ALFA_6  == 'None' ? '' : x.D_VALOR_ALFA_6 }</td>
                <td class="border px-2 py-1 text-center">${x.ESPECIE || ''}</td>
                <td class="border px-2 py-1 text-left">${x.D_VALOR_ALFA_7 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.NOMBRE_IDENTIFICACION_BUQUE == 'None' ? '' : (x.NOMBRE_IDENTIFICACION_BUQUE || '')}</td>
                <td class="border px-2 py-1 text-center">${x.NOBRE_PROD_ACUICULA == 'None' ? '' : x.NOBRE_PROD_ACUICULA }</td>
                <td class="border px-2 py-1 text-center">${x.PROUCTO_DESCONGELADO == 'None' ? '' : x.PROUCTO_DESCONGELADO } ${x.D_VALOR_ALFA_10 == 'None' ? '' : x.D_VALOR_ALFA_10 }</td>
                <td class="border px-2 py-1 text-center">${formatLongDate(x.FECHA_CONGELACION)}</td>
                <td class="border px-2 py-1 text-center">${formatLongDate(x.FECHA_PRODUCCION)}</td>
            </tr>`;
        });
    }

    let htmlPartes = '';
    if(partes.length > 0){
        partes.map(x => {
            htmlPartes += `<tr>
                <td class="border px-2 py-1 text-center">${x.NUMERO_PARTE || ''}</td>
                <td class="border px-2 py-1 text-center">${x.LOTE_INTERNO || ''}</td>
                <td class="border px-2 py-1 text-center">${x.LOTE_PROVEEDOR || ''}</td>
                <td class="border px-2 py-1 text-center">${formatLongDate(x.FECHA_VERIFICACION)}</td>
                <td class="border px-2 py-1 text-center">${x.C2 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.C3 || ''}</td>
                <td class="border px-2 py-1 text-left">${x.C4 || ''}</td>
                <td class="border px-2 py-1 text-left">${x.C6 || ''}</td>
                <td class="border px-2 py-1 text-center">${x.C7 || ''}</td>
                <td class="border px-2 py-1 text-left">${x.C8 || ''}</td>
                <td class="border px-2 py-1 text-left">${x.C9 || ''}</td>
                <td class="border px-2 py-1 text-center">${formatLongDate(x.C10)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(x.N3 || 0)}</td>
                <td class="border px-2 py-1 text-center">${x.C18 || ''}</td>
                <td class="border px-2 py-1 text-right">${fEur0(x.N4 || 0)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(x.N5 || 0)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(x.N6 || 0)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(x.N7 || 0)}</td>
                <td class="border px-2 py-1 text-right">${fEur0(x.N8 || 0)}</td>
            </tr>`;
        });
    }

    const html = `
        <div class="space-y-6">

            <div>
                <h3 class="text-sm mb-2">Datos artículo y lote</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Artículo</th>
                            <th>Descripción</th>
                            <th>Lote</th>
                            <th>Proveedor</th>
                            <th>Fecha creación</th>
                            <th>Fecha caducidad</th>
                            <th>Lote proveedor</th>
                            <th>Descripción lote</th>
                            <th>Lote origen</th>
                            <th class="topRight">Desc. lote 2</th>
                        </tr>
                    </thead>
                    <tbody>${htmlInfo || `<tr><td colspan="10" class="border px-2 py-1 text-center">Sin datos</td></tr>`}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Características artículo y lote</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Método</th>
                            <th>D. método</th>
                            <th>FAO</th>
                            <th>D. FAO</th>
                            <th>Arte pesca</th>
                            <th>D. arte pesca</th>
                            <th>País origen</th>
                            <th>D. país</th>
                            <th>Contenedor</th>
                            <th>D. contenedor</th>
                            <th>Especie</th>
                            <th>D. especie</th>
                            <th>Buque</th>
                            <th>Prod. acuícola</th>
                            <th>Descongelado</th>
                            <th>F. congelación</th>
                            <th class="topRight">F. producción</th>
                        </tr>
                    </thead>
                    <tbody>${htmlCar || `<tr><td colspan="17" class="border px-2 py-1 text-center">Sin datos</td></tr>`}</tbody>
                </table>
            </div>

            <div>
                <h3 class="text-sm mb-2">Partes de inspección</h3>
                <table class="w-full table-auto border border-gray-300 text-sm">
                    <thead>
                        <tr class="twcolor">
                            <th class="topLeft">Nº parte</th>
                            <th>Lote interno</th>
                            <th>Lote proveedor</th>
                            <th>F. verificación</th>
                            <th>Tipo parte</th>
                            <th>Norma</th>
                            <th>D. norma</th>
                            <th>Situación</th>
                            <th>Artículo</th>
                            <th>D. artículo</th>
                            <th>Proveedor</th>
                            <th>Fecha entrada</th>
                            <th>Cant. recibida</th>
                            <th>Presentación</th>
                            <th>Aceptada</th>
                            <th>Rechazada</th>
                            <th>Kg recibida</th>
                            <th>Kg aceptada</th>
                            <th class="topRight">Kg rechazada</th>
                        </tr>
                    </thead>
                    <tbody>${htmlPartes || `<tr><td colspan="19" class="border px-2 py-1 text-center">Sin datos</td></tr>`}</tbody>
                </table>
            </div>
        </div>
        <br><br><br><br><br>
    `;

    document.getElementById('htmlContentIAL').innerHTML = html;
}



async function createExcelEPIA() {
    if (!informeArtLoteData) {
        showM('No hay datos para exportar', 'warning');
        return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Informe");
    const COLOR_HEADER = '00751b';

    const article = (document.getElementById('searchArticleIAL')?.value || '').trim().toUpperCase();
    const lot     = (document.getElementById('searchLotIAL')?.value || '').trim().toUpperCase();

    let currentRow = 1;

    function cleanExcelValue(value) {
        if (value === null || value === undefined) return '';
        if (value === 'None') return '';
        return value;
    }

    function formatExcelDate(value) {
        value = cleanExcelValue(value);
        if (!value) return '';
        return formatLongDate(value);
    }

    function addSection(title, dataArray) {
        if (!dataArray || dataArray.length === 0) return;

        const headers = Object.keys(dataArray[0]);
        const colCount = headers.length;

        sheet.mergeCells(currentRow, 1, currentRow, colCount);
        const titleCell = sheet.getCell(currentRow, 1);
        titleCell.value = title.toUpperCase();
        titleCell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
        titleCell.alignment = { horizontal: "center" };
        titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };

        currentRow++;

        sheet.insertRow(currentRow, headers);
        sheet.getRow(currentRow).eachCell(cell => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLOR_HEADER } };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        });

        currentRow++;

        dataArray.forEach(obj => {
            const values = Object.values(obj).map(v => cleanExcelValue(v));
            sheet.insertRow(currentRow, values);

            sheet.getRow(currentRow).eachCell(cell => {
                cell.alignment = { vertical: "middle", wrapText: true };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };
            });

            currentRow++;
        });

        currentRow++;
    }

    const info = (informeArtLoteData.info || []).map(item => ({
        "Artículo": cleanExcelValue(item.CODIGO_ARTICULO),
        "Descripción": cleanExcelValue(item.D_CODIGO_ARTICULO),
        "Lote": cleanExcelValue(item.NUMERO_LOTE_INT),
        "Proveedor": cleanExcelValue(item.CODIGO_PROVEEDOR),
        "Fecha creación": formatExcelDate(item.FECHA_CREACION),
        "Fecha caducidad": formatExcelDate(item.FECHA_CADUCIDAD),
        "Lote proveedor": cleanExcelValue(item.NUMERO_LOTE_PRO),
        "Descripción lote": cleanExcelValue(item.DESCRIPCION_LOTE),
        "Lote origen": cleanExcelValue(item.NUMERO_LOTE_INT_ORIGEN),
        "Desc. lote 2": cleanExcelValue(item.DESCRIPCION_LOTE2)
    }));

    const caracteristicas = (informeArtLoteData.caracteristicas || []).map(item => ({
        "Método": cleanExcelValue(item.METODO_PRODUCCION),
        "D. método": cleanExcelValue(item.D_VALOR_ALFA_1),
        "FAO": cleanExcelValue(item.FAO),
        "D. FAO": cleanExcelValue(item.D_VALOR_ALFA_2),
        "Arte pesca": cleanExcelValue(item.ARTE_PESCA),
        "D. arte pesca": cleanExcelValue(item.D_VALOR_ALFA_3),
        "País origen": cleanExcelValue(item.PAIS_ORIGEN),
        "D. país": cleanExcelValue(item.D_VALOR_ALFA_4),
        "Contenedor": cleanExcelValue(item.CONTENEDOR),
        "D. contenedor": cleanExcelValue(item.D_VALOR_ALFA_6),
        "Especie": cleanExcelValue(item.ESPECIE),
        "D. especie": cleanExcelValue(item.D_VALOR_ALFA_7),
        "Buque": cleanExcelValue(item.NOMBRE_IDENTIFICACION_BUQUE),
        "Prod. acuícola": cleanExcelValue(item.NOBRE_PROD_ACUICULA),
        "Descongelado": `${cleanExcelValue(item.PROUCTO_DESCONGELADO)} ${cleanExcelValue(item.D_VALOR_ALFA_10)}`.trim(),
        "F. congelación": formatExcelDate(item.FECHA_CONGELACION),
        "F. producción": formatExcelDate(item.FECHA_PRODUCCION)
    }));

    const partes = (informeArtLoteData.partes_inspeccion || []).map(item => ({
        "Nº parte": cleanExcelValue(item.NUMERO_PARTE),
        "Lote interno": cleanExcelValue(item.LOTE_INTERNO),
        "Lote proveedor": cleanExcelValue(item.LOTE_PROVEEDOR),
        "F. verificación": formatExcelDate(item.FECHA_VERIFICACION),
        "Tipo parte": cleanExcelValue(item.C2),
        "Norma": cleanExcelValue(item.C3),
        "D. norma": cleanExcelValue(item.C4),
        "Situación": cleanExcelValue(item.C6),
        "Artículo": cleanExcelValue(item.C7),
        "D. artículo": cleanExcelValue(item.C8),
        "Proveedor": cleanExcelValue(item.C9),
        "Fecha entrada": formatExcelDate(item.C10),
        "Cant. recibida": cleanExcelValue(item.N3),
        "Presentación": cleanExcelValue(item.C18),
        "Aceptada": cleanExcelValue(item.N4),
        "Rechazada": cleanExcelValue(item.N5),
        "Kg recibida": cleanExcelValue(item.N6),
        "Kg aceptada": cleanExcelValue(item.N7),
        "Kg rechazada": cleanExcelValue(item.N8)
    }));

    addSection("Datos artículo y lote", info);
    addSection("Características artículo y lote", caracteristicas);
    addSection("Partes de inspección", partes);

    sheet.columns.forEach(col => {
        col.width = 18;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob(
        [buffer],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Informe_articulo_lote_${article || 'SIN_ARTICULO'}_${lot || 'SIN_LOTE'}.xlsx`;
    a.click();
}