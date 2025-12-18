from extensions import db

# no tiene modelo propio

# solo une cursos con materias
curso_materia = db.Table(
    "curso_materia",
    db.Column("curso_id", db.Integer, db.ForeignKey("cursos.id"), primary_key=True),
    db.Column("materia_id", db.Integer, db.ForeignKey("materias.id"), primary_key=True)
)

