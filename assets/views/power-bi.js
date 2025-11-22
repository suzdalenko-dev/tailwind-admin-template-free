function powerBiInit(){
    document.getElementById('slugTitle').innerHTML = '';
    let powerBiName = parseHashRoute();
    powerBiName     = powerBiName.params.name || 'None';
    document.title  = powerBiName;

    getReportPBI(powerBiName);
}

function getReportPBI(powerBiName){
    let userName    = window.localStorage.getItem('username') || 'None';
    let password    = window.localStorage.getItem('password') || 'None';
    let userId      = window.localStorage.getItem('user_id') || 'None';
    let userRole    = window.localStorage.getItem('role') || 'None';;
    let formData = new FormData();
        formData.append('report_name', powerBiName);
        formData.append('user_name', userName);
        formData.append('password', password);
        formData.append('user_id', userId);
        formData.append('user_role', userRole);

    fetch(HTTP_HOST+'powerbi/get/0/0/get_custom_report/', {method:'POST', body: formData}).then(r => r.json()).then(r => {
        if(r && r.data && r.data.res){
            let powerBiFrame = document.getElementById('powerBiFrame');
            powerBiFrame.src = r.data.res;
            let h = (window.visualViewport && window.visualViewport.height) ? Math.floor(window.visualViewport.height) : Math.floor(window.innerHeight);
            powerBiFrame.style.height = (h - 70) + 'px';
        } else {
            showM('No hay suficientes permisos', 'warning');
        }
    }).catch(e => {
        showM(e, 'error');
    });
}