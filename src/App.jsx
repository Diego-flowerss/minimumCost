import React, { useState } from "react";
import "./App.css";

function App() {
  // Estados para manejar filas y columnas
  const [filas, setFilas] = useState(3);
  const [columnas, setColumnas] = useState(3);

  // Estado para almacenar los costos en la matriz
  const [costos, setCostos] = useState([
    [0, 0],
    [0, 0],
  ]);

  // Estos estados almacenan la oferta y demanda
  const [oferta, setOferta] = useState([0, 0]);
  const [demanda, setDemanda] = useState([0, 0]);

  // Estado para guardar el resultado final
  const [resultado, setResultado] = useState(null);

  // Crea la matriz con los tamaños actuales
  const crearMatriz = () => {
    const nuevaMatriz = Array.from({ length: filas }, () =>
      Array(columnas).fill(0)
    );
    setCostos(nuevaMatriz);
    setOferta(Array(filas).fill(0));
    setDemanda(Array(columnas).fill(0));
  };

  // Esta función se llama cada vez que cambia un valor en la matriz de costos
  const handleChangeMatriz = (i, j, value) => {
    const nuevaMatriz = costos.map((fila, x) =>
      fila.map((celda, y) => (x === i && y === j ? Number(value) : celda))
    );
    setCostos(nuevaMatriz);
  };

  // Esta funcion es para manejar cambios en oferta y demanda
  const handleChangeArray = (setter, index, value) => {
    setter((prev) => prev.map((v, i) => (i === index ? Number(value) : v)));
  };

  // Esta funcion calcula la asignacion óptima con el método de costo minimo
  const handleCalcular = () => {
    const resultado = costoMinimo(costos, oferta, demanda);
    setResultado(resultado);
  };

  // Esta funcion contiene el algoritmo de costo minimo
  const costoMinimo = (matriz, oferta, demanda) => {
    const filas = matriz.length;
    const columnas = matriz[0].length;
    const asignacion = Array.from({ length: filas }, () =>
      Array(columnas).fill(0)
    );

    let ofertaRestante = [...oferta];
    let demandaRestante = [...demanda];
    let costoTotal = 0;

    // Mientras la oferta y demanda no ha sido satisfecha continuaremos con un while
    while (
      ofertaRestante.some((o) => o > 0) &&
      demandaRestante.some((d) => d > 0)
    ) {
      let minCosto = Infinity;
      let posMinima = [-1, -1];

      for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
          if (
            ofertaRestante[i] > 0 &&
            demandaRestante[j] > 0 &&
            matriz[i][j] < minCosto
          ) {
            minCosto = matriz[i][j];
            posMinima = [i, j];
          }
        }
      }

      const [i, j] = posMinima;
      const asignacionValor = Math.min(ofertaRestante[i], demandaRestante[j]);

      asignacion[i][j] = asignacionValor;
      costoTotal += asignacionValor * matriz[i][j];

      ofertaRestante[i] -= asignacionValor;
      demandaRestante[j] -= asignacionValor;
    }

    return { asignacion, costoTotal }; // retornamos la asignacion y el costo total
  };

  return (
    <div className="App">
      <h1>Método de Transporte - Costo Mínimo</h1>

      <div>
        <label>Número de filas: </label>
        <input
          type="number"
          value={filas}
          onChange={(e) => setFilas(Number(e.target.value))}
        />
        <label>Número de columnas: </label>
        <input
          type="number"
          value={columnas}
          onChange={(e) => setColumnas(Number(e.target.value))}
        />
        <button onClick={crearMatriz}>Crear Matriz</button>
      </div>

      <div
        className="grid-container"
        style={{ gridTemplateColumns: `repeat(${columnas}, 60px)` }}
      >
        {costos.map((fila, i) =>
          fila.map((celda, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={celda}
              onChange={(e) => handleChangeMatriz(i, j, e.target.value)}
            />
          ))
        )}
      </div>

      <div>
        <h3>Oferta</h3>
        {oferta.map((o, i) => (
          <input
            key={`oferta-${i}`}
            type="number"
            value={o}
            onChange={(e) => handleChangeArray(setOferta, i, e.target.value)}
          />
        ))}
      </div>

      <div>
        <h3>Demanda</h3>
        {demanda.map((d, i) => (
          <input
            key={`demanda-${i}`}
            type="number"
            value={d}
            onChange={(e) => handleChangeArray(setDemanda, i, e.target.value)}
          />
        ))}
      </div>

      <button onClick={handleCalcular}>Calcular Asignación</button>

      {resultado && (
        <div>
          <h3>Asignación Óptima</h3>
          <table>
            <tbody>
              {resultado.asignacion.map((fila, i) => (
                <tr key={i}>
                  {fila.map((valor, j) => (
                    <td key={`${i}-${j}`}>{valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Costo Total: {resultado.costoTotal}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
