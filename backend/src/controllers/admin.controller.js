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

const obtenerTodosRetos = async (req, res) => {
  try {
    const retos = await prisma.reto.findMany({
      include: {
        creador: { select: { nombre: true, correo: true } },
        _count: { select: { soluciones: true } }
      },
      orderBy: { fecha_creacion: 'desc' }
    });
    return res.json({ success: true, data: retos });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const editarRetoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, nivel, categoria } = req.body;

    const reto = await prisma.reto.update({
      where: { id_reto: parseInt(id) },
      data: { titulo, descripcion, nivel, categoria }
    });

    return res.json({ success: true, data: reto });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
const obtenerMetricas = async (req, res) => {
  try {
    const [totalUsuarios, totalRetos, totalSoluciones, totalComentarios, totalEvaluaciones, solucionesPorEstado] = await Promise.all([
      prisma.usuario.count(),
      prisma.reto.count(),
      prisma.solucion.count(),
      prisma.comentario.count(),
      prisma.evaluacion.count(),
      prisma.solucion.groupBy({
        by: ['estado'],
        _count: { estado: true }
      })
    ]);

    const topUsuarios = await prisma.usuario.findMany({
      select: { nombre: true, puntos_totales: true },
      orderBy: { puntos_totales: 'desc' },
      take: 3
    });

    return res.json({
      success: true,
      data: {
        totalUsuarios,
        totalRetos,
        totalSoluciones,
        totalComentarios,
        totalEvaluaciones,
        solucionesPorEstado,
        topUsuarios
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { obtenerUsuarios, eliminarUsuario, cambiarEstadoSolucion, obtenerTodasSoluciones, obtenerTodosRetos, editarRetoAdmin, obtenerMetricas };
