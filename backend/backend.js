const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
};

// Routes
app.get('/api/todos', async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

app.post('/api/todos', async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Text is required' });
    }
    const todo = new Todo({ text });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    next(error);
  }
});

app.put('/api/todos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/todos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Apply error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});