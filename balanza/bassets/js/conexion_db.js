/* ------------------------------------------------------
           1. FECHA ACTUAL + AUTO-REFRESCAR CADA MINUTO
------------------------------------------------------ */

function actualizarFecha() {
    const f = new Date();
    const opciones = {weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'};

    document.getElementById("fecha").textContent = f.toLocaleDateString('es-ES', opciones);
}

actualizarFecha();

function actualizarTipoMerma() {
    fetch(HTTP_HOST+"produccion/get/0/0/balanza_get_mermas/").then(r => r.json()).then(r => {
        if(r && r.data && r.data.mermas && r.data.mermas.length > 0){
            let select = document.getElementById("tipo_merma");
            select.innerHTML = '<option value="" disabled selected class="size18">Seleccione tipo de merma</option>';
            r.data.mermas.forEach(m => {
                select.innerHTML += `<option value="${m.codigo}" class="size18">${m.descripcion}</option>`;
            });
        }
    });
}

actualizarTipoMerma();

setInterval(actualizarFecha, 60000);
let clickAction = 0;

/* ------------------------------------------------------
    2. GUARDAR EN BACKEND
------------------------------------------------------ */
function guardarLineasMerma() {
    if(clickAction == 1){
        return;
    }
    clickAction = 1;

    let tipo_merma = document.getElementById('tipo_merma').value;
    let autos      = document.querySelectorAll("#inputs_automaticos input");
    let listaPesos = [];
    autos.forEach(inp => {
        let valor = inp.value.trim();
        if (valor !== "") listaPesos.push(valor);
    });
    let pesoManual = document.getElementById("peso_manual").value.trim();

    if((tipo_merma && pesoManual && pesoManual != 0) || (tipo_merma && listaPesos.length > 0)){

    } else {
        showM('Rellene el formulario !!!', 'warning');
        clickAction = 0;
        return;
    }
    

    listaPesos = [];
    autos      = document.querySelectorAll("#inputs_automaticos input");
    autos.forEach(inp => {
        let valor = inp.value.trim();
        if (valor != "") listaPesos.push(valor);
    });

    let formData = new FormData();
    listaPesos.forEach(p => {
        formData.append("pesos_auto[]", p);
    });
    formData.append("peso_manual", pesoManual);
    formData.append("tipo_merma", tipo_merma);

    if((tipo_merma && pesoManual) || (tipo_merma && listaPesos.length > 0)){
        fetch(HTTP_HOST+"produccion/put/0/0/balanza_save_weight/", {method: "POST", body: formData,}).then(r => r.json()).then(r => { console.log(r)
            if (r.data && r.data.guardados && r.data.guardados > 0) {
                showM('Guardado correctamente');
                listaPesos = null;
                document.getElementById('tipo_merma').value             = '';
                document.getElementById('inputs_automaticos').innerHTML = '';
                document.getElementById('peso_manual').value            = '';
                clickAction = 0;
            } else {
                showM("Error al guardar", 'error');
                clickAction = 0;
            }
            loadTodaDate();
        }).catch(e => {
            showM("Error de red: " + e, 'error');
            clickAction = 0;
            loadTodaDate();
        });
    } else {
        showM('Rellene el formulario', 'warning');
        clickAction = 0;
        loadTodaDate();
    }

    
}
