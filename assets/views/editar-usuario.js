let user_idEU;
let user_nameEU;
function editarUsuarioInit(){
    document.getElementById('slugTitle').innerHTML = '';
    
    let allEU = parseHashRoute();
    user_idEU = allEU.params.id;
    user_nameEU = allEU.params.name;

    document.title = 'Editar usuario '+user_nameEU;

    if(window.localStorage.getItem('password') && window.localStorage.getItem('action_pass') && window.localStorage.getItem('username') == 'admin'){
        getfAU();
    } else {
        showM('Sin permisos', 'error');
    }
}

function getfAU(){
    let formData = new FormData();
    formData.append('action', 'get_user');
    formData.append('id', user_idEU);
    formData.append('name', user_nameEU);
    fetch(HTTP_HOST+'froxa/login/', {method: 'POST', body: formData}).then(r => r.json()).then(r => {
        if(r && r.data && r.data.user && r.data.user[0] && r.data.user[0].id){
            console.log(r.data.user[0])
            document.getElementById('user_name_eu').value = r.data.user[0].name;
            document.getElementById('user_password_eu').value = r.data.user[0].password;
            document.getElementById('user_role_eu').value = r.data.user[0].role;
            document.getElementById('user_permissions_eu').value = r.data.user[0].permissions;
            document.getElementById('user_action_pass_eu').value = r.data.user[0].action_pass;
        }
    }).catch(e => {
        showM(e, 'error');
    })
}