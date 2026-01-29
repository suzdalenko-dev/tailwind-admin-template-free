const params = new URLSearchParams(window.location.search);
const FAMILIA_ID = params.get("familia_id");
const CODIGO_ART = params.get("codigo") || '';


function putYellow_kat(x){  
    if (x == 1) return 'yellow_kat';
    else {
        return '';
    }
}

function pressInputEdit(event, id, tipo){
    if(event.key == 'Enter'){
        let val = event.target.value;
        let data = {tipo, id, val}
        suzdalenkoPost('compras/put/0/0/editar_tabla_jj/', data, r => {
            pintarMenuGlobal();
            setTablesGlobal();
        });
    }
}


function labelDesdeUnoHastaHoy(fecha = new Date()) {
  const d = (fecha instanceof Date) ? fecha : new Date(fecha);
  const dia = d.getDate();
  if (dia <= 1) return "1";
  return `1-${dia - 1}`;
}

function labelDesdeHoyHastaFinMes(fecha = new Date()) {
  const d = (fecha instanceof Date) ? fecha : new Date(fecha);
  const dia = d.getDate();
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11
  // último día del mes: día 0 del mes siguiente
  const lastDay = new Date(year, month + 1, 0).getDate();
  return `${dia}-${lastDay}`;
}