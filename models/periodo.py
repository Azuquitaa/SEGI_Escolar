from extensions import db

# este modelo indica y define cómo se evalua
class PeriodoEvaluativo(db.Model):
    __tablename__ = "periodos"

    id = db.Column(db.Integer, primary_key=True)

    nombre = db.Column(db.String(50), nullable=False)
    tipo = db.Column(db.String(20), nullable=False)
    orden = db.Column(db.Integer, nullable=False)

    nota_aprobacion = db.Column(db.Float, nullable=False)

    escuela_id = db.Column(
        db.Integer,
        db.ForeignKey("escuelas.id"),
        nullable=False
    )

    escuela = db.relationship("Escuela", backref="periodos")

    def __repr__(self):
        return f"<Periodo {self.nombre}>"
