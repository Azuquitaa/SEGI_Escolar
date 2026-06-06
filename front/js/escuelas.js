import { API_URL } from './config.js';
import { API,cargarEscuelasAPI, guardarDatosAPI } from './api.js';
import { abrirModal } from './modal.js';

// Elementos DOM
const escuelaSelect = document.getElementById("escuelaSelect");
const crearEscuelaBtn = document.getElementById("crearEscuela");
const editarEscuelaBtn = document.getElementById("editarEscuela");

export async function cargarEscuelas() {
    try {
        const respuesta = await API.getEscuelas();
        
        escuelaSelect.innerHTML = "";
        
        if (!respuesta || respuesta.length === 0) { 
            escuelaSelect.innerHTML = "<option>No hay escuelas agregadas</option>";
            if (editarEscuelaBtn) editarEscuelaBtn.disabled = true;
            
            // Disparar evento indicando que no hay escuelas
            const event = new CustomEvent('escuelaCambiada', { detail: { escuelaId: null } });
            document.dispatchEvent(event);
            return;
        }
        
        if (editarEscuelaBtn) editarEscuelaBtn.disabled = false;
        
        const optionDefault = document.createElement("option");
        optionDefault.textContent = "Seleccione una escuela";
        optionDefault.value = "";
        escuelaSelect.appendChild(optionDefault);

        respuesta.forEach(escuela => {
            const option = document.createElement("option");
            option.value = escuela.id;
            option.textContent = `${escuela.nombre} - ${escuela.nivel}`;
            escuelaSelect.appendChild(option);
        });

        
    } catch (error) {
        console.error("Error cargando escuelas", error);
    }
}

export function inicializarEscuelas() {
    
    // Verificar que los elementos existan
    if (!escuelaSelect) {
        console.error("Elemento escuelaSelect no encontrado");
        return;
    }
    
    // Event listener para cambio de escuela
    escuelaSelect.addEventListener("change", () => {
        const escuelaId = escuelaSelect.value;
        
        // Guardar en localStorage para persistencia
        if (escuelaId) {
            localStorage.setItem('escuelaSeleccionada', escuelaId);
        } else {
            localStorage.removeItem('escuelaSeleccionada');
        }
        
        // Disparar evento personalizado para que cursos.js lo maneje
        const event = new CustomEvent('escuelaCambiada', { 
            detail: { 
                escuelaId,
                escuelaNombre: escuelaSelect.selectedOptions[0]?.textContent || ''
            } 
        });
        document.dispatchEvent(event);
    });
    
    // Event listener para crear escuela
    if (crearEscuelaBtn) {
        crearEscuelaBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Crear escuela clickeado");
            abrirModal("escuela", "crear");
        });
    }
    
    // Event listener para editar escuela
    if (editarEscuelaBtn) {
        editarEscuelaBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const option = escuelaSelect.selectedOptions[0];
            
            if (!option || option.value === "") {
                alert("Seleccione una escuela para editar");
                return;
            }

            const [nombre, nivel] = option.textContent.split("-").map(t => t.trim());
            
            abrirModal("escuela", "editar", {
                id: escuelaSelect.value,
                nombre,
                nivel
            });
        });
    }
    
    console.log("Eventos de escuelas inicializados");
}

export { escuelaSelect };