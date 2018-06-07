const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')
const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user')
const {users, todos, populateTodos, populateUser} = require('./seed/seed');

beforeEach(populateUser);
beforeEach(populateTodos);


describe("POST /todos", () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
       }
       Todo.find({text}).then((todos) => {
         expect(todos.length).toBe(1);
         expect(todos[0].text).toBe(text);
         done();
       }).catch((e) => done(e));
      });
  });

  it("Should not create a new todo with invalid data", (done) => {
    var text = "    ";

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .expect((res) => {
        expect(res.body.text).toBe(undefined);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', (done) => {
  it('Should retrieve a list of all the todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
    });
});

describe('GET /todos/:id', (done)=> {
  it('Should retrieve a single todo object by the id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should send a 404 when the object cannot be found ', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('Should retrieve a 400 when passed an invalid id', (done) => {
    request(app)
    .get('/todos/123abc')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', (done) => {
  //Test delete successful
  it('Should send a 404 and a todo that got deleted successfully', (done) => {
    var hexID = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(hexID).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  })

  it('Should send a 404 when the object cannot be found ', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should retrieve a 400 when passed an invalid id', (done) => {
    request(app)
      .delete('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', (done) => {
  //Test delete successful
  it('Should send a 200 and return a todo item with an updated completed, text, and completedAt', (done) => {
    var hexID = todos[0]._id.toHexString();
    var body = { "text": 'Hello', "completed": true };
    request(app)
      .patch(`/todos/${hexID}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findByIdAndUpdate(hexID).then((todo) => {
          expect(todo.completed).toBe(true);
          expect(todo.text).toBe(body.text);
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch((e) => done(e));
      })
  });

  it('Should send a 200 and with a null completedAt field', (done) => {
    var hexID = todos[0]._id.toHexString();
    var body = { "text": 'Hello', "completed": false };
    request(app)
      .patch(`/todos/${hexID}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findByIdAndUpdate(hexID).then((todo) => {
          expect(todo.completed).toBe(false);
          expect(todo.text).toBe(body.text);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  })

  it('Should send a 404 when the object cannot be found ', (done) => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should retrieve a 400 when passed an invalid id', (done) => {
    request(app)
      .patch('/todos/123abc')
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });
  it('Should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  });
});

describe('POST /users', () => {
  it('Should send a 200 if user was created successfully', (done) => {
    var email = 'example@example.com';
    var password = '123mbdew';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotEqual(password);
          done();
        });
      });
  });

  it('Should return validation errors', (done) => {
    request(app)
      .post('/users')
      .send({email: 'victor', password: 'pass'})
      .expect(400)
      .end(done)
  });
  it('Should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({email: 'victor@example.com', password: 'password123'})
      .expect(400)
      .end(done)
  });
})