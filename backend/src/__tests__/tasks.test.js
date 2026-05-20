jest.mock('../db', () => ({
    query: jest.fn(),
  }));
  
  const request = require('supertest');
  const app = require('../app');
  const pool = require('../db');
  
  describe('Rotas /api/tasks', () => {
    beforeEach(() => {
      pool.query.mockReset();
    });
  
    it('GET /api/tasks retorna 200 com lista de tarefas', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, titulo: 'Estudar' }] });
  
      const res = await request(app).get('/api/tasks');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, titulo: 'Estudar' }]);
    });
  
    it('POST /api/tasks sem titulo retorna 400', async () => {
      const res = await request(app).post('/api/tasks').send({});
  
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'O campo titulo e obrigatorio' });
    });
  
    it('GET /api/tasks/:id inexistente retorna 404', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
  
      const res = await request(app).get('/api/tasks/999');
  
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Tarefa nao encontrada' });
    });
  });
  