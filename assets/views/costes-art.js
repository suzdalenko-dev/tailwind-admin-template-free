let excel_all_lines = []

function costesArtInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="addExcelArt()">➕ Añadir artículo </span>
        <span class="b-top-page" onclick="createExcelArtConst()">📥 Excel </span>
        `;
    document.getElementById('tituloArticleCosts').innerHTML = 'Proyección de costes de artículos';

    renderArtTable();
    document.getElementById('addNewArticleForm').style.display = 'none';

    initArticleAddFormData();
}

async function renderArtTable(){
    let tBody = '';
    let lines = await loadData('produccion/get/0/0/get_all_excel_editables_lines/');
    excel_all_lines = lines.data;
    lines.data.map(x => {
        tBody += `<tr>
            <td class="border px-2 py-1 text-center howerA" onclick="openArticleDetail(${x.article_code})" >${x.article_code}</td>
            <td class="border px-2 py-1 text-center howerA" onclick="openArticleDetail(${x.article_code})" >${x.article_name}</td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.rendimiento)}" onkeydown="inputNewValue('rendimiento', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center">${toFL(x.precio_materia_prima)}</td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.precio_aceite)}" onkeydown="inputNewValue('precio_aceite', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.precio_servicios)}"  onkeydown="inputNewValue('precio_servicios', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.aditivos)}" onkeydown="inputNewValue('aditivos', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.mod)}" onkeydown="inputNewValue('mod', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.embalajes)}" onkeydown="inputNewValue('embalajes', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.amort_maq)}" onkeydown="inputNewValue('amort_maq', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center"><input type="number" value="${toFL(x.moi)}" onkeydown="inputNewValue('moi', event, ${x.id})" /></td>
            <td class="border px-2 py-1 text-center">${toFL(x.final_coste_act)}</td>
            <td class="border px-2 py-1 text-center">${toFL(x.final_coste_mas1)}</td>
            <td class="border px-2 py-1 text-center">${toFL(x.final_coste_mas2)}</td>
            <td class="border px-2 py-1 text-center">${toFL(x.final_coste_mas3)}</td>
        </tr>`;
    })

    let tableCosts = `<div class="table-container">
        <table class="styled-table">
            <thead>
                <tr class="twcolor">
                    <th>Código</th>
                    <th>Descripcion</th>
                    <th>Rend.</th>
                    <th>Mat. prima</th>
                    <th>Aceite</th>
                    <th>Servicio</th>
                    <th>Aditivo</th>
                    <th>MOD</th>
                    <th>Embalaje</th>
                    <th>Amort.</th>
                    <th>MOI</th>
                    <th id="date0">Fin mes</th>
                    <th id="date1">+1</th>
                    <th id="date2">+2</th>
                    <th id="date3">+3</th>    
                </tr>
            </thead>
            <tbody>${tBody}</tbody>
        </table>
    </div>`;


    document.getElementById('costes_art_content').innerHTML = tableCosts;
    getNextMonthsCosts();
    setDefaulContentToLocalStorage();
}

function inputNewValue(field, event, lineId){
    if (event.key === 'Enter') {
        let formData = new FormData();
            formData.append('id', lineId);
            formData.append('value', event.target.value);
            formData.append('field', field);
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
    window.location.href = url;
    loadView('detalle-articulo-costes');
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

    const header = ["Código", "Descripción", "Rend.", "Mat. prima", "Aceite", "Servicio","Aditivo", "MOD", "Embalaje", "Amort.", "MOI", ...months];

    // Crear las filas de datos
    const rows = excel_all_lines.map(item => [
        item.article_code,
        item.article_name.trim(),
        item.rendimiento ?? "",
        toFL(item.precio_materia_prima) ?? "",
        item.precio_aceite ?? "",
        item.precio_servicios ?? "",
        item.aditivos ?? "",
        item.mod ?? "",
        item.embalajes ?? "",
        item.amort_maq ?? "",
        item.moi ?? "",
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
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}__${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}}`;
    const filename = `costes_${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
}
