window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};



var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



$(document).ready(function() {

  var totalSale = [];
  var totalExpense = [];
  var totalProfit = 0;
  var data = {};
  var startDate = new Date(new Date().getFullYear(), 0, 1);
  var endDate = new Date(new Date().getFullYear(), 11, 31)


  var request1 = $.ajax('/sales/2018', {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(result) {
      var res = JSON.parse(result)
      totalSale = res.totalSales;
    },
    error: function() {
      console.log('error');
    }
  });
  var request2 = $.ajax('/expenses/2018', {
    type: 'GET',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(result) {
      var res = JSON.parse(result)
      totalExpense = res.totalExpense;
    },
    error: function() {
      console.log('error');
    }
  });


  $.when(request1, request2).done(function(data1, data2) {
    var config = {
      type: 'bar',
      data: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [{
          label: "Sales",
          backgroundColor: window.chartColors.red,
          borderColor: window.chartColors.red,
          data: totalSale,
          fill: false,
        }, {
          label: "Expenses",
          backgroundColor: window.chartColors.blue,
          borderColor: window.chartColors.blue,
          data: totalExpense,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Profit over the whole year'
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    };

    var ctx = document.getElementById("canvas").getContext("2d");
    new Chart(ctx, config);

    document.getElementById("expense").innerHTML = totalExpense.reduce(getSum) + '₹';
    document.getElementById("sale").innerHTML = totalSale.reduce(getSum) + '₹';
    document.getElementById("profit").innerHTML = totalSale.reduce(getSum) - totalExpense.reduce(getSum) + '₹';


  })



});

function getSum(total, num) {
  return total + num;
}
