from extensions import db

class Actividad(db.Model):
    __tablename__ = "actividades"

    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    puntaje_max = db.Column(db.Integer, nullable=False)

    materia_id = db.Column(
        db.Integer,
        db.ForeignKey("materias.id"),
        nullable=False
    )

    curso_id = db.Column(
        db.Integer,
        db.ForeignKey("cursos.id"),
        nullable=False
    )

    materia = db.relationship("Materia", backref="actividades")
    curso = db.relationship("Curso", backref="actividades")

    def __repr__(self):
        return f"<Actividad {self.titulo}>"
