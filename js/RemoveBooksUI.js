
var RemoveBooksUI = function(container){
  Library.call(this);
  this.$container = container;
  this._trash = [];
};

RemoveBooksUI.prototype = Object.create(Library.prototype);

RemoveBooksUI.prototype.init = function () {
  this._bindEvents();
  return;
};

RemoveBooksUI.prototype._bindEvents = function () {
  $('#removeButton').on('click', $.proxy(this._handleRemoveBooks, this));
  return;
};


RemoveBooksUI.prototype._handleRemoveBooks = function () {
  var title = $('#formRemoveBookTitle').val();
  var author = $('#formRemoveBookAuthor').val();


  if(title && !author){
    //Remove book by Title
    this._removeBooksByTitle(title);
  } else if(author && !title){
    this._removeBooksByAuthor(author);
  } if(author && title){
    //Remove books by both
    this._removeBooksByTitle(title);
    this._removeBooksByAuthor(author);
  } else if(!title && !author){
    alert ("You must enter a valid title or author to remove books.")
  }
  return;
};

RemoveBooksUI.prototype._removeBooksByTitle = function (title) {
  //Remove book by Title
  if (this.getBookByTitle(title).length) {
    if(confirm("Are you sure you want to remove " + title + "?")){
      this.removeBookbyTitle(title);
      console.log(title + " was removed.")
    }
  } else {
    alert("This title does not exist on your bookshelf.")
  }
  return;
};

RemoveBooksUI.prototype._removeBooksByAuthor = function (author) {
  //Remove book by Author
  if (this.getBooksByAuthor(author).length) {
    if(confirm("Are you sure you want to remove all books by " + author + "?")){
      this.removeBookByAuthor(author);
      console.log("Books by " + author + " were removed.")
    }
  } else {
    alert("This author does not exist on your bookshelf.")
  }
  return;
};


$(function(){

  window.gRemoveBooksUI = new RemoveBooksUI($('#removeBookModal'));
  window.gRemoveBooksUI.init();
});
