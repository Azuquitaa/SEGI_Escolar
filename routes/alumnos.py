from flask import Blueprint, request, jsonify
from extensions import db
from models.alumno import Alumno
from models.curso import Curso
from models.periodo import PeriodoEvaluativo

alumnos_bp = Blueprint("alumnos", __name__)


# POST /alumnos
@alumnos_bp.route("/", methods=["POST"])
def crear_alumno():
    data = request.get_json()

    curso = Curso.query.get(data["curso_id"])
    if not curso:
        return jsonify({"error": "Curso no encontrado"}), 404

    alumno = Alumno(
        nombre=data["nombre"].strip().title(),
        apellido=data["apellido"].strip().title(),
        dni=data["dni"].strip(),
        estado="activo",
        curso_id=data["curso_id"]
    )

    db.session.add(alumno)
    db.session.commit()

    return jsonify({"mensaje": "Alumno creado"}), 201


# GET /alumnos
@alumnos_bp.route("/", methods=["GET"])
def listar_alumnos():
    curso_id = request.args.get("curso_id")
    id = request.args.get("id")

    query = Alumno.query.filter_by(activo=True)
    if id:
        query = query.filter_by(id=id)
    elif curso_id:
        query = query.filter_by(curso_id=curso_id)

    alumnos = query.all()

    return jsonify([
        {
            "id": a.id,
            "nombre": a.nombre,
            "apellido": a.apellido,
            "dni": a.dni,
            "estado": a.estado,
            "curso_id": a.curso_id,
            "curso": f"{a.curso.anio}°{a.curso.division}"
        }
        for a in alumnos
    ])


@alumnos_bp.route("/<int:id>", methods=["GET"])
def obtener_alumno(id):
    a = Alumno.query.get_or_404(id)

    return jsonify({
            "id": a.id,
            "nombre": a.nombre,
            "apellido": a.apellido,
            "dni": a.dni,
            "estado": a.estado,
            "curso_id": a.curso_id,
            "curso": f"{a.curso.anio}°{a.curso.division}"
    })


# PUT -  actualizacion
@alumnos_bp.route("/<int:id>", methods=["PUT"])
def editar_alumno(id):
    alumno = Alumno.query.get_or_404(id)
    data = request.get_json()
    alumno.nombre = data["nombre"].strip().title()
    alumno.apellido= data["apellido"].strip().title()
    alumno.dni= data["dni"].strip()
    alumno.estado= data.get("estado", "activo").strip().title()

    if "curso_id" in data:
        curso = Curso.query.get(data["curso_id"])
        if not curso:
            return jsonify({"error": "Escuela no encontrada"}), 404
        alumno.curso_id = data["curso_id"]

    db.session.commit()
    return jsonify({"msg": "Alumno actualizada"}), 200

# PUT BORRADO LÓGICO
@alumnos_bp.route("/<int:alumno_id>/desactivar", methods=["PUT"])
def desactivar_alumno(alumno_id):
    alumno = Alumno.query.get(alumno_id)

    if not alumno:
        return jsonify({"error": "Alumno no encontrado"}), 404

    alumno.activo = False
    db.session.commit()

    return jsonify({"mensaje": "Alumno desactivado"})

# PUT REACTIVAR EL ALUMNO
@alumnos_bp.route("/<int:alumno_id>/activar", methods=["PUT"])
def activar_alumno(alumno_id):
    alumno = Alumno.query.get(alumno_id)

    if not alumno:
        return jsonify({"error": "Alumno no encontrado"}), 404

    alumno.activo = True
    db.session.commit()

    return jsonify({"mensaje": "Alumno reactivado"})




@alumnos_bp.route("/<int:alumno_id>/periodo/<int:periodo_id>", methods=["GET"])
def estado_periodo(alumno_id, periodo_id):
    alumno = Alumno.query.get(alumno_id)
    periodo = PeriodoEvaluativo.query.get(periodo_id)

    if not alumno or not periodo:
        return jsonify({"error": "Alumno o período no encontrado"}), 404

    promedio = alumno.promedio_por_periodo(periodo.id)
    aprueba = alumno.aprueba_periodo(periodo)

    return jsonify({
        "alumno": f"{alumno.nombre}",
        "periodo": periodo.nombre,
        "promedio": promedio,
        "aprueba": aprueba
    })
@alumnos_bp.route("/<int:alumno_id>/estado-final", methods=["GET"])
def estado_final_alumno(alumno_id):
    alumno = Alumno.query.get(alumno_id)
    if not alumno:
        return jsonify({"error": "alumno no encontrado"}), 404
    
    promedio_anual = alumno.promedio_anual()
    estado = alumno.estado_final()

    return jsonify({
        "alumno":alumno.nombre,
        "promedio_anual":promedio_anual,
        "estado_final":estado
    })