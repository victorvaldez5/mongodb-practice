// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to database server');
  }
  console.log('Connected to MongoDb server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('unable to insert Todo', err);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));

  // })

  // db.collection('Users').insertOne({
  //   name: 'Victor Valdez',
  //   age: 21,
  //   location: 'Manhattan, KS'
  // }, (err, result) => {
  //   if(err) {
  //     return console.log('Unable to insert User', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  
  // });

  db.close();
});


