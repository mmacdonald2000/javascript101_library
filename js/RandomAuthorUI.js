//a UI to show a random author on modal
var RandomAuthorUI = function(container) {
  this.$container = container;
  Library.call(this);
  this._holdAuthor = [];
};

RandomAuthorUI.prototype = Object.create(Library.prototype);

RandomAuthorUI.prototype.init = function () {
  this._bindEvents();
  return;
};

RandomAuthorUI.prototype._bindEvents = function () {

  $('.pick-author-btn').on('click', $.proxy(this._handleShowAuthor, this));

  $('#getBooksbyAuthor').on('click', $.proxy(this._handleGetBooksByAuthor, this));

  $(document).on('authorUpdate', $.proxy(this._updateTable, this));

};

RandomAuthorUI.prototype._handleShowAuthor = function () {
  this._holdAuthor = [];
  var author = this.getRandomAuthorName();
  this._holdAuthor = author;
  var li = document.createElement('li');
  $(li).text(author);
  this.$container.find('ul').html(li);
  return;
};

RandomAuthorUI.prototype._handleGetBooksByAuthor = function () {
  console.log(this._holdAuthor)
  var books = this.getBooksByAuthor(this._holdAuthor);
  console.log(books);
  this._handleEventTrigger('specialUpdate', books)
};

$(function(){
  window.gRandomAuthorUI = new RandomAuthorUI($('#pickAuthorModal'));
  window.gRandomAuthorUI.init();
});
