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
  // serializeArray returns an array of objects with name and value keys - name is the name from html, value is the user input
  var serializedInput = $('form').serializeArray();

    var holdingObj = new Object();
    var bookValid = true;
    //for each entry in the inputs put the value into the object with name as a key
    $.each(serializedInput, function(index, entry){
      if(entry.value){
        holdingObj[entry.name] = entry.value;
      } else {
        //as is this does not stop the functionality-- Do I need to check for bookValid?
        //if(bookValid && this.checkForDuplicates(holdingObj)){push}
        bookValid = false;
        alert("Please enter a value for " + entry.name)
      }
    });
    //put the holdingObj into a Book object
    var inputBook = new Book(holdingObj)
    //return book
    return inputBook;

};



//add books to queue
AddBooksUI.prototype._queueBooks = function () {
  //prevent button from closing modal
  event.preventDefault();
  //make a book from input data
  inputBook = this.makeBook();
  console.log("This is the input: ");
  console.log(inputBook);
  //put book on temporary bookshelf

  //check if already on bookShelf and maybe if already on _tempBookShelf too
  this._tempBookShelf.push(inputBook);
  console.log("This is _tempBookShelf");
  console.log(this._tempBookShelf);
  this.queueCounter++;
  $('.queueNumber').text(this.queueCounter);
  // $('form').trigger('reset');

  return;
};

//make a clear queue function
AddBooksUI.prototype._clearQueue = function () {
  event.preventDefault();
  this._tempBookShelf = [];
  this.queueCounter = 0;
  $('.queueNumber').text(this.queueCounter);
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
