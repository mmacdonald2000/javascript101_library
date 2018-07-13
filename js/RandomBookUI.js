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

$(function(){
  window.gRandomBook = new RandomBookUI($(''));
  window.gRandomBook.init();
});
