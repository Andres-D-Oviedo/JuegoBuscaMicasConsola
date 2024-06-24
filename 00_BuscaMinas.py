import random

# Función para pedir al usuario una entrada
def preguntar(pregunta):
    return input(pregunta)

# Función para inicializar la matriz de Busca Minas
def crear_matriz(dimension):
    matriz = []
    for i in range(dimension):
        fila = [0] * dimension
        matriz.append(fila)
    return matriz

# Función para colocar minas en la matriz
def colocar_minas(matriz, num_minas):
    dimension = len(matriz)
    minas_colocadas = 0

    while minas_colocadas < num_minas:
        fila = random.randint(0, dimension - 1)
        columna = random.randint(0, dimension - 1)

        if matriz[fila][columna] != 'M':
            matriz[fila][columna] = 'M'
            minas_colocadas += 1

    # Actualizar la matriz con los números de minas adyacentes
    for i in range(dimension):
        for j in range(dimension):
            if matriz[i][j] != 'M':
                matriz[i][j] = contar_minas_adyacentes(matriz, i, j)

# Función para contar minas adyacentes a una celda
def contar_minas_adyacentes(matriz, fila, columna):
    dimension = len(matriz)
    minas = 0

    for i in range(-1, 2):
        for j in range(-1, 2):
            nueva_fila = fila + i
            nueva_columna = columna + j

            if (
                0 <= nueva_fila < dimension and
                0 <= nueva_columna < dimension and
                matriz[nueva_fila][nueva_columna] == 'M'
            ):
                minas += 1

    return minas

# Función para mostrar la matriz en la consola
def mostrar_matriz(matriz, mostrar_todo=False):
    print('  ' + ' '.join(map(str, range(len(matriz)))))
    for i in range(len(matriz)):
        fila = matriz[i] if mostrar_todo else [
            celda if isinstance(celda, (int, str)) else 'X' for celda in matriz[i]
        ]
        print(i, ' '.join(map(str, fila)))

# Función principal del juego
def jugar():
    dimension = int(preguntar("Ingrese la dimensión de la matriz: "))
    num_minas = int(preguntar("Ingrese el número de minas: "))

    matriz = crear_matriz(dimension)
    colocar_minas(matriz, num_minas)

    juego_terminado = False
    celdas_abiertas = 0
    total_celdas = dimension * dimension

    while not juego_terminado and celdas_abiertas < total_celdas - num_minas:
        mostrar_matriz(matriz)

        fila = int(preguntar("Ingrese la fila: "))
        columna = int(preguntar("Ingrese la columna: "))

        if 0 <= fila < dimension and 0 <= columna < dimension:
            if matriz[fila][columna] == 'M':
                print("¡Has encontrado una mina! ¡Juego terminado!")
                mostrar_matriz(matriz, True)
                juego_terminado = True
            elif isinstance(matriz[fila][columna], int):
                print(f"Celdas abiertas: {celdas_abiertas + 1}")
                matriz[fila][columna] = ' '
                celdas_abiertas += 1
            else:
                print("Esta celda ya ha sido abierta. Intente nuevamente.")
        else:
            print("Posición inválida. Intente nuevamente.")

        if celdas_abiertas == total_celdas - num_minas:
            print("¡Felicidades! Has abierto todas las celdas sin minas. ¡Has ganado!")
            mostrar_matriz(matriz, True)
            juego_terminado = True

# Ejecutar el juego
jugar()