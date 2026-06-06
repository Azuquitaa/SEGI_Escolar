// cursos.js
import { API_URL } from './config.js';
import { API, cargarCursosAPI, obtenerCursoAPI } from './api.js';
import { abrirModal } from './modal.js';
import { escuelaSelect } from './escuelas.js';

// Elementos DOM
const cursoSelect = document.getElementById("cursoSelect");
const crearCursoBtn = document.getElementById("crearCurso");
const editarCursoBtn = document.getElementById("editarCurso");
export async function cargarCursos(escuelaId) {
    try {
        const respuesta = await API.getCursos(escuelaId);  // Usa API.getCursos()
        
        cursoSelect.innerHTML = "";

        if (!respuesta || respuesta.length === 0) {
            cursoSelect.innerHTML = "<option>No hay cursos</option>";
            editarCursoBtn.disabled = true;
            crearCursoBtn.disabled = false;
            cursoSelect.disabled = false; // Asegurar que sea seleccionable
            return;
        }

        editarCursoBtn.disabled = false;
        crearCursoBtn.disabled = false;
        cursoSelect.disabled = false;

        const optionDefault = document.createElement("option");
        optionDefault.textContent = "Seleccione un curso";
        optionDefault.value = "";
        cursoSelect.appendChild(optionDefault);

        respuesta.forEach(curso => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = `${curso.anio}${curso.division}`;
            cursoSelect.appendChild(option);
        });

        console.log("Cursos cargados correctamente");

    } catch (error) {
        console.error("Error cargando cursos", error);
        cursoSelect.innerHTML = "<option>Error al cargar cursos</option>";
    }
}

export function inicializarCursos() {
    // Escuchar evento de cambio de escuela
    document.addEventListener('escuelaCambiada', (event) => {
        const { escuelaId } = event.detail;
        if (escuelaId && escuelaId !== "") {
            
            cargarCursos(escuelaId);
            cursoSelect.disabled = false;
            crearCursoBtn.disabled = false;
        } else {
            cursoSelect.disabled = true;
            crearCursoBtn.disabled = true;
            editarCursoBtn.disabled = true;
            cursoSelect.innerHTML = "<option>Seleccione una escuela</option>";
        }
    });
    
    
    crearCursoBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const escuelaId = escuelaSelect.value;
        
        if (!escuelaId) {
            alert("Primero seleccioná una escuela");
            return;
        }
        
        abrirModal("curso", "crear");
    });
    
    editarCursoBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const cursoId = cursoSelect.value;
        if (!cursoId) return;
        
        try {
            const respuesta = await obtenerCursoAPI(cursoId);
            abrirModal("curso", "editar", {
                id: cursoId,
                anio: respuesta.anio,
                division: respuesta.division
            });
        } catch (error) {
            console.error("Error obteniendo curso", error);
        }
    });
    
    // Cambio de curso
    cursoSelect.addEventListener("change", () => {
        const cursoId = cursoSelect.value;
        console.log("Curso cambiado:", cursoId);
        
        // Disparar evento personalizado para que alumnos.js lo maneje
        const event = new CustomEvent('cursoCambiado', { 
            detail: { 
                cursoId,
                escuelaId: cursoSelect.getAttribute('data-escuela-id')
            } 
        });
        document.dispatchEvent(event);
    });
}

export { cursoSelect , crearCursoBtn, editarCursoBtn };