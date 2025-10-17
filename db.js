const { MongoClient } = require('mongodb');

module.exports = {
  connectToDb: (cb) => {
    // Database connection logic here
    MongoClient.connect('mongodb://localhost:27017/bookstore')
        .then(client => {
            dbConnection = client.db();
            return cb();
        })
        .catch(err => { console.error(err);
            return cb(err);
         });
  },
  getDb: () => dbConnection
    // Logic to get the database instance here
  

}