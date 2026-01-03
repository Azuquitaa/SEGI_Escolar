from flask import Blueprint, request, jsonify
from extensions import db
from models.alumno import Alumno
from models.curso import Curso
from models.periodo import PeriodoEvaluativo

alumnos_bp = Blueprint("alumnos", __name__)

# GET /alumnos
@alumnos_bp.route("/", methods=["GET"])
def listar_alumnos():
    alumnos = Alumno.query.all()

    return jsonify([
        {
            "id": a.id,
            "nombre": a.nombre,
            "apellido": a.apellido,
            "estado": a.estado,
            "curso_id": a.curso_id,
            "curso": f"{a.curso.anio}°{a.curso.division}"
        }
        for a in alumnos
    ])


# POST /alumnos
@alumnos_bp.route("/", methods=["POST"])
def crear_alumno():
    data = request.get_json()

    curso = Curso.query.get(data["curso_id"])
    if not curso:
        return jsonify({"error": "Curso no encontrado"}), 404

    alumno = Alumno(
        nombre=data["nombre"],
        apellido=data["apellido"],
        estado=data.get("estado", "activo"),
        curso_id=data["curso_id"]
    )

    db.session.add(alumno)
    db.session.commit()

    return jsonify({"mensaje": "Alumno creado"}), 201

@alumnos_bp.route("/<int:alumno_id>/periodo/<int:periodo_id>", methods=["GET"])
def estado_periodo(alumno_id, periodo_id):
    alumno = Alumno.query.get(alumno_id)
    periodo = PeriodoEvaluativo.query.get(periodo_id)

    if not alumno or not periodo:
        return jsonify({"error": "Alumno o período no encontrado"}), 404

    promedio = alumno.promedio_por_periodo(periodo.id)
    aprueba = alumno.aprueba_periodo(periodo)

    return jsonify({
        "alumno": f"{alumno.nombre}",
        "periodo": periodo.nombre,
        "promedio": promedio,
        "aprueba": aprueba
    })
@alumnos_bp.route("/<int:alumno_id>/estado-final", methods=["GET"])
def estado_final_alumno(alumno_id):
    alumno = Alumno.query.get(alumno_id)
    if not alumno:
        return jsonify({"error": "alumno no encontrado"}), 404
    
    promedio_anual = alumno.promedio_anual()
    estado = alumno.estado_final()

    return jsonify({
        "alumno":alumno.nombre,
        "promedio_anual":promedio_anual,
        "estado_final":estado
    })