/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2013 Euskalbar Taldea (see AUTHORS file)
 *
 * This file is part of Euskalbar.
 *
 * Euskalbar is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

Components.utils.import("resource://gre/modules/Services.jsm");

if (!euskalbar) var euskalbar = {};

euskalbar = function () {

  // Private vars
  var $L = euskalbarLib,
      $ = $L.$;

  // Public interface

  return {

    curVersion: "3.12",

    firstrunURL: "http://euskalbar.eu/firstrun",

    versionBaseURL: "http://euskalbar.eu/version",

    helpBaseURL: "http://euskalbar.eu/help/",

    // URI of the current user's profile directory
    profileURI: Services.dirsvc.get("ProfD", Components.interfaces.nsIFile),

    prefs: Services.prefs.getBranch("extensions.euskalbar."),

    source: null,

    target: null,


    /* Euskalbar initialization function */
    /* XXX: Try to minimize the actions executed here, as it affects to the
       overall browser startup time */
    init: function () {

      // Register to receive notifications of preference changes
      Services.prefs.addObserver("extensions.euskalbar.", this, false);

      var firstrun = euskalbar.prefs.getBoolPref("firstrun");
      var infoURL, openInfo = false;

      if (firstrun) {
        euskalbar.prefs.setBoolPref("firstrun", false);
        euskalbar.prefs.setCharPref("installedVersion", this.curVersion);

        /* Add Euskalbar button to the navigation bar and force
         * the toolbar to be displayed */
        euskalbar.ui.appendButtonToToolbar();
        euskalbar.ui.displayToolbar();

        euskalbar.stats.init();

        openInfo = true;
        infoURL = euskalbar.firstrunURL;
      } else {
        try {
          var installedVersion = euskalbar.prefs.getCharPref("installedVersion");

          /* We are in the middle of an upgrade */
          if (this.curVersion != installedVersion) {
            euskalbar.prefs.setCharPref("installedVersion", this.curVersion);

            /* Add Euskalbar button to the navigation bar and force
             * the toolbar to be displayed */
            euskalbar.ui.appendButtonToToolbar();
            euskalbar.ui.displayToolbar();

            openInfo = true;
            infoURL = euskalbar.versionBaseURL +
              this.curVersion.replace(/\./g, '');
          }
        } catch (ex) {
          /* Reinstall: do we need to do something in this situation? */
        }
      }

      if (openInfo) {
        setTimeout(function () {
          gBrowser.selectedTab = gBrowser.addTab(infoURL);
        }, 1000);
      }

      //Initialize language selection button
      var lang = this.prefs.getCharPref("language.startup");
      this.source = lang[0] + lang[1];
      this.target = lang[3] + lang[4];

      this.setLang(this.source, this.target);
      this.setDictionaries(this.source !== 'eu' ? this.source : this.target);

      // Load available dictionaries
      euskalbar.dicts.available.forEach(function (dictName) {
        var dictURI = 'chrome://euskalbar/content/dicts/' + dictName + '.js';
        Services.scriptloader.loadSubScript(dictURI, this, 'UTF-8');
      });

      euskalbar.ui.init();
    },


    // Euskalbar deskargatu
    shutdown: function () {
      window.removeEventListener("unload", euskalbar.shutdown, false);

      Services.prefs.removeObserver("", this);
      document.persist("euskalbar-toolbar", "currentset");
    },


    // Observerra erabili: hobespenetan aldaketa bat dagoenean exekutatzen da
    observe: function (subject, topic, data) {
      if (topic != "nsPref:changed") {
        return;
      }

      switch (data) {
        case "extensions.euskalbar.showdicts.enabled":
          this.showhideDicts();
          break;
        case "extensions.euskalbar.showcontextmenu.enabled":
          this.showContextmenu();
          break;
      }

      // Buttons' visibility
      euskalbar.dicts.available.forEach(function (dictName) {
        if (data === 'extensions.euskalbar.' + dictName + '.visible') {
          euskalbar.ui.toggleButtons('euskalbar-' + dictName,
                                     dictName + '.visible');
        }
      });
    },

    /*
     * Runs a query.
     *
     * The dictionary to query for and the search terms will be determined
     * according to the element that fired the event.
     */
    runQuery: function (event) {
      var dictName, isContext, term,
          source = euskalbar.source,
          target = euskalbar.target,
          element = event.target;

      dictName = element.id.split('-')[1];
      isContext = element.id.endsWith('-context');
      term = isContext ? euskalbar.ui.selectionText()
                       : $('euskalbar-search-string').value;

      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      // In case a context-menu search is being performed, we need to retrieve
      // the `source` and `target` languages from the element that fired this
      // event.
      if (isContext) {
        // Element IDs will have the following form:
        // `euskalbar-dictName-source_target-context`
        var pair = element.id.split('-')[2];

        // A language pair's source and target languages will always be
        // delimited by the underscore character
        if (pair && pair.indexOf('_') !== -1) {
          source = pair.slice(0,2);
          target = pair.slice(3,5);
        }
      }

      euskalbar.dicts.query(dictName, term, source, target);
    },

    /*
     * Runs a combined query.
     */
    runCombinedQueries: function (event) {
      var doc = event.target,
          url = doc.location.href,
          term = $('euskalbar-search-string').value,
          source = euskalbar.source,
          target = euskalbar.target;

      doc.removeEventListener("DOMContentLoaded",
                              euskalbar.runCombinedQueries, true);

      if (url.indexOf("chrome://euskalbar/content/html/") != -1) {
        // FIXME: This code is repeated, find a way to pass it along while
        // being able to remove the event listener.
        var lang = "";
        if ((source == 'es') || (target == 'es')) {
          lang = "es";
        } else if ((source == 'fr') || (target == 'fr')) {
          lang = "fr";
        } else {
          lang = "en";
        }

        var key = "";
        if (url.indexOf("euskalbarshift") != -1) {
          key = "onkey1";
        } else if (url.indexOf("euskalbarktrl") != -1) {
          key = "onkey2";
        }

        euskalbar.initHTML(doc, key, lang);

        // Go through each dictionary
        euskalbar.dicts.available.forEach(function (dictName) {
          try {
            var prefName = dictName + '.' + key + '.' + lang;
            if (euskalbar.prefs.getBoolPref(prefName)) {
              euskalbar.dicts.combinedQuery(dictName, term, source, target,
                                            doc);
            }
          } catch (e) {
            $L.log("Error while running combined query for " + dictName);
          }
        });
      }
    },

    // Initializes the HTML files in preparation of the combined queries
    initHTML: function (doc, key, lang) {
      // Sets the theme for the HTML files
      var prefStyle = euskalbar.prefs.getCharPref("style.combinedquery"),
          link = doc.getElementsByTagName("link")[0];
      link.setAttribute("href", prefStyle);

      var childPrefs = euskalbar.prefs.getChildList("", {}),
          isEnabledPref = function (value, index, array) {
            return (value.indexOf(key + '.' + lang) !== -1 &&
                    euskalbar.prefs.getBoolPref(value));
          },
          enabledPrefs = childPrefs.filter(isEnabledPref);

      enabledPrefs.forEach(function (prefName) {
        var dictName = prefName.split(".")[0],
            dictDisplayName = euskalbar.dicts[dictName].displayName;

        $('buruak', doc).innerHTML = $('buruak', doc).innerHTML
                                     + '<th id="dictName' + dictName + '">'
                                     + dictDisplayName + '<\/th>';

        var atd = doc.createElement('td');
        atd.setAttribute("id", "a" + dictName);
        atd.setAttribute("class", "gorputza");
        doc.getElementById('gorputzak').appendChild(atd);

        var ato = doc.createElement('td');
        ato.setAttribute("id", "o" + dictName);
        ato.setAttribute("class", "gorputza");
        doc.getElementById('oinak').appendChild(ato);
      });

      doc.getElementById('oharra').innerHTML = $L._("oharra");
    },


    // Shows help
    openHelp: function () {
      var locale = $L.langCode(euskalbar.ui.locale);

      if (euskalbar.ui.acceptedLocales.indexOf(locale) == -1) {
        var locale = 'en';
      }

      this.reuseOldTab(this.helpBaseURL + locale, "euskalbarhelp");
    },

    // Shows/hides dictionaries menu
    showhideDicts: function () {
      var menuEntry = $('euskalbar-menu');
      var appmenuEntry = $("appmenu_euskalbar");
      var appmenuSpacer = $("euskalbar-appmenu-spacer");

      if (!this.prefs.getBoolPref("showdicts.enabled")) {
        menuEntry.setAttribute('hidden', true);
        appmenuEntry.setAttribute('hidden', true);
        appmenuSpacer.setAttribute('hidden', true);
      } else {
        menuEntry.removeAttribute('hidden');
        appmenuEntry.removeAttribute('hidden');
        appmenuSpacer.removeAttribute('hidden');
      }
    },


    // Shows/hides context menu
    showContextmenu: function () {
      var sep = $('euskalbar-context-menuseparator');
      var button = $('euskalbar-context-menu');
      if (!this.prefs.getBoolPref("showcontextmenu.enabled")) {
        sep.setAttribute('hidden', true);
        button.setAttribute('hidden', true);
      } else {
        sep.removeAttribute('hidden');
        button.removeAttribute('hidden');
      }
    },


    // Shows prefs window
    euskalbarOptions: function () {
      var dialogURL = "chrome://euskalbar/content/prefs.xul";
      var prefwindow = window.openDialog(dialogURL, "", "chrome,modal,close");
    },


    // Estatistika lokalak erakusten ditu
    showLocalstats: function () {
      var t = gBrowser.addTab("chrome://euskalbar/content/stats.xul");
      gBrowser.selectedTab = t;
    },


    /* Toggles Euskalbar status */
    toggleBar: function (event) {
      if (event.target.id != "cmd_toggleEuskalbar") {
        return;
      }

      var el = $("euskalbar-toolbar");
      var state = el.collapsed;
      el.collapsed = !state;
    },

    // Laster-teklen aginduak exekutatzen ditu
    teklakEuskalbar: function (prefer) {
      switch (prefer) {
      case "showdicts":
        this.prefs.setBoolPref(prefer + ".enabled", !this.prefs.getBoolPref(prefer + ".enabled"));
        break;
      case "showcontextmenu":
        this.prefs.setBoolPref(prefer + ".enabled", !this.prefs.getBoolPref(prefer + ".enabled"));
        break;
      case "focustextbox":
        var tb = $("euskalbar-search-string");
        tb.focus();
        tb.select();
        break;
      case "toggledicts":
        this.toggleLang();
        break;
      }
    },


    // *************************************
    //  Euskalbarren barneko funtzioak
    // *************************************

    /**
     * Opens a browser tab with the given URL.
     * @param url
     *        The URL to open.
     * @param slug
     *        A unique string to identify the dictionary.
     * @param method
     *        The method of the HTTP request.
     * @param params
     *        Data to be sent in the HTTP request.
     *
     *        Parameters can either be:
     *        #. An object of key-value pairs. In case values are functions,
     *        the returned value will be used.
     *        #. Arrays serialized out of forms. In these situations the object
     *        elements of the array must have 'name' and 'value' properties.
     *
     *        Values will be properly escaped when invoking this function, so
     *        no prior escaping is needed.
     */
    openURL: function (url, slug, method, params) {
      var postData = null,
          dataString = $L.serialize(params);

      if (method == 'GET') {
        if (url.indexOf("?") == -1 && dataString) {
          url += "?";
        }

        url += dataString;
      } else if (method == "POST") {
        var stringStream = Cc["@mozilla.org/io/string-input-stream;1"]
                           .createInstance(Components.interfaces.nsIStringInputStream);

        stringStream.data = dataString;

        var postData = Cc["@mozilla.org/network/mime-input-stream;1"]
                       .createInstance(Components.interfaces.nsIMIMEInputStream);
        postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
        postData.addContentLength = true;
        postData.setData(stringStream);
      }

      if (this.prefs.getBoolPref("reusetabs.enabled")) {
        this.reuseOldTab(url, slug, postData);
      } else {
        this.openNewTab(url, slug, postData);
      }

      if (!this.prefs.getBoolPref("focuswindow.enabled")) {
        var tb = $("euskalbar-search-string");
        tb.focus();
        tb.select();
      }
    },


    /* Open URL in a new tab */
    openNewTab: function (tabUrl, slug, aPostData) {
      var newTab = gBrowser.addTab(tabUrl, null, null, aPostData);

      // Store slug as an attribute for reusing purposes
      newTab.setAttribute('slug', slug);

      if (!this.prefs.getBoolPref("bgtabs.enabled")) {
        gBrowser.selectedTab = newTab;
      }
    },


    /* Reuse old tab by querying tabs for the 'slug' attribute */
    reuseOldTab: function (tabUrl, slug, aPostData) {
      var numTabs = gBrowser.tabs.length;
      var found = false;
      var index = 0;

      while (index < numTabs && !found) {
        var currentTab = gBrowser.tabs[index];

        if (currentTab.hasAttribute('slug')
            && currentTab.getAttribute('slug') == slug) {

          var currentBrowser = gBrowser.getBrowserAtIndex(index);
          currentBrowser.webNavigation.loadURI(tabUrl, null, null,
                                               aPostData, null);

          if (!this.prefs.getBoolPref("bgtabs.enabled")) {
            gBrowser.tabContainer.selectedIndex = index;
          }
          currentBrowser.focus();
          found = true;
        }

        index++;
      }

      if (!found) {
        this.openNewTab(tabUrl, slug, aPostData);
      }
    },

    /* Returns the tab index by matching a given slug */
    getTabIndexBySlug: function (slug) {
      var found = false,
          index = 0,
          numTabs = gBrowser.tabs.length;

      while (index < numTabs && !found) {
        var currentTab = gBrowser.tabs[index];

        if (currentTab.hasAttribute('slug')
            && currentTab.getAttribute('slug') == slug) {
          found = true;
        }
        index++;
      }

      if (found) {
        return index - 1;
      }

      return -1;
    },


    // Kutxa hutsik badago, mezu bat bidali
    alertEmptyBox: function (katea) {
      // Remove pre and post whitespaces
      katea = katea.replace(/^\s+|\s+$/g, "");
      if (katea === "") {
        var euskalbarNotify = gBrowser.getNotificationBox();
        euskalbarNotify.appendNotification($L._f("kutxahutsa", ""));

        var t = setTimeout(function(){
          euskalbarNotify.removeCurrentNotification();
        }, 4000);

        return true;
      }

      return false;
    },


    // Enter tekla sakatzean irekitzen diren hiztegiak
    goEuskalBarOnKey: function (event) {
      // Get search string entered by user
      var searchStr = $('euskalbar-search-string').value;

      // If user pressed Enter key
      if (event.keyCode == 13) {
        if (this.alertEmptyBox(searchStr)) {
          return;
        }

        if ((event.shiftKey) || (event.ctrlKey)) {
          var k, url, slug;

          if (event.shiftKey) {
            k = "onkey1";
            url = 'chrome://euskalbar/content/html/euskalbarshift.html';
            slug = 'euskalbarshift';
          } else if (event.ctrlKey) {
            k = "onkey2";
            url = 'chrome://euskalbar/content/html/euskalbarktrl.html';
            slug = 'euskalbarktrl';
          }

          this.openURL(url, slug, null, null);

          var tab = gBrowser
            .getBrowserAtIndex(euskalbar.getTabIndexBySlug(slug));
          tab.addEventListener("DOMContentLoaded", this.runCombinedQueries,
                               true);
        } else { // Shift tekla eta Ktrl tekla sakatuta ez badaude...
          if ((this.source == 'es') || (this.target == 'es')) {
            // eu-es eta es-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (this.prefs.getBoolPref("euskalterm.onkey")) {
              euskalbar.dicts.goEuskalBarEuskalterm(this.source, searchStr, '0');
            }
            if (this.prefs.getBoolPref("elhuyar.onkey")) {
              euskalbar.dicts.goEuskalBarElhuyar(this.source, this.target, searchStr);
            }
            if (this.prefs.getBoolPref("zthiztegia.onkey")) {
              euskalbar.dicts.goEuskalBarZTHiztegia(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("telekom.onkey")) {
              euskalbar.dicts.goEuskalBarTelekom(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("labayru.onkey")) {
              euskalbar.dicts.goEuskalBarLabayru(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("zehazki.onkey")) {
              euskalbar.dicts.goEuskalBarZehazki(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("consumer.onkey")) {
              euskalbar.dicts.goEuskalBarConsumer(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("danobat.onkey")) {
              euskalbar.dicts.goEuskalBarDanobat(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("lanbide.onkey")) {
              euskalbar.dicts.goEuskalBarLanbide(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("epaitegiak.onkey")) {
              euskalbar.dicts.goEuskalBarEpaitegiak(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("ehuskaratuak.onkey")) {
              euskalbar.dicts.goEuskalBarEHUskaratuak(this.source, this.target, searchStr);
            }
          } else if ((this.source == 'fr') || (this.target == 'fr')) {
            // eu-fr eta fr-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (this.prefs.getBoolPref("euskalterm.onkey")) {
              euskalbar.dicts.goEuskalBarEuskalterm(this.source, searchStr, '0');
            }
            if (this.prefs.getBoolPref("elhuyar.onkey")) {
              euskalbar.dicts.goEuskalBarElhuyar(this.source, this.target, searchStr);
            }
            if (this.prefs.getBoolPref("zthiztegia.onkey")) {
              euskalbar.dicts.goEuskalBarZTHiztegia(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("telekom.onkey")) {
              euskalbar.dicts.goEuskalBarTelekom(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("ehuskaratuak.onkey")) {
              euskalbar.dicts.goEuskalBarEHUskaratuak(this.source, this.target, searchStr);
            }
          } else if ((this.source == 'en') || (this.target == 'en')) {
            // eu-en eta en-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (this.prefs.getBoolPref("euskalterm.onkey")) {
              euskalbar.dicts.goEuskalBarEuskalterm(this.source, searchStr, '0');
            }
            if (this.prefs.getBoolPref("elhuyar.onkey")) {
              euskalbar.dicts.goEuskalBarElhuyar(this.source, this.target, searchStr);
            }
            if (this.prefs.getBoolPref("morris.onkey")) {
              euskalbar.dicts.goEuskalBarMorris(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("zthiztegia.onkey")) {
              euskalbar.dicts.goEuskalBarZTHiztegia(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("telekom.onkey")) {
              euskalbar.dicts.goEuskalBarTelekom(this.source, searchStr);
            }
            if (this.prefs.getBoolPref("opentran.onkey")) {
              euskalbar.dicts.goEuskalBarOpentran(searchStr);
            }
            if (this.prefs.getBoolPref("ehuskaratuak.onkey")) {
              euskalbar.dicts.goEuskalBarEHUskaratuak(this.source, this.target, searchStr);
            }
          } else if ((this.source == 'eu') && (this.target == 'jp')) {
            // Go to Goihata dictionary if translating from Basque to Japanese
            if (this.prefs.getBoolPref("goihata.onkey")) {
              euskalbar.dicts.goEuskalBarGoihata(this.source, this.target, searchStr);
            }
          } else if ((this.source == 'la') || (this.target == 'la')) {
            if (this.prefs.getBoolPref("euskalterm.onkey")) {
              euskalbar.dicts.goEuskalBarEuskalterm(this.source, searchStr, '0');
            }
            if (this.prefs.getBoolPref("zthiztegia.onkey")) {
              euskalbar.dicts.goEuskalBarZTHiztegia(this.source, searchStr);
            }
          }
          // Aukeratutako hizkuntzarekiko menpekotasunik ez dutenak kargatu
          if (this.prefs.getBoolPref("batua.onkey")) {
            euskalbar.dicts.goEuskalBarEuskaltzaindia(searchStr);
          }
          if (this.prefs.getBoolPref("oeh.onkey")) {
            euskalbar.dicts.goEuskalBarOEH(searchStr);
          }
          if (this.prefs.getBoolPref("hauta.onkey")) {
            euskalbar.dicts.goEuskalBarHauta(searchStr);
          }
          if (this.prefs.getBoolPref("lurhe.onkey")) {
            euskalbar.dicts.goEuskalBarLurhe(searchStr);
          }
          if (this.prefs.getBoolPref("luret.onkey")) {
            euskalbar.dicts.goEuskalBarLuret(searchStr);
          }
          if (this.prefs.getBoolPref("harluxet.onkey")) {
            euskalbar.dicts.goEuskalBarHarluxet(searchStr);
          }
          if (this.prefs.getBoolPref("wikipedia.onkey")) {
            euskalbar.dicts.goEuskalBarWikipedia(searchStr);
          }
          if (this.prefs.getBoolPref("uzei.onkey")) {
            euskalbar.dicts.goEuskalBarUZEI(searchStr);
          }
          if (this.prefs.getBoolPref("itzul.onkey")) {
            euskalbar.dicts.goEuskalBarItzuL(searchStr);
          }
          if (this.prefs.getBoolPref("mokoroa.onkey")) {
            euskalbar.dicts.goEuskalBarMokoroa(this.source, searchStr);
          }
          if (this.prefs.getBoolPref("intza.onkey")) {
            euskalbar.dicts.goEuskalBarIntza(this.source, searchStr);
          }
          if (this.prefs.getBoolPref("eurovoc.onkey")) {
            euskalbar.dicts.goEuskalBarEurovoc(searchStr);
          }
          if (this.prefs.getBoolPref("bergara.onkey")) {
            euskalbar.dicts.goEuskalBarBergara(searchStr);
          }
          if (this.prefs.getBoolPref("ereduzko.onkey")) {
            euskalbar.dicts.goEuskalBarEreduzko(searchStr);
          }
          if (this.prefs.getBoolPref("egungo.onkey")) {
            euskalbar.dicts.goEuskalBarEgungo(searchStr);
          }
          if (this.prefs.getBoolPref("klasikoak.onkey")) {
            euskalbar.dicts.goEuskalBarKlasikoak(searchStr);
          }
          if (this.prefs.getBoolPref("ztcorpusa.onkey")) {
            euskalbar.dicts.goEuskalBarZTCorpusa(searchStr);
          }
          if (this.prefs.getBoolPref("lb.onkey")) {
            euskalbar.dicts.goEuskalBarLB(searchStr);
          }
          if (this.prefs.getBoolPref("lth.onkey")) {
            euskalbar.dicts.goEuskalBarLiteratura(searchStr);
          }
          if (this.prefs.getBoolPref("corpeus.onkey")) {
            euskalbar.dicts.goEuskalBarCorpEus(searchStr);
          }
          if (this.prefs.getBoolPref("xuxenweb.onkey")) {
            euskalbar.dicts.goEuskalBarXUXENweb(searchStr);
          }
          if (this.prefs.getBoolPref("elebila.onkey")) {
            euskalbar.dicts.goEuskalBarElebila(searchStr);
          }
        }
      }
    },


    // Toggles the active language pair
    toggleLang: function () {
      this.setLang(this.target, this.source);
    },


    // Sets the new active language pair
    setLang: function (source, target) {
      // Some exceptions to the rule
      if (['jp'].indexOf(source) !== -1 || ['la'].indexOf(target) !== -1) {
        return;
      }

      $("euskalbar-language").setAttribute("label",
                                           source.toUpperCase() +
                                           " ‣ " +
                                           target.toUpperCase());
      this.source = source;
      this.target = target;
    },


    // Adapts dictionary visibility according to the given language
    // XXX: This should to the job by giving a language pair
    setDictionaries: function (hizk) {
      var euskalterm = $('euskalbar-euskalterm');
      var morris = $('euskalbar-morris');
      var opentran = $('euskalbar-opentran');
      var labayru = $('euskalbar-labayru');
      var zehazki = $('euskalbar-zehazki');
      var elhuyar = $('euskalbar-elhuyar');
      var goihata = $('euskalbar-goihata');
      var zthiztegia = $('euskalbar-zthiztegia');
      var telekom = $('euskalbar-telekomunikazioak');
      var danobat = $('euskalbar-danobat');
      var ehuskaratuak = $('euskalbar-ehuskaratuak');
      var lanbide = $('euskalbar-lanbide_heziketa');
      var epaitegiak = $('euskalbar-epaitegiak');

      switch (hizk) {
      case 'es':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", false);
        goihata.setAttribute("hidden", true);
        zthiztegia.setAttribute("hidden", false);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        labayru.setAttribute("hidden", false);
        zehazki.setAttribute("hidden", false);
        telekom.setAttribute("hidden", false);
        danobat.setAttribute("hidden", false);
        ehuskaratuak.setAttribute("hidden", false);
        lanbide.setAttribute("hidden", false);
        epaitegiak.setAttribute("hidden", false);
        break;
      case 'fr':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", false);
        goihata.setAttribute("hidden", true);
        zthiztegia.setAttribute("hidden", false);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
        telekom.setAttribute("hidden", false);
        danobat.setAttribute("hidden", true);
        ehuskaratuak.setAttribute("hidden", false);
        lanbide.setAttribute("hidden", true);
        epaitegiak.setAttribute("hidden", true);
        break;
      case 'en':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", false);
        goihata.setAttribute("hidden", true);
        zthiztegia.setAttribute("hidden", false);
        morris.setAttribute("hidden", false);
        opentran.setAttribute("hidden", false);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
        telekom.setAttribute("hidden", false);
        danobat.setAttribute("hidden", true);
        ehuskaratuak.setAttribute("hidden", false);
        lanbide.setAttribute("hidden", true);
        epaitegiak.setAttribute("hidden", true);
        break;
      case 'la':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", true);
        goihata.setAttribute("hidden", true);
        zthiztegia.setAttribute("hidden", false);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
        telekom.setAttribute("hidden", true);
        danobat.setAttribute("hidden", true);
        ehuskaratuak.setAttribute("hidden", true);
        lanbide.setAttribute("hidden", true);
        epaitegiak.setAttribute("hidden", true);
        break;
      case 'jp':
        euskalterm.setAttribute("hidden", true);
        elhuyar.setAttribute("hidden", true);
        goihata.setAttribute("hidden", false);
        zthiztegia.setAttribute("hidden", true);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
        telekom.setAttribute("hidden", true);
        danobat.setAttribute("hidden", true);
        ehuskaratuak.setAttribute("hidden", true);
        lanbide.setAttribute("hidden", true);
        epaitegiak.setAttribute("hidden", true);
        break;
      }
    },

  };

}();

window.addEventListener("load", function(e) {
    window.removeEventListener('load', euskalbar.init, false);
    euskalbar.init();
}, false);
window.addEventListener("unload", function(e) { euskalbar.shutdown(); }, false);
