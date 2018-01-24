
// Add button click handler
$(document).ready(function() {

  itemIndex = 0;
  totalAmount = 0;
  arrayOfAmount = [];
  $('#itemForm').on('click', '.addItem', function() {
    itemIndex++;
    var $template = $('#itemTemplate'),
      $clone = $template
      .clone()
      .removeClass('hide')
      .removeAttr('id')
      .attr('data-item-index', itemIndex)
      .insertBefore($template);


    // Update the name attributes
    $clone.find('[name="cloneditem"]').attr('id', 'item' + itemIndex + '').end()
    $clone.find('[name="clonedquantity"]').attr('id', 'quantity' + itemIndex + '').end()
    $clone.find('[name="clonedrate"]').attr('id', 'rate' + itemIndex + '').end();
    $clone.find('[name="clonedamount"]').attr('id', 'amount' + itemIndex + '').end();

    // Add new fields

  })

  // Remove button click handler
  $('#itemForm').on('click', '.removeItem', function() {
    var $row = $(this).parents('.form-group'),
      index = $row.attr('data-item-index');
    $row.remove();
  });
});

$(document).on('keyup', '.itemTable *', function(e) {

  var row = e.target.attributes.getNamedItem("id").value;
  var rowNumber = row.replace(/[^\d.]/g, '');

  var qty = $("#quantity" + rowNumber);
  var rte = $("#rate" + rowNumber);
  var amount = $("#amount" + rowNumber);

  var total1 = isNaN(parseInt(qty.val() * $(rte).val())) ? 0 : (qty.val() * $(rte).val());
  $(amount).text(parseFloat(Math.round(total1 * 100) / 100).toFixed(2));

  var index = arrayOfAmount.indexOf(rowNumber);
  arrayOfAmount[rowNumber] = total1;

  var total2 = isNaN(parseInt(rte.val() * $(qty).val())) ? 0 : (rte.val() * $(qty).val());
  $(amount).text(parseFloat(Math.round(total2 * 100) / 100).toFixed(2));

  var index = arrayOfAmount.indexOf(rowNumber);
  arrayOfAmount[rowNumber] = total2;

  var sum = arrayOfAmount.reduce((a, b) => a + b, 0);
  $("#total").text(parseFloat(Math.round(sum * 100) / 100).toFixed(2));

});
