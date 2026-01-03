from flask import Blueprint, request, jsonify
from datetime import datetime
from extensions import db
from models.actividad import Actividad
from models.curso import Curso
from models.materia import Materia
from models.periodo import PeriodoEvaluativo

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
            "fecha_inicio": a.fecha_inicio,
            "fecha_final": a.fecha_final,
            "puntaje_max": a.puntaje_max,
            "observaciones":a.observaciones,
            "materia": a.materia.nombre,
            "curso": f"{a.curso.anio}°{a.curso.division}"
        }
        for a in actividades
    ])


# POST /actividades
@actividades_bp.route("/", methods=["POST"])
def crear_actividad():

    data = request.get_json()

    periodo = PeriodoEvaluativo.query.get(data["periodo_id"])
    if not periodo:
        return jsonify({"error": "Periodo no encontrado"}), 404
    
    fecha_inicio = datetime.strptime(
        data["fecha_inicio"], "%Y-%m-%d"
    ).date()

    fecha_final = None
    if data.get("fecha_final"):
        fecha_final = datetime.strptime(
            data["fecha_final"], "%Y-%m-%d"
        ).date()

    actividad = Actividad(
        titulo=data["titulo"],
        tipo=data["tipo"],
        fecha_inicio=fecha_inicio,
        fecha_final=fecha_final,
        puntaje_max=data["puntaje_max"],
        observaciones=data.get("observaciones"),
        materia_id=data["materia_id"],
        curso_id=data["curso_id"],
        periodo_id = periodo.id
    )

    db.session.add(actividad)
    db.session.commit()

    return jsonify({"mensaje": "Actividad creada"}), 201