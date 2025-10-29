const express = require('express');
const { connectToDb ,getDb} = require('./db');
const { ObjectId } = require('mongodb');

//initialize express app and middleware
const app = express();
app.use(express.json());

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
  //current page
  const page = req.query.page || 0;
  //number of documents per page
  const booksPerPage = 3;   
   let books = [];
  db.collection('books')
    .find()
    .sort({author: 1  })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
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

//route to add a new book
app.post('/books', (req, res) => {
  const book = req.body;
  db.collection('books')
    .insertOne(book)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(() => {
      res.status(500).json({ error: 'Could not create a new document' });
    });
});

//route to delete a book by id
app.delete('/books/:id', (req, res) => {
  if(ObjectId.isValid(req.params.id)){
    db.collection('books')
      .deleteOne({_id: new ObjectId(req.params.id)})
      .then(result => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: 'Could not delete the document' });
      });
  }else{
    res.status(500).json({ error: 'Not a valid document id' });
  }

});

//route to update a book by id
app.patch('/books/:id', (req, res) => {
  const updates = req.body;
  if(ObjectId.isValid(req.params.id)){
    db.collection('books')
      .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
      .then(result => {
        res.status(200).json(result);
      })
      .catch(() => {
        res.status(500).json({ error: 'Could not update the document' });
      });
  }else{
    res.status(500).json({ error: 'Not a valid document id' });
  }

});
