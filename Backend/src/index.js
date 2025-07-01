// 📁 backend/src/index.js (CÓDIGO CORREGIDO)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

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



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Web general
app.use('/api/auth/veterinarios', authVeterinarioRoutes); // Veterinarios
app.use('/api/mobile/auth', authMobileRoutes); // Autenticación móvil

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));