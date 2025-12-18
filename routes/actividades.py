from flask import Blueprint, request, jsonify
from datetime import datetime
from extensions import db
from models.actividad import Actividad
from models.curso import Curso
from models.materia import Materia

actividades_bp = Blueprint("actividades", __name__)

# GET /actividades
@actividades_bp.route("/", methods=["GET"])
def listar_actividades():
    actividades = Actividad.query.all()

    return jsonify([
        {
            "id": a.id,
            "titulo": a.titulo,
            "tipo": a.tipo,
            "fecha": a.fecha.isoformat(),
            "puntaje_max": a.puntaje_max,
            "materia": a.materia.nombre,
            "curso": f"{a.curso.anio}°{a.curso.division}"
        }
        for a in actividades
    ])


# POST /actividades
@actividades_bp.route("/", methods=["POST"])
def crear_actividad():
    data = request.get_json()

    curso = Curso.query.get(data["curso_id"])
    materia = Materia.query.get(data["materia_id"])

    if not curso or not materia:
        return jsonify({"error": "Curso o materia no encontrado"}), 404

    actividad = Actividad(
        titulo=data["titulo"],
        tipo=data["tipo"],
        fecha=datetime.strptime(data["fecha"], "%Y-%m-%d").date(),
        puntaje_max=data["puntaje_max"],
        curso_id=curso.id,
        materia_id=materia.id
    )

    db.session.add(actividad)
    db.session.commit()

    return jsonify({"mensaje": "Actividad creada"}), 201
