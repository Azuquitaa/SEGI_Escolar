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
# creacion
@escuelas_bp.route("/", methods=["POST"])
def crear_escuela():
    data = request.json

    escuela = Escuela(
        nombre=data["nombre"].strip().title(),
        nivel=data["nivel"].strip().title()
    )

    db.session.add(escuela)
    db.session.commit()

    return jsonify({"mensaje": "Escuela creada correctamente"}), 201

# actualizacion
@escuelas_bp.route("/<int:id>", methods=["PUT"])
def editar_escuela(id):
    escuela = Escuela.query.get_or_404(id)
    data = request.json
    escuela.nombre = data["nombre"].strip().title()
    escuela.nivel = data["nivel"]
    db.session.commit()
    return jsonify({"msg": "Escuela actualizada"}), 200