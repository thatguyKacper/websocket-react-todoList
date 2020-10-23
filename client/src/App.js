import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: [],
    };

    this.changeValue = this.changeValue.bind(this);
    this.submitForm = this.submitForm.bind(this);
  };

  componentDidMount() {
    this.socket = io('http://localhost:8000');

    this.socket.on('addTask', (taskName) => { this.addTask(taskName) });
    this.socket.on('removeTask', (index, task) => { this.removeTask(index, task) });
    this.socket.on('updateData', (tasks) => { this.updateData(tasks) });
  };

  updateData(tasks) {
    this.setState({ tasks: tasks })
  };

  clickedRemove(task) {
    const index = this.state.tasks.indexOf(task);
    this.removeTask(index, task);
  };

  removeTask(index, task) {
    if (this.state.tasks.find(taskRemove => taskRemove.id === task.id)) {
      this.setState(this.state.tasks.splice(index, 1))
      this.socket.emit('removeTask', index, task)
    };
  };

  async changeValue(event) {
    await this.setState({
      taskName: {
        name: event.target.value,
        id: uuidv4(),
      }
    });
  }

  submitForm(event) {
    event.preventDefault();
    this.addTask(this.state.taskName);
  };

  addTask(taskName) {
    if (!this.state.tasks.find(task => task.id === taskName.id)) {
      this.state.tasks.push(taskName);
      this.setState(this.state.tasks);
      this.socket.emit('addTask', taskName);
    };
  };

  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (
              <li key={task.name} className="task"> {task.name} <button onClick={() =>
                this.clickedRemove(task)} className="btn btn--red">Remove</button></li>
            ))}
          </ul>

          <form onSubmit={this.submitForm} id="add-task-form">
            <input onChange={this.changeValue} value={this.state.taskName.name} className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;