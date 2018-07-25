//a UI to handle getting a random book and displaying it in a modal
var RandomBookUI = function(container){
  Library.call(this);
  this.$container = container;
}

//extending from Library
RandomBookUI.prototype = Object.create(Library.prototype);

//initialize the instance
RandomBookUI.prototype.init = function () {
  this._bindEvents();
  return;
};

RandomBookUI.prototype._bindEvents = function () {

$('#data-table').on('click', '#coverArtBookModal', $.proxy(this._pushBookByTable, this));

$('.pick-book-btn').on('click', $.proxy(this._pushBookByRandom, this));

$(document).on('randomBook', $.proxy(this._pushBookInfoWithDetail, this));

};

RandomBookUI.prototype._pushBookInfo = function (book) {
  //push cover art into image source
  this.$container.find('#bookModalCover').attr('src', book.cover);
  //push title
  this.$container.find('#bookModalTitle').html(book.title);
  //push author
  this.$container.find('#bookModalAuthor').html(book.author);
  //push Pages
  this.$container.find('#bookModalPages').html(book.numberOfPages);
  //push pubDate
  this.$container.find('#bookModalDate').html(book.publishDate);
  //push Rating
  this.$container.find('#bookModalRating').html(book.rating);

};

RandomBookUI.prototype._pushBookInfoWithDetail = function (e) {
  this._pushBookInfo(e.detail);
};

RandomBookUI.prototype._pushBookByTable = function (e) {
  //get book title & getBookByTitle
  var title = $(e.currentTarget).closest('tr').attr('data-title');
  var tableBook = this.getOneBookByTitle(title);
  this._pushBookInfo(tableBook);
};

RandomBookUI.prototype._pushBookByRandom = function () {
  var randomBookId = this.getRandomBook()._id;
  this.getOneBookFromDatabase(randomBookId);
  // this._pushBookInfo(randomBook);
};

$(function(){
  window.gRandomBook = new RandomBookUI($('#bookModal'));
  window.gRandomBook.init();
});
