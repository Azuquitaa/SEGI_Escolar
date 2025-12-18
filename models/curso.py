from extensions import db
from models.curso_materia import curso_materia

class Curso(db.Model):
    __tablename__ = "cursos"

    # columnas
    id = db.Column(db.Integer, primary_key=True)
    anio = db.Column(db.Integer, nullable=False)
    division = db.Column(db.String(10), nullable=False)
    # foreign key, se une un curso depende de una escuela
    escuela_id = db.Column(
        db.Integer,
        db.ForeignKey("escuelas.id"),
        nullable=False
    )
    # relacion de uno a muchos, un curso tiene muchos alumnos
    alumnos = db.relationship(
        "Alumno",
        backref="curso",
        lazy=True,
        cascade="all, delete-orphan"
    )

    # relacion muchos a muchos.
    materias = db.relationship(
        "Materia",
        secondary=curso_materia,
        back_populates="cursos"
    )

    def __repr__(self):
        return f"<Curso {self.anio}°{self.division}>"
