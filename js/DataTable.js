
var DataTable = function(container){
  Library.call(this);
  this.$container = container;
  this._trash = [];
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
  this.$container.find('.delete-book').on('click', $.proxy(this._deleteRow, this));
  //Edit functionality
  this.$container.find($("td[contenteditable='true']")).on('focus', $.proxy(this._resaveRow, this));
};

DataTable.prototype._bindCustomListeners = function () {
  $(document).on('tableUpdate', $.proxy(this._updateTable, this));
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
  //add an attribute to tr with the title as the value so that we can target the title when deleting rows
  $(tr).attr('title', book.title);
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
    if (key != 'cover') {$(td).attr('contenteditable', 'true')};
    if (key == 'cover') {
      var img = document.createElement('img');
      $(img).attr('src', book[key]);
      $(td).html(img);
      $(td).attr("data-toggle", "modal");
      $(td).attr("data-target", "#bookModal");
    };
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

DataTable.prototype._deleteRow = function (e) {
  //create variable to target the row of the delete icon
  var $target = $(e.currentTarget).closest('tr');
  //create variable of the title of that row
  var title = $target.attr("title");
  //if delete is confirmed delete, otherwise do nothing
  if(confirm("Are you sure you want to delete this book?")){
    //push book with matching title to _trash in case they want to undo delete - need to create this functionality
    this._trash.push(this.getBookByTitle(title));
    //remove book from bookShelf
    this.removeBookbyTitle(title);
    //remove row from html (detach keeps a copy in memory: I'm not sure if I want this or not)
    $target.detach();
  }
  return false;
};

DataTable.prototype._resaveRow = function () {
  alert("You targeted... wisely")
};


$(function(){
  window.gTable = new DataTable($('#data-table'));
  window.gTable.init();
});
