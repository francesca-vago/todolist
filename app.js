const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Use EJS Templates
app.set('view engine', 'ejs');

// Use Body Parser and Static Pages
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/todolistDB',
                  {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
                );

// Schema
const tasksSchema = {
  name: String
};

// Model
const Task = mongoose.model('Task', tasksSchema);

// Default Tasks
const task1 = new Task({
  name: "Cook Dinner"
})

const task2 = new Task({
  name: "Write blog post"
})

const task3 = new Task({
  name: "Clean house"
})

const defaultTasks = [task1, task2, task3];


app.get('/', (req, res) => {

  const today = new Date();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }
  const currentDay = today.toLocaleDateString("en-US", options);

  Task.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Task.insertMany(defaultTasks, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to database");
        }
      });
      res.redirect('/');
    } else {
      res.render('list', {day: currentDay, tasks: foundItems})
    }
  });
});

app.post('/', (req, res) => {

  const newTask = new Task({
    name: req.body.newTask
  });

  newTask.save();

  res.redirect('/');
})

app.listen(port, () => {
  console.log('Server started on port 3000');
})
