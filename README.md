Acceso a Datos de Producción desde Zzircon
Para permitir que las aplicaciones de Zzircon accedan a información de producción, se ha desarrollado un servicio web (API) que permite consultar datos del sistema ERP LIBRA mediante peticiones GET. Las respuestas se devuelven en formato JSON estructurado, facilitando su integración y uso en los sistemas cliente.

A continuación, se detallan los endpoints disponibles:

1. Órdenes de Fabricación en Uso
    Obtiene un listado de las órdenes de fabricación (OF) activas y actualmente seleccionadas.

    Endpoint:
    http://192.168.1.30/api/zzircon/of/0/ofs_en_uso/
    (No requiere parámetros)

    Ejemplo de respuesta: Ver archivo ofs_en_uso.json


2. Detalle de una Orden de Fabricación
    Consulta detallada de una OF específica, incluyendo información de cabecera, artículos pedidos, consumidos, producidos y datos de la ficha del artículo.

    Endpoint:
    http://192.168.1.30/api/zzircon/of/{id}/of_detalle/     
    (Requiere el ID de la OF, por ejemplo: 381 http://192.168.1.30/api/zzircon/of/381/of_detalle/) 

    Ejemplo de respuesta: Ver archivo of_detalle.json


3. Orden de Fabricación Asociada a una Paleta
    Devuelve la información de la OF a la que está asignada una paleta determinada. Equivale al informe "OF de palet" en Producción Movilidad.

    Endpoint:
    http://192.168.1.30/api/zzircon/palet/{numero_paleta}/of_de_palet/
    (Requiere el número de paleta, por ejemplo: 000000096 http://192.168.1.30/api/zzircon/palet/000000096/of_de_palet/)

    Ejemplo de respuesta: Ver archivo of_de_palet.json


4. Información de un Recipiente (Paleta)
    Proporciona los datos de un recipiente/paleta, equivalente al informe "Info. recipiente" del sistema de Radiofrecuencia.

    Endpoint:
    http://192.168.1.30/api/zzircon/palet/{numero_paleta}/info_recipiente/
    (Requiere el número de paleta, por ejemplo: 000015612 http://192.168.1.30/api/zzircon/palet/000015612/info_recipiente/)

    Ejemplo de respuesta: Ver archivo info_recipiente.json


Desde punto menu > "Manten. ordenes fabricacion"
"OFs: Necesitamos recuperar las OFs planificadas y las OFs en producción" no existen OF planificadas solo hay: ABIERTA, CERRADA, ANULADA y RETENIDA.

Ten en cuenta que necesitamos capturar el número de palets creados y pdtes. para cada una de estos embalajes por lo que necesitamos el detalle. ?¿?¿


?¿?¿
    Modo de conservación	Vida útil	Consumir preferentemente antes del fin de
    Condiciones de conservación	Mantener a -18 °C. Una vez descongelado no volver a congelar    
    Método de empleo	Descongelar en el frigorifico y cocinar al gusto.
    Consumir antes de	24 horas