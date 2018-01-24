$(window).load(function() {
  $('.progress').hide();
});


function exportToExcel() {
    $("#page-table").table2excel({
      // exclude CSS class
      exclude: ".noExl",
      name: "Worksheet Name",
      filename: "SomeFile" //do not include extension
    });
}


$(document).ready(function() {
  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
  });

  $('select').material_select();

  // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
  $('.modal').modal();

  // Table row page per limit
       var totalRows = $('#page-table').find('tbody tr:has(td)').length;
       var recordPerPage = 20;
       var totalPages = Math.ceil(totalRows / recordPerPage);
       console.log(totalPages);
       $('#page-table').find('tbody tr:has(td)').hide();
         var tr = $('#page-table tbody tr:has(td)');
         for (var i = 0; i <= recordPerPage - 1; i++) {
           $(tr[i]).show();
         }

    $('#example').materializePagination({
        align: 'right',
        lastPage:  totalPages,
        firstPage:  1,
        urlParameter: 'page',
        useUrlParameter: false,
        onClickCallback: function(requestedPage){

            $('#page-table').find('tbody tr:has(td)').hide();
                var nBegin = (requestedPage-1) * recordPerPage;
                var nEnd = requestedPage*recordPerPage -1;
                for (var i = nBegin; i <= nEnd; i++) {
                  $(tr[i]).show();
                }
        }
    });

});
