let PARENT_ARTICLE = 0;
let DC_DATA        = [];


function detalleArticuloCostesInit(){
    if(document.getElementById('slugTitle')){ document.getElementById('slugTitle').innerHTML = ''; }

    let artCode = parseHashRoute();
    artCode = artCode.params.codigo;
    document.title = 'Detalle artículo costes: ' + artCode;

    fetch(HTTP_HOST+'produccion/get/0/0/get_datail_art_cost/?code='+artCode).then(r => r.json()).then(r => {
        if(r && r.data && r.data.artHead && r.data.artHead[0]){
            DC_DATA = r.data;
            let artHead = r.data.artHead[0];
                PARENT_ARTICLE = artHead.article_code;
                let articleCodeId = document.getElementById('articleCodeId')
                if(articleCodeId) document.getElementById('articleCodeId').value = PARENT_ARTICLE;
                let descripcionCodeId = document.getElementById('descripcionCodeId')
                if(descripcionCodeId) document.getElementById('descripcionCodeId').value = artHead.article_name;
                showDetailCode();
        } else {
            showM('e6 '+'Error', 'error artHead');
           
        }
        if(r && r.data && r.data.artLines){
            writeIgnredients(r.data.artLines);
        }
    }).catch(e => {
        showM('e7 '+e, 'error');
       
    });

    fetch(HTTP_HOST+'produccion/get/0/0/get_articles_libra/' ).then(r => r.json()).then(r => {
        LIST_ARTICLES = r.data;
    }).catch(e => {
        showM('e8 '+e, 'error');
    });
}


function writeIgnredients(artLines){
    let listadoLineas = document.getElementById('listadoLineas')
    let htmlContent   = '';
    let sumPercentage = 0;

    artLines.map(x => {
        let htmlAlternative = ''
        let alternative = JSON.parse(x.alternative);
        if(alternative){
            alternative.map(a => {
                htmlAlternative += `<div>Código: ${a.code}, Descripción:  ${a.name} <span class="howerA" onclick="deleteAltItem(${x.id}, ${a.code})">🗑️</span></div>`;
            });
        }
        if(htmlAlternative){
            htmlAlternative = `<div class="text-md ml-1">Alternativas: ${htmlAlternative}</div>`;
        }

        sumPercentage += x.percentage;

        htmlContent += `<div class="flex items-center gap-2">
                            <input type="text" placeholder="Código" value="${x.article_code}" class="border px-2 py-1 rounded w-1/4" disabled />
                            <input type="text" placeholder="Descripción" value="${x.article_name}" class="border px-2 py-1 rounded w-2/4" disabled />
                            <input type="number" placeholder="Porcentaje" value="${x.percentage}" class="border px-2 py-1 rounded w-1/4" onkeydown="changeLinePorcent(event, ${x.id})" />
                            <button class="text-md text-blue-900 whitespace-nowrap" onclick="addAlternativeArtCosts(${x.id})">➕ Añad.</button>
                            <button class="text-md text-blue-900 whitespace-nowrap" onclick="deleteArtCostsLine(${x.id})">🗑️ Elem.</button>
                        </div>
                        <div id="insertInputAlt_${x.id}"></div>
                        ${htmlAlternative}
                        <br><hr /><br>`;
    });
    listadoLineas.innerHTML = htmlContent;
    let perSpan = document.getElementById('perSpan');
    if(perSpan) perSpan.innerHTML = `Insertar ingredientes y porcentajes ${sumPercentage} %`;
}


function addNewLineFuncion(){
    let newDiv = document.createElement('div');
    let lineNewHtml = `<div class="flex items-center gap-2">
                            <input type="text" placeholder="Descripción nuevo ingrediente" value="" class="border px-2 py-1 rounded w-2/4" oninput="changeLineImp(event, 0, 0)" />
                        </div><br>`
    newDiv.innerHTML = lineNewHtml;
    let listadoLineas = document.getElementById('listadoLineas');
    listadoLineas.appendChild(newDiv)
}


