const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const Diary = require('../models/diary');
const Consultation = require('../models/consultation');

// Consultation Routes
router.get('/consultations', async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ date: 1 });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/consultations', async (req, res) => {
  const consultation = new Consultation(req.body);
  try {
    const newConsultation = await consultation.save();
    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/consultations/:id', async (req, res) => {
  try {
    const updatedConsultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedConsultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json(updatedConsultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/consultations/:id', async (req, res) => {
  try {
    const result = await Consultation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Todo Routes
router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/todos/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Diary Routes
router.get('/diaries', async (req, res) => {
  try {
    const diaries = await Diary.find().sort({ createdAt: -1 });
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/diaries', async (req, res) => {
  const diary = new Diary(req.body);
  try {
    const newDiary = await diary.save();
    res.status(201).json(newDiary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/diaries/:id', async (req, res) => {
  try {
    const updatedDiary = await Diary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDiary) {
      return res.status(404).json({ message: 'Diary entry not found' });
    }
    res.json(updatedDiary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/diaries/:id', async (req, res) => {
  try {
    await Diary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Diary entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 