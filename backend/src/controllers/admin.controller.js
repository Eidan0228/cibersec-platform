const prisma = require('../config/prisma');

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        rol: true,
        puntos_totales: true,
        fecha_registro: true,
        _count: {
          select: {
            retos_creados: true,
            soluciones: true
          }
        }
      },
      orderBy: { fecha_registro: 'desc' }
    });
    return res.json({ success: true, data: usuarios });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({ where: { id_usuario: parseInt(id) } });
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (usuario.rol === 'ADMIN') {
      return res.status(403).json({ success: false, message: 'No puedes eliminar un administrador' });
    }

    await prisma.evaluacion.deleteMany({ where: { id_usuario: parseInt(id) } });
    await prisma.comentario.deleteMany({ where: { id_usuario: parseInt(id) } });
    await prisma.solucion.deleteMany({ where: { id_usuario: parseInt(id) } });
    await prisma.reto.deleteMany({ where: { id_creador: parseInt(id) } });
    await prisma.usuario.delete({ where: { id_usuario: parseInt(id) } });

    return res.json({ success: true, data: 'Usuario eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const cambiarEstadoSolucion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['PENDIENTE', 'APROBADO', 'RECHAZADO'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    const solucion = await prisma.solucion.update({
      where: { id_solucion: parseInt(id) },
      data: { estado }
    });

    return res.json({ success: true, data: solucion });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const obtenerTodasSoluciones = async (req, res) => {
  try {
    const soluciones = await prisma.solucion.findMany({
      include: {
        usuario: { select: { nombre: true, correo: true } },
        reto: { select: { titulo: true } }
      },
      orderBy: { fecha_envio: 'desc' }
    });
    return res.json({ success: true, data: soluciones });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { obtenerUsuarios, eliminarUsuario, cambiarEstadoSolucion, obtenerTodasSoluciones };