from extensions import db
from models.curso_materia import curso_materia

class Materia(db.Model):
    __tablename__ = "materias"

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)

    # la escuela puede ver la cantidad de materias
    escuela_id = db.Column(
        db.Integer,
        db.ForeignKey("escuelas.id"),
        nullable=False
    )

    # cada curso tiene muchas materias
    cursos = db.relationship(
        "Curso",
        secondary=curso_materia, # esto indica la tabla intermedia
        back_populates="materias" #conecta ambos lados de la relación
    )

    def __repr__(self):
        return f"<Materia {self.nombre}>"
