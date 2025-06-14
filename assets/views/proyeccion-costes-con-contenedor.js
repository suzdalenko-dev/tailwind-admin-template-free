let searchArticleValue = '';
let excel_all_lines    = [];

function proyeccionCostesConContenedorInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="addExcelArt()">➕ Añadir artículo </span>
        <span class="b-top-page" onclick="createExcelArtConst()">📥 Excel </span>
        <span class="b-top-page" onclick="recalculateTable()">🔃 Recaclular </span>
        `;
    document.getElementById('tituloArticleCosts').innerHTML = 'Proyección de costes de artículos';
    initSearchArticle();

    renderArtTable();
    document.getElementById('addNewArticleForm').style.display = 'none';

    initArticleAddFormData();
    document.title = 'Costes de artículos';
    changeFocus();
}

async function renderArtTable(){
    let lines = await loadData('produccion/get/0/0/get_all_excel_editables_lines/');
    excel_all_lines = lines.data;
    
    paintTableFilteredData();
    getNextMonthsCosts();
    setDefaulContentToLocalStorage();
}

function inputNewValue(event, lineId){
    if (event.key == 'Enter') {
        let formData         = new FormData();                                                formData.append('id', lineId);
        let rendimiento      = document.getElementById('rendimiento'+lineId).value || 0;      formData.append('rendimiento', rendimiento);
        let precio_aceite    = document.getElementById('precio_aceite'+lineId).value || 0;    formData.append('precio_aceite', precio_aceite);
        let precio_servicios = document.getElementById('precio_servicios'+lineId).value || 0; formData.append('precio_servicios', precio_servicios);
        let aditivos         = document.getElementById('aditivos'+lineId).value || 0;         formData.append('aditivos', aditivos);
        let mod              = document.getElementById('mod'+lineId).value || 0;              formData.append('mod', mod);
        let embalajes        = document.getElementById('embalajes'+lineId).value || 0;        formData.append('embalajes', embalajes);
        let amort_maq        = document.getElementById('amort_maq'+lineId).value || 0;        formData.append('amort_maq', amort_maq);
        let moi              = document.getElementById('moi'+lineId).value || 0;              formData.append('moi', moi);
        updateExcelLine(formData);
    }
}

function updateExcelLine(formData){
    fetch(HTTP_HOST+'produccion/put/0/0/update_excel_line/', {method:'POST', body: formData}).then(r => r.json()).then(r => {
        renderArtTable();
    }).catch(e => {
        showM('e2 '+ e, 'error');
    })
}

function addExcelArt(){
    document.getElementById('addNewArticleForm').style.display = 'block';
}


function saveNewAricleFunc(){
    let articleCodeId = document.getElementById('articleCodeId').value;
    let descripcionCodeId = document.getElementById('descripcionCodeId').value;
    if (articleCodeId && descripcionCodeId){
        let formData = new FormData();
            formData.append('code', articleCodeId);
            formData.append('name', descripcionCodeId);
        fetch(HTTP_HOST+'produccion/get/0/0/save_art_cost_head/', {method:'POST', body: formData}).then(r => r.json()).then(r => {
            if(r && r.data && r.data.code > 0){
                openArticleDetail(r.data.code);
            } else {
                 showM('e3 ', 'error');
            }
        }).catch(e => {
            showM('e4 '+e, 'error');
        })
    }
}

function initArticleAddFormData(){
    document.getElementById('descripcionCodeId').addEventListener('input', (event) => {
        let query = event.target.value.toLowerCase();

        if (query) {
            let filteredList = LIST_ARTICLES.filter(item => 
                item.CODIGO_ARTICULO.toLowerCase().includes(query) || item.DESCRIP_COMERCIAL.toLowerCase().includes(query)
            );
            if(filteredList.length > 0) {  suggestionsList.innerHTML = ''; }

            for(let y = 0; y < 22; y++){
                let item = filteredList[y];
                let listItem = document.createElement("li");
                listItem.textContent = item.CODIGO_ARTICULO + " " + item.DESCRIP_COMERCIAL;
                suggestionsList.appendChild(listItem);
                listItem.addEventListener('click', () => {
                    document.getElementById('articleCodeId').value = item.CODIGO_ARTICULO;
                    document.getElementById('descripcionCodeId').value = item.DESCRIP_COMERCIAL;
                    suggestionsList.innerHTML = '';
                   
                });
            }
        } else {
          suggestionsList.innerHTML = '';
        }
    });

    fetch(HTTP_HOST+'produccion/get/0/0/get_articles_libra/' ).then(r => r.json()).then(r => {
        LIST_ARTICLES = r.data;
    }).catch(e => {
        showM('e5 '+e, 'error');
    });
}


function openArticleDetail(artCode){
    let url = '/dashboard/#detalle-articulo-costes?codigo='+artCode;
    // window.location.href = url;
    // loadView('detalle-articulo-costes');
    window.open(url, '_blank');
}


function getNextMonthsCosts(){
    let today = new Date();
    for (let i = 0; i < 4; i++) {
        let date  = new Date(today.getFullYear(), today.getMonth() + i, 1);
        let month = String(date.getMonth() + 1).padStart(2, '0'); 
        let year  = String(date.getFullYear()).slice(-2); 
        let out   = `${month}/${year}`;
        let x = document.getElementById('date'+i)
        if(x) x.innerHTML = out;
    }
}


function createExcelArtConst() {
    // Generar dinámicamente los próximos 4 meses en formato MM/YY
    const months = [];
    const today = new Date();
    for (let i = 0; i < 4; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() + i);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        months.push(`${month}/${year}`);
    }

    let header = ["Código", "Descripción", "€/Kg Act.", "€/kg F/M", "Rend.", "M/Prima Act.", "Aceite", "Servicio","Aditivo", "MOD", "Embalaje", "Amort.", "MOI", "€/Kg C/G Act.", ...months];

    const rows = excel_all_lines.map(item => [
        item.article_code,
        item.article_name.trim(),
        toFL(item.precio_padre_act) ?? "",
        toFL(item.inicio_coste_act) ?? "",
        toFL(item.rendimiento) ?? "",
        toFL(item.precio_materia_prima) ?? "",
        item.precio_aceite ?? "",
        item.precio_servicios ?? "",
        item.aditivos ?? "",
        item.mod ?? "",
        item.embalajes ?? "",
        item.amort_maq ?? "",
        item.moi ?? "",
        toFL(item.precio_padre_mas_gastos) ?? "",
        toFL(item.final_coste_act) ?? "",
        toFL(item.final_coste_mas1) ?? "",
        toFL(item.final_coste_mas2)?? "",
        toFL(item.final_coste_mas3) ?? ""
    ]);

    const worksheet_data = [header, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheet_data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Costes");

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}__${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `costes_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
}


