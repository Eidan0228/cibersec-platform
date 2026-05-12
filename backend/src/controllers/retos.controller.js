const prisma = require('../config/prisma');

const crearReto = async (req, res) => {
  try {
    const { titulo, descripcion, nivel, categoria } = req.body;
    const id_creador = req.usuario.id_usuario;

    if (!titulo || !descripcion || !nivel || !categoria) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const nivelesValidos = ['BASICO', 'INTERMEDIO', 'AVANZADO'];
    if (!nivelesValidos.includes(nivel)) {
      return res.status(400).json({ success: false, message: 'Nivel inválido. Usa BASICO, INTERMEDIO o AVANZADO' });
    }

    const reto = await prisma.reto.create({
      data: { titulo, descripcion, nivel, categoria, id_creador }
    });

    return res.status(201).json({ success: true, data: reto });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const listarRetos = async (req, res) => {
  try {
    const retos = await prisma.reto.findMany({
      include: {
        creador: { select: { nombre: true, correo: true } }
      }
    });

    return res.json({ success: true, data: retos });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const verReto = async (req, res) => {
  try {
    const { id } = req.params;

    const reto = await prisma.reto.findUnique({
      where: { id_reto: parseInt(id) },
      include: {
        creador: { select: { nombre: true, correo: true } },
        archivos: true
      }
    });

    if (!reto) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    return res.json({ success: true, data: reto });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const editarReto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, nivel, categoria } = req.body;
    const { id_usuario, rol } = req.usuario;

    const reto = await prisma.reto.findUnique({ where: { id_reto: parseInt(id) } });

    if (!reto) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    if (reto.id_creador !== id_usuario && rol !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar este reto' });
    }

    const nivelesValidos = ['BASICO', 'INTERMEDIO', 'AVANZADO'];
    if (nivel && !nivelesValidos.includes(nivel)) {
      return res.status(400).json({ success: false, message: 'Nivel inválido. Usa BASICO, INTERMEDIO o AVANZADO' });
    }

    const retoActualizado = await prisma.reto.update({
      where: { id_reto: parseInt(id) },
      data: { titulo, descripcion, nivel, categoria }
    });

    return res.json({ success: true, data: retoActualizado });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const eliminarReto = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario, rol } = req.usuario;

    const reto = await prisma.reto.findUnique({ where: { id_reto: parseInt(id) } });

    if (!reto) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    if (reto.id_creador !== id_usuario && rol !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para eliminar este reto' });
    }

    await prisma.reto.delete({ where: { id_reto: parseInt(id) } });

    return res.json({ success: true, data: 'Reto eliminado correctamente' });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { crearReto, listarRetos, verReto, editarReto, eliminarReto };