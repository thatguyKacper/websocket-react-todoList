const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  app.use(express.static(path.join(__dirname, '/client/index.html')));
});

const server = app.listen(8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);

  socket.on('addTask', (taskName) => {
    if (!tasks.find(task => task.id == taskName.id)) {
      tasks.push(taskName);
      socket.broadcast.emit('addTask', taskName);
    };
  });

  socket.on('removeTask', (index, task) => {
    if (tasks.find(taskRemove => taskRemove.id == task.id)) {
      tasks.splice(index, 1);
      socket.broadcast.emit('removeTask', index, task);
    };
  });
});