-- 12828864Q
-- svoboda2019S.
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


Sara
1. Pantalla de horas traer los ultimos 50 OF
2. Infome, entre fechas por artículo OF y turnos.
    artículo fabricado, horas desglosadas por turno, zona !!!!!!!!! 
    fecha > articulo > zona > turno > numero horas totales de este turno, zona, articulo.
3. Hacer que la OF de limpeza sea visible para los operarios siempre