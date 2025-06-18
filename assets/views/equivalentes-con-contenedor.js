let listEquivalents = []

function equivalentesConContenedorInit() {
    document.title = 'Artículos equivalentes';
    document.getElementById('slugTitle').innerHTML = `<div>
            <span class="b-top-page" onclick="addEquibArt()">➕ Añadir grupo </span>
        </div>`;
        /* <span class="b-top-page" onclick="createExcelArtEquiv()">📥 Excel </span>
            <span class="b-top-page" onclick="recalculateEquiv()">🔃 Recaclular </span> */

    getAllListsEquivalents();
}


function openEquivalent(pageId){
    let url = '/dashboard/#detalle-grupo-equivalente?id='+pageId;
    window.open(url, '_blank');
}

function paintTables() {
    let tablPriceEquiCon = document.getElementById('tablPriceEquiCon');
    let tableHtml = '';
    listEquivalents.map(x => {
        tableHtml += `<tr>
            <th class="border px-2 py-1 taleft howerA" onclick="openEquivalent(${x.id})">${x.article_name}</th>
            <th class="border px-2 py-1 text-center">${fEE(x.kg_act)}</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.price_act)}</th>

            <th class="border px-2 py-1 text-center">${fEE(x.kg0)}</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.price0)}</th>
            
            <th class="border px-2 py-1 text-center">${fEE(x.kg1)}</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.price1)}</th>
            
            <th class="border px-2 py-1 text-center">${fEE(x.kg2)}</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.price2)}</th>
            
            <th class="border px-2 py-1 text-center">${fEE(x.kg3)}</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.price3)}</th>
        </tr>`;
    });
    let html = `<div class="table-container scrollable-table">
                    <table class="styled-table-ca scrollable-table stycky-table">
                        <thead>
                          <tr>
                            <th class="topLeft">Equivalente</th>
                            <th colspan="2">Estado Actual</th>
                            <th colspan="2" id="topDate0"></th>
                            <th colspan="2" id="topDate1"></th>
                            <th colspan="2" id="topDate2"></th>
                            <th colspan="2" id="topDate3" class="topRight"></th>
                          </tr>
                          <tr><th></th><th>Kg</th><th>€/kg</th><th>Kg</th><th>€/kg</th><th>Kg</th><th>€/kg</th><th>Kg</th><th>€/kg</th><th>Kg</th><th>€/kg</th></tr>
                        </thead>
                        <tbody>${tableHtml}</tbody>
                    </table>
                </div>`;

    
    if(tablPriceEquiCon) tablPriceEquiCon.innerHTML = html;
    setTopDates4();   
}

function paintStructure(strData){
    let tableStructureA = document.getElementById('tableStructureA');
    let tBody   = '';
    let newName = '';
    let strVal  = '';
    let calcKg  = '';
    strData.map(x => {
        if(newName != x.name){
            strVal = `<b>${x.name}</b>`; calcKg = '';
        } else {
            strVal = `<span class="small-letter">&nbsp; &nbsp; &nbsp;${x.entrada}</span>`; calcKg = fEE(x.calc_kg);
        }
        tBody += `<tr>
            <th class="border px-2 py-1 taleft">${strVal}</th>
            <th class="border px-2 py-1 text-center">${fEurEntero(x.stock_actual) == 0 ? "" : fEurEntero(x.stock_actual) }</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.pcm_actual) == '0,00' ? "" : fEur000(x.pcm_actual) }</th>

            <th class="border px-2 py-1 text-center">${fEurEntero(x.consumo_prod) == 0 ? "" : fEurEntero(x.consumo_prod) }</th>
            <th class="border px-2 py-1 text-center">${fEurEntero(x.consumo_vent) == 0 ? "" : fEurEntero(x.consumo_vent) }</th>
            
            <th class="border px-2 py-1 text-center">${fEurEntero(x.entrada_kg) == 0 ? "" : fEurEntero(x.entrada_kg) }</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.entrada_eur) == "0,00" ? "" : fEur000(x.entrada_eur) }</th>
            
            <th class="border px-2 py-1 text-center">${calcKg}</th>
            <th class="border px-2 py-1 text-center">${fEur000(x.calc_eur) == "0,00" ? "": fEur000(x.calc_eur)}</th>
        </tr>`;
        newName = x.name;
    });
    let html = `<div class="table-container scrollable-table">
                   <table class="styled-table-ca scrollable-table stycky-table">
                       <thead>
                         <tr>
                           <th class="topLeft">Nombre</th>
                           <th>Stock Actual Kg</th>
                           <th>PMP Actual €/kg</th>
                           <th>Cons. Prod.</th>
                           <th>Cons. Vent.</th>
                           <th>Entrada Kg</th>
                           <th>Entrada €/Kg</th>
                           <th>Stock Calc. Kg</th>
                           <th class="topRight">PMP Calc. €/Kg</th>
                         </tr>
                       </thead>
                       <tbody>${tBody}</tbody>
                   </table>
               </div>`;
    if(tableStructureA) { tableStructureA.innerHTML = html; setDefaulContentToLocalStorage(); }
}

async function getAllListsEquivalents() {
    /* recalculate costs structure TABLES EquivalentsHead AND DetalleEntradasEquivCC */
    await loadData('produccion/get/0/0/recalculate_equiv_with_contaner/');

    listEquivalents = await loadData('produccion/get/0/0/create_update_equivalents/');
    listEquivalents = listEquivalents.data;
    paintTables();
    
    let structureData = await loadData('/produccion/get_structure/0/0/create_update_equivalents/');
    paintStructure(structureData.data)
}

async function saveNewAGroupFunc() {
    if(userDontLogin('produccion')) return;
    let groupName = document.getElementById('descripGroupEquv').value;
    let formData = new FormData();
    formData.append('group_name', groupName);
    let res = await saveData('produccion/create/0/0/create_update_equivalents/', formData);
    window.location.reload();
}

function addEquibArt() {
    if(userDontLogin('produccion')) return;
    document.getElementById('addNewEquivForm').style.display = 'block';
}

