const { MongoClient } = require('mongodb');

let uri = 'mongodb+srv://<db_username>:<db_password>@cluster0.zbvmieo.mongodb.net/?appName=Cluster0'
module.exports = {
  connectToDb: (cb) => {
    // Database connection logic here
    MongoClient.connect(uri)
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