const readline = require('readline'); 
const rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});

function preguntar(pregunta) {
    return new Promise(resolve => rl.question(pregunta, answer => {
        resolve(answer);
    }));
}

// Función para inicializar la matriz de Busca Minas
function crearMatriz(dimension) {
    const matriz = [];
    for (let i = 0; i < dimension; i++) {
        const fila = [];
        for (let j = 0; j < dimension; j++) {
            fila.push(0);
        }
        matriz.push(fila);
    }
    return matriz;
}

// Función para colocar minas en la matriz
function colocarMinas(matriz, numMinas) {
    const dimension = matriz.length;
    let minasColocadas = 0;

    while (minasColocadas < numMinas) {
        const fila = Math.floor(Math.random() * dimension);
        const columna = Math.floor(Math.random() * dimension);

        if (matriz[fila][columna] !== 'M') {
            matriz[fila][columna] = 'M';
            minasColocadas++;
        }
    }

    // Actualizar la matriz con los números de minas adyacentes
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (matriz[i][j] !== 'M') {
                matriz[i][j] = contarMinasAdyacentes(matriz, i, j);
            }
        }
    }
}

// Función para contar minas adyacentes a una celda
function contarMinasAdyacentes(matriz, fila, columna) {
    const dimension = matriz.length;
    let minas = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;

            if (
                nuevaFila >= 0 && nuevaFila < dimension &&
                nuevaColumna >= 0 && nuevaColumna < dimension &&
                matriz[nuevaFila][nuevaColumna] === 'M'
            ) {
                minas++;
            }
        }
    }

    return minas;
}

// Función para mostrar la matriz en la consola
function mostrarMatriz(matriz, mostrarTodo = false) {
    console.log('  ' + Array.from(Array(matriz.length).keys()).join(' '));
    for (let i = 0; i < matriz.length; i++) {
        let fila = mostrarTodo ? matriz[i] : matriz[i].map(celda => (typeof celda === 'number' || celda === ' ' ? celda : 'X'));
        console.log(i + ' ' + fila.join(' '));
    }
}

// Función principal del juego
async function jugar() {
    const dimension = parseInt(await preguntar("Ingrese la dimensión de la matriz: "));
    const numMinas = parseInt(await preguntar("Ingrese el número de minas: "));

    let matriz = crearMatriz(dimension);
    colocarMinas(matriz, numMinas);

    let juegoTerminado = false;
    let celdasAbiertas = 0;
    const totalCeldas = dimension * dimension;

    while (!juegoTerminado && celdasAbiertas < totalCeldas - numMinas) {
        mostrarMatriz(matriz);

        const fila = parseInt(await preguntar("Ingrese la fila: "));
        const columna = parseInt(await preguntar("Ingrese la columna: "));

        if (fila >= 0 && fila < dimension && columna >= 0 && columna < dimension) {
            if (matriz[fila][columna] === 'M') {
                console.log("¡Has encontrado una mina! ¡Juego terminado!");
                mostrarMatriz(matriz, true);
                juegoTerminado = true;
            } else if (typeof matriz[fila][columna] === 'number') {
                console.log(`Celdas abiertas: ${celdasAbiertas + 1}`);
                matriz[fila][columna] = ' ';
                celdasAbiertas++;
            } else {
                console.log("Esta celda ya ha sido abierta. Intente nuevamente.");
            }
        } else {
            console.log("Posición inválida. Intente nuevamente.");
        }

        if (celdasAbiertas === totalCeldas - numMinas) {
            console.log("¡Felicidades! Has abierto todas las celdas sin minas. ¡Has ganado!");
            mostrarMatriz(matriz, true);
            juegoTerminado = true;
        }
    }

    rl.close();
}

// Ejecutar el juego
jugar();