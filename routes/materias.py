from flask import Blueprint, request, jsonify
from extensions import db
from models.materia import Materia
from models.curso import Curso

materias_bp = Blueprint("materias", __name__)

# GET /materias
@materias_bp.route("/", methods=["GET"])
def listar_materias():
    materias = Materia.query.all()

    return jsonify([
        {
            "id": m.id,
            "nombre": m.nombre,
            "escuela_id": m.escuela_id
        }
        for m in materias
    ])


# POST /materias
@materias_bp.route("/", methods=["POST"])
def crear_materia():
    data = request.get_json()

    materia = Materia(
        nombre=data["nombre"],
        escuela_id=data["escuela_id"]
    )

    db.session.add(materia)
    db.session.commit()

    return jsonify({"mensaje": "Materia creada"}), 201


# POST /materias/asignar
@materias_bp.route("/asignar", methods=["POST"])
def asignar_materia_a_curso():
    data = request.get_json()

    curso = Curso.query.get(data["curso_id"])
    materia = Materia.query.get(data["materia_id"])

    if not curso or not materia:
        return jsonify({"error": "Curso o materia no encontrado"}), 404

    if materia not in curso.materias:
        curso.materias.append(materia)
        db.session.commit()

    return jsonify({"mensaje": "Materia asignada al curso"}), 200
