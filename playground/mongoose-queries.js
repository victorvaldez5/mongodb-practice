const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

var id = '6b1739fbde66c8a5193f0097';


if(!ObjectID.isValid(id)) {
  console.log('ID is not valid');
}
Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne(Todo.find({
    _id: id
  }).then((todo) => {
    console.log('Todo', todo);
  })
);

Todo.findById({id}).then((todo) => {
  if (!todo) {
    return console.log('Did not find id');
  }
  console.log('Todo By Id', todo);
}).catch((e) => console.log(e))