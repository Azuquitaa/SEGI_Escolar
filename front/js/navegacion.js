import { cargarEscuelas } from './escuelas.js';
import { cargarCursos } from './cursos.js';
import { cargarEscuelasParaActividades, cargarMateriasParaActividades } from './actividades.js';

export function inicializarNavegacion() {
    const inicioSection = document.getElementById('inicio-section');
    const actividadesSection = document.getElementById('actividades-section');
    
    // Event listeners para el menú
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Remover clase active de todos los items
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Agregar clase active al item clickeado
            this.classList.add('active');
            
            // Mostrar la sección correspondiente
            if (section === 'inicio') {
                inicioSection.style.display = 'block';
                actividadesSection.style.display = 'none';
                
            } else if (section === 'actividades') {
                inicioSection.style.display = 'none';
                actividadesSection.style.display = 'block';
                
                // Cargar datos necesarios para actividades
                cargarEscuelasParaActividades();
                cargarMateriasParaActividades();
            }
        });
    });
}