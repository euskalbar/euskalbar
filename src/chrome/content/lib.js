
var euskalbarLib = {};

(function() {

  /*
   * DOM manipulation
   */

  /* Quick and easy getElementById */
  this.$ = function (id, doc) {
    if (doc) {
      return doc.getElementById(id);
    } else {
      return document.getElementById(id);
    }
  };


  /*
   * String manipulation
   */

  this.slugify = function (text) {
    text = text.toLowerCase();
    text = text.replace(/[^-a-z0-9,&\s]+/ig, '');
    text = text.replace(/-/gi, "_");
    text = text.replace(/\s/gi, "-")

    return text;
  };

}).apply(euskalbarLib);
