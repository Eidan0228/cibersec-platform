const esAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Acceso denegado. Se requiere rol ADMIN' });
  }
  next();
};

module.exports = { esAdmin };