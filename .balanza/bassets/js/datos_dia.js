function loadTodaDate() {

    fetch(HTTP_HOST + "produccion/get/0/0/balanza_data_day/")
        .then(r => r.json())
        .then(r => {

            document.getElementById('tabla_datos').innerHTML = '';

            if (r && r.data && r.data.registros && r.data.registros.length > 0) {

                let tbody = document.getElementById("tabla_datos");
                document.getElementById('existen_datos_dia').style.display = 'block';
                tbody.innerHTML = "";

                const ahora = Date.now();                 // ahora en ms
                const limite = ahora - (30 * 60 * 1000);  // hace 30 minutos

                r.data.registros.forEach(row => {

                    let accion = 'no';
                    let icono  = '';

                    // Convertir la fecha del registro a timestamp
                    const fechaRegistro = new Date(row.tiempo).getTime();

                    // Solo se muestra la ❌ si el registro es de los últimos 30 minutos
                    if (!isNaN(fechaRegistro) && fechaRegistro >= limite) {
                        accion = 'si';
                        icono  = '❌';
                    }

                    tbody.innerHTML += `
                        <tr class="border-b">
                            <td class="py-2 px-2">${row.tiempo}</td>
                            <td class="py-2 px-2">${row.descripcion}</td>
                            <td class="py-2 px-2 text-right">${row.pesada}</td>
                            <td class="py-2 px-2 hovered" onclick="deleteItemDD(${row.id}, '${accion}')">${icono}</td>
                        </tr>`;
                });
            }
        });
}


loadTodaDate();


function deleteItemDD(id, accion) {
    let confirm_delete = confirm("¿Seguro que quieres eliminar este registro?");
    if (!confirm_delete) { return;}
    if (accion == 'si') {
        fetch(HTTP_HOST + "produccion/delete/0/0/balanza_delete_line/?id="+id).then(r => r.json()).then(r => { 
            if(r && r.data && r.data.deleted && r.data.deleted > 0){
                showM("Registro eliminado correctamente", 'warning');
                loadTodaDate();
            } else {
                showM("No se ha podido eliminar el registro", 'error');
            }
        }).catch(e => {
            showM('2. '+e, 'error');
            loadTodaDate();
        });
    }
    loadTodaDate();
}


function toggleTablaPesadas() {
    let tabla = document.getElementById('tabla_contenedor');
    if (tabla.style.display === 'none') { tabla.style.display = 'block';
    } else { tabla.style.display = 'none'; }
    loadTodaDate();
}
