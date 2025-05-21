
import requests, json

Country = ['US', 'CN', 'JP', 'ES', 'DE', 'RU', 'PL'] 
PIB = [
    "https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.CD?format=json",
    "https://api.worldbank.org/v2/country/CN/indicator/NY.GDP.MKTP.CD?format=json",
    "https://api.worldbank.org/v2/country/JP/indicator/NY.GDP.MKTP.CD?format=json",   
    "https://api.worldbank.org/v2/country/ES/indicator/NY.GDP.MKTP.CD?format=json",
    "https://api.worldbank.org/v2/country/DE/indicator/NY.GDP.MKTP.CD?format=json",
    "https://api.worldbank.org/v2/country/RU/indicator/NY.GDP.MKTP.CD?format=json",
    "https://api.worldbank.org/v2/country/PL/indicator/NY.GDP.MKTP.CD?format=json"
]

Riqueza = [
    "https://api.worldbank.org/v2/country/US/indicator/NY.ADJ.NNTY.CD?format=json",
    "https://api.worldbank.org/v2/country/CN/indicator/NY.ADJ.NNTY.CD?format=json",
    "https://api.worldbank.org/v2/country/JP/indicator/NY.ADJ.NNTY.CD?format=json",
    "https://api.worldbank.org/v2/country/ES/indicator/NY.ADJ.NNTY.CD?format=json"
]
    
Out = []
i   = 0
for url in PIB:
    response = requests.get(url)
    # Comprobamos si la solicitud fue exitosa (código 200)
    if response.status_code == 200:
        data = response.json()  # Convertimos la respuesta en JSON
        Out += [{'name':Country[i], 'data':data[1]}]  
    else:
        print("Error en la solicitud:", response.status_code)
    i += 1

with open(f"world-bank.api/pib.json", 'w', encoding='utf-8') as f:
    json.dump(Out, f, ensure_ascii=False, indent=4)

print(Out[0])