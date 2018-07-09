//contructor - container is a placeholder for the selector of the modal
var AddBooksUI = function(container){
  //reassign 'this' to the instance of Library
  Library.call(this);
  this._tempBookShelf = new Array();
  this.$container = container;
};

//extending from Library
AddBooksUI.prototype = Object.create(Library.prototype);

//initialize the instance
AddBooksUI.prototype.init = function () {
  this._bindEvents();
};

//put all events that should be controlled by this modal here
//proxy similar to call - resets the context to the scope of the class or it would just be within the function's context
AddBooksUI.prototype._bindEvents = function () {
  $('#add-books-btn').on('click', $.proxy(this._handleModalOpen, this));
  //bind event add books to queue
  //bind event to add books to library
};

//Actual event handler
AddBooksUI.prototype._handleModalOpen = function () {
  this.$container.modal('show');
};

AddBooksUI.prototype._queueBooks = function () {
  //add books to queue
};

AddBooksUI.prototype._addBooksToLIb = function () {
  //take queued books array and pass to this.addBooks in library
};

$(function(){
  window.gAddBooksUI = new AddBooksUI($('#addBookModal'));
  window.gAddBooksUI.init();
});
