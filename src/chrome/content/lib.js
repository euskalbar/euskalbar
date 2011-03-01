
var euskalbarLib = {};

(function() {

  /* Constants */

  const Cc = Components.classes;
  const Ci = Components.interfaces;

  const chromeregCID = '@mozilla.org/chrome/chrome-registry;1';
  const chromeregIID = Ci.nsIChromeRegistry;

  const resphIID = Ci.nsIResProtocolHandler;

  const L10N_NORMAL = 0;
  const L10N_FORMATTED = 1;


  /*
   * Ajax stuff
   */

  /* A generic function for performing AJAX requests
   * It takes one argument, which is an object that contains a set of options
   * Thanks for this, John Resig.
   */
  this.ajax = function (options) {
    // Load the options object with defaults, if no
    // values were provided by the user
    options = {
      // The type of HTTP Request
      type: options.type || "GET",

      // The URL the request will be made to
      url: options.url || "",

      // How long to wait before considering the request to be a timeout
      timeout: options.timeout ||
        euskalbar.prefs.getIntPref("query.timeout") * 1000,

      // Functions to call when the request fails, succeeds,
      // or completes (either fail or succeed)
      onComplete: options.onComplete || function(){},
      onError: options.onError || function(){},
      onSuccess: options.onSuccess || function(){},

      // The data type that'll be returned from the server
      // the default is simply to determine what data was returned from the
      // server and act accordingly.
      data: options.data || ""
    };

    // Create the request object
    var xhr = new XMLHttpRequest();

    // Open the asynchronous POST request
    xhr.open(options.type, options.url, true);

    // We're going to wait for a request for the amount of seconds
    // the user has in its preferences before giving up
    var timeoutLength = euskalbar.prefs.getIntPref("query.timeout") * 1000;

    // Keep track of when the request has been succesfully completed
    var requestDone = false;

    // Initalize a callback which will fire 5 seconds from now, cancelling
    // the request (if it has not already occurred).
    // TODO: determine if the request has actually been timed out
    setTimeout(function () {
      requestDone = true;
    }, timeoutLength);

    // Watch for when the state of the document gets updated
    xhr.onreadystatechange = function() {
      // Wait until the data is fully loaded,
      // and make sure that the request hasn't already timed out
      if (xhr.readyState == 4 && !requestDone) {

        // Check to see if the request was successful
        if (httpSuccess(xhr)) {

          // Execute the success callback with the data returned from the server
          options.onSuccess(httpData(xhr, options.type));

          // Otherwise, an error occurred, so execute the error callback
        } else {
          options.onError();
        }

        // Call the completion callback
        options.onComplete();

        // Clean up after ourselves, to avoid memory leaks
        xhr = null;
      }
    };

    // Establish the connection to the server
    xhr.send();

    // Determine the success of the HTTP response
    function httpSuccess(r) {
      try {
        // If no server status is provided, and we're actually
        // requesting a local file, then it was successful
        return !r.status && location.protocol == "file:" ||
          // Any status in the 200 range is good
          (r.status >= 200 && r.status < 300) ||
          // Successful if the document has not been modified
          r.status == 304;
      } catch (e) {
      }

      // If checking the status failed, then assume that the request failed too
      return false;
    }

    // Extract the correct data from the HTTP response
    function httpData(r, type) {
      // Get the content-type header
      var ct = r.getResponseHeader("content-type");

      // If no default type was provided, determine if some
      // form of XML was returned from the server
      var data = !type && ct && ct.indexOf("xml") >= 0;

      // Get the XML Document object if XML was returned from
      // the server, otherwise return the text contents returned by the server
      data = type == "xml" || data ? r.responseXML : r.responseText;

      // If the specified type is "script", execute the returned text
      // response as if it was JavaScript
      if (type == "script") {
        JSON.parse(data);
      }

      // Return the response data (either an XML Document or a text string)
      return data;
    }

  };


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
    var index = text.lastIndexOf(".");

    if (index > 0) {
      text = text.substr(index + 1);
    }

    text = text.toLowerCase();
    text = text.replace(/[^-a-z0-9,&\s]+/ig, '');
    text = text.replace(/-/gi, "_");
    text = text.replace(/\s/gi, "-")

    return text;
  };


  /*
   * i18n / l10n
   */

  /* General localization function
   * 'type' can either be any of the L10N_* constants
   */
  this.gettext = function (text, args, type) {
    var strKey = text.replace(' ', '_', "g").toLowerCase();

    // First try getting the current locale's translation
    try {
      var bundle = this.$("leuskal");

      if (type == L10N_FORMATTED) {
        return bundle.getFormattedString(strKey, args);
      } else {
        return bundle.getString(strKey);
      }
    } catch (e) {
      console.log("Failed to get translation for key: " + strKey);
    }

    // If it fails, fall back to en-US
    try {
      var bundle = this.getDefaultStrBundle();

      if (type == L10N_FORMATTED) {
        return bundle.formatStringFromName(strKey, args, args.length);
      } else {
        return bundle.GetStringFromName(strKey);
      }
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

  /* Basic localization function */
  this._ = function (text) {
    return this.gettext(text, null, L10N_NORMAL);
  };

  /* Localization function with support for formatted strings.
   * Arguments are passed as an array of possible values.
   */
  this._f = function (text, args) {
    return this.gettext(text, args, L10N_FORMATTED);
  };

  this.defaultStrBundle = null;

  this.getDefaultStrBundle = function () {
    if (!this.defaultStringBundle) {
      var bundleURL = "chrome://euskalbar/locale/euskalbar.properties";
      var fileURI = this.FileIO.getLocalOrSystemPath(bundleURL);

      var parts = fileURI.split("/");
      parts[parts.length - 2] = "en-US";
      this.defaultStrBundle = Services.strings.createBundle(parts.join("/"));
    }

    return this.defaultStrBundle;
  };

  /* Returns the language part of a given locale code */
  this.langCode = function (code) {
    var sepIndex = code.indexOf('-');

    if (sepIndex != -1) {
      return code.slice(0, sepIndex);
    }

    return code;
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
