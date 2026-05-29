const express = require('express');
const client = require('prom-client');
const { Pool } = require('pg'); 
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error(' Error crítico al conectar a PostgreSQL:', err.stack);
    } else {
        console.log(' Conexión exitosa a PostgreSQL. Hora del servidor DB:', res.rows[0].now);
    }
});

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get('/compute', (req, res) => {
    let cycle = 0;
    for (let i = 0; i < 50000000; i++) {
        cycle += Math.sqrt(i);
    }
    res.send(`Cálculo completado por el contenedor en el puerto ${port}. Resultado: ${cycle}`);
});

app.get('/db-check', async (req, res) => {
    try {
        const dbRes = await pool.query('SELECT NOW() as current_time');
        res.send(`Conexión a la Base de Datos OK. Hora de Postgres: ${dbRes.rows[0].current_time} (Atendido por instancia en puerto ${port})`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error de comunicación con el servicio de Base de Datos');
    }
});

app.get('/', (req, res) => {
    res.send(`Hola desde la instancia de la Aplicación corriendo en el puerto ${port}`);
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(port, () => {
    console.log(`Aplicación escuchando en http://localhost:${port}`);
});