import psycopg2
try:
    conn = psycopg2.connect( dbname="froxadb", user="alexey", password="1q2w3e4r5t6y7u8i9o0p", host="192.168.1.30", port=5432)

    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print("Conexión exitosa. Versión de PostgreSQL:", version)

    cursor.close()
    conn.close()

except Exception as e:
    print("Error al conectar:", e)
