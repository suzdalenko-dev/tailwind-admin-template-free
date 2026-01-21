function produccionOfsNumeroPersonasInit(){
    document.title = 'Número de personas en una OF';

    getONP();
}

function getONP(){
    fetch(HTTP_HOST+'produccion/get/0/0/ofs_personal/').then(r => r.json()).then(r => { console.log(r)
        let html = '';
        r.data.ls.map(x => {
            console.log(x);
            html += `<tr>
                        <td class="border px-2 py-1 text-center">${formatDateToEuropean(x.fecha)}</td>
                        <td class="border px-2 py-1 text-center">${x.of_id}</td>
                        <td class="border px-2 py-1 text-center">${x.of_code}</td>
                        <td class="border px-2 py-1 text-left">${x.of_desc}</td>
                        <td class="border px-2 py-1 text-center"><input class="center_text" type="number" value="${x.turno1 ?? ''}" onkeydown="saveOnEnterONP(event, ${x.id}, 'turno1')" /></td>
                        <td class="border px-2 py-1 text-center"><input class="center_text" type="number" value="${x.turno2 ?? ''}" onkeydown="saveOnEnterONP(event, ${x.id}, 'turno2')" /></td>
                        <td class="border px-2 py-1 text-center"><input class="center_text" type="number" value="${x.turno3 ?? ''}" onkeydown="saveOnEnterONP(event, ${x.id}, 'turno3')" /></td>
                    </tr>`
            });
        document.getElementById('tableONP').innerHTML = html;
    }).catch(e => {
        showM(e, 'error');
        document.getElementById('tableONP').innerHTML = '<br>'+e;
    })
}

function saveOnEnterONP(event, id, field) {
    if (event.key !== 'Enter') return;

    const value = event.target.value;

    fetch(HTTP_HOST + 'produccion/post/0/0/ofs_personal_save/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({id: id, field: field, value: value })
    })
    .then(r => r.json())
    .then(r => {
        getONP();
    })
    .catch(e => {
        showM('Error al guardar', 'error');
        getONP();
        console.error(e);
    });
}
