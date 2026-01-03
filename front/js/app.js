const API_URL = "http://127.0.0.1:5000";

async function cargarAlumnos() {
    const res= await fetch(`${API_URL}/alumnos`);
    const alumnos = await res.json();

    const select = document.getElementById("alumnoSelect");
    select.innerHTML = "";

    alumnos.forEach(a => {
        const option = document.createElement("option");
        option.value = a.id;
        option.textContent = a.nombre;
        select.appendChild(option);

    });
}

async function cargarEstado() {
    const alumnoId = document.getElementById("alumnoSelect").value;

    const res= await fetch(`${API_URL}/alumnos/${alumnoId}/estado-final`);
    const data= await res.json();

    document.getElementById("resultado").innerHTML = `<p>Promedio anual: ${data.promedio_anual}</p>\n
    <p>Estado: ${data.estado_final}</p>
    `;
}

cargarAlumnos();