function changeLineImp(event, numLin, lineId){
    let suggestionsList2 = document.getElementById('suggestionsList2');

    let query = event.target.value.toLowerCase();
    if (query) {
        let filteredList = LIST_ARTICLES.filter(item =>  item.CODIGO_ARTICULO.toLowerCase().includes(query) || item.DESCRIP_COMERCIAL.toLowerCase().includes(query));
        if(filteredList.length > 0) {  suggestionsList2.innerHTML = ''; }
     
        for(let y = 0; y < 22; y++){
            let item = filteredList[y];
            let listItem = document.createElement("li");
            listItem.textContent = item.CODIGO_ARTICULO + " " + item.DESCRIP_COMERCIAL;
            suggestionsList2.appendChild(listItem);
            listItem.addEventListener('click', () => {
               saveNewIngredient(item.CODIGO_ARTICULO, item.DESCRIP_COMERCIAL);
            });
        }
    } else {
        suggestionsList2.innerHTML = '';
    }
}

function saveNewIngredient(code, name){
    let formData = new FormData();
        formData.append('parent', PARENT_ARTICLE)
        formData.append('code', code);
        formData.append('name', name);
    fetch(HTTP_HOST+'produccion/get/0/0/save_new_ingrediente_line/', {method:'POST', body:formData}).then(r => r.json()).then(r => {
         document.getElementById('suggestionsList2').innerHTML = ''
        detalleArticuloCostesInit();
    }).catch(e => {
        showM('e9 '+e, 'error');
    })
}


function deleteArtCostsLine(x){
    let confDel = confirm('¿Eliminar?')
    if (confDel){
        fetch(HTTP_HOST+'produccion/get/0/0/delete_ingrediente_line/?id='+x).then(r => r.json()).then(r => {
            detalleArticuloCostesInit();
        }).catch(e => {
            showM('e10 '+e, 'error');
        })
    }
}


function addAlternativeArtCosts(x){
    let divInputAlt = document.getElementById('insertInputAlt_'+x)
    divInputAlt.innerHTML = `<input type="text" placeholder="Descripcion" class=" border px-2 py-1 rounded mt-2 input_alt_desc" oninput="addAlternativeArticle(event, ${x})" />`;
 
}


function addAlternativeArticle(event, lineId){
    document.getElementById('suggestionsList2').innerHTML = ''
    let suggestionsList2 = document.getElementById('suggestionsList2');

    let query = event.target.value.toLowerCase();
    if (query) {
        let filteredList = LIST_ARTICLES.filter(item =>  item.CODIGO_ARTICULO.toLowerCase().includes(query) || item.DESCRIP_COMERCIAL.toLowerCase().includes(query));
        if(filteredList.length > 0) {  suggestionsList2.innerHTML = ''; }
     
        for(let y = 0; y < 22; y++){
            let item = filteredList[y];
            let listItem = document.createElement("li");
            listItem.textContent = item.CODIGO_ARTICULO + " " + item.DESCRIP_COMERCIAL;
            suggestionsList2.appendChild(listItem);
            listItem.addEventListener('click', () => {
               saveIngredienteAlternativeArt(lineId, item.CODIGO_ARTICULO, item.DESCRIP_COMERCIAL);
            });
        }
    } else {
        suggestionsList2.innerHTML = '';
    }
}


function saveIngredienteAlternativeArt(lineCostsId, code, name){
    let formData = new FormData();
        formData.append('line_cost_id', lineCostsId)
        formData.append('code', code);
        formData.append('name', name);
    fetch(HTTP_HOST+'produccion/get/0/0/line_costs_save_alternative/', {method:"POST", body:formData}).then(r => r.json()).then(r => {
        document.getElementById('suggestionsList2').innerHTML = ''
        detalleArticuloCostesInit();
    }).catch(e => showM('e11 '+e, 'error'));   
}

function changeLinePorcent(event, lineId){
    if (event.key === 'Enter') {
        let perValue = event.target.value;
        fetch(HTTP_HOST+'produccion/put/0/0/line_costs_update_percentage/?line_id='+lineId+'&value='+perValue).then(r => r.json()).then(r => {
            detalleArticuloCostesInit();
        }).catch(e => {
            showM('e12 '+e, 'error');
        });
    }
}

