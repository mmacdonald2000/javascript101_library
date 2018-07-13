
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

  return false;
};


RemoveBooksUI.prototype._handleRemoveBooks = function () {
  var title = $('#formRemoveBookTitle').val();
  var author = $('#formRemoveBookAuthor').val();
  console.log(title);
  console.log(author);

  validTitle = this._checkTitle(title);
  validAuthor = this._checkAuthor(author);

  tBook = this.getBookByTitle(title);
  aBooks = this.getBooksByAuthor(author);
  allBooks = aBooks.concat(tBook);

    if(validTitle && validAuthor){
      if(confirm("Are you sure you want to delete these books?" + allBooks)) {
        this.removeBookbyTitle(this._title);
        this.removeBookByAuthor(this._author);
      }
    } else if (validTitle && !validAuthor) {
      if(confirm("Are you sure you want to delete " + book + "?")) {
        this.removeBookbyTitle(this._title);
      }
    } else if (!validTitle && validAuthor) {
      if (confirm("Are you sure you want to delete these books?" + aBooks)) {
        this.removeBookByAuthor(this._author);
      }
    } else {
      alert("Please enter a valid title or author to remove books.");
    }


};

RemoveBooksUI.prototype._checkTitle = function (title) {
  var validTitle;
  if(this.getBookByTitle(title)){
    validTitle = true;
  } else {
    validTitle = false;
  };
  return validTitle
};

RemoveBooksUI.prototype._checkAuthor = function (author) {
  var validAuthor;
  if(this.getBooksByAuthor(author)){
    validAuthor = true;
  } else {
    validAuthor = false;
  };
  return validAuthor;
};


$(function(){

  window.gRemoveBooksUI = new RemoveBooksUI($('#removeBookModal'));
  window.gRemoveBooksUI.init();
});
