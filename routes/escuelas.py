from flask import Blueprint, request, jsonify
from extensions import db
from models.escuela import Escuela

escuelas_bp = Blueprint("escuelas", __name__)

# GET /escuelas
@escuelas_bp.route("/", methods=["GET"])
def listar_escuelas():
    escuelas = Escuela.query.all()
    resultado = []

    for e in escuelas:
        resultado.append({
            "id": e.id,
            "nombre": e.nombre,
            "nivel": e.nivel
        })

    return jsonify(resultado)


# POST /escuelas
# {
#     "nombre":"Escuela Normal",
#     "nivel":"Secundaria"
# }

@escuelas_bp.route("/", methods=["POST"])
def crear_escuela():
    data = request.json

    nueva_escuela = Escuela(
        nombre=data["nombre"],
        nivel=data["nivel"]
    )

    db.session.add(nueva_escuela)
    db.session.commit()

    return jsonify({"mensaje": "Escuela creada correctamente"}), 201
