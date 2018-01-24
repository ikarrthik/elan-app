function searchMonthExpenses(event){

  var startDate = document.getElementById('startdate').value;
  var endDate = document.getElementById('enddate').value;
  var data = {};
  console.log(startDate);

    console.log(endDate);

    $.ajax('/expenses/date/' + startDate +'/'+endDate, {
      type: 'GET',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function(data) {
        console.log("success");
        console.log(data);
        loadTable('page-table', ['date', 'type', 'amount','vendor','notes','_id'], data);
      },
      error: function() {
        console.log('error');
      }
    });
}

function loadTable(tableId, fields, data) {
    //$('#' + tableId).empty(); //not really necessary
    var rows = '';
    $.each(data, function(index, item) {

        var row = '';
        if(index ==0) {
         row =   '<thead>'+
          '  <tr>'+
              '<th> <i class="material-icons prefix">date_range</i> <span>  Date </span> </th>'+
              '<th> <i class="material-icons prefix">style</i> <span> Expense type</span></th>'+
              '<th> <i class="material-icons prefix">attach_money</i><span> Amount</span></th>'+
              '<th> <i class="material-icons prefix">local_shipping</i> <span> Vendor</span></th>'+
              '<th> <i class="material-icons prefix">description</i> <span> Notes</span></th>'+
              '<th> <i class="material-icons prefix">speaker_notes</i> <span> Actions</span></th>'+
            '</tr>'+
          '</thead>'
        }
         row += '<tr>';

        $.each(fields, function(index, field) {

            if(field.includes('_id')){
              row += '<td class="document-id">' + item[field+''] + '</td>';
              row +=  '  <td onclick="editExpenses(this)">'+
                      '  <button class="btn-floating btn-small blue">'+
                      '  <i class="small material-icons">mode_edit</i>'+
                      ' </button>'+
                      '</td>';
            }else{
              row += '<td>' + item[field+''] + '</td>';
            }

        });



        rows += row + '<tr>';
    });

    console.log(rows);
    $('#' + tableId).html(rows);
}



$(document).ready(function() {

  var data = {};
  //var ctx = document.getElementById("thisYearRevenue").getContext("2d");
  //var gradient = ctx.createLinearGradient(300, 0, 0, 300);
  //gradient.addColorStop(0, '#0288d1');
  //gradient.addColorStop(1, '#26c6da');

  $.ajax('/expenses/2018', {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      var parsedData = JSON.parse(data);
      yearlyExpenses(parsedData.totalExpense, {});
    },
    error: function() {
      console.log('error');
    }
  });
})


function editExpenses(x) {
  console.log("Ajax call");
  var expenseId = x.parentNode.getElementsByTagName('td')[5].innerHTML;

  var data = {};
  var expenseId = expenseId.toString().replace(/\s+/g, '');

  //Opens the modal window programatically
  $('#modal2').modal('open');


  $.ajax('/expense/' + expenseId, {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      console.log("success");
      document.getElementById('newdate').value = data.date;
      document.getElementById('newamount').value = data.amount;
      document.getElementById("documentId").textContent = data._id;
      document.getElementsByClassName('select-dropdown')[6].value = data.type;
      document.getElementsByClassName('select-dropdown')[8].value = data.vendor;
      document.getElementById('newref').value = data.ref;
      document.getElementById('newnotes').value = data.notes;
    },
    error: function() {
      console.log('error');
    }
  });
}




$(document).ready(function() {

  var d = new Date();
  var n = d.getMonth();

  callExpenseService(n);
})

$(function() {
  $("#card-select").change(function() {
    callExpenseService($('option:selected', this).attr('value'));
  });
});

function callExpenseService(day) {

  var data = {};
  $.ajax('/expenses/' + day + '/2018', {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {

      var parsedData = JSON.parse(data);

      $(".expenseCard").text(parsedData.totalExpense + " ₹");

    },
    error: function() {
      console.log('error');
    }
  });


}

function updateExpense() {

  console.log("update event");

  let data = {

  }
  data._id = document.getElementById("documentId").textContent;
  data.date = document.getElementById('newdate').value;
  data.amount = document.getElementById('newamount').value;
  data.type = document.getElementsByClassName('select-dropdown')[6].value;
  data.vendor = document.getElementsByClassName('select-dropdown')[8].value;
  data.ref = document.getElementById('newref').value;
  data.notes = document.getElementById('newnotes').value;



  $.ajax({
    url: "/expense",
    type: "PUT",
    //contentType: "application/x-www-form-urlencoded",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(data) {
      location.href = "/expenses"

    },
    error: function(err) {
      console.log("error happened!!");
    }
  });


}

function deleteExpense() {
  let data = {}
  var expenseId = document.getElementById("documentId").textContent;
  $.ajax({
    url: "/expense/" + expenseId,
    type: "DELETE",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(data) {
      location.href = "/expenses"

    },
    error: function(err) {
      console.log("error happened!!");
    }
  });
}

 function yearlyExpenses(data1, data2) {
//   //Line chart with color shadow: Revenue for 2017 Chart
//   var thisYearCTX = document.getElementById("thisYearRevenue").getContext("2d");
//
//   Chart.types.Line.extend({
//     name: "LineAlt",
//     initialize: function() {
//       Chart.types.Line.prototype.initialize.apply(this, arguments);
//
//       var ctx = this.chart.ctx;
//       var originalStroke = ctx.stroke;
//       ctx.stroke = function() {
//         ctx.save();
//         ctx.shadowColor = 'rgba(156, 46, 157,0.5)';
//         ctx.shadowBlur = 20;
//         ctx.shadowOffsetX = 2;
//         ctx.shadowOffsetY = 20;
//         originalStroke.apply(this, arguments)
//         ctx.restore();
//       }
//     }
//   });
//
//
//   var thisYearData = {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [{
//       label: "This year dataset",
//       fillColor: "#9C2E9D",
//       strokeColor: "#9C2E9D",
//       pointColor: "transparent",
//       pointStrokeColor: "transparent",
//       pointHighlightFill: "#fff",
//       pointHighlightStroke: "#9C2E9D",
//       data: data1
//     }]
//   };
//
//   var thisYearChart = new Chart(thisYearCTX).LineAlt(thisYearData, {
//     datasetFill: false,
//     scaleShowGridLines: false,
//
//     datasetStrokeWidth: 5,
//     scaleFontColor: '#9e9e9e',
//     scaleGridLineColor: '#e4e4e4',
//     scaleLineColor: 'transparent',
//     scaleOverride: true,
//     scaleSteps: 4,
//     scaleStepWidth: 3000,
//     scaleStartValue: 0
//   });
//

}
