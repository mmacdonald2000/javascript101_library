
var DataTable = function(container){
  Library.call(this);
  this.$container = container;
  this._queue = new Array();
};

//extending from Library
DataTable.prototype = Object.create(Library.prototype);

DataTable.prototype.init = function () {
  this.recover();
  this._updateTable();
  this._bindEvents();
  this._bindCustomListeners();
};

DataTable.prototype._bindEvents = function () {
  //add native events here
};

DataTable.prototype._bindCustomListeners = function () {
  $(document).on('objUpdate', $.proxy(this._updateTable, this));
};

DataTable.prototype._updateTable = function () {
  //alert(e.detail.data)
  var _self = this;
  var $tbody = this.$container.find('tbody');
  $tbody.empty();
  $.each(window.bookShelf, function(index, book){
    _self._createRow(book);
  });
};

DataTable.prototype._createRow = function (book) {
  var tr = document.createElement('tr');
  var deleteInput = document.createElement('input')
  var att = document.setAttribute('type');
  att.value = 'checkbox';
  deleteInput.setAttributeNode(att);

  for (var key in book) {
    var td = document.createElement('td')
    $(td).text = (book[key])
    tr.append(td);
    console.log(book[key]);
  };
  tr.append(document.createElement('td').append(deleteInput));
  return tr;
};


$(function(){
  window.gTable = new DataTable($('#data-table'));
  window.gTable.init();
});
