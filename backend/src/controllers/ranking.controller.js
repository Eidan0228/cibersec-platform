const prisma = require('../config/prisma');

const obtenerRanking = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        correo: true,
        puntos_totales: true,
        rol: true,
        _count: {
          select: {
            soluciones: true,
            retos_creados: true
          }
        }
      },
      orderBy: {
        puntos_totales: 'desc'
      }
    });

    return res.json({ success: true, data: usuarios });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { obtenerRanking };