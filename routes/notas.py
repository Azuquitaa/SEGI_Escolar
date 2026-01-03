from flask import Blueprint, request, jsonify
from extensions import db
from models.nota import Nota
from models.alumno import Alumno
from models.actividad import Actividad
from models.periodo import PeriodoEvaluativo

notas_bp = Blueprint("notas", __name__)

@notas_bp.route("/", methods=["POST"])
def crear_nota():
    data = request.get_json()

    alumno = Alumno.query.get(data["alumno_id"])
    actividad = Actividad.query.get(data["actividad_id"])
    periodo = PeriodoEvaluativo.query.get(data["periodo_id"])

    if actividad.periodo_id != periodo.id:
        return jsonify({
            "error": "La actividad no pertenece a este período"
        }), 400


    if not alumno or not actividad or not periodo:
        return jsonify({"error": "Alumno, actividad o período no encontrado"}), 404

    valor = float(data["valor"])

    if valor > actividad.puntaje_max:
        return jsonify({
            "error": "La nota supera el puntaje máximo de la actividad"
        }), 400

    nota = Nota(
        valor=valor,
        alumno_id=alumno.id,
        actividad_id=actividad.id,
        periodo_id=periodo.id
    )

    db.session.add(nota)
    db.session.commit()

    return jsonify({"mensaje": "Nota cargada"}), 201
