//a UI to handle making and displaying a table of books
var DataTable = function(container){
  Library.call(this);
  this.$container = container;
  //// IDEA: use to store deleted books for a while?
  this._trash = [];
  this._$target;
};

//extending from Library
DataTable.prototype = Object.create(Library.prototype);

DataTable.prototype.init = function () {
  // this.recover();
  //replace call to local storage with call to database
  this.getDataFromDatabase();
  this._bindEvents();
  this._bindCustomListeners();
};

DataTable.prototype._bindEvents = function () {
  //delete functionality
  this.$container.on('click', '.delete-book', $.proxy(this._deleteRow, this));
  //Edit functionality
  this.$container.on('click', '.edit-book', $.proxy(this._makeEditable, this));

  this.$container.on('click', '.save-book', $.proxy(this._resaveRow, this));
  //figure out how to make this only update on a click
  // this.$container.find("tr").on('blur', "td[contenteditable='true']", $.proxy(this._resaveRow, this));

  this.$container.on('change', '#editCover', $.proxy(this._handleTableImageUpload, this));

  $('.search-form').on('submit', $.proxy(this._searchUI, this));

  $('#allBooksBtn').on('click', $.proxy(this.getDataFromDatabase, this));
};

DataTable.prototype._bindCustomListeners = function () {
  $(document).on('tableUpdate', $.proxy(this._updateTable, this, window.bookShelf));

  $(document).on('specialUpdate', $.proxy(this._updateTableWithE, this));

};

DataTable.prototype._updateTableWithE = function (e) {
  //pass the value held in detail key of the event
  this._updateTable(e.detail);
};

DataTable.prototype._updateTable = function (bookshelf) {
  var _self = this;
  //Make Table Head Dynamically
  var $thead = this.$container.find('thead');
  $thead.empty();
  $thead.append(_self._createHeaderRow());
  // Make Table Body Dynamically
  var $tbody = this.$container.find('tbody');
  $tbody.empty();
  $.each(bookshelf, function(index, book){
    $tbody.append(_self._createRow(book));
  });
};

DataTable.prototype._createRow = function (book) {
  //create table row variable
  var tr = document.createElement('tr');
  $(tr).addClass('table-row');
  //add an attribute to tr with the title as the value so that we can target the title when deleting rows
  $(tr).attr('data-title', book.title);
  $(tr).attr('data-id', book._id);
  // create table data variable for delete column
  var deleteTD = document.createElement('td');
  //create i element for delete column
  var deleteI = document.createElement('i');
  //give it applicable class names
  $(deleteI).addClass('far fa-times-circle btn delete-book')
  //add input to table data
  deleteTD.append(deleteI);
  var editI = document.createElement('i');
  $(editI).addClass('far fa-edit btn edit-book');
  deleteTD.append(editI);

  //for each key in {Book} make a table data and add text to it
  for (var key in book) {
    var td = document.createElement('td')
    var $td = $(td).addClass('editable');
    if (key != 'cover') {
      $td.attr('contenteditable', 'false');
      $td.attr('data-name', key);
      $td.text(book[key]);
    }
    if (key == 'cover') {
      $td.append(this._createImg(book[key]));
      $td.attr("data-toggle", "modal");
      $td.attr('data-name', 'cover')
      $td.attr("data-target", "#bookModal");
      // console.log(td);
    };
    if(key === '__v' || key === '_id'){
      $td.addClass('collapse')
    }
    tr.append(td);
  };
  //append deleteTD here
  tr.append(deleteTD);
  return tr;
};

DataTable.prototype._createImg = function (bookCover) {
  return $('<img>', {
    src: bookCover,
    'class': 'btn',
    'id': 'coverArtBookModal',
    'alt': 'Cover Art'
  });
};

DataTable.prototype._createHeaderRow = function () {
  var book = new Book({});
  var tr = document.createElement('tr');

  //dynamically make the header
  for (var key in book) {
    var th = document.createElement('th')
    // console.log(key);
    $(th).text(makeTitle(key));
    if(key === '__v' || key === '_id'){
      $(th).addClass('collapse')
    }
    tr.append(th);
  };
  // append deleteTD here
  var deleteTH = document.createElement('th');
  $(deleteTH).text("Delete?");
  tr.append(deleteTH);
  return tr;
};

DataTable.prototype._deleteRow = function (e) {
  this._$target = $(e.currentTarget).closest('tr');
  var id = this._$target.attr('data-id');
  if(confirm("Are you sure you want to delete this book?")){
    this.removeBookbyId(id);
    //remove row from html (detach keeps a copy in memory: I'm not sure if I want this or not)
    this._$target.detach();
  }
  return false;
};

DataTable.prototype._resaveRow = function (e) {
  //grab row of the clicked button
  this._$target = $(e.currentTarget).closest('tr');
  var bookId = this._$target.attr('data-id');
  var answer = confirm('Are you sure you want to edit this book: "' + this._$target.attr('data-title') + '"?');
  if(answer){
    // this.removeBookbyTitle(oldBookTitle);
    var newTarget = this._$target.find('.editable');
    //use children of tr to get book info into object
    var oBook = {};
    $(newTarget).each(function(i, v){
      var key = $(this).attr('data-name');
      oBook[key] = key == 'cover' ? $(this).find('img').attr('src') : $(this).text();
    });
    console.log(oBook);

    var newBook = new Book(oBook);
    //edit book in database
    this.editDataFromDatabase(newBook);
    //change icon back to edit icon
    this._$target.find('td i.save-book').addClass('fa-edit edit-book').removeClass('fa-save save-book');
  } else if (answer === false){
    this._unmakeEditable(e);
  }
};

DataTable.prototype._makeEditable = function (e) {
  this._$target = $(e.currentTarget).closest('tr')
  //make td's in target tr contenteditable
  // console.log(this._$target.children('td[data-name]'));
  this._$target.children('td.editable').attr('contenteditable','true');

  //change icon to save icon
  this._$target.find('td i.edit-book').addClass('fa-save save-book').removeClass('fa-edit edit-book');
  //add a input box to image td
  this._$target.children('td[data-name="cover"]')
    .removeAttr('data-toggle data-target')
    .append('<input type="file" class="form-control-file col pl-0" id="editCover" accept="image/*">');


};
DataTable.prototype._handleTableImageUpload = function () {
  console.log('test upload');
  return fileReader('#coverArtBookModal','input[type=file]', this._$target );
};

DataTable.prototype._unmakeEditable = function (e) {
  this._$target = $(e.currentTarget).closest('tr');
  //change contenteditable back to false
  this._$target.children('td.editable').attr('contenteditable','false');
  //change save icon back to edit icon
  this._$target.find('td i.save-book').addClass('fa-edit edit-book').removeClass('fa-save save-book');
  //remove file reader and add modal attachment
  this._$target.children('td[data-name="cover"]')
    .remove('input[type=file]#editCover')
    .attr('data-toggle', 'modal')
    .attr('data-target', '#bookModal');

};

DataTable.prototype._searchUI = function (e) {
  e.preventDefault();
  searchInput = $('#search-input').val();
  console.log(this.search(searchInput));
  if(searchInput){
    this._handleEventTrigger('specialUpdate', this.search(searchInput));
  }
};


$(function(){
  window.gTable = new DataTable($('#data-table'));
  window.gTable.init();
});
