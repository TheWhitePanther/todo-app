import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() && taskDate.trim()) {
      if (editingTaskIndex !== null) {
        const updatedTasks = tasks.map((task, index) => 
          index === editingTaskIndex ? { ...task, text: newTask, date: taskDate, priority: taskPriority } : task
        );
        setTasks(updatedTasks);
        setEditingTaskIndex(null);
      } else {
        const updatedTasks = [...tasks, { text: newTask, date: taskDate, priority: taskPriority, completed: false }];
        setTasks(updatedTasks);
      }
      setNewTask('');
      setTaskDate('');
      setTaskPriority('Medium');
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    setNewTask(tasks[index].text);
    setTaskDate(tasks[index].date);
    setTaskPriority(tasks[index].priority);
    setEditingTaskIndex(index);
  };

  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      if (filter === 'today') return task.date === new Date().toISOString().split('T')[0];
      return true;
    })
    .filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const priorities = { High: 3, Medium: 2, Low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100 || 0;

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
        <input
          type="date"
          value={taskDate}
          onChange={(e) => setTaskDate(e.target.value)}
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onClick={handleAddTask}>
          {editingTaskIndex !== null ? 'Update Task' : 'Add Task'}
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
        />
        <div className="filters">
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('completed')}>Completed</button>
          <button onClick={() => setFilter('pending')}>Pending</button>
          <button onClick={() => setFilter('today')}>Due Today</button>
        </div>
        <div className="progress">
          <progress value={progress} max="100"></progress>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <ul>
          {filteredTasks.map((task, index) => (
            <li key={index} className={task.completed ? 'completed' : ''}>
              <span onClick={() => handleCompleteTask(index)}>
                {task.text} (Due: {task.date}, Priority: {task.priority})
              </span>
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
