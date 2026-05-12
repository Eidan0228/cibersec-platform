const prisma = require('../config/prisma');

const evaluarSolucion = async (req, res) => {
  try {
    const { puntuacion, comentario, id_solucion } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!puntuacion || !id_solucion) {
      return res.status(400).json({ success: false, message: 'Puntuación y solución son obligatorios' });
    }

    if (puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ success: false, message: 'La puntuación debe ser entre 1 y 5' });
    }

    const solucion = await prisma.solucion.findUnique({ where: { id_solucion: parseInt(id_solucion) } });
    if (!solucion) {
      return res.status(404).json({ success: false, message: 'Solución no encontrada' });
    }

    if (solucion.id_usuario === id_usuario) {
      return res.status(403).json({ success: false, message: 'No puedes evaluar tu propia solución' });
    }

    const evaluacionExistente = await prisma.evaluacion.findUnique({
      where: { id_usuario_id_solucion: { id_usuario, id_solucion: parseInt(id_solucion) } }
    });
    if (evaluacionExistente) {
      return res.status(400).json({ success: false, message: 'Ya evaluaste esta solución' });
    }

    const evaluacion = await prisma.evaluacion.create({
      data: { puntuacion, comentario, id_solucion: parseInt(id_solucion), id_usuario }
    });

    const evaluaciones = await prisma.evaluacion.findMany({
      where: { id_solucion: parseInt(id_solucion) }
    });
    const promedio = Math.round(evaluaciones.reduce((acc, e) => acc + e.puntuacion, 0) / evaluaciones.length);

    await prisma.solucion.update({
      where: { id_solucion: parseInt(id_solucion) },
      data: { puntaje_obtenido: promedio }
    });

    await prisma.usuario.update({
      where: { id_usuario: solucion.id_usuario },
      data: { puntos_totales: { increment: puntuacion } }
    });

    return res.status(201).json({ success: true, data: evaluacion });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { evaluarSolucion };