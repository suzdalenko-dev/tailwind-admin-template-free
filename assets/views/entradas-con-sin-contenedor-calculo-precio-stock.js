let arrivalSearched = '';
let ARRIVALS_LIST   = [];

async function entradasConSinContenedorCalculoPrecioStockInit(){
    document.getElementById('slugTitle').innerHTML = '';

    initArrArticle();
    await getInsertDataTable();
}

function initArrArticle(){
    arrivalSearched = window.localStorage.getItem('buscar_llegadas') || '';
    document.getElementById('searchArticleArr').value = arrivalSearched;
}
function cleanArticleArr(){
    arrivalSearched = '';
    document.getElementById('searchArticleArr').value = arrivalSearched;
    window.localStorage.setItem('buscar_llegadas', '');
    paintArrivalTable();
}
// function changeSearchedArribals(event){
//     let inputValue = document.getElementById('searchArticleArr').value.trim();
//     arrivalSearched = inputValue;
//     window.localStorage.setItem('buscar_llegadas', inputValue); console.log()
//     paintArrivalTable();
// }
function changeSearchedArribals(event){
    let inputValue = document.getElementById('searchArticleArr').value.trim();
    arrivalSearched = inputValue;
    window.localStorage.setItem('buscar_llegadas', inputValue);
    if ('requestIdleCallback' in window) { requestIdleCallback(() => paintArrivalTable());
    } else { setTimeout(() => paintArrivalTable(), 0); }
}


async function getInsertDataTable(){
    let arrivals = await loadData('produccion/get/0/0/embarcado_get_all/');
    ARRIVALS_LIST = arrivals.data;
    paintArrivalTable();
}

function paintArrivalTable(){
    let arrivalsWitchwitchout = document.getElementById('arrivalsWitchwitchout');
    let tBody   = '';
    let newName = '';
    let strVal  = '';
    let calcKg  = '';
    let filteredArray = [];
    if (arrivalSearched) { filteredArray = ARRIVALS_LIST.filter(x => String(x.code).includes(arrivalSearched) || String(x.name).toLowerCase().includes(arrivalSearched.toLowerCase()));
    } else { filteredArray = ARRIVALS_LIST; }

    filteredArray.map(x => {
        if(newName != x.name){
            strVal = `<b>${x.name} ${x.code}</b>`; calcKg = '';
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
    if(arrivalsWitchwitchout) { 
        arrivalsWitchwitchout.innerHTML = html; 
        setDefaulContentToLocalStorage();
    }
}

