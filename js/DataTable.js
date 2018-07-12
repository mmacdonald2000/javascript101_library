
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
  //add delete functionality here
};

DataTable.prototype._bindCustomListeners = function () {
  $(document).on('objUpdate', $.proxy(this._updateTable, this));
};

DataTable.prototype._updateTable = function () {
  var _self = this;
  //Make Table Head Dynamically
  var $thead = this.$container.find('thead');
  $thead.empty();
  $thead.append(_self._createHeaderRow());
  // Make Table Body Dynamically
  var $tbody = this.$container.find('tbody');
  $tbody.empty();
  $.each(window.bookShelf, function(index, book){
    $tbody.append(_self._createRow(book));
  });
};

DataTable.prototype._createRow = function (book) {
  //create table row variable
  var tr = document.createElement('tr');
  // create table data variable for delete column
  var deleteTD = document.createElement('td');
  //create i element for delete column
  var deleteI = document.createElement('i');
  //give it applicable class names
  $(deleteI).addClass('far fa-times-circle btn delete-book')
  //add input to table data
  deleteTD.append(deleteI);


  //for each key in {Book} make a table data and add text to it
  for (var key in book) {
    var td = document.createElement('td')
    $(td).text(book[key]);
    tr.append(td);
  };
  //append deleteTD here
  tr.append(deleteTD);
  return tr;
};

DataTable.prototype._createHeaderRow = function () {
  var book = new Book({});
  var tr = document.createElement('tr');
  // //a prettier way to make the header
  // var thCover = document.createElement('th');
  // var thTitle = document.createElement('th');
  // var thAuthor = document.createElement('th');
  // var thPages = document.createElement('th');
  // var thPubDate = document.createElement('th');
  // var thRating = document.createElement('th');
  //
  // $(thCover).text("");
  // $(thTitle).text("Title");
  // $(thAuthor).text("Author");
  // $(thPages).text("Pages");
  // $(thPubDate).text("Date of Publication");
  // $(thRating).text("Rating");
  // tr.append(thCover, thTitle, thAuthor, thPages, thPubDate, thRating);

  //a silly way to dynamically make the header
  for (var key in book) {
    var th = document.createElement('th')
    // console.log(key);
    $(th).text(makeTitle(key));
    tr.append(th);
  };
  // append deleteTD here
  var deleteTH = document.createElement('th');
  $(deleteTH).text("Delete?");
  tr.append(deleteTH);
  return tr;
};


$(function(){
  window.gTable = new DataTable($('#data-table'));
  window.gTable.init();
});
