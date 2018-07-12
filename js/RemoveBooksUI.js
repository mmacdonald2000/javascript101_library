
var RemoveBooksUI = function(container){
  Library.call(this);
  this.$container = container;
  this._trash = [];
  this._title = $('#formRemoveBookTitle').val();
  this._author = $('#formRemoveBookAuthor').val();
};

RemoveBooksUI.prototype = Object.create(Library.prototype);

RemoveBooksUI.prototype.init = function () {
  this._bindEvents();
  return;
};

RemoveBooksUI.prototype._bindEvents = function () {
  $('#deleteBooks').on('click', $.proxy(this._handleModalOpen(), this));

  $('#removeButton').on('click', $.proxy(this._handleRemoveBooks()), this);

  // return;
};

RemoveBooksUI.prototype._handleModalOpen = function () {
  this.$container.modal('show');
  return;
};

RemoveBooksUI.prototype._handleRemoveBooks = function () {
  console.log(this._title);
  console.log(this._author);

    if(this._title && this._author){
      this.removeBookbyTitle(this._title);
      this.removeBookByAuthor(this._author);
    } else if (this._title) {
      this.removeBookbyTitle(this._title);
    } else if (this._author) {
      this.removeBookByAuthor(this._author);
    } else {
      alert("Please enter a title or author to remove books.");
    }


};

//remove books by title
// RemoveBooksUI.prototype._removeByTitle = function () {
//   $title = $('#formRemoveBookTitle');
//   if(confirm("Are you sure you want to delete this book?" + $title)) {
//
//     console.log('removed');
//   };
//
//   return;
// };

RemoveBooksUI.prototype._removeByAuthor = function () {
  
};


$(function(){
  window.gRemoveBooksUI = new RemoveBooksUI($('#removeBookModal'));
  window.gRemoveBooksUI.init();
});
