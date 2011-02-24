
var euskalbarLib = {};

(function() {

  /* Quick and easy getElementById */
  this.$ = function (id, doc) {
    if (doc) {
      return doc.getElementById(id);
    } else {
      return document.getElementById(id);
    }
  };

}).apply(euskalbarLib);
