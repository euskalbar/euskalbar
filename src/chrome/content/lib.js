
var euskalbarLib = {};

(function() {

  /* Constants */

  const chromeregCID = '@mozilla.org/chrome/chrome-registry;1';
  const chromeregIID = Ci.nsIChromeRegistry;

  const resphIID = Ci.nsIResProtocolHandler;


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


  /*
   * i18n / l10n
   */

  this._ = function (text) {
    var strKey = text.replace(' ', '_', "g").toLowerCase();

    // First try getting the current locale's translation
    try {
      var bundle = this.$("leuskal");
      return bundle.getString(strKey);
    } catch(e) {
      console.log("Failed to get translation for key: " + strKey);
    }

    // If it fails, fall back to en-US
    try {
      var bundle = this.getDefaultStrBundle();
      return bundle.GetStringFromName(strKey);
    } catch (e) {
      console.log("Failed to get translation for key: " + strKey);
    }

    // As a last resource, we use the given text after the last dot
    var index = text.lastIndexOf(".");
    if (index > 0 && text.charAt(index - 1) != "\\") {
      text = text.substr(index + 1);
    }

    text = text.replace("_", " ", "g");

    return text;
  };

  this.defaultStrBundle = null;

  this.getDefaultStrBundle = function () {
    if (!this.defaultStringBundle) {
      var bundleURL = "chrome://euskalbar/locale/euskalbar.properties";
      var fileURI = this.FileIO.getLocalOrSystemPath(bundleURL);

      var parts = fileURI.split("/");
      parts[parts.length - 2] = "en-US";
      console.log(parts.join('/'));
      this.defaultStrBundle = Services.strings.createBundle(parts.join("/"));
    }

    console.log(this.defaultStrBundle);
    return this.defaultStrBundle;
  };


  /*
   * File IO operations
   */

  this.FileIO = {

      getLocalSystemURI: function (url) {
        try {
          var uri = Services.io.newURI(url, null, null);

          if (uri.schemeIs("resource")) {
            var ph = Services.io.getProtocolHandler("resource").QueryInterface(resphIID);
            var abspath = ph.getSubstitution(uri.host);
            uri = Services.io.newURI(uri.path.substr(1), null, abspath);
          }

          if (uri.schemeIs("chrome")) {
            var chromeRegistry = Cc[chromeregCID].getService(chromeregIID);
            uri = chromeRegistry.convertChromeURL(uri);
          }

          return uri;
        } catch(exc) {
        }
      },

      /* Gets path starting from a URL */
      getLocalOrSystemPath: function (url, allowDirectories) {
        var uri = this.getLocalSystemURI(url);

        if (uri instanceof Ci.nsIFileURL) {
          var file = uri.file;
          if (allowDirectories) {
            return file && file.path;
          } else {
            return file && !file.isDirectory() && file.path;
          }
        }
      },

    };

}).apply(euskalbarLib);
