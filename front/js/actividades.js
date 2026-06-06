import { API_URL } from './config.js';
import { 
    API,
    cargarEscuelasAPI, 
    cargarCursosAPI, 
    cargarMateriasAPI,
    guardarDatosAPI,
    fetchData  
} from './api.js';

export async function cargarEscuelasParaActividades() {
    try {
        const respuesta = await API.getEscuelas();
        
        const select = document.getElementById('actividad-escuelaSelect');
        select.innerHTML = '';

        if (respuesta.length === 0) {
            select.innerHTML = '<option>No hay escuelas agregadas</option>';
            return;
        }

        const optionDefault = document.createElement('option');
        optionDefault.textContent = 'Seleccione una escuela';
        optionDefault.value = '';
        select.appendChild(optionDefault);

        respuesta.forEach(escuela => {
            const option = document.createElement('option');
            option.value = escuela.id;
            option.textContent = `${escuela.nombre} - ${escuela.nivel}`;
            select.appendChild(option);
        });

        // Habilitar cambio de cursos cuando se selecciona escuela
        select.addEventListener('change', function() {
            const escuelaId = this.value;
            const cursoSelect = document.getElementById('actividad-cursoSelect');
            
            if (escuelaId) {
                cargarCursosParaActividades(escuelaId);
                cursoSelect.disabled = false;
            } else {
                cursoSelect.disabled = true;
                cursoSelect.innerHTML = '<option>Seleccione una escuela primero</option>';
                document.getElementById('crearActividad').disabled = true;
            }
        });

    } catch (error) {
        console.error('Error cargando escuelas para actividades', error);
    }
}

export async function cargarMateriasParaActividades() {
    try {
        const res = await fetch(`${API_URL}/materias`);
        const respuesta = await res.json();

        const select = document.getElementById('actividad-materiaSelect');
        select.innerHTML = '';

        if (respuesta.length === 0) {
            select.innerHTML = '<option>No hay materias disponibles</option>';
            return;
        }

        const optionDefault = document.createElement('option');
        optionDefault.textContent = 'Seleccione una materia (opcional)';
        optionDefault.value = '';
        select.appendChild(optionDefault);

        respuesta.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id;
            option.textContent = materia.nombre;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error cargando materias', error);
    }
}

export async function cargarCursosParaActividades(escuelaId) {
    try {
        const respuesta = await API.getCursos(escuelaId);

        const select = document.getElementById('actividad-cursoSelect');
        select.innerHTML = '';

        if (respuesta.length === 0) {
            select.innerHTML = '<option>No hay cursos en esta escuela</option>';
            document.getElementById('crearActividad').disabled = true;
            return;
        }

        const optionDefault = document.createElement('option');
        optionDefault.textContent = 'Seleccione un curso';
        optionDefault.value = '';
        select.appendChild(optionDefault);

        respuesta.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id;
            option.textContent = `${curso.anio}${curso.division}`;
            select.appendChild(option);
        });

        // Habilitar crear actividad cuando se selecciona curso
        select.addEventListener('change', function() {
            const cursoId = this.value;
            const crearBtn = document.getElementById('crearActividad');
            crearBtn.disabled = !cursoId;
            
            if (cursoId) {
                cargarActividades(cursoId);
            } else {
                limpiarTablaActividades();
            }
        });

    } catch (error) {
        console.error('Error cargando cursos para actividades', error);
    }
}

export async function cargarActividades(cursoId) {
    try {
        
        const actividades = await API.getActividades(cursoId);

        const tbody = document.getElementById('tabla-actividades');
        tbody.innerHTML = '';

        if (actividades.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="5">No hay actividades para este curso</td>`;
            tbody.appendChild(tr);
            return;
        }

        actividades.forEach(actividad => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${actividad.nombre}</td>
                <td>${actividad.tipo}</td>
                <td>${new Date(actividad.fecha).toLocaleDateString()}</td>
                <td>${actividad.materia_nombre || 'Sin materia'}</td>
                <td>
                    <button class="editar-actividad" data-id="${actividad.id}">Editar</button>
                    <button class="eliminar-actividad" data-id="${actividad.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // se agregan los botones de editar/eliminar a las actividades
        agregarEventListenersActividades();

    } catch (error) {
        console.error('Error cargando actividades', error);
    }
}

function limpiarTablaActividades() {
    const tbody = document.getElementById('tabla-actividades');
    tbody.innerHTML = `
        <tr>
            <td colspan="5">Seleccione un curso para ver las actividades</td>
        </tr>
    `;
}

export function agregarEventListenersActividades() {
    document.querySelectorAll('.eliminar-actividad').forEach(btn => {
        btn.addEventListener('click', async function() {
            const actividadId = this.dataset.id;
            if (confirm('¿Está seguro de eliminar esta actividad?')) {
                try {
                    // Usa la nueva API
                    await API.deleteActividad(actividadId);
                    
                    const cursoId = document.getElementById('actividad-cursoSelect').value;
                    if (cursoId) {
                        cargarActividades(cursoId);
                    }
                } catch (error) {
                    console.error('Error eliminando actividad', error);
                }
            }
        });
    });
}

export function inicializarActividades() {
    document.getElementById('crearActividad').addEventListener('click', function() {
        const formulario = document.getElementById('formulario-actividad');
        formulario.classList.remove('hidden');
        
        // Limpiar formulario
        document.getElementById('formActividad').reset();
        
        // Ocultar lista de actividades
        document.getElementById('lista-actividades').style.display = 'none';
    });

    // Event listener para cancelar creación de actividad
    document.getElementById('cancelar-actividad').addEventListener('click', function() {
        const formulario = document.getElementById('formulario-actividad');
        formulario.classList.add('hidden');
        
        // Mostrar lista de actividades
        document.getElementById('lista-actividades').style.display = 'block';
    });

    // Event listener para guardar actividad
    document.getElementById('formActividad').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cursoId = document.getElementById('actividad-cursoSelect').value;
        if (!cursoId) {
            alert('Debe seleccionar un curso');
            return;
        }
        
        const actividadData = {
            nombre: document.getElementById('actividad-nombre').value,
            tipo: document.getElementById('actividad-tipo').value,
            fecha: document.getElementById('actividad-fecha').value,
            descripcion: document.getElementById('actividad-descripcion').value,
            curso_id: parseInt(cursoId)
        };
        
        const materiaId = document.getElementById('actividad-materiaSelect').value;
        if (materiaId) {
            actividadData.materia_id = parseInt(materiaId);
        }
        
        try {
            await API.createActividad(actividadData);
            
            
            document.getElementById('formulario-actividad').classList.add('hidden');
                
            // Mostrar lista de actividades
            document.getElementById('lista-actividades').style.display = 'block';
                
            // Recargar actividades
            cargarActividades(cursoId);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear la actividad');
        }
    });
}