-- drrWq9SNsFJH
select * 
from HISTORICO_COBROS
where TO_CHAR(fecha_factura, 'YYYY') = '2026'
order by documento asc
;

select * 
from AGRUPACIONES_DESGLOSES
where TO_CHAR(EJERCICIO, 'YYYY') = '2026'
;

select *
from historico_detallado_apuntes
where TO_CHAR(FECHA_ASIENTO, 'YYYY') = '2026'
order by documento asc
;