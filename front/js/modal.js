import { modalConfig, modalEntidad, modalEditandoId } from './config.js';

const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");
const modalCampos = document.getElementById("modalCampos");

// Exportar funciones
export function abrirModal(entidad, modo, datos = {}) {
    // Actualizar variables globales
    window.modalEntidad = entidad;
    window.modalEditandoId = modo === "editar" ? datos.id : null;

    const config = modalConfig[entidad];

    modalTitulo.textContent = modo === "crear" ? config.tituloCrear : config.tituloEditar;
    modalCampos.innerHTML = "";

    config.campos.forEach(campo => {
        const label = document.createElement("label");
        label.textContent = campo.label;

        const input = document.createElement("input");
        input.id = `modal-${campo.id}`;
        input.value = datos[campo.id] || "";

        modalCampos.appendChild(label);
        modalCampos.appendChild(input);
    });

    modal.classList.remove("hidden");
}

export function cerrarModal() {
    modal.classList.add("hidden");
}

// Inicializar eventos del modal
export function inicializarModal() {
    document.getElementById("modalCancelar").addEventListener("click", cerrarModal);
}