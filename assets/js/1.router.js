let oldVuewName = false;
let clickedMenu = 1;

function initRouter() {
    let pageRoute = parseHashRoute();   
    if (pageRoute.view) { loadView(pageRoute.view); }
    else { loadView('dashboard'); } // Cargar vista por defecto si no hay hash
}

function loadView(viewName) {
    /* hay permisos por vista y permiso por punto en el menu */
    if(!String(window.localStorage.getItem('permissions')).includes("*")){
        if(!String(window.localStorage.getItem('permissions')).includes(viewName) && viewName != 'dashboard'){
            alert('No hay permisos para ver esta vista', 'waring');
            window.location.href = '/dashboard';
        }
    }
    

    let viewContainer = document.getElementById('htmlContent');

    fetch(`/assets/views/${viewName}.html`)
        .then(res => res.text())
        .then(html => {
            if(viewName != 'detalle-articulo-costes' && viewContainer && clickedMenu != 0){
                let oldHtmlPageContent =  getDefaultContenFromLocalStorage(viewName);                
                if(oldHtmlPageContent) viewContainer.innerHTML = oldHtmlPageContent;
                else viewContainer.innerHTML = html;
            } else {
                viewContainer.innerHTML = html;
            }
            if(oldVuewName == viewName){ clickedMenu++; } else { clickedMenu = 1; }
            if(clickedMenu > 3){ clickedMenu = 0;}
            oldVuewName = viewName;
  

            if(String(html).includes('found') || String(html).includes('edited') || String(html).includes('deleted')){
                setTimeout(() => { window.location = '/dashboard'; }, 2200);
            }

            // Carga el JS asociado (una sola vez)
            let scriptPath = `/assets/views/${viewName}.js`;
            if (!document.querySelector(`script[src="${scriptPath}"]`)) {
                let script = document.createElement('script');
                script.src = scriptPath;
                script.onload = () => {
                    let initFunction = window[`${toCamelCase(viewName)}`];
                    if (initFunction) initFunction();
                    else {
                        console.error(`Init function not found for ${viewName} ${toCamelCase(viewName)}`);
                    }
                };
                document.head.appendChild(script);
            } else {
                let initFunction = window[`${toCamelCase(viewName)}`];
                if (initFunction) initFunction();
                else {
                    console.error(`Init function not found for ${viewName} ${toCamelCase(viewName)}`);
                }
            }
        }).catch( e => {
            viewContainer.innerHTML = 'e1. Error '+ e;
        });
    
    let username = window.localStorage.getItem('username');
    let password = window.localStorage.getItem('password');
    fetch(HTTP_HOST+'froxa/login/?action=login&username='+username+'&password='+password).then(r => r.json()).then(r => {
        if(r && r.data && r.data.id > 0){
            window.localStorage.setItem('role', r.data.role);
            window.localStorage.setItem('permissions', r.data.permissions);
            window.localStorage.setItem('action_pass', r.data.action_pass);
        } else {
            showM('Credenciales incorrectos', 'warning');
            setTimeout(() => { window.location.href = '/'; }, 3000);
            deleteContent();
        }
    }).catch(e => { 
        showM('e34 '+e, 'error');
        setTimeout(() => { window.location.href = '/'; }, 3000);
        deleteContent();
    });
}


function deleteContent(){
    setInterval(() => {
        document.getElementById('htmlContent').innerHTML = '';
    }, 1000);
}


function toCamelCase(str) { 
    console.log(str.replace(/-([a-z])/g, g => g[1].toUpperCase()) + 'Init');
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase()) + 'Init';

}

function parseHashRoute() {
    let fullHash = window.location.hash; // "#crear-usuario?recogida_id=1&user=2"
    let [route, queryString] = fullHash.slice(1).split('?');
    let params = new URLSearchParams(queryString || '');
  
    return {
      view: route,
      params: Object.fromEntries(params.entries())
    };
}

initRouter();


// Abrir o crear la base de datos IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("htmlContentDB", 1); // nombre y versión

    request.onupgradeneeded = (event) => {
      let db = event.target.result;

      // Se ejecuta solo al CREAR o CAMBIAR VERSIÓN de la base de datos
      if (!db.objectStoreNames.contains("htmlPages")) {
        db.createObjectStore("htmlPages", { keyPath: "viewName" }); // "tabla" con clave primaria
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject("IndexedDB error: " + event.target.error);
  });
}


// Guardar contenido HTML en IndexedDB
function setDefaulContentToLocalStorage() {
   
}

// Leer y pintar contenido HTML desde IndexedDB
function getDefaultContenFromLocalStorage(viewName) {
    openDB().then((db) => {
       console.log(db)    
    });




}

