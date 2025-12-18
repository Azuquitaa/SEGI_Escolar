from flask import Blueprint, request, jsonify
from extensions import db
from models.alumno import Alumno
from models.curso import Curso

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
