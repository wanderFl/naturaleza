const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json());

// Datos simulados (ejemplo de empleados)
const empleados = [
    { id: 1, nombre: "Juan Pérez", cargo: "Desarrollador" },
    { id: 2, nombre: "María López", cargo: "Diseñadora UX" },
    { id: 3, nombre: "Carlos Gómez", cargo: "DevOps Engineer" }
];

// Ruta para obtener los empleados
app.get('/empleados', (req, res) => {
    res.json(empleados);
});

// Ruta para obtener un empleado por ID
app.get('/empleados/:id', (req, res) => {
    const empleado = empleados.find(emp => emp.id === parseInt(req.params.id));
    empleado ? res.json(empleado) : res.status(404).json({ mensaje: "Empleado no encontrado" });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
