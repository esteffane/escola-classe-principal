const express = require('express');
const pool = require('./db');
const Escola = require('./escola'); // Supondo que você tenha uma classe Escola definida

const router = express.Router();

// Listar todas as escolas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM escola');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
});

// Obter uma escola pelo ID
router.get('/escola/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM escola WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Escola não encontrada' });
    } else {
      const row = result.rows[0];
      const escola = new Escola(row.id, row.nome, row.cnpj, row.endereco, row.telefone);
      res.json(escola);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar escola' });
  }
});

// Criar uma nova escola
router.post('/escola', async (req, res) => {
  const { nome, cnpj, endereco, telefone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO escola (nome, cnpj, endereco, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, cnpj, endereco, telefone]
    );
    const row = result.rows[0];
    const escola = new Escola(row.id, row.nome, row.cnpj, row.endereco, row.telefone);
    res.status(201).json(escola);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar escola' });
  }
});

// Atualizar uma escola
router.put('/escola/:id', async (req, res) => {
  const id = req.params.id;
  const { nome, cnpj, endereco, telefone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE escola SET nome = $1, cnpj = $2, endereco = $3, telefone = $4 WHERE id = $5 RETURNING *',
      [nome, cnpj, endereco, telefone, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Escola não encontrada' });
    } else {
      const row = result.rows[0];
      const escola = new Escola(row.id, row.nome, row.cnpj, row.endereco, row.telefone);
      res.json(escola);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar escola' });
  }
});

// Deletar uma escola
router.delete('/escola/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM escola WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Escola não encontrada' });
    } else {
      res.json({ message: 'Escola excluída com sucesso' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir escola' });
  }
});

module.exports = router;
