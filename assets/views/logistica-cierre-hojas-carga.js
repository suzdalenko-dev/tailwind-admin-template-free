let fechaDesde;
let fechaHasta;

function logisticaCierreHojasCargaInit(){
    document.title = 'Repaso de cierre de hojas de carga';
    document.getElementById('slugTitle').innerHTML = '';

    fechaDesde = getTodayDate();
    fechaHasta = getTodayDate();

    initLCHC();
}

function initLCHC(){
    document.getElementById('inputFromLCHC').value = fechaDesde;
    document.getElementById('inputToLCHC').value   = fechaHasta;
    document.getElementById('tableLCJC').innerHTML = '<br>Cargando datos..';
}