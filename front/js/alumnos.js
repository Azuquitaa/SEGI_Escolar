import { API_URL } from './config.js';
import { cargarAlumnosAPI, obtenerAlumnoAPI } from './api.js';
import { abrirModal } from './modal.js';
import { cursoSelect } from './cursos.js';

// Elementos DOM
const alumnosSection = document.getElementById("alumnosSection");
const crearAlumnoBtn = document.getElementById("crearAlumno");
const editarAlumnoBtn = document.getElementById("editarAlumno");

export async function cargarAlumnos(cursoId) {
    if (!cursoId) {
        console.log("No hay cursoId proporcionado");
        return;
    }

    try {
        const alumnos = await cargarAlumnosAPI(cursoId);
        const tbody = document.getElementById("alumnosTable");
        tbody.innerHTML = "";

        if (alumnos.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="6">No hay alumnos cargados</td>`;
            tbody.appendChild(tr);
            return;
        }

        alumnos.forEach(a => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${a.apellido}</td>
                <td>${a.nombre}</td>
                <td>${a.dni}</td>
                <td>${a.curso}</td>
                <td>${a.estado}</td>
                <td>
                    <button data-id="${a.id}" class="editar-alumno">Editar</button>
                    <button class="eliminar-alumno" data-id="${a.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        activarEdicionAlumnos();
        activarEliminacionAlumnos();
        
    } catch (error) {
        console.error("Error cargando alumnos", error);
    }
}

function activarEdicionAlumnos() {
    document.querySelectorAll(".editar-alumno").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const alumnoId = btn.dataset.id; 

            try {
                const alumno = await obtenerAlumnoAPI(alumnoId);
                abrirModal("alumno", "editar", {
                    id: alumno.id,
                    nombre: alumno.nombre,
                    apellido: alumno.apellido,
                    dni: alumno.dni
                });
            } catch (error) {
                console.error("Error obteniendo alumno", error);
            }
        });
    });
}

function activarEliminacionAlumnos() {
    document.querySelectorAll(".eliminar-alumno").forEach(btn => {
        btn.addEventListener("click", async () => {
            const alumnoId = btn.dataset.id;

            const confirmar = confirm(
                "¿Querés eliminar al alumno de la lista?\n\n" +
                "✔ Se conservarán sus datos y notas\n" +
                "✖ No aparecerá más en el curso"
            );

            if (!confirmar) return;

            try {
                await fetch(`${API_URL}/alumnos/${alumnoId}/desactivar`, {
                    method: "PUT"
                });
                cargarAlumnos(cursoSelect.value);
            } catch (error) {
                console.error("Error eliminando alumno", error);
            }
        });
    });
}

export function inicializarAlumnos() {
    // Escuchar evento de cambio de curso
    document.addEventListener('cursoCambiado', (event) => {
        const { cursoId } = event.detail;
        
        if (cursoId) {
            alumnosSection.style.display = "block";
            crearAlumnoBtn.disabled = false;
            cargarAlumnos(cursoId);
        } else {
            alumnosSection.style.display = "none";
            crearAlumnoBtn.disabled = true;
            editarAlumnoBtn.disabled = true;
        }
    });
    
    // Event listener para crear alumno
    crearAlumnoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const cursoId = cursoSelect.value;

        if (!cursoId) {
            alert("Primero seleccioná un curso");
            return;
        }

        abrirModal("alumno", "crear");
    });
}