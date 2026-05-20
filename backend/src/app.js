require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
app.disable('x-powered-by');

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:8080';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'taskflow-backend' });
});

app.use('/api/tasks', tasksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
