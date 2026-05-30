function pintarMenuGlobal(){
    suzdalenkoGet('compras/put/0/0/get_familias_menu/', (r) => {
        let html = '<a class="top_link" href="/dashboard/#compras-proyeccion-listado-familias">◀️</a>';
        let class_blue = '';
        r.data.familias.map(fam => {    
            if(fam.id == FAMILIA_ID){ 
                class_blue = 'class_blue';
                document.title = fam.descripcion;
        }
        html += `<a class="top_link ${class_blue}" href="/dashboard/proyeccion-compras/?familia_id=${fam.id}">${fam.descripcion}</a>`;
        class_blue = '';
    });
        document.getElementById('nav_fam').innerHTML =  html;
    });
}

pintarMenuGlobal();
