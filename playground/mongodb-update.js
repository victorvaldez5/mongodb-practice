const { MongoClient, ObjectID } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to database server');
  }
  console.log('Connected to MongoDb server');

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("5b147f422d0436cb66ec8a9c")
  
  }, {
    $set: { 
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })



  // db.close();
});
