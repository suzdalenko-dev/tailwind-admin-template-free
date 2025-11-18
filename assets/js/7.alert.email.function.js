async function alertEmailFunction(view){
    let emailsData      = await resqueAlertEmail(view);
    let userName        = window.localStorage.getItem('username');
    let textAreaEnabled = 'disabled';
    let emailButton     = '';
    if(userName == 'alexey'|| userName == 'admin'){
        textAreaEnabled = '';
        emailButton     = `<div class="flex justify-end mt-3"><button onclick="saveUsersEmail('${view}')" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm shadow" >Guardar correos</button></div>`;
    }

    let htmlEmailAlert = document.getElementById('html_email_alert');
    if(htmlEmailAlert){
        htmlEmailAlert.innerHTML = `<div>
                <h2 class="text-lg font-semibold mb-2 flex items-center gap-2">📧 Correos de aviso</h2>
                <p class="text-xs text-gray-600 mb-2">
                    Introduce uno o varios correos separados por punto y coma.<br>
                    Estos correos recibirán una alerta semanal por artículo, cuando un artículo esté por debajo del stock de seguridad.
                </p>
                <textarea id="emailsAviso7" class="w-full h-32 border rounded p-2 text-sm focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none" placeholder="ejemplo@empresa.com;otro@dominio.com" ${textAreaEnabled}>${emailsData}</textarea>
                ${emailButton}
            </div>`;
    }
}


function saveUsersEmail(view){
    let userName        = window.localStorage.getItem('username');
    let emailsAviso7    = document.getElementById('emailsAviso7').value;
    if((userName == 'alexey'|| userName == 'admin') && emailsAviso7){
        let formData = new FormData();
            formData.append('emails', emailsAviso7)
        fetch(HTTP_HOST+'produccion/save/'+view+'/0/get_set_alert_emails/', {method: 'POST', body: formData}).then(r => r.json()).then(r => {
            window.location.reload();
        }).catch(e => {
            showM(e, 'error');
        });
    }
}


async function resqueAlertEmail(view){
    let res = await fetch(HTTP_HOST+'produccion/get/'+view+'/0/get_set_alert_emails/')
    res = await res.json();
    if(res && res.data && res.data.res && res.data.res[0] && res.data.res[0].emails){ return res.data.res[0].emails; }
    return '';
}