var allLinesCLC = [];

function comprasLlegadasContenedoresInit(){
    document.getElementById('slugTitle').innerHTML = `
        <span class="b-top-page" onclick="createExcelAllArrivals()">📥 Excel </span>
        <span class="b-top-page" onclick="createPDFArrivals()">📄 PDF </span>
    `;
    document.title = "LLegada de los contenedores";

    setInputDate();
    setSearchedDate();
    setCheckedSituation();
    getAllContainer();
}
/* 1. trabajo con fechas */
function setInputDate(){
    let firstDataInput = document.getElementById('firstDataInput');
    let secondDataInput = document.getElementById('secondDataInput');

    if(window.localStorage.getItem('first_date')){
        firstDataInput.value = window.localStorage.getItem('first_date');
    } else {
        firstDataInput.value = addMonthsFunc(-11);
        window.localStorage.setItem('first_date', addMonthsFunc(-11));
    }

    if(window.localStorage.getItem('second_date')){
        secondDataInput.value = window.localStorage.getItem('second_date');
    } else {
        secondDataInput.value = addMonthsFunc(11);
        window.localStorage.setItem('second_date', addMonthsFunc(11));
    }
}

function firstDateChange(event){
    let firstDate = event.target.value;
    window.localStorage.setItem('first_date', firstDate);
    getAllContainer();
}

function secondDateChange(event){
    let secondDate = event.target.value;
    window.localStorage.setItem('second_date', secondDate);
    getAllContainer();
}

/* 2. trabajo de busqueda */
function setSearchedDate(){
    let searchInputL = document.getElementById('searchInputL');
    searchInputL.value = window.localStorage.getItem('searched_line') || '';
}

function changeSearchedInput(event){
    let searched = event.target.value.trim();
    window.localStorage.setItem('searched_line', searched);
    show2Tables();
}

function clickBroom(){
    document.getElementById('searchInputL').value = '';
    window.localStorage.setItem('searched_line', '');
    show2Tables();
}

/* 3. checkboks agrupado */
function setCheckedSituation(){
    let checckGroup = document.getElementById('checckGroup');
    let situation_checked = window.localStorage.getItem('situation_checked') || 'no';
    if(situation_checked == 'si'){
        checckGroup.checked  = true;
        document.getElementById('normal_table').style.display = 'none';
        document.getElementById('grouped_table').style.display = 'block';
    } else {
        checckGroup.checked = false;
        document.getElementById('normal_table').style.display = 'block';
        document.getElementById('grouped_table').style.display = 'none';
    }
}
function inputGroupChanged(){
    let situation_checked = window.localStorage.getItem('situation_checked') || 'no';
    let checckGroup = document.getElementById('checckGroup');
    if(situation_checked == 'si'){
        window.localStorage.setItem('situation_checked', 'no');
        checckGroup.checked = false;
        document.getElementById('normal_table').style.display = 'block';
        document.getElementById('grouped_table').style.display = 'none';
    } else {
        window.localStorage.setItem('situation_checked', 'si');
        checckGroup.checked  = true;
        document.getElementById('normal_table').style.display = 'none';
        document.getElementById('grouped_table').style.display = 'block';
    }
}

/* 4. traer datos */
function getAllContainer(){
    let first  = window.localStorage.getItem('first_date');
    let second = window.localStorage.getItem('second_date');
    fetch(HTTP_HOST+`compras/get/0/0/latest_arrivals_katerina/?first=${first}&second=${second}`).then(r => r.json()).then(r => {
        allLinesCLC = r;
        show2Tables();
    }).catch(e => {
        // alert('err1 ' +e);
    });
};

