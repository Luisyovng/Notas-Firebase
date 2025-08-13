import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔹 Configuración de Firebase (CAMBIAR por tus credenciales)


const firebaseConfig = {
  apiKey: "AIzaSyCNLRJlYG-inxmEj6W2G__axD-HDagpU84",
  authDomain: "proyecto-29e33.firebaseapp.com",
  projectId: "proyecto-29e33",
  databaseURL: "https://proyecto-29e33-default-rtdb.firebaseio.com/", // 🔹 IMPORTANTE
  storageBucket: "proyecto-29e33.firebasestorage.app",
  messagingSenderId: "719482361904",
  appId: "1:719482361904:web:12894545bd85bec669b5f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializar Realtime Database
const db = getDatabase(app);

//  Función para calcular promedio
function calcularPromedio(n1, n2, n3) {
    return ((n1 + n2 + n3) / 3).toFixed(2);
}

//  Función para guardar en Realtime Database
function guardarNotas(n1, n2, n3, promedio, asignatura, Nombre) {
    const notasRef = ref(db, "notas");
    const nuevaNota = {

    nombre: Nombre,
    asignatura: asignatura,
    nota1: n1,
    nota2: n2,
    nota3: n3,
    promedionotas: promedio,
    fecha: new Date().toLocaleString()
    };

    push(notasRef, nuevaNota)
    .then(() => {
      console.log(" Notas guardadas en Firebase:", nuevaNota);
      document.getElementById("resultado").textContent =
        ` Notas guardadas con promedio: ${promedio}`;
      document.getElementById("resultado").style.color = "Blue";
    })
    .catch((error) => {
      console.error("Error al guardar en Firebase:", error);
      document.getElementById("resultado").textContent =
        `Error al guardar: ${error.message}`;
      document.getElementById("resultado").style.color = "red";
    });
}




//  Función para mostrar datos en tabla
// 📌 Mostrar las notas en la tabla HTML en tiempo real
function mostrarNotas() {
  const notasRef = ref(db, "notas");

  onValue(notasRef, function(snapshot) {
    const tabla = document.getElementById("tablaNotas");
    tabla.innerHTML = ""; // Limpiar tabla antes de agregar filas

    if (!snapshot.exists()) {
      tabla.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; color:gray;">
            No hay registros guardados
          </td>
        </tr>
      `;
      return;
    }

    snapshot.forEach(function(childSnapshot) {
      // Desestructurar para mayor claridad
      const { nota1, nota2, nota3, promedio, fecha } = childSnapshot.val();

      const fila = `
        <tr>
          <td>${nota1}</td>
          <td>${nota2}</td>
          <td>${nota3}</td>
          <td>${promedio}</td>
          <td>${fecha}</td>
        </tr>
      `;

      tabla.innerHTML += fila;
    });
  });
}

//  Función para limpiar la tabla
function limpiarTabla() { 
    const tabla = document.getElementById("tablaNotas");
    tabla.innerHTML = "";
    document.getElementById("resultado").textContent = "";
}
// Evento del botón de limpiar  
document.getElementById("limpiarBtn").addEventListener("click", () => {
    limpiarTabla();
    const notasRef = ref(db, "notas");
    notasRef.set(null); // Elimina todas las notas de la base de datos
    document.getElementById("resultado").textContent = "Notas eliminadas y tabla limpiada.";
});

// Evento del formulario
document.getElementById("notaForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let n1 = parseFloat(document.getElementById("nota1").value);
    let n2 = parseFloat(document.getElementById("nota2").value);
    let n3 = parseFloat(document.getElementById("nota3").value);
    let asignatura = document.getElementById("asignatura").value;
    let Nombre = document.getElementById("nombre").value;
  

    let promedio = calcularPromedio(n1, n2, n3);
    guardarNotas(n1, n2, n3, promedio, asignatura, Nombre);

    document.getElementById("resultado").textContent = ` Notas guardadas con promedio: ${promedio}`;
    e.target.reset();
});

// Inicializar tabla en tiempo real
mostrarNotas();