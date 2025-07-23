// Backend/src/index.js - ARCHIVO LIMPIO Y CORREGIDO
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// ===== RUTAS DE ANIMTECH =====
const authRoutes = require('./routes/auth.routes'); 
const authVeterinarioRoutes = require('./routes/authVeterinario.routes'); 
const authMobileRoutes = require('./routes/authMobile.routes'); 
const petRoutes = require('./routes/pet.routes');
const historialRoutes = require('./routes/historial.routes');
const turnosRoutes = require('./routes/turnos.routes');
const veterinariosRoutes = require('./routes/veterinarios.routes');
const teleconsultaRoutes = require('./routes/teleconsulta.routes');
const clinicasRoutes = require('./routes/clinicas.routes'); 
const perfilMascotaRoutes = require('./routes/perfilMascota.routes');
const eventosRoutes = require('./routes/eventos.routes'); 
const userRoutes = require('./routes/user.routes');
const reportesRoutes = require('./routes/reportes.routes');
const historialMobileRoutes = require('./routes/historialMobile.routes');
const rolesRoutes = require('./routes/roles.routes'); 
const reportesWebGeneralRoutes = require('./routes/reporteswebgeneral.routes');
const chatbotRoutes = require('./routes/chatbot.routes');
const chatbotMobileRoutes = require('./routes/chatbotMobile.routes');

// ===== NUEVA RUTA PARA RED SOCIAL =====
const socialRoutes = require('./routes/social.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Registrar rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/auth/veterinarios', authVeterinarioRoutes);
app.use('/api/mobile/auth', authMobileRoutes);
app.use('/api/mascotas', petRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/veterinarios', veterinariosRoutes);
app.use('/api/teleconsultas', teleconsultaRoutes);
app.use('/api/clinicas', clinicasRoutes); 
app.use('/api/perfiles-mascotas', perfilMascotaRoutes); 
app.use('/api/eventos', eventosRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/historialMobile', historialMobileRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/reporteswebgeneral', reportesWebGeneralRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chatbot-mobile', chatbotMobileRoutes);

// ===== NUEVA RUTA PARA LA RED SOCIAL =====
app.use('/api/social', socialRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🤖 AnimBot (Web): http://localhost:${PORT}/api/chatbot`);
  console.log(`📱 AnimBot (Móvil): http://localhost:${PORT}/api/chatbot-mobile`);
  console.log(`🌐 Red Social: http://localhost:${PORT}/api/social`);
});