function show2Tables(){
    // NORMAL TABLE
    let inputValue    = window.localStorage.getItem('searched_line') || false;
    let htmlNormal    = '';
    let oldContainer  = '';
    let oldExpediente = '';
    let brInserted    = '';
    let r            = allLinesCLC;
    
    if(r && r.data && r.data.epr && r.data.epr.length > 0){
        for (let y of r.data.epr) {
            if(inputValue){
                let lineData = y.ARTICULO+y.DESCRIP_COMERCIAL+y.CONTENEDOR+y.CANTIDAD+y.PRECIO+y.VALOR_CAMBIO+y.CONSTE_C_G_EUR+y.ORIGEN+y.FECHA_PREV_LLEGADA+y.D_PLANTILLA+y.COD_PROV+y.PROVEEDOR_D+y.NUM_EXPEDIENTE;
                if(!lineData.includes(inputValue)){
                    continue
                }
            }
            
            brInserted = '';
            if (oldContainer != '' && oldContainer != y.CONTENEDOR){ htmlNormal += `<br>`; brInserted = 'yes'; }
            if(brInserted != 'yes' && oldExpediente != '' && oldExpediente != y.NUM_EXPEDIENTE){ htmlNormal += `<br>`; }
            oldContainer  = y.CONTENEDOR;
            oldExpediente = y.NUM_EXPEDIENTE;
            

            htmlNormal += `<tr>
                <td class="border px-2 py-1 text-center">${y.ARTICULO}</td>
                <td class="border px-2 py-1 text-letf">${y.DESCRIP_COMERCIAL.slice(0, 33)}</td>
                <td class="border px-2 py-1 text-letf"></td>
                <td class="border px-2 py-1 text-letf">${y.CONTENEDOR}</td>
                <td class="border px-2 py-1 text-letf">${fEurEntero(y.CANTIDAD)}</td>
                <td class="border px-2 py-1 text-letf">${fEur000(y.PRECIO)}</td>
                <td class="border px-2 py-1 text-left">${fEur0000(y.VALOR_CAMBIO)}</td>
                <td class="border px-2 py-1 text-letf">${fEur000(y.CONSTE_C_G_EUR)}</td>
                <td class="border px-2 py-1 text-letf">${y.ORIGEN}</td>
                <td class="border px-2 py-1 text-letf">${fLDate(y.FECHA_PREV_LLEGADA)}</td>
                <td class="border px-2 py-1 text-letf">${replaceEntr(y.D_PLANTILLA)}</td>
                <td class="border px-2 py-1 text-letf">${y.COD_PROV} ${y.PROVEEDOR_D.slice(0, 22)}</td>
                <td class="border px-2 py-1 text-letf"></td>
                <td class="border px-2 py-1 text-letf"></td>
                <td class="border px-2 py-1 text-letf">${y.NUM_EXPEDIENTE}</td>
            </tr>`;
        };
    }
    document.getElementById('tableNormal').innerHTML = htmlNormal;


    // GROUPED TABLE


    let htmlGrouped = '';
    let situacionContinue = '';
    let expedNum    = '';
    if(r && r.data && r.data.grouped && r.data.grouped.length > 0){
        r.data.grouped.map(x => {
            if(x && x.lines && x.lines.length > 0){
                for (let y of x.lines) {
                    if(inputValue){
                        situacionContinue = '';
                        let lineData = y.ARTICULO+y.DESCRIP_COMERCIAL+y.CONTENEDOR+y.CANTIDAD+y.PRECIO+y.VALOR_CAMBIO+y.CONSTE_C_G_EUR+y.ORIGEN+y.FECHA_PREV_LLEGADA+y.D_PLANTILLA+y.COD_PROV+y.PROVEEDOR_D+y.NUM_EXPEDIENTE;
                        if(!lineData.includes(inputValue)){
                            situacionContinue = 'continue';
                            continue
                        }
                    }
                    expedNum = y.NUM_EXPEDIENTE;
                    htmlGrouped += `<tr>
                        <td class="border px-2 py-1 text-center">${y.ARTICULO}</td>
                        <td class="border px-2 py-1 text-letf">${y.DESCRIP_COMERCIAL.slice(0, 33)}</td>
                        <td class="border px-2 py-1 text-letf"></td>
                        <td class="border px-2 py-1 text-letf">${y.CONTENEDOR}</td>
                        <td class="border px-2 py-1 text-letf">${fEurEntero(y.CANTIDAD)}</td>
                        <td class="border px-2 py-1 text-letf">${fEur000(y.PRECIO)}</td>
                        <td class="border px-2 py-1 text-left">${fEur0000(y.VALOR_CAMBIO)}</td>
                        <td class="border px-2 py-1 text-letf">${fEur000(y.CONSTE_C_G_EUR)}</td>
                        <td class="border px-2 py-1 text-letf">${y.ORIGEN}</td>
                        
                        <td class="border px-2 py-1 text-letf">${fLDate(y.FECHA_PREV_LLEGADA)}</td>
                        <td class="border px-2 py-1 text-letf">${replaceEntr(y.D_PLANTILLA)}</td>
                        <td class="border px-2 py-1 text-letf">${y.COD_PROV} ${y.PROVEEDOR_D.slice(0, 22)}</td>
                        <td class="border px-2 py-1 text-letf"></td>
                        <td class="border px-2 py-1 text-letf"></td>
                        <td class="border px-2 py-1 text-letf">${y.NUM_EXPEDIENTE}</td>
                    </tr>`;
                    innerExpediente = y.NUM_EXPEDIENTE;
                };
            }
            if(situacionContinue != 'continue'){
                htmlGrouped += `<br> ${expedNum} ${situacionContinue}`;
            }

        });
    }
    document.getElementById('tableGrouped').innerHTML = htmlGrouped;
}