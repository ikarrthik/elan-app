var router = function(app) {

var vendorList = require('../model/vendorList');
var billList = require('../model/billList');
var constants = require('../modules/constant');
var dbController = require("../model/dbcontroller");
var ObjectId = require('mongodb').ObjectID;
var async = require('async');





app.get('/home', function(req, res) {

  res.render("home", {})

});



app.get('/vendors', function(req, res) {

  res.render("vendorView", {
    vendorList: vendorList
  })
});



app.post('/addVendor', function(req, res) {

  var errors = req.validationErrors();

  if (errors) {
    res.render("vendorView", {
      vendorList: vendorList,
      errors: errors
    })
  } else {
    var vendor = {
      companyName: req.body.companyName,
      gstIn: req.body.gstIn,
      address: req.body.address,
      contactperson: req.body.contactperson,
      phone: req.body.phone,
      remarks: req.body.remarks
    };

    vendorList.push(vendor);
    res.redirect('/vendors');
  }
});


// ---------- Expense routes ------------------


// get all the expenses
app.get('/expenses', function(req, res) {
  renderAllExpenses(req, res);
});

//Expense get single expense
app.get('/expense/:expenseId', function(req, res) {

  var expenseId = {
    _id: new ObjectId(req.params.expenseId)
  }

  dbController.getRecord(expenseId, "expenses").then((expense) => {
    res.send(expense.record[0]);

  })

});


//Post a new expense
app.post('/addExpense', function(req, res) {

  var errors = req.validationErrors();
  var created_at = new Date(req.body.date);


  if (errors) {
    res.render("expenseView", {
      errors: errors
    })
  } else {

    var expense = {
      date: req.body.date,
      type: req.body.type,
      amount: req.body.amount,
      vendor: req.body.vendor,
      ref: req.body.ref,
      notes: req.body.notes,
      created_at:created_at
    }

    dbController.insert(expense, "expenses").then((response) => {
      res.redirect('/expenses');
    });
  }
});


// update the exisitng expense
app.put('/expense', function(req, res) {

  var body = req.body;
  body._id = new ObjectId(body._id)
  dbController.updateRecord(body, "expenses");
  renderAllExpenses(req, res);
});

//Expense  update  single expense
app.delete('/expense/:expenseId', function(req, res) {
  doc_id = new ObjectId(req.params.expenseId)
  dbController.deleteRecord(doc_id, "expenses");
  //renderAllExpenses(req, res);
  res.send("success");
});


//month wise  parameterized rest call
app.get('/expenses/:month/:year', function(req, res) {
  var totalExpense = 0;
  var month = req.params.month;
  var year = req.params.year;


  dbController.getAllRecords("expenses").then((expenses) => {


    expenses.records.forEach(function(expense) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var d = new Date();
      var currentMonth = monthNames[month];

      if ((expense.date).includes(currentMonth) && (expense.date).includes(year)) {
        totalExpense = totalExpense + parseInt(expense.amount);

      }

    })
    res.send(JSON.stringify({
      totalExpense: `${totalExpense}`
    }, null, 3));

  })
});

//yearly wise  expenses for chart
app.get('/expenses/:year', function(req, res) {
  var totalExpense = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var year = req.params.year;

  dbController.getAllRecords("expenses").then((expenses) => {


    expenses.records.forEach(function(expense) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var d = new Date(expense.date);
      //    var currentMonth = monthNames[month];


      if ((expense.date).includes(year)) {
        totalExpense[d.getMonth()] = totalExpense[d.getMonth()] + parseInt(expense.amount);

      }


    })

    res.send(JSON.stringify({
      totalExpense
    }, null, 3));

  })
});

app.get('/expenses/date/:startDate/:endDate', function(req, res) {

  //res.render("home", {})
  console.log("Hitting the service");
    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    dbController.getRecordWithDateRange("expenses",startDate,endDate).then((expense) =>{
        console.log(expense.record);
        res.send(expense.record);

    });


});


// ---------- Sales  route --------------
//Render all the sales
app.get('/sales', function(req, res) {

  renderAllSales(req, res);

});

//get a single sale
app.get('/sale/:saleId', function(req, res) {

  let saleId = {
    _id: new ObjectId(req.params.saleId)
  }

  dbController.getRecord(saleId, "sales").then((sale) => {
    res.send(sale.record[0]);
  })

});

// Update an exisitng sale
app.post('/sale', function(req, res) {
  let body = req.body;
  body._id = new ObjectId(body._id)
  dbController.updateRecord(body, "sales");
  renderAllSales(req, res);
});


// Post a new sale
app.post('/addSale', function(req, res) {

  let errors = req.validationErrors();
  var created_at = new Date(req.body.date);


  if (errors) {
    res.render("expenseView", {
      salesList: salesList,
      errors: errors
    })
  } else {

    let sale = {
      date: req.body.date,
      type: req.body.type,
      credit: req.body.credit,
      vendor: req.body.vendor,
      remarks: req.body.remarks,
      created_at:created_at
    }

    dbController.insert(sale, "sales").then((response) => {
      res.redirect('/sales');
    });
  }
});

