let PARENT_ID_EQ = 0;

function detalleGrupoEquivalenteInit(){
    if(document.getElementById('slugTitle')){ document.getElementById('slugTitle').innerHTML = ''; }
    document.title = 'Detalle equivalente';

    getDataPageEq();
}

async function nameGroupPress(event){
    if (event.key === "Enter") {
        let groupName = event.target.value.trim();
        let formData = new FormData();
            formData.append('group_name', groupName);
        let x = await saveData(`/produccion/save_one/0/${PARENT_ID_EQ}/create_update_equivalents/`, formData);
        window.location.reload();
    }
}

async function getDataPageEq(){
    PARENT_ID_EQ = parseHashRoute();
    PARENT_ID_EQ = PARENT_ID_EQ.params.id;

    let eQData = await loadData(`produccion/get_one/0/${PARENT_ID_EQ}/create_update_equivalents/`);
    eQData = eQData.data;
    document.getElementById('nameGroupId').value = eQData.article_name;
    console.log(eQData)
}