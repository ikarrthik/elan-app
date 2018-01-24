function searchMonthSales(event) {

  var startDate = document.getElementById('startdate').value;
  var endDate = document.getElementById('enddate').value;
  var data = {};
  console.log(startDate);

  console.log(endDate);

  $.ajax('http://localhost:3000/sales/date/' + startDate + '/' + endDate, {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      console.log("success");
      console.log(data);
      loadTable('page-table', ['date', 'vendor', 'type', 'credit', 'remarks', '_id'], data);
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
    if (index == 0) {
      row = '<thead>' +
        '  <tr>' +
        '<th> <i class="material-icons prefix">date_range</i> <span>  Date </span> </th>' +
        '<th> <i class="material-icons prefix">local_shipping</i> <span> Vendor</span></th>' +
        '<th> <i class="material-icons prefix">style</i><span> Type</span></th>' +
        '<th> <i class="material-icons prefix">credit_card</i> <span> Credit</span></th>' +
        '<th> <i class="material-icons prefix">description</i> <span> Remarks</span></th>' +
        '<th> <i class="material-icons prefix">call_to_action</i> <span> Actions</span></th>' +
        '</tr>' +
        '</thead>'
    }
    row += '<tr>';

    $.each(fields, function(index, field) {

      if (field.includes('_id')) {
        row += '<td class="document-id">' + item[field + ''] + '</td>';
        row += '  <td onclick="editSale(this)">' +
          '  <button class="btn-floating btn-small blue">' +
          '  <i class="small material-icons">mode_edit</i>' +
          ' </button>' +
          '</td>';
      } else {
        row += '<td>' + item[field + ''] + '</td>';
      }

    });



    rows += row + '<tr>';
  });

  console.log(rows);
  $('#' + tableId).html(rows);
}


function editSale(x) {

  var saleId = x.parentNode.getElementsByTagName('td')[5].innerHTML;
  var data = {};
  var saleId = saleId.toString().replace(/\s+/g, '');

  //Opens the modal window programatically
  $('#modal2').modal('open');

  $.ajax('http://localhost:3000/sale/' + saleId, {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
      document.getElementById('newdate').value = data.date;
      document.getElementById('newcredit').value = data.credit;
      document.getElementById('newtype').value = data.type;
      document.getElementById("documentId").textContent = data._id;
      document.getElementsByClassName('select-dropdown')[2].value = data.vendor;
      document.getElementById('newremarks').value = data.remarks;
    },
    error: function() {
      console.log('error');
    }
  });

}

function updateSale() {
  let data = {}
  data._id = document.getElementById("documentId").textContent;
  data.date = document.getElementById('newdate').value;
  data.type = document.getElementById('newtype').value;
  data.vendor = document.getElementsByClassName('select-dropdown')[2].value;
  data.remarks = document.getElementById('newremarks').value;
  data.credit = document.getElementById('newcredit').value;

  $.ajax({
    url: "http://localhost:3000/sale",
    type: "POST",
    //contentType: "application/x-www-form-urlencoded",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(data) {
      location.href = "http://localhost:3000/sales"

    },
    error: function(err) {
      console.log("error happened!!");
    }
  });


}

function deleteSale() {
  let data = {}

  var saleId = document.getElementById("documentId").textContent;
  $.ajax({
    url: "http://localhost:3000/sale/" + saleId,
    type: "DELETE",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(data) {
      location.href = "http://localhost:3000/sales"
    },
    error: function(err) {
      console.log("error happened!!");
    }
  });


}

$(document).ready(function() {

  // Call onload month expense api
  var d = new Date();
  var n = d.getMonth();
  callMonthlySales(n);


  let data = {

  }

  $.ajax('http://localhost:3000/sales/2018', {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {

      var parsedData = JSON.parse(data);
      yearlySales(parsedData.totalSales, {});

    },
    error: function() {
      console.log('error');
    }
  });


});

function yearlySales(sales) {

  var ctx = document.getElementById('line-chart').getContext("2d");

  var gradient = ctx.createLinearGradient(300, 0, 0, 300);
  gradient.addColorStop(0, '#0288d1');
  gradient.addColorStop(1, '#26c6da');


  var salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      label: 'sales',
      backgroundColor: gradient,
      borderColor: "#FFFF",
      showLine: true,
      scaleGridLineColor: 'transparent',
      strokeColor: "rgba(255,82,82,0.1)",
      pointColor: "#00bcd4",
      pointBorderColor: "#0288d1",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "#0288d1",
      data: sales
    }, ]
  }

  var options = {
    tooltips: {
      titleSpacing: 12,
      bodySpacing: 12,
      xPadding: 12,
      yPadding: 12,
      titleFontSize: 17,
      titleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      bodyFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      bodyFontSize: 15,

    },

    scales: {
      xAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }
      }],
      yAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }
      }]
    }
  }
  // get line chart canvas
  var sales = document.getElementById('line-chart').getContext('2d');
  // draw line chart
  //  new Chart(sales).Line(salesData);
  new Chart(ctx, {
    type: 'line',
    data: salesData,
    options

  });


}

$(function() {
  $("#card-select").change(function() {
    callMonthlySales($('option:selected', this).attr('value'));
  });
});

function callMonthlySales(month) {

  let data = {};
  $.ajax('http://localhost:3000/sales/' + month + '/2018', {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {

      let parsedData = JSON.parse(data);
      $(".saleCard").text(parsedData.totalSale + " ₹");

    },
    error: function() {
      console.log('error');
    }
  });


}
