var constants = require('../modules/constant');
var q = require('q');
//lets require/import the mongodb native drivers.
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = require('mongodb').MongoClient;
var database;

// Use connect method to connect to the Server
// Init method
MongoClient.connect(constants.DB_URL, function(err, db) {
  if (err) {
    console.error('Unable to connect to the mongoDB server. Error:', err);
  } else {
    //HURRAY!! We are connected. :)
    console.log('Connection established to: ' + constants.DB_URL);
    database = db;
  }
});

module.exports = {
  insert: function(record, table) {
    // Get the documents collection
    var collection = database.collection(table);
    var insertResult = {
      error: false
    }
    var deferred = q.defer();

    // Insert user record into the collection as new document
    collection.insert(record, function(err, result) {
      if (err) {
        console.error(err);
        insertResult.error = true;
        deferred.reject(insertResult);
      } else {
        console.log('Inserted document into the "users" collection. The documents inserted with "_id" are:', JSON.stringify(result));
        insertResult.error = false;
        insertResult.message = result;
        deferred.resolve(insertResult);
      }
    });
    console.log('Exiting insertRecord method');
    return deferred.promise;
  },

  // To get records of the sender using senderID
  getRecord: function(key, table) {

    var deferred = q.defer();

    // Get the documents collection
    var collection = database.collection(table);
    collection.find(key).toArray(function(err, result) {
      var response = {};
      if (err) {
        console.log(err);
        response.error = true;
        response.errorObject = err;
        deferred.reject(response);
      } else if (result.length) {
        // console.log('Found:', result);
        response.error = false;
        response.record = result;
        deferred.resolve(response);
      } else {
        response.error = false;
        response.record = [];
        console.log('No document(s) found with defined "find" criteria!');
        deferred.resolve(response);
      }
    });

    return deferred.promise;
  },


  // To get records of the sender using senderID
  updateRecord: function(data, table) {

    var query = {
      _id: data._id
    };
    database.collection(table).updateOne(query, data, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      return "success"
    });

  },

  // To get records of the sender using senderID
  deleteRecord: function(doc_id, table) {

    var query = {
      _id: doc_id
    };
    database.collection(table).remove(query, function(err, res) {
      if (err) throw err;
      console.log("1 document deleted");
      return "success"
    });

  },

  // To get records of the sender using senderID
  getRecordWithDateRange: function(table, startDate , endDate) {

    var deferred = q.defer();
    var query = {"created_at": {"$gte": new Date(startDate), "$lt": new Date(endDate)}};
    var col = database.collection(table);

    col.find(query).toArray(function(err,res){
      var response = {};
          if(err){
            console.log(err);
          }
          else{
            response.record  = res;
            deferred.resolve(response);
          }
    });

    return deferred.promise;

    },



  // To get records of the sender using senderID
  getAllRecords: function(table) {

    var deferred = q.defer();

    // Get the documents collection
    var collection = database.collection(table);
    collection.find().sort({_id: -1}).toArray(function(err, result) {
      var response = {};
      if (err) {
        console.log(err);
        response.error = true;
        response.errorObject = err;
        deferred.reject(response);
      } else if (result.length) {
        console.log('Found:', result);
        response.error = false;
        response.records = result;
        deferred.resolve(response);
      } else {
        response.error = false;
        response.records = [];
        console.log('No document(s) found with defined "find" criteria!');
        deferred.resolve(response);
      }
    });

    return deferred.promise;
  },
}
