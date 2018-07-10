//contructor - container is a placeholder for the selector of the modal
var AddBooksUI = function(container){
  //reassign 'this' to the instance of Library
  Library.call(this);
  this._tempBookShelf = new Array();
  this.$container = container;
  this.queueCounter = 0;
};

//extending from Library
AddBooksUI.prototype = Object.create(Library.prototype);

//initialize the instance
AddBooksUI.prototype.init = function () {
  this._bindEvents();
  return;
};

//put all events that should be controlled by this modal here
//proxy similar to call - resets the context to the scope of the class or it would just be within the function's context
AddBooksUI.prototype._bindEvents = function () {
  //bind event to open modal
  $('#add-books-btn').on('click', $.proxy(this._handleModalOpen, this));
  //bind event to make a book object

  //bind event add book to queue
  $('.queue-btn').on('click', $.proxy(this._queueBooks, this));
  //bind event to add books to library
  $('#formAddAllBooks').on('click', $.proxy(this._addBooksToLIb, this));
  // return;
};

//open the modal
AddBooksUI.prototype._handleModalOpen = function () {
  this.$container.modal('show');
  return;
};

//make book object from inputs
AddBooksUI.prototype.makeBook = function () {

  var serialized = $('form').serializeArray();
  // var title = serialized[0].value;
  // var author = serialized[1].value;
  // var numberOfPages = serialized[2].value;
  // var publishDate = serialized[3].value;

  var title = $('#formAddBookTitle').val();
  var author = $('#formAddBookAuthor').val();
  var numberOfPages = $('#formAddBookPages').val();
  var pubDate = $('#formAddBookPubDate').val();
  // var rating = $('#formAddBookRating').val();
  // var cover = $('#formAddBookCover').val();

  var inputBook = new Book(title, author, numberOfPages, pubDate)

  return inputBook;
};

//add books to queue
AddBooksUI.prototype._queueBooks = function () {
  event.preventDefault();
  inputBook = this.makeBook();
  console.log("This is the input: ");
  console.log(inputBook);
  this._tempBookShelf.push(inputBook);
  console.log("This is _tempBookShelf");
  console.log(this._tempBookShelf);
  this.queueCounter++;
  $('.queueNumber').text(this.queueCounter);
  $('form').trigger('reset');

  return;
};

//add Queued books to bookshelf
AddBooksUI.prototype._addBooksToLIb = function () {
  event.preventDefault();
  if(this.queueCounter===0){
    inputBook = this.makeBook();
    this.addBook(inputBook);
  } else {
    console.log(this._tempBookShelf);
    this.addBooks(this._tempBookShelf);
    this._tempBookShelf = [];
  }
  this.queueCounter = 0;
  $('.queueNumber').text(this.queueCounter);
  // this.$container.modal('hide');
  return;
};

$(function(){
  window.gAddBooksUI = new AddBooksUI($('#addBookModal'));
  window.gAddBooksUI.init();
});

// //jQuery Form Validation Plugin
// $(document).ready(function() {
//
//     $('#your_form_id').ajaxForm( { beforeSubmit: dateCheck } );
// });
