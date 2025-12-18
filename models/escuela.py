from extensions import db


class Escuela(db.Model):
    __tablename__ = "escuelas" # nombre tabla

    # creacion de columnas, tipos de columnas, primary key y foreign key
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    nivel = db.Column(db.String(50), nullable=False)

    cursos = db.relationship(
        "Curso",
        backref="escuela",
        lazy=True,
        cascade="all, delete-orphan"
    ) # cascada, si se elimina una escuela se elimina el curso tambien

    def __repr__(self):
        return f"<Escuela {self.nombre}>"
