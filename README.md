# SEGI_Escolar ( Sistema de Gestión de Notas ) 
Este proyecto es un sistema web desarrollado en Python para la gestión de escuelas, cursos, alumnos, materias, actividades y calificaciones.
---

## 🧩 Características
- Gestión de múltiples escuelas
- Organización por cursos y materias
- Administración de alumnos y estados
- Carga de actividades y notas
- Generación de reportes básicos

---

## 🛠️ Tecnologías
- Python 3
- Flask
- HTML / CSS
- SQLite

---

## 📦 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/Azuquitaa/SEGI_Escolar.git


---

## El Paso a Paso
Este sistema debe poder responder preguntas como:

¿A qué escuela pertenece esto?

¿Qué materias tiene un curso?

¿Qué actividades se tomaron en un período?

¿Qué notas tiene un alumno en un cuatrimestre?

¿Aprueba el alumno el año?

Si el modelo está mal pensado:

estas preguntas se vuelven imposibles

o el sistema se rompe cuando crece

## Base de datos:

0 - Escuela

Es la raíz organizativa. (todo depende de la escuela.)

Cada escuela puede tener:

 - materias distintas

 - reglas de aprobación distintas

 - períodos distintos


1 - Curso

Representa un año/división dentro de una escuela.

Decisión importante:

 - un curso pertenece a una escuela

 - un curso no define materias por sí mismo


2 - Alumno

 - pertenece a un curso

 - tiene estado (activo, egresado, etc.)

Las notas no viven en el alumno, viven en una entidad separada (Nota).


3 - Materias (relación de muchos a muchos)

Esta fue una decisión muy importante.

Por ejemplo, realidad escolar:

Matemática existe en 1°, 2°, 3°

2° tiene muchas materias

una materia aparece en muchos cursos

Eso es muchos a muchos.

Por eso al ser una relación de muchos a muchos se debe utilizar una tabla intermedia (curso_materia)


4 - Actividades.

Una actividad puede tener varios tipos:

 - TP (Trabajo práctico)
 - Examen
 - Evaluación

un alumno puede tener varias notas

cada nota responde a una actividad concreta

la actividad pertenece a:

- una materia
- un curso
- un período

Eso permite preguntas como:

“qué evaluaciones hubo en el 1° cuatrimestre de Matemática en 2°A”


5 - Período evaluativo.

Las escuelas pueden evaluar:

 - por bimestres
 - por trimestres
 - por cuatrimestres
 - anual

Entonces en el período se define:

 - nombre (“1° Cuatrimestre”)
 - tipo (“cuatrimestral”)
 - orden (1, 2, 3…)
 - nota mínima para aprobar


6 - Nota.

Una nota une:

- alumno
- actividad
- período

Eso permite:

múltiples notas por actividad

múltiples actividades por período

cálculo correcto de promedios

Además:

validamos que la nota no supere el puntaje máximo

validamos que la nota corresponda al período correcto



