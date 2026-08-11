const prisma = require('../config/prisma');

const obtenerPerfil = async (req, res) => {
  try {
    const id_usuario = req.usuario.id_usuario;

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario },
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
            soluciones: true,
            comentarios: true,
            evaluaciones: true
          }
        },
        retos_creados: {
          select: { id_reto: true, titulo: true, nivel: true, categoria: true, fecha_creacion: true }
        },
        soluciones: {
          select: {
            id_solucion: true,
            contenido_respuesta: true,
            estado: true,
            puntaje_obtenido: true,
            fecha_envio: true,
            reto: { select: { titulo: true } }
          },
          orderBy: { fecha_envio: 'desc' }
        }
      }
    });

    return res.json({ success: true, data: usuario });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { obtenerPerfil };