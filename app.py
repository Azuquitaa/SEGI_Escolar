from flask import Flask
from flask_cors import CORS
from extensions import db


# se fabrica la app.. no se crea
def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object("config.Config")

    db.init_app(app)

    # rutas
    from routes.escuelas import escuelas_bp
    from routes.cursos import cursos_bp
    from routes.alumnos import alumnos_bp
    from routes.materias import materias_bp
    from routes.actividades import actividades_bp
    from routes.notas import notas_bp
    from routes.periodos import periodos_bp

    app.register_blueprint(escuelas_bp, url_prefix="/escuelas")
    app.register_blueprint(cursos_bp, url_prefix="/cursos")
    app.register_blueprint(alumnos_bp, url_prefix="/alumnos")
    app.register_blueprint(materias_bp, url_prefix="/materias")
    app.register_blueprint(actividades_bp, url_prefix="/actividades")
    app.register_blueprint(notas_bp, url_prefix="/notas")
    app.register_blueprint(periodos_bp, url_prefix="/periodos")

    @app.route("/")
    def index():
        return "Sistema de Gestión de Notas"

    return app


if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        db.create_all()

    app.run(debug=True)
