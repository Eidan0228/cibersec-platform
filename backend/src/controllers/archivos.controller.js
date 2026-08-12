const prisma = require('../config/prisma');
const path = require('path');
const fs = require('fs');

const subirArchivo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se subió ningún archivo' });
    }

    const reto = await prisma.reto.findUnique({ where: { id_reto: parseInt(id) } });
    if (!reto) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    if (reto.id_creador !== req.usuario.id_usuario && req.usuario.rol !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'No tienes permiso para subir archivos a este reto' });
    }

    const archivo = await prisma.archivoAdjunto.create({
      data: {
        nombre_archivo: req.file.originalname,
        ruta: req.file.path,
        tipo: req.file.mimetype,
        id_reto: parseInt(id)
      }
    });

    return res.status(201).json({ success: true, data: archivo });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al subir el archivo' });
  }
};

const obtenerArchivos = async (req, res) => {
  try {
    const { id } = req.params;

    const archivos = await prisma.archivoAdjunto.findMany({
      where: { id_reto: parseInt(id) }
    });

    return res.json({ success: true, data: archivos });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error al obtener archivos' });
  }
};

module.exports = { subirArchivo, obtenerArchivos };