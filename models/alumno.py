from extensions import db

class Alumno(db.Model):
    __tablename__ = "alumnos"

    # columnas
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(10), nullable=False)
    apellido = db.Column(db.String(10), nullable=False)
    # valores: "activo", "egresado", "libre","intensificando"
    estado = db.Column(
        db.String(20),
        nullable=False,
        default="activo"
    )

    # foreign key, que une un alumno con un curso
    curso_id = db.Column(
        db.Integer,
        db.ForeignKey("cursos.id"),
        nullable=False
    )

    def __repr__(self):
        return f"<Alumno {self.apellido},{self.nombre}>"
