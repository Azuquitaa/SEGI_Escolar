from flask import Blueprint, request, jsonify
from extensions import db
from models.curso import Curso
from models.escuela import Escuela

cursos_bp = Blueprint("cursos", __name__)

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


# PUT -  actualizacion
@cursos_bp.route("/<int:id>", methods=["PUT"])
def editar_curso(id):
    curso = Curso.query.get_or_404(id)
    data = request.get_json()
    curso.anio=data["anio"]
    curso.division=data["division"]

    if "escuela_id" in data:
        escuela = Escuela.query.get(data["escuela_id"])
        if not escuela:
            return jsonify({"error": "Escuela no encontrada"}), 404
        curso.escuela_id = data["escuela_id"]

    db.session.commit()
    return jsonify({"msg": "Curso actualizada"}), 200


@cursos_bp.route("/", methods=["GET"])
def listar_cursos():
    escuela_id = request.args.get("escuela_id") # filtrar por id de escuela
    id = request.args.get("id") # filtrar por id de curso

    query = Curso.query
    if id:
        query = query.filter_by(id=id)
    elif escuela_id:
        query = query.filter_by(escuela_id=escuela_id)

    cursos = query.all()

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

@cursos_bp.route("/<int:id>", methods=["GET"])
def obtener_curso(id):
    c = Curso.query.get_or_404(id)

    return jsonify({
            "id": c.id,
            "anio": c.anio,
            "division": c.division,
            "escuela_id": c.escuela_id,
            "escuela": c.escuela.nombre
        
    })

