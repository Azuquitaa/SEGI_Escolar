export const API_URL = "http://127.0.0.1:5000";

export const modalConfig = {
    escuela: {
        tituloCrear: "Crear Escuela",
        tituloEditar: "Editar Escuela",
        endpoint: "escuelas",
        campos: [
            { id: "nombre", label: "Nombre" },
            { id: "nivel", label: "Nivel" }
        ]
    },
    curso: {
        tituloCrear: "Crear Curso",
        tituloEditar: "Editar Curso",
        endpoint: "cursos",
        campos: [
            { id: "anio", label: "Año" },
            { id: "division", label: "División" }
        ]
    },
    alumno: {
        tituloCrear: "Crear Alumno",
        tituloEditar: "Editar Alumno",
        endpoint: "alumnos",
        campos: [
            { id: "nombre", label: "Nombre" },
            { id: "apellido", label: "Apellido" },
            { id: "dni", label: "Dni" }
        ]
    }
};

// Variables globales que se comparten
export let modalEntidad = null;
export let modalEditandoId = null;