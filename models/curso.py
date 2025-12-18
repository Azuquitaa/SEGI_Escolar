from extensions import db

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

    def __repr__(self):
        return f"<Curso {self.anio}°{self.division}>"
