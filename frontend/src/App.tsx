import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:5000/api/todos';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      // Do not set error state here as we are removing error handling
      console.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTodo })
      });
      if (!response.ok) throw new Error('Failed to add todo');
      const todo: Todo = await response.json();
      setTodos([todo, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Failed to add todo');
    }
  };

  const updateTodo = async (id: string) => {
    if (!editText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText })
      });
      if (!response.ok) throw new Error('Failed to update todo');
      const updatedTodo: Todo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
      setEditingId(null);
    } catch (error) {
      console.error('Failed to update todo');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My TODO List
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo xD"
            disabled={isLoading}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : todos.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No todos yet
          </Typography>
        ) : (
          <List>
            {todos.map(todo => (
              <ListItem
                key={todo._id}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  p: 1
                }}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setEditingId(todo._id);
                        setEditText(todo.text);
                      }}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => deleteTodo(todo._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                {editingId === todo._id ? (
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => updateTodo(todo._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTodo(todo._id);
                      }
                    }}
                    size="small"
                    autoFocus
                  />
                ) : (
                  <ListItemText
                    primary={todo.text}
                    sx={{
                      textDecoration: todo.completed ? 'line-through' : 'none'
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}
