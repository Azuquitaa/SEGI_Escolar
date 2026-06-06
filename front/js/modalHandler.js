import { modalConfig } from './config.js';
import { API, guardarDatosAPI } from './api.js';
import { cargarEscuelas } from './escuelas.js';
import { cargarCursos } from './cursos.js';
import { cargarAlumnos } from './alumnos.js';
import { cerrarModal } from './modal.js';

export function inicializarModalHandler() {
    const modalGuardarBtn = document.getElementById("modalGuardar");
    
    if (!modalGuardarBtn) {
        console.warn('Botón modalGuardar no encontrado');
        return;
    }
    
    modalGuardarBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        
        if (!window.modalEntidad) {
            console.error('No hay entidad modal definida');
            return;
        }
        
        const config = modalConfig[window.modalEntidad];
        const data = {};
        
        // Obtener datos del modal
        config.campos.forEach(campo => {
            const element = document.getElementById(`modal-${campo.id}`);
            if (element) {
                data[campo.id] = element.value.trim();
            }
        });

        // Lógica específica por entidad
        if (window.modalEntidad === "alumno") {
            const cursoSelect = document.getElementById("cursoSelect");
            const cursoId = cursoSelect ? cursoSelect.value : null;
            
            if (!cursoId) {
                alert("No hay curso seleccionado");
                return;
            }
            
            data.curso_id = Number(cursoId);
        }

        if (window.modalEntidad === "curso") {
            const escuelaSelect = document.getElementById("escuelaSelect");
            const escuelaId = escuelaSelect ? escuelaSelect.value : null;
            
            if (!escuelaId) {
                alert("No hay escuela seleccionada");
                return;
            }
            
            data.escuela_id = Number(escuelaId);
        }

        try {
            if (window.modalEditandoId) {
                // Actualizar
                await API[`update${capitalizeFirst(window.modalEntidad)}`](
                    window.modalEditandoId, 
                    data
                );
            } else {
                // Crear
                await API[`create${capitalizeFirst(window.modalEntidad)}`](data);
            }
            
            cerrarModal();
            recargarDatos(window.modalEntidad);
            
        } catch (error) {
            console.error("Error al guardar:", error);
            alert(`Error al guardar: ${error.message}`);
        }
    });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function recargarDatos(entidad) {
    switch (entidad) {
        case "alumno":
            const cursoSelect = document.getElementById("cursoSelect");
            if (cursoSelect && cursoSelect.value) {
                cargarAlumnos(cursoSelect.value);
            }
            break;
            
        case "curso":
            const escuelaSelect = document.getElementById("escuelaSelect");
            if (escuelaSelect && escuelaSelect.value) {
                cargarCursos(escuelaSelect.value);
            }
            break;
            
        case "escuela":
            cargarEscuelas();
            break;
    }
}