const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1/mytodoapp", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log(`Error connecting to the database: ${err}`);
  } else {
    console.log('Successfully connected to the database');
  }
});
// tasklist schema
const myTask = new mongoose.Schema({
  taskId: String,
  title: String,
  task: String,
  taskStatus: String
})

const Todotasks = mongoose.model('Todotasks', {
  username: String,
  password: String,
  taskCount: {
    completedTask: Number,
    pendingTask: Number,
    canceledTask: Number,
    deletedTask: Number,
    totalTask: Number,
  },
  taskList: [myTask]

})

module.exports = {
  Todotasks
}
