function produccionOfsNumeroPersonasInit(){
    document.title = 'Número de personas en una OF';

    getONP();
}

function getONP(){
    fetch(HTTP_HOST+'produccion/get/0/0/ofs_personal/').then(r => r.json()).then(r => {
        let html = '';
        r.data.ls.map(x => {
            html += `<tr>
                        <td class="border px-2 py-1 text-center">${formatDateToEuropean(x.fecha)}</td>
                        <td class="border px-2 py-1 text-center">${x.of_id}</td>
                        <td class="border px-2 py-1 text-center">${x.of_code}</td>
                        <td class="border px-2 py-1 text-left">${x.of_desc}</td>
                        <td class="border px-2 py-1 text-center"><input id="input_turno1_${x.id}" class="center_text" type="number" value="${x.turno1 != 0 ? x.turno1 : ''}" onkeydown="saveOnEnterONP(event, ${x.id})" /></td>
                        <td class="border px-2 py-1 text-center"><input id="input_turno2_${x.id}" class="center_text" type="number" value="${x.turno2 != 0 ? x.turno2 : ''}" onkeydown="saveOnEnterONP(event, ${x.id})" /></td>
                        <td class="border px-2 py-1 text-center"><input id="input_turno3_${x.id}" class="center_text" type="number" value="${x.turno3 != 0 ? x.turno3 : ''}" onkeydown="saveOnEnterONP(event, ${x.id})" /></td>
                    </tr>`
            });
        document.getElementById('tableONP').innerHTML = html;
    }).catch(e => {
        showM(e, 'error');
        document.getElementById('tableONP').innerHTML = '<br>'+e;
    })
}

function saveOnEnterONP(event, id) {
    if (event.key !== 'Enter') return;

    let fm = new FormData();
        fm.append('id', id);
        fm.append('turno1', document.getElementById('input_turno1_'+id).value);
        fm.append('turno2', document.getElementById('input_turno2_'+id).value);
        fm.append('turno3', document.getElementById('input_turno3_'+id).value);
        
    fetch(HTTP_HOST + 'produccion/post/0/0/ofs_personal_save/', {method: 'POST', body: fm}).then(r => r.json()).then(r => {
        getONP();
    }).catch(e => {
        showM('Error al guardar', 'error');
        getONP();
        console.error(e);
    });
}
