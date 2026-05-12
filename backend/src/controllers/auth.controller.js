const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const register = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    if (contrasena.length < 6) {
      return res.status(400).json({ success: false, message: 'La contraseña debe tener mínimo 6 caracteres' });
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      return res.status(400).json({ success: false, message: 'El correo no tiene un formato válido' });
    }

    const usuarioExiste = await prisma.usuario.findUnique({ where: { correo } });
    if (usuarioExiste) {
      return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const contrasena_hash = await bcrypt.hash(contrasena, 10);

    const usuario = await prisma.usuario.create({
      data: { nombre, correo, contrasena_hash }
    });

    return res.status(201).json({
      success: true,
      data: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, correo: usuario.correo }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      data: { token, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = { register, login };