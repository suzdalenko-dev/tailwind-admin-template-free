suzdalenkoalexey
s9

imagedeveloper
sA.

simplefactura2024@gmail.com
sA.


Stock cierre - Kilos MTD = SUM(HISTORICO_STOCKS[STOCK_PRESENTACION]) 

Stock cierre - Kilos LMTD = 
 CALCULATE(
    [Stock cierre - Kilos MTD],
    DATEADD(
        dimCalendarioStock[Fecha],
        -1,
        YEAR
    )
)

Stock cierre - Importe € MTD = SUM(HISTORICO_STOCKS[IMPORTE])

Stock cierre - Importe € LMTD = 
    CALCULATE(
        [Stock cierre - Importe € MTD],
        DATEADD(
            dimCalendarioStock[Fecha],
            -1,
            YEAR
        )
)