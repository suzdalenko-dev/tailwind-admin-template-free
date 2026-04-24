function calidadImantoGestionArticulosInit(){
    document.title = 'Gestion artículos manto';
    document.getElementById('slugTitle').innerHTML = '<span class="b-top-page" onclick="addNewArticleManto()">➕ Añadir Artículo</span>';
    getCIGA();
}

function addNewArticleManto(){
    let code = prompt('¿Añadir artículo? \n Indique el código');
    if(code){
        fetch(HTTP_HOST + 'calidad/add_manto_article/0/0/gestion_articles_manto/?code='+code).then(r => r.json()).then(r =>{
            getCIGA();
        }).catch(e =>{
            showM(e, 'error');
        })
    }
}

function deleteThisMant(code){
    let confirmDelete = confirm('¿Eliminar Artículo '+code+'?');
    if(confirmDelete){
        fetch(HTTP_HOST + 'calidad/delete_mant_item/0/0/gestion_articles_manto/?code='+code).then(r => r.json()).then(r =>{
            getCIGA();
        }).catch(e =>{
            showM(e, 'error');
        })
    }
}

function getCIGA(){
    const table = document.getElementById('tableCIGA');
    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="11" class="border px-2 py-1 text-left">Cargando..</td>
        </tr>
    `;

    fetch(HTTP_HOST + 'calidad/getall/0/0/gestion_articles_manto/')
        .then(r => r.json())
        .then(r => {
            const lines = r?.data?.articles || [];

            if (!Array.isArray(lines) || lines.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="11" class="border px-2 py-1 text-left">No se han encontrado datos</td>
                    </tr>
                `;
                return;
            }
            let html = '';
            lines.forEach(l => {
                html += `
                    <tr>
                        <td class="border text-left px-1">${l.code} ${l.description}</td>
                        <td class="border text-center hovered" onclick="deleteThisMant('${l.code}')">✖</td>
                    </tr>
                `;
            });
            table.innerHTML = html;
        })
        .catch(e => {
            console.error(e);
            table.innerHTML = `
                <tr>
                    <td colspan="11" class="border px-2 py-1 text-left">Error al cargar datos</td>
                </tr>
            `;
            showM('Error al cargar el informe manto', 'error');
        });
}