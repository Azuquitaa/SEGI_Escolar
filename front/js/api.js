import { API_URL } from './config.js';

export async function fetchData(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Para DELETE que no devuelve contenido
        if (response.status === 204 || options.method === 'DELETE') {
            return { success: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Funciones específicas
export async function cargarEscuelasAPI() {
    return await fetchData('escuelas');
}

export async function cargarCursosAPI(escuelaId) {
    return await fetchData(`cursos?escuela_id=${escuelaId}`);
}

export async function cargarAlumnosAPI(cursoId) {
    return await fetchData(`alumnos/?curso_id=${cursoId}`);
}

export async function cargarMateriasAPI() {
    return await fetchData('materias');
}

export async function obtenerCursoAPI(id) {
    return await fetchData(`cursos/${id}`);
}

export async function obtenerAlumnoAPI(id) {
    return await fetchData(`alumnos/${id}`);
}

export async function cargarActividadesAPI(cursoId) {
    return cursoId
        ? await fetchData(`actividades?curso_id=${cursoId}`)
        : await fetchData('actividades');
}

export async function obtenerActividadAPI(id) {
    return await fetchData(`actividades/${id}`);
}


export async function guardarDatosAPI(endpoint, method, data = {}, id = null) {
    const url = id ? `${endpoint}/${id}` : endpoint;
    return await fetchData(url, {
        method,
        body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify(data) : undefined
    });
}

// Helper para operaciones CRUD específicas
export const API = {
    // Escuelas
    getEscuelas: () => fetchData('escuelas'),
    getEscuela: (id) => fetchData(`escuelas/${id}`),
    createEscuela: (data) => guardarDatosAPI('escuelas', 'POST', data),
    updateEscuela: (id, data) => guardarDatosAPI('escuelas', 'PUT', data, id),
    
    // Cursos
    getCursos: (escuelaId = null) => 
        escuelaId ? fetchData(`cursos?escuela_id=${escuelaId}`) : fetchData('cursos'),
    getCurso: (id) => fetchData(`cursos/${id}`),
    createCurso: (data) => guardarDatosAPI('cursos', 'POST', data),
    updateCurso: (id, data) => guardarDatosAPI('cursos', 'PUT', data, id),
    
    // Alumnos
    getAlumnos: (cursoId = null) => 
        cursoId ? fetchData(`alumnos?curso_id=${cursoId}`) : fetchData('alumnos'),
    getAlumno: (id) => fetchData(`alumnos/${id}`),
    createAlumno: (data) => guardarDatosAPI('alumnos', 'POST', data),
    updateAlumno: (id, data) => guardarDatosAPI('alumnos', 'PUT', data, id),
    desactivarAlumno: (id) => guardarDatosAPI(`alumnos/${id}/desactivar`, 'PUT'),
    
    // Actividades
    getActividades: (cursoId = null) => 
        cursoId ? fetchData(`actividades?curso_id=${cursoId}`) : fetchData('actividades'),
    getActividad: (id) => fetchData(`actividades/${id}`),
    createActividad: (data) => guardarDatosAPI('actividades', 'POST', data),
    updateActividad: (id, data) => guardarDatosAPI('actividades', 'PUT', data, id),
    deleteActividad: (id) => guardarDatosAPI('actividades', 'DELETE', {}, id),
    
    // Materias
    getMaterias: () => fetchData('materias')
};

// export async function guardarDatosAPI(endpoint, method, data, id = null) {
//     const url = id ? `${endpoint}/${id}` : endpoint;
//     return await fetchData(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//     });
// }