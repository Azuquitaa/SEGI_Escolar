from extensions import db

class Nota(db.Model):
    __tablename__ = "notas"

    id = db.Column(db.Integer, primary_key=True)

    valor = db.Column(db.Float, nullable=False)

    alumno_id = db.Column(
        db.Integer,
        db.ForeignKey("alumnos.id"),
        nullable=False
    )

    actividad_id = db.Column(
        db.Integer,
        db.ForeignKey("actividades.id"),
        nullable=False
    )

    periodo_id = db.Column(
        db.Integer,
        db.ForeignKey("periodos.id"),
        nullable=False
    )

    alumno = db.relationship("Alumno", backref="notas")
    actividad = db.relationship("Actividad", backref="notas")
    periodo = db.relationship("PeriodoEvaluativo", backref="notas")

    def __repr__(self):
        return f"<Nota {self.valor}>"