function deleteAltItem(id, code){
    let deleteAltItem = confirm('¿Eliminar ítem?');
    if(deleteAltItem){
        fetch(HTTP_HOST+'/produccion/put/0/0/line_costs_delete_alternative/?id='+id+'&code='+code).then(r => r.json()).then(r => {
            detalleArticuloCostesInit();
        }).catch(e => {
            showM('e13 '+e, 'error');
        });
    }
}

function deleteArticleCosts(){
    let confirmA = confirm('¿Quitar el artículo de la tabla de costes?');
    if (confirmA) {
         fetch(HTTP_HOST+'/produccion/put/0/0/delete_article_costs_all/?code='+PARENT_ARTICLE).then(r => r.json()).then(r => {
            window.location.href = '/dashboard/#costes-art';
            loadView('costes-art');
        }).catch(e => {
            showM('e14 '+e, 'error');
        });
    }
}

function syntaxHighlight(json) {
  if (typeof json !== "string") {
    json = JSON.stringify(json, null, 2);
  }
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?=:))/g, '<span class="key">$1</span>')  // Keys
    .replace(/(:\s*)"(.*?)"/g, '$1<span class="string">"$2"</span>')                                  // Strings
    .replace(/(:\s*)(\d+(?:\.\d+)?)/g, '$1<span class="number">$2</span>')                             // Numbers
    .replace(/(:\s*)(true|false)/g, '$1<span class="boolean">$2</span>')                               // Booleans
    .replace(/(:\s*)null/g, '$1<span class="null">null</span>');                                       // Nulls
}

function showDetailCode(){
    fetch(HTTP_HOST+'produccion/get/0/0/recalculate_price_projections/?code='+PARENT_ARTICLE).then(response => response.json()).then(data => {
        if(data && data.data && data.data[0] && data.data[0].expediente_sin_precios){
            let textArray =   data.data[0].expediente_sin_precios.join(' ,');
            showM('OJO hay expedientes sin gastos imputados (precio desconocido). Num: '+textArray, 'warning');
        }

        if (Array.isArray(data?.data)) {
            data.data.forEach(articulo => {
              if (Array.isArray(articulo.lineas)) {
                articulo.lineas.forEach(linea => {
                  if (Array.isArray(linea.rango)) {
                    linea.rango.forEach(rango => {
                      rango.consumo = ["ver info_suma_consumo"];
                    });
                  }
                });
              }
            });
          }
    showDetailsDesglose(data.data);
    let html = syntaxHighlight(data.data[0]);
    document.getElementById("jsonContainer").innerHTML = html;
  }); 
}

function showDetailsDesglose(data){
    let desglosePrecios = document.getElementById('desglosePrecios');
    let tContent = '';
    let parent_art_data = data[0];
    let grupos_ingredientes_padre = parent_art_data.lineas;

    grupos_ingredientes_padre.forEach(line => {
        let linePercentage = line.percentage;
        console.log(linePercentage);

        let consisteAlternativos = line.consiste_de_alternativos;
        let resAlter = line.resumen_alternativos;

        tContent += `<tr class="border-t">
                        <td class="px-2 py-2">`;
                        consisteAlternativos.forEach(alterna => { tContent += `Código: ${alterna[0].erp} Stock: ${alterna[0].stock} Precio: ${toFL(alterna[0].precio)} <br>` });     

        tContent += `</td>
                    <td>Precio: ${toFL(resAlter.precio_kg)} x ${linePercentage} %</td>
                    <td>Porcentaje parte: ${toFL(resAlter.parte_proporcional)}</td>
                </tr>`;
    });

    desglosePrecios.innerHTML = tContent;

    let costes_fecha = parent_art_data.costes_fecha;
    if(costes_fecha){
        costes_fecha = costes_fecha[0];
        if(costes_fecha){
            costes_fecha = costes_fecha.inicio_coste_act;
            document.getElementById('currentEndMont').value = toFL(costes_fecha);
        }
    }

    document.getElementById('currentPrice').value = toFL(parent_art_data.precio_padre_act);
}