import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks && Array.isArray(storedTasks)) {
      console.log("Loaded tasks from local storage:", storedTasks);
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {
    console.log("Saving tasks to local storage:", tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      if (editingTaskIndex !== null) {
        const updatedTasks = tasks.map((task, index) => 
          index === editingTaskIndex ? { ...task, text: newTask } : task
        );
        setTasks(updatedTasks);
        setEditingTaskIndex(null);
      } else {
        setTasks([...tasks, { text: newTask, completed: false }]);
      }
      setNewTask('');
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    setNewTask(tasks[index].text);
    setEditingTaskIndex(index);
  };

  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTask}>
          {editingTaskIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <span onClick={() => handleCompleteTask(index)}>{task.text}</span>
              <button onClick={() => handleEditTask(index)}>Edit</button>
              <button onClick={() => handleDeleteTask(index)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;