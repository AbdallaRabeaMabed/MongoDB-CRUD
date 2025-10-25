const express = require('express');
const { connectToDb ,getDb} = require('./db');
const { ObjectId } = require('mongodb');

//initialize express app and middleware
const app = express();

//connect to database before starting the server
let db;
connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } db = getDb();
});


//routes
app.get('/books', (req, res) => {
   let books = [];
  db.collection('books')
    .find()
    .sort({author: 1  })
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch the documents' });
    });


});

// route to get a single book by id
app.get('/books/:id', (req, res) => {
  if(ObjectId.isValid(req.params.id)){
    db.collection('books')
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not fetch the document' });
    });
  }else{
    res.status(500).json({ error: 'Not a valid document id' });
  }

});