let PARENT_ID_EQ     = 0;
let LIST_ARTICLES_EQ = [];

function detalleGrupoEquivalenteInit(){
    if(document.getElementById('slugTitle')){ document.getElementById('slugTitle').innerHTML = ''; }
    document.title = 'Detalle equivalente';

    getDataPageEq();
    getListArticles();
}

async function saveNewQuivalente(code, name){
    let formData = new FormData();
        formData.append('id', PARENT_ID_EQ)
        formData.append('code', code);
        formData.append('name', name);
    await saveData('produccion/save_item_equiv/0/0/create_update_equivalents/ ', formData);
    getDataPageEq();
    if(document.getElementById('suggestionsList2')) document.getElementById('suggestionsList2').innerHTML = '';
}

async function getListArticles(){
    let x = await loadData('produccion/get/0/0/get_articles_libra/');
   LIST_ARTICLES_EQ = x.data;
}

function changeLineQuival(event){
    let suggestionsList2 = document.getElementById('suggestionsList2');

    let query = event.target.value.toLowerCase();
    if (query) {
        let filteredList = LIST_ARTICLES_EQ.filter(item =>  item.CODIGO_ARTICULO.toLowerCase().includes(query) || item.DESCRIP_COMERCIAL.toLowerCase().includes(query));
        if(filteredList.length > 0) {  suggestionsList2.innerHTML = ''; }
     
        for(let y = 0; y < 22; y++){
            let item = filteredList[y];
            let listItem = document.createElement("li");
            listItem.textContent = item.CODIGO_ARTICULO + " " + item.DESCRIP_COMERCIAL;
            suggestionsList2.appendChild(listItem);
            listItem.addEventListener('click', () => {
               saveNewQuivalente(item.CODIGO_ARTICULO, item.DESCRIP_COMERCIAL);
            });
        }
    } else {
        suggestionsList2.innerHTML = '';
    }
}

function addNewArticuleGr(){
    let newDiv = document.createElement('div');
    let lineNewHtml = `<div class="flex items-center gap-2">
                            <input type="text" placeholder="Descripción nuevo equivalente" value="" class="border px-2 py-1 rounded w-2/4" oninput="changeLineQuival(event)" />
                    </div><br>`
    if(newDiv) newDiv.innerHTML = lineNewHtml;
    let listadoLinEquiv = document.getElementById('listadoLinEquiv');
    if(listadoLinEquiv) listadoLinEquiv.appendChild(newDiv)
}

async function nameGroupPress(event){
    if (event.key === "Enter") {
        let groupName = event.target.value.trim();
        let formData = new FormData();
            formData.append('group_name', groupName);
        let x = await saveData(`produccion/save_one/0/${PARENT_ID_EQ}/create_update_equivalents/`, formData);
        window.location.reload();
    }
}

async function getDataPageEq(){
    PARENT_ID_EQ = parseHashRoute();
    PARENT_ID_EQ = PARENT_ID_EQ.params.id;

    let eQData = await loadData(`produccion/get_one/0/${PARENT_ID_EQ}/create_update_equivalents/`);
    eQData = eQData.data;
    document.getElementById('nameGroupId').value = eQData.article_name;

    let listadoLinEquiv = document.getElementById('listadoLinEquiv')
    let htmlAlternative = '';
    let alternative     = JSON.parse(eQData.alternative);
    console.log(alternative)

    if(alternative && alternative.length > 0){
        alternative.map(x => {
            htmlAlternative += `<div>Código: ${x.code}, Descripción:  ${x.name} <span class="howerA" onclick="deleteItemEquiv(${PARENT_ID_EQ}, ${x.code})">🗑️</span></div>`;
        });
        htmlAlternative += '<br>';
    }
    if(listadoLinEquiv) listadoLinEquiv.innerHTML = htmlAlternative;
}

async function deleteItemEquiv(id, code){
    let confirmA = confirm('¿Eliminar artículo?');
    if(!confirmA) return; 
    let formData = new FormData();
        formData.append('id', id);
        formData.append('code', code);
    await deleteData('produccion/delete_item/0/0/create_update_equivalents/', formData)
    getDataPageEq();
}