from flask import Blueprint, request, jsonify
from extensions import db
from models.curso import Curso
from models.escuela import Escuela

cursos_bp = Blueprint("cursos", __name__)

# GET /cursos
@cursos_bp.route("/", methods=["GET"])
def listar_cursos():
    cursos = Curso.query.all()

    return jsonify([
        {
            "id": c.id,
            "anio": c.anio,
            "division": c.division,
            "escuela_id": c.escuela_id,
            "escuela": c.escuela.nombre
        }
        for c in cursos
    ])


# POST /cursos
# {
#     "anio":2,
#     "division":"b",
#     "escuela_id":1
# }

@cursos_bp.route("/", methods=["POST"])
def crear_curso():
    data = request.get_json()

    escuela = Escuela.query.get(data["escuela_id"])
    if not escuela:
        return jsonify({"error": "Escuela no encontrada"}), 404

    curso = Curso(
        anio=data["anio"],
        division=data["division"],
        escuela_id=data["escuela_id"]
    )

    db.session.add(curso)
    db.session.commit()

    return jsonify({"mensaje": "Curso creado"}), 201
