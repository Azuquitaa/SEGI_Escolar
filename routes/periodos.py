from flask import Blueprint, request, jsonify
from extensions import db
from models.periodo import PeriodoEvaluativo
from models.escuela import Escuela

periodos_bp = Blueprint("periodos", __name__)

@periodos_bp.route("/", methods=["POST"])
def crear_periodo():
    data = request.get_json()

    escuela = Escuela.query.get(data["escuela_id"])
    if not escuela:
        return jsonify({"error": "Escuela no encontrada"}), 404

    periodo = PeriodoEvaluativo(
        nombre=data["nombre"],
        tipo=data["tipo"],
        orden=data["orden"],
        nota_aprobacion=data["nota_aprobacion"],
        escuela_id=escuela.id
    )

    db.session.add(periodo)
    db.session.commit()

    return jsonify({"mensaje": "Periodo evaluativo creado"}), 201

@periodos_bp.route("/", methods=["GET"])
def listar_periodos():
    periodos = PeriodoEvaluativo.query.order_by(PeriodoEvaluativo.orden).all()

    return jsonify([
        {
            "id": p.id,
            "nombre": p.nombre,
            "tipo": p.tipo,
            "orden": p.orden,
            "nota_aprobacion": p.nota_aprobacion,
            "escuela_id": p.escuela_id
        }
        for p in periodos
    ])
