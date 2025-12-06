function conexionInternet(){
    fetch('https://informes.froxa.net/balanza.php').then(r => r.json()).then(r => {
        if(r && r.conexion){
            document.getElementById('con_internet').innerHTML = '🟢';
        } else {
            document.getElementById('con_internet').innerHTML = '🔴';
        }
    }).catch( e =>{
        document.getElementById('con_internet').innerHTML = '🔴';
    });
}

function conexionDjango(){
    fetch(HTTP_HOST+'produccion/get/0/0/balanza_get_con/').then(r => r.json()).then(r => { 
        if(r && r.data && r.data.conexion){
            document.getElementById('con_django').innerHTML = '🟢';
        } else {
            document.getElementById('con_django').innerHTML = '🔴';
        }
    }).catch( e =>{
        document.getElementById('con_django').innerHTML = '🔴';
    });
}

function conexionWsSocket(){
    if(CON_WS_SOCKET == 1){
        document.getElementById('con_ws_socket').innerHTML = '🟢';
    } else {
        document.getElementById('con_ws_socket').innerHTML = '🔴';
    }
}

function conexionBalanza(){
    if(CON_BALANZA == 1){
        document.getElementById('con_balanza').innerHTML = '🟢';
    } else {
        document.getElementById('con_balanza').innerHTML = '🔴';
    }
}

setInterval(() => {
    conexionInternet();
    conexionDjango();
    conexionWsSocket();
    conexionBalanza();
}, 222000);

conexionInternet();
conexionDjango();
conexionWsSocket();
conexionBalanza();

setTimeout(() => {
    conexionInternet();
    conexionDjango();
    conexionWsSocket();
    conexionBalanza();
}, 11000);