var euskalbarButton = {

  /* Appends the Euskalbar button to the navigation bar */
  appendToToolbar: function() {
    // Get the current navigation bar button set (a string of button IDs) and append
    // the ID of the Euskalbar button into it
    var euskalbarButtonId = "euskalbar-button";
    var navBarId = "nav-bar";
    var navBar = document.getElementById(navBarId);

    var currentSet = navBar.currentSet;

    // Append only if the button is not already there
    var curSet = currentSet.split(",");
    if (curSet.indexOf(euskalbarButtonId) == -1) {
      var set = curSet.concat(euskalbarButtonId);

      navBar.setAttribute("currentset", set.join(","));
      document.persist(navBarId, "currentset");

      try {
        BrowserToolboxCustomizeDone(true);
      } catch (e) {
      }
    }

    // In case it's hidden, show the navigation bar
    navBar.setAttribute("collapsed", false);
    document.persist(navBarId, "collapsed");
  },

}
