function comprasProyeccionListadoFamiliasInit(){
    document.title = 'Proyección listado de familias-artículos';
     document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="addFamiliaCPLF()">➕ Añadir Familia </span>
    `;

    getFamiliasArticulosCPLF();
}

function addFamiliaCPLF(){
    let familyName = prompt('Añadir Familia \n Indique el nombre de la familia');
    if(familyName){
        suzdalenkoPost('compras/put/0/0/save_entity_proyeccion/', {'action': 'crear-familia', 'entity':'familia', 'name': familyName.toUpperCase(), 'familia_id': 0, 'id': 0}, (res) => { getFamiliasArticulosCPLF(); });
    }
}

function openFormNewArtCPLF(famId, famName){
    let artCode = prompt(`Añadir artículo a la familia ${famName} [${famId}] \n Inserte código artículo Libra`);
    if(artCode){
        suzdalenkoPost('compras/put/0/0/save_entity_proyeccion/', {'action': 'familia-add-articulo', 'entity':'articulo', 'name': '', 'familia_id': famId, 'id': artCode}, (res) => { 
            getFamiliasArticulosCPLF(); 
            suzdalenkoGet(`compras/put/0/0/recalculo_jjavier/?codigo=${artCode}`, r => {;});
            // recalcular padre
        });
    }
}

function openTableViewCPLF(family_id){
    window.open(`/dashboard/proyeccion-compras?familia_id=${family_id}`, '_self');
}

function getFamiliasArticulosCPLF(){
    suzdalenkoGet('compras/get/0/0/get_familias_articulos/', (r) => {
        if(r && r.data && r.data.familias && r.data.familias.length){
            let htmlFam = '';
            r.data.familias.map(fam => {
                htmlFam += `<tr>

                                <td class="border px-2 py-1 text-left hovered" onclick="openTableViewCPLF(${fam.id})">🔗 ${fam.descripcion}</td>
                                <td class="border px-2 py-1 text-center hovered" onclick="famCPLFPress(${fam.id}, '${fam.descripcion}')">✏️ </td>
                                <td class="border px-2 py-1 text-center hovered" onclick="openFormNewArtCPLF(${fam.id}, '${fam.descripcion}')">➕ </td>
                            </tr>`;
            });
            document.getElementById('familiaCPLF').innerHTML = htmlFam;
        } else {
            document.getElementById('familiaCPLF').innerHTML = 'Familias no encotradas';
        }
        if(r && r.data && r.data.articulos && r.data.articulos.length){
            let htmlArt = '';
            
            r.data.articulos.map(a => {
                htmlArt += `<tr>
                                <td class="border px-2 py-1 text-left hovered" onclick="openTableViewCPLF(${a.familia_id})">🔗 ${a.familia_descripcion}</td>
                                <td class="border px-2 py-1 text-center">${a.codigo}</td>
                                <td class="border px-2 py-1 text-left">${a.articulo_descripcion}</td> 
                                <td class="border px-2 py-1 text-center hovered" onclick="deleteArtCPLF(${a.familia_id}, ${a.articulo_id}, '${a.codigo}', '${a.articulo_descripcion}')">🗑️</td>
                                <td class="border px-2 py-1 text-center hovered" onclick="addEquivalenteCPLF('${a.familia_descripcion}', ${a.familia_id}, ${a.articulo_id}, ${a.codigo}, '${a.articulo_descripcion}')">➕ Equivalente</td>
                                <td class="border px-2 py-1 text-center"></td>
                                <td class="border px-2 py-1 text-center"></td>
                            </tr>`;
                if(a && a.equiv && a.equiv.length > 0){
                    a.equiv.map(eq => { console.log(eq)
                        htmlArt += `<tr>
                                <td class="border px-2 py-1 text-left"></td>
                                <td class="border px-2 py-1 text-center"></td>
                                <td class="border px-2 py-1 text-left"></td> 
                                <td class="border px-2 py-1 text-center"></td>
                                <td class="border px-2 py-1 text-center"></td>
                                <td class="border px-2 py-1 text-left">${eq.codigo_hijo} ${eq.descrp_hijo}</td>
                                <td class="border px-2 py-1 text-center hovered" onclick="deleteEquivCPLF(${eq.id}, '${eq.descrp_hijo}', '${eq.codigo_hijo}', ${a.codigo})">🗑️</td>
                            </tr>`;
                    });
                }
            });
            document.getElementById('articulosCPLF').innerHTML = htmlArt;
        } else {
            document.getElementById('articulosCPLF').innerHTML = 'Artículos no encontrados';
        }
    });
}

function deleteEquivCPLF(lineId, eqDescr, eqCode, codigo){
    let deleteThis = confirm(`Eliminar equivalente \n ${eqDescr} [${eqCode}]`);
    if(deleteThis){
        suzdalenkoPost('compras/put/0/0/save_entity_proyeccion/', {'action': 'delete-equivalente', 'entity':'articulo', 'name': '', 'familia_id': 0, 'id': lineId}, (res) => { 
            getFamiliasArticulosCPLF();
            suzdalenkoGet(`compras/put/0/0/recalculo_jjavier/?codigo=${codigo}`, r => {;});
        });
    }
}

function addEquivalenteCPLF(familia_descripcion, familia_id, articulo_id, codigo, articulo_descripcion){
    let equivalentCode = prompt(`Añadir artículo equivalente para familia ${familia_descripcion} \n ${articulo_descripcion} [${codigo}] \n Inserte código artículo Libra`);
    if(equivalentCode){
        suzdalenkoPost('compras/put/0/0/save_entity_proyeccion/', {'action': 'creacion-equivalente', 'entity':'articulo', 'name': equivalentCode, 'familia_id': familia_id, 'id': articulo_id}, (res) => { 
            getFamiliasArticulosCPLF();
            suzdalenkoGet(`compras/put/0/0/recalculo_jjavier/?codigo=${codigo}`, r => {;});
        });
    }
}

function famCPLFPress(famId, famDesc){
    let name = prompt('Editar nombre familia '+famDesc, famDesc);
    if(!name) return;
    suzdalenkoPost('compras/put/0/0/save_entity_proyeccion/', {'action': 'update', 'entity':'familia', 'name': name.toUpperCase(), 'familia_id': famId, 'id': 0}, (res) => { getFamiliasArticulosCPLF(); });
}

function deleteArtCPLF(fam_id, art_id, art_code, art_desrip){
    let confirm_delete = confirm(`Eliminar Artículo del cálculo de stock \n ${art_desrip} [${art_code}]`);
    if(confirm_delete){
        suzdalenkoPost('compras/put/0/0/save_entity_proyeccion/', {'action': 'borrar_articulo', 'entity':'articulo', 'name': '', 'familia_id': fam_id, 'id': art_id}, (res) => { getFamiliasArticulosCPLF(); });
    }
}