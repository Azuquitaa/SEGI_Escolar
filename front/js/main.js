import { preventFormSubmission } from './utils.js';
import { inicializarModal } from './modal.js';
import { inicializarModalHandler } from './modalHandler.js';
import { cargarEscuelas, inicializarEscuelas } from './escuelas.js';
import { inicializarCursos } from './cursos.js';
import { inicializarAlumnos } from './alumnos.js';
import { inicializarNavegacion } from './navegacion.js';
import { inicializarActividades } from './actividades.js';


// Variables globales que necesitan ser accesibles desde múltiples módulos
window.modalEntidad = null;
window.modalEditandoId = null;

document.addEventListener("DOMContentLoaded", async () => {
    // Prevenir envío de formularios
    preventFormSubmission();
    
    // Inicializar todos los módulos
    inicializarModal();
    inicializarModalHandler();
    inicializarEscuelas();
    inicializarCursos();
    inicializarAlumnos();
    inicializarNavegacion();
    inicializarActividades();
    
    // Cargar datos iniciales
    await  cargarEscuelas();
    
    console.log("Aplicación inicializada correctamente");
});