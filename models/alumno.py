from extensions import db
from models.nota import Nota
from models.periodo import PeriodoEvaluativo


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

    def promedio_por_periodo(self, periodo_id):
        notas = Nota.query.filter_by(
            alumno_id=self.id,
            periodo_id=periodo_id
        ).all()

        if not notas:
            return None

        total = sum(n.valor for n in notas)
        return round(total / len(notas), 2)
    
    def aprueba_periodo(self, periodo):
        promedio = self.promedio_por_periodo(periodo.id)

        if promedio is None:
            return False

        return promedio >= periodo.nota_aprobacion


    def promedio_anual(self):
        periodos = PeriodoEvaluativo.query.order_by(
            PeriodoEvaluativo.orden
        ).all()

        promedios = []

        for periodo in periodos:
            promedio = self.promedio_por_periodo(periodo.id)
            if promedio is not None:
                promedios.append(promedio)

        if not promedios:
            return None

        return round(sum(promedios) / len(promedios), 2)

    def estado_final(self):
        periodos = PeriodoEvaluativo.query.all()

        for periodo in periodos:
            if not self.aprueba_periodo(periodo):
                return "repite"
            
        return "aprueba"