function recalculateTable(){
    document.getElementById('slugTitle').innerHTML = `<span class="b-top-page" onclick="addExcelArt()">➕ Añadir artículo </span><span class="b-top-page" onclick="createExcelArtConst()">📥 Excel </span>`;
    let titulo = document.getElementById('tituloArticleCosts');
    let dotCount = 0;
   
    if (titulo) {
        setInterval(() => { dotCount = (dotCount + 1) % 4; let dots = '.'.repeat(dotCount); titulo.innerHTML = `Recalculando${dots}`;}, 500);
    }

    fetch(HTTP_HOST+'produccion/get/0/0/recalculate_price_projections/').then(r => r.json()).then(r => {
        if(r && r.data){
            if(tituloArticleCosts) tituloArticleCosts.innerHTML = 'Proyección de costes de artículos';
            setTimeout(() => {renderArtTable();}, 3000);
            if(r && r.data && r.data[0] && r.data[0].expediente_sin_precios && r.data[0].expediente_sin_precios.length > 0){
                let textArray =   r.data[0].expediente_sin_precios.join(' ,');
                showM('OJO hay expedientes sin gastos imputados (precio desconocido). Núm: '+textArray, 'warning');
            } else {
                showM('Recalculado');
            }
        } else {
           showM('e16 Error');
        }
        setTimeout( () => { window.location.reload(); }, 11000);
    }).catch(e =>{
        showM('e15 '+e, 'error');
    })
}
function cleanArticleSearch(){
    searchArticleValue = '';
    document.getElementById('searchArticleInput').value = searchArticleValue;
    window.localStorage.setItem('buscar_articulo', '');
    paintTableFilteredData();
}
function initSearchArticle(){
    searchArticleValue = window.localStorage.getItem('buscar_articulo') || '';
    document.getElementById('searchArticleInput').value = searchArticleValue;
}
function changeSearchedArticle(event){
    let inputValue = document.getElementById('searchArticleInput').value.trim();
    searchArticleValue = inputValue;
    window.localStorage.setItem('buscar_articulo', inputValue);
    paintTableFilteredData()
}
function paintTableFilteredData(){
    let filteredArray = [];
    if (searchArticleValue) { filteredArray = excel_all_lines.filter(x => String(x.article_code).includes(searchArticleValue) || String(x.article_name).toLowerCase().includes(searchArticleValue.toLowerCase()));
    } else { filteredArray = excel_all_lines; }
    let tBody = '';
    filteredArray.map(x => {
        tBody += `<tr>
            <td class="border px-2 py-1 text-center howerA" onclick="openArticleDetail(${x.article_code})" >${x.article_code}</td>
            <td class="border px-2 py-1 text-center howerA taleft" onclick="openArticleDetail(${x.article_code})" >${x.article_name}</td>
            <td class="border px-2 py-1 text-center">${fEur000(x.precio_padre_act)}</td>
            <td class="border px-2 py-1 text-center">${fEur000(x.inicio_coste_act)}</td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.rendimiento)}"      id="rendimiento${x.id}"      onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center">${fEur000(x.precio_materia_prima)}</td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.precio_aceite)}"    id="precio_aceite${x.id}"    onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.precio_servicios)}" id="precio_servicios${x.id}" onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.aditivos)}"         id="aditivos${x.id}"         onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.mod)}"              id="mod${x.id}"              onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.embalajes)}"        id="embalajes${x.id}"        onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.amort_maq)}"        id="amort_maq${x.id}"        onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input class="input-ca" type="number" value="${toFL2(x.moi)}"              id="moi${x.id}"              onkeydown="inputNewValue(event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center">${fEur000(x.precio_padre_mas_gastos)}</td>
            <td class="border px-2 py-1 text-center">${fEur000(x.final_coste_act)}</td>
            <td class="border px-2 py-1 text-center">${fEur000(x.final_coste_mas1)}</td>
            <td class="border px-2 py-1 text-center">${fEur000(x.final_coste_mas2)}</td>
            <td class="border px-2 py-1 text-center">${fEur000(x.final_coste_mas3)}</td>
        </tr>`;
    })

    let tableCosts = `<div class="table-container">
        <table class="styled-table-ca">
            <thead>
                <tr>
                    <th class="topLeft">Código</th>
                    <th>Descripcion</th>
                    <th>€/Kg Act.</th>
                    <th>€/kg F/M</th>
                    <th>Rend.</th>
                    <th>M/Prima Act.</th>
                    <th>Aceite</th>
                    <th>Servicio</th>
                    <th>Aditivo</th>
                    <th>MOD</th>
                    <th>Embalaje</th>
                    <th>Amort.</th>
                    <th>MOI</th>
                    <th>€/Kg C/G Act.</th>
                    <th id="date0">Fin mes</th>
                    <th id="date1">+1</th>
                    <th id="date2">+2</th>
                    <th id="date3" class="topRight">+3</th>    
                </tr>
            </thead>
            <tbody>${tBody}</tbody>
        </table>
    </div>`;
    if(document.getElementById('costes_art_content')) document.getElementById('costes_art_content').innerHTML = tableCosts;
    
    getNextMonthsCosts();
}


function changeFocus(){
    // window.addEventListener("focus", () => {
    //     console.log("🔵 La ventana volvió a tener foco");
    //     renderArtTable();
    // });

    // window.addEventListener("blur", () => {
    //     console.log("⚪ La ventana perdió el foco");
    //     setTimeout(() => { renderArtTable(); }, 3000);
    // });
}