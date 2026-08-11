const prisma = require('../config/prisma');

const enviarSolucion = async (req, res) => {
  try {
    const { contenido_respuesta, id_reto } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!contenido_respuesta || !id_reto) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const reto = await prisma.reto.findUnique({ where: { id_reto: parseInt(id_reto) } });
    if (!reto) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    const solucion = await prisma.solucion.create({
      data: { contenido_respuesta, id_reto: parseInt(id_reto), id_usuario }
    });

    return res.status(201).json({ success: true, data: solucion });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const listarSolucionesPorReto = async (req, res) => {
  try {
    const { id } = req.params;

    const reto = await prisma.reto.findUnique({ where: { id_reto: parseInt(id) } });
    if (!reto) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    const soluciones = await prisma.solucion.findMany({
      where: { id_reto: parseInt(id) },
      include: {
        usuario: { select: { nombre: true, correo: true } }
      }
    });

    return res.json({ success: true, data: soluciones });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const listarSolucionesPorUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({ where: { id_usuario: parseInt(id) } });
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const soluciones = await prisma.solucion.findMany({
      where: { id_usuario: parseInt(id) },
      include: {
        reto: { select: { titulo: true, nivel: true, categoria: true } }
      }
    });

    return res.json({ success: true, data: soluciones });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const editarSolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenido_respuesta } = req.body;
    const id_usuario = req.usuario.id_usuario;

    if (!contenido_respuesta) {
      return res.status(400).json({ success: false, message: 'El contenido es obligatorio' });
    }

    const solucion = await prisma.solucion.findUnique({ where: { id_solucion: parseInt(id) } });

    if (!solucion) {
      return res.status(404).json({ success: false, message: 'Solución no encontrada' });
    }

    if (solucion.id_usuario !== id_usuario) {
      return res.status(403).json({ success: false, message: 'Solo el autor puede editar esta solución' });
    }

    if (solucion.estado !== 'PENDIENTE') {
      return res.status(400).json({ success: false, message: 'Solo se pueden editar soluciones en estado PENDIENTE' });
    }

    const actualizada = await prisma.solucion.update({
      where: { id_solucion: parseInt(id) },
      data: { contenido_respuesta }
    });

    return res.json({ success: true, data: actualizada });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { enviarSolucion, listarSolucionesPorReto, listarSolucionesPorUsuario, editarSolucion };