let listEquivalents = []

function equivalentesInit() {
    document.title = 'Artículos equivalentes';
    document.getElementById('slugTitle').innerHTML = `<div>
        <span class="b-top-page" onclick="addEquibArt()">➕ Añadir grupo </span>
        <span class="b-top-page" onclick="createExcelArtConst()">📥 Excel </span>
        <span class="b-top-page" onclick="recalculateTable()">🔃 Recaclular </span>
        </div>`;



    getListEquivalents();
}

function openEquivalent(pageId){
    let url = '/dashboard/#detalle-grupo-equivalente?id='+pageId;
    window.open(url, '_blank');
}

function paintTables() {
    let tablPriceEquiCon = document.getElementById('tablPriceEquiCon');
    tableHtml = '';

    console.log(listEquivalents)

    listEquivalents.map(x => {
        console.log(x)
        tableHtml += `<tr>
            <th class="border px-2 py-1 text-center howerA taleft" onclick="openEquivalent(${x.id})">${x.article_name}</th>
        </tr>`;
    });
    let html = `<div class="table-container scrollable-table">
        <table class="styled-table-ca scrollable-table">
            <thead>
              <tr>
                <th class="topLeft">Artículo</th>
                <th colspan="2">2025-02</th>
                <th colspan="2">2025-03</th>
                <th colspan="2">2025-04</th>
                <th colspan="2" class="topRight">2025-05</th>
              </tr>
              <tr>
                <th></th>
                <th>Kg</th><th>€/kg</th>
                <th>Kg</th><th>€/kg</th>
                <th>Kg</th><th>€/kg</th>
                <th>Kg</th><th>€/kg</th>
              </tr>
            </thead>
            <tbody>${tableHtml}</tbody>
        </table>
    </div>`

    tablPriceEquiCon.innerHTML = html;
    console.log(listEquivalents)
    setDefaulContentToLocalStorage();
}

async function getListEquivalents() {
    listEquivalents = await loadData('produccion/get/0/0/create_update_equivalents/');
    if(listEquivalents && listEquivalents.data){
        listEquivalents = listEquivalents.data;
        paintTables();
    }
}

async function saveNewAGroupFunc() {
    let groupName = document.getElementById('descripGroupEquv').value;
    let formData = new FormData();
    formData.append('group_name', groupName);
    let res = await saveData('produccion/create/0/0/create_update_equivalents/', formData);
    window.location.reload();
}

function addEquibArt() {
    document.getElementById('addNewEquivForm').style.display = 'block';
}
