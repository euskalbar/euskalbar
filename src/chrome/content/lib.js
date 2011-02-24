
euskalbarLib = {

  /* Quick and easy getElementById */
  $: function (id, doc) {
    if (doc) {
      return doc.getElementById(id);
    } else {
      return document.getElementById(id);
    }
  },

};
