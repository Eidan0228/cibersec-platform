const prisma = require('../config/prisma');

const agregarComentario = async (req, res) => {
  try {
    const { contenido, id_solucion } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!contenido || !id_solucion) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const solucion = await prisma.solucion.findUnique({ where: { id_solucion: parseInt(id_solucion) } });
    if (!solucion) {
      return res.status(404).json({ success: false, message: 'Solución no encontrada' });
    }

    const comentario = await prisma.comentario.create({
      data: { contenido, id_solucion: parseInt(id_solucion), id_usuario }
    });

    return res.status(201).json({ success: true, data: comentario });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const listarComentarios = async (req, res) => {
  try {
    const { id } = req.params;

    const solucion = await prisma.solucion.findUnique({ where: { id_solucion: parseInt(id) } });
    if (!solucion) {
      return res.status(404).json({ success: false, message: 'Solución no encontrada' });
    }

    const comentarios = await prisma.comentario.findMany({
      where: { id_solucion: parseInt(id) },
      include: {
        usuario: { select: { nombre: true, correo: true } }
      }
    });

    return res.json({ success: true, data: comentarios });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { agregarComentario, listarComentarios };