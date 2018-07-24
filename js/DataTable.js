//a UI to handle making and displaying a table of books
var DataTable = function(container){
  Library.call(this);
  this.$container = container;
  //what do I want to do with this?
  this._trash = [];
};

//extending from Library
DataTable.prototype = Object.create(Library.prototype);

DataTable.prototype.init = function () {
  // this.recover();

  this.getDataFromDatabase();


  this._updateTable(window.bookShelf);
  this._bindEvents();
  this._bindCustomListeners();
};

DataTable.prototype._bindEvents = function () {
  console.log('Binding events')
  // $('#allBooksBtn').on('click', $.proxy(this.getDataFromDatabase, this));


  //delete functionality
  this.$container.on('click', '.delete-book', $.proxy(this._deleteRow, this));
  //Edit functionality
  this.$container.on('click', '.edit-book', $.proxy(this._makeEditable, this));

  this.$container.on('click', '.save-book', $.proxy(this._resaveRow, this));
  //figure out how to make this only update on a click
  // this.$container.find("tr").on('blur', "td[contenteditable='true']", $.proxy(this._resaveRow, this));

  $('.search-form').on('submit', $.proxy(this._searchUI, this));

  $('#allBooksBtn').on('click', $.proxy(this._updateTable, this, window.bookShelf));
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
  //fix mobile-first design - doesn't work 7/18/18
  $('td:nth-child(4),th:nth-child(4)').hide();
  $('td:nth-child(5),th:nth-child(5)').hide();
  $('td:nth-child(6),th:nth-child(6)').hide();

  if($(window).width() >= 600){
    $('td:nth-child(4),th:nth-child(4)').show();
    $('td:nth-child(5),th:nth-child(5)').show();
    $('td:nth-child(6),th:nth-child(6)').show();
  }
};

DataTable.prototype._createRow = function (book) {
  //create table row variable
  var tr = document.createElement('tr');
  $(tr).addClass('table-row');
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
  var editI = document.createElement('i');
  $(editI).addClass('far fa-edit btn edit-book');
  deleteTD.append(editI);


  //for each key in {Book} make a table data and add text to it
  for (var key in book) {
    var td = document.createElement('td')
    $(td).text(book[key]);
    $(td).attr('id', key);
    if (key != 'cover') {
      $(td).attr('contenteditable', 'false');
    };
    if (key == 'cover') {
      var img = document.createElement('img');
      $(img).attr('src', book[key]);
      $(img).attr('alt', 'Cover Art');
      $(img).attr('id', 'coverArtBookModal');
      $(img).addClass('btn');
      $(td).html(img);
      $(td).attr("data-toggle", "modal");
      $(td).attr("data-target", "#bookModal");
      // console.log(td);
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

  //dynamically make the header
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
    this._trash.push(this.getOneBookByTitle(title));
    //remove book from bookShelf
    this.removeBookbyTitle(title);
    //remove row from html (detach keeps a copy in memory: I'm not sure if I want this or not)
    $target.detach();
  }
  return false;
};

DataTable.prototype._resaveRow = function (e) {
  //grab row of the clicked button
  var $target = $(e.currentTarget).closest('tr');
  var oldBookTitle = $target.attr('title');
  var answer = confirm('Are you sure you want to edit this book "' + oldBookTitle + '"?');
  if(answer){
    this.removeBookbyTitle(oldBookTitle);
    var newTarget = $target.children();
    //use children of tr to get book info into object
    var oBook = {
      cover: $(newTarget[0]).find('img').attr('src'),
      title: newTarget[1].innerText,
      author: newTarget[2].innerText,
      numberOfPages: newTarget[3].innerText,
      publishDate: newTarget[4].innerText,
      rating: newTarget[5].innerText
    }
    //make a new book with object
    var newBook = new Book(oBook);

    this.addBook(newBook);
    //change icon back to edit icon
    $target.find('td i.save-book').addClass('fa-edit edit-book').removeClass('fa-save save-book');
  } else if (answer === false){
    $target.children('td#title').attr('contenteditable','false');
    $target.children('td#author').attr('contenteditable','false');
    $target.children('td#numberOfPages').attr('contenteditable','false');
    $target.children('td#publishDate').attr('contenteditable','false');
    $target.children('td#rating').attr('contenteditable','false');
    $target.find('td i.save-book').addClass('fa-edit edit-book').removeClass('fa-save save-book');
  }
};

DataTable.prototype._makeEditable = function (e) {
  var $target = $(e.currentTarget).closest('tr')
  //make td's in target tr contenteditable
  $target.children('td#title').attr('contenteditable','true');
  $target.children('td#author').attr('contenteditable','true');
  $target.children('td#numberOfPages').attr('contenteditable','true');
  $target.children('td#publishDate').attr('contenteditable','true');
  $target.children('td#rating').attr('contenteditable','true');
  //change icon to save icon
  $target.find('td i.edit-book').addClass('fa-save save-book').removeClass('fa-edit edit-book');
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
