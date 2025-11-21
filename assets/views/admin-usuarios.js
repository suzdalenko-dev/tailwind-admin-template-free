function adminUsuariosInit(){
    document.getElementById('slugTitle').innerHTML = '';
    document.title = "Usuarios";

    getAU();
}

function getAU(){
    document.getElementById('tableAU').innerHTML = 'Cargando..'
    let formData = new FormData();
    formData.append('action', 'consult_users')
    fetch(HTTP_HOST+'froxa/login/', {method:'POST', body: formData}).then(r => r.json()).then(r => {
        let html = '';
        r.data.all_users.map(u => {
            html += `<tr>
                <td class="border px-2 py-1 text-center" onclick="openUsersAU(${u.id}, '${u.name}')"><b class="color_blue">${u.name}</b></td>
                <td class="border px-2 py-1 text-center">${u.role}</td>
                <td class="border px-2 py-1 text-center">${u.last_visit}</td>
                <td class="border px-2 py-1 text-center">${u.num_visit}</td>
            </tr>`;
        });
        document.getElementById('tableAU').innerHTML = html;
    }).catch(e => {
        showM(e, 'error');
    })
}

function openUsersAU(user_id, user_name){
    if(window.localStorage.getItem('password') && window.localStorage.getItem('action_pass') && window.localStorage.getItem('username') == 'admin' && window.localStorage.getItem('password') == window.localStorage.getItem('action_pass')){
        let showUserData = confirm('¿Acceder a datos sensibles del usuario?')
        if(showUserData){
            window.open('/dashboard/#editar-usuario?id='+user_id+'&name='+user_name)
        }
    } else {
        showM('No tienes suficientes permisos..', 'warning');
    }
    
   
}