//delete a sale
app.delete('/sale/:saleId', function(req, res) {
  doc_id = new ObjectId(req.params.saleId);

  console.log(doc_id);
  dbController.deleteRecord(doc_id, "sales");
  res.send("success");
});


//year wise  parameterized rest call
app.get('/sales/:year', function(req, res) {
console.log("hiting the sales yeearrrrr!!!!");
  let totalSales = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let year = req.params.year;

  dbController.getAllRecords("sales").then((sales) => {


    sales.records.forEach(function(sale) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var d = new Date(sale.date);
      //    var currentMonth = monthNames[month];
      if ((sale.date).includes(year)) {
        totalSales[d.getMonth()] = totalSales[d.getMonth()] + parseInt(sale.credit);

      }

    })

    res.send(JSON.stringify({
      totalSales
    }, null, 3));

  })
});

//monthly wise sales
app.get('/sales/:month/:year', function(req, res) {

  var totalSale = 0;
  var month = req.params.month;
  var year = req.params.year;

  dbController.getAllRecords("sales").then((sales) => {


    sales.records.forEach(function(sale) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      var d = new Date();
      var currentMonth = monthNames[month];

      if ((sale.date).includes(currentMonth) && (sale.date).includes(year)) {
        totalSale = totalSale + parseInt(sale.credit);

      }
    })
    res.send(JSON.stringify({
      totalSale: `${totalSale}`
    }, null, 3));

  })
});




app.get('/sales/date/:startDate/:endDate', function(req, res) {

  //res.render("home", {})
  console.log("Hitting the service");
    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    dbController.getRecordWithDateRange("sales",startDate,endDate).then((sale) =>{
        console.log(sale.record);
        res.send(sale.record);

    });


});


// -----------Bills view ------------

app.get('/bills', function(req, res) {

  var listOfVendors = [];
  vendorList.forEach(function(vendor) {
    listOfVendors.push(vendor.companyName);
  })

  res.render("billsView", {
    billList: billList,
    listOfVendors: listOfVendors
  })
});


app.post('/addBill', function(req, res) {

  var errors = req.validationErrors();

  if (errors) {
    res.render("billsView", {
      billList: billList,
      errors: errors
    })
  } else {

    var bill = {
      billNo: req.body.billNo,
      vendor: req.body.vendor,
      orderNo: req.body.orderNo,
      billDate: req.body.billDate,
      dueDate: req.body.dueDate,
      tax: req.body.tax,
      total: req.body.total
    }
    billList.push(bill);
    res.redirect('/bills');
  }
});

function sumAllSales(year){

  console.log("hitting the service sales");
  var totalSale = [];

  dbController.getAllRecords("sales").then((sales) => {

    sales.records.forEach(function(sale) {
      if ((sale.date).includes(year)) {
        totalSale.push(sale.credit);
      }
    })
    console.log("Total Sale ##$#$#$#$#$#");
    console.log(totalSale);
    return totalSale;
  })
}

function sumAllExpenses(year){
  console.log("hitting the service expense");

  var totalExpense = [];

    dbController.getAllRecords("expenses").then((expenses ,err) => {
              expenses.records.forEach(function(expense) {
                if ((expense.date).includes(year)) {
                  totalExpense.push(expense.amount);
                }
              })
            console.log("Total Expense ##$#$#$#$#$#");
            console.log(totalExpense);
            return totalExpense;
    })

}

// -------- Profit and loss
app.get('/v1/profit/:year',async function(req, res) {

  var year = req.params.year;
  var totalProfit = 0;
  var totalExpense = [];
  var totalSale = [];

  console.log("Total profit for the year : " + year);
  let promises = {};

   promises[0] = sumAllSales(year);
   promises[1] = sumAllExpenses(year);

   Promise.all(promises)
   .then(function(values) {
     console.log(values);
   })
   .catch(function(err) {
     console.log(err);
   });


    // data.then(function(result){
      // res.send(JSON.stringify({
      //   data: `${data}`,
      // }, null, 3));
    // })


});



//  ------- Utility Functions ---------
function renderAllExpenses(req, res) {
  var listOfVendors = [];
  vendorList.forEach(function(vendor) {

    listOfVendors.push(vendor.companyName);

  })

  dbController.getAllRecords("expenses").then((expenseList) => {
    res.render("expenseView", {
      expenseList: expenseList.records,
      typeOfExpenses: constants.typeOfExpenses,
      listOfVendors: listOfVendors
    })
  })
}

function renderAllSales(req, res) {
  var listOfVendors = [];
  vendorList.forEach(function(vendor) {

    listOfVendors.push(vendor.companyName);

  })

  dbController.getAllRecords("sales").then((saleList) => {
    res.render("salesView", {
      salesList: saleList.records,
      typeOfExpenses: constants.typeOfExpenses,
      listOfVendors: listOfVendors
    })
  })
}


}
module.exports = router;
