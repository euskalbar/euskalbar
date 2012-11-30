/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2012 Euskalbar Taldea (see AUTHORS file)
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

  var euskalbar = {

    curVersion: "3.11",

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

        euskalbar.stats.createStatsFile();

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

      // Disable preferences related to 3000 and Adorez dictionaries, as they
      // don't work (remove when those dictionaries work again)
      this.prefs.setBoolPref("3000.onkey", false);
      this.prefs.setBoolPref("3000.onkey1.es", false);
      this.prefs.setBoolPref("3000.onkey2.es", false);
      this.prefs.setBoolPref("adorez.onkey", false);
      this.prefs.setBoolPref("adorez.onkey1.es", false);
      this.prefs.setBoolPref("adorez.onkey1.en", false);
      this.prefs.setBoolPref("adorez.onkey1.fr", false);
      this.prefs.setBoolPref("adorez.onkey2.es", false);
      this.prefs.setBoolPref("adorez.onkey2.en", false);
      this.prefs.setBoolPref("adorez.onkey2.fr", false);

      //Initialize language selection button
      var lang = this.prefs.getCharPref("language.startup");
      this.source = lang[0] + lang[1];
      this.target = lang[3] + lang[4];

      this.setEuskalbarLang(this.source, this.target);
      if (this.source != 'eu') {
        this.setEuskalbarDictionaries(this.source);
      } else {
        this.setEuskalbarDictionaries(this.target);
      }

      // Azalak aldatzeko funtzioari deitu (DOMContentLoaded gertaerapean)
      gBrowser.addEventListener("DOMContentLoaded", this.initHTML, true);

      //Execute combined queries only when the HTML is loaded
      gBrowser.addEventListener("DOMContentLoaded", euskalbar.comb.getShiftTelekom, true);
      gBrowser.addEventListener("DOMContentLoaded", euskalbar.comb.getShiftZTHiztegia, true);
      gBrowser.addEventListener("DOMContentLoaded", euskalbar.comb.getShiftLabayru, true);
      gBrowser.addEventListener("DOMContentLoaded", euskalbar.comb.getShiftMokoroa, true);
      gBrowser.addEventListener("DOMContentLoaded", euskalbar.comb.getShiftDanobat, true);


      // Init bar's buttons
      this.toggleButtons("EuskalBar-Search", "euskalterm.visible");
      this.toggleButtons("EuskalBar-Elhuyar", "elhuyar.visible");
      this.toggleButtons("EuskalBar-ZTHiztegia", "zthiztegia.visible");
      this.toggleButtons("EuskalBar-Telekom", "telekom.visible");
      this.toggleButtons("EuskalBar-Labayru", "labayru.visible");
      this.toggleButtons("EuskalBar-Zehazki", "zehazki.visible");
      this.toggleButtons("EuskalBar-Morris", "morris.visible");
      this.toggleButtons("EuskalBar-Opentran", "opentran.visible");
      this.toggleButtons("EuskalBar-Euskaltzaindia", "batua.visible");
      this.toggleButtons("EuskalBar-OEH", "oeh.visible");
      this.toggleButtons("EuskalBar-UZEI", "uzei.visible");
      this.toggleButtons("EuskalBar-ItzuL", "itzul.visible");
      this.toggleButtons("EuskalBar-Harluxet", "harluxet.visible");
      this.toggleButtons("EuskalBar-Wikipedia", "wikipedia.visible");
      this.toggleButtons("EuskalBar-Mokoroa", "mokoroa.visible");
      this.toggleButtons("EuskalBar-Intza", "intza.visible");
      this.toggleButtons("EuskalBar-Eurovoc", "eurovoc.visible");
      this.toggleButtons("EuskalBar-Bergara", "bergara.visible");
      this.toggleButtons("EuskalBar-Ereduzko", "ereduzko.visible");
      this.toggleButtons("EuskalBar-Klasikoak", "klasikoak.visible");
      this.toggleButtons("EuskalBar-ZTCorpusa", "ztcorpusa.visible");
      this.toggleButtons("EuskalBar-LB", "lb.visible");
      this.toggleButtons("EuskalBar-Consumer", "consumer.visible");
      this.toggleButtons("EuskalBar-CorpEus", "corpeus.visible");
      this.toggleButtons("EuskalBar-XUXENweb", "xuxenweb.visible");
      this.toggleButtons("EuskalBar-Elebila", "elebila.visible");
      this.toggleButtons("EuskalBar-Goihata", "goihata.visible");
      this.toggleButtons("EuskalBar-Danobat", "danobat.visible");

      euskalbar.ui.init();
    },


    // Euskalbar deskargatu: observerra ezabatu
    shutdown: function () {
      window.removeEventListener("load", euskalbar.init, false);
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
      //toggle buttons visibility
      case "extensions.euskalbar.euskalterm.visible":
        this.toggleButtons("EuskalBar-Search", "euskalterm.visible");
        break;
      case "extensions.euskalbar.elhuyar.visible":
        this.toggleButtons("EuskalBar-Elhuyar", "elhuyar.visible");
        break;
      case "extensions.euskalbar.zthiztegia.visible":
        this.toggleButtons("EuskalBar-ZTHiztegia", "zthiztegia.visible");
        break;
      case "extensions.euskalbar.telekom.visible":
        this.toggleButtons("EuskalBar-Telekom", "telekom.visible");
        break;
      case "extensions.euskalbar.labayru.visible":
        this.toggleButtons("EuskalBar-Labayru", "labayru.visible");
        break;
      case "extensions.euskalbar.zehazki.visible":
        this.toggleButtons("EuskalBar-Zehazki", "zehazki.visible");
        break;
      case "extensions.euskalbar.morris.visible":
        this.toggleButtons("EuskalBar-Morris", "morris.visible");
        break;
      case "extensions.euskalbar.opentran.visible":
        this.toggleButtons("EuskalBar-Opentran", "opentran.visible");
        break;
      case "extensions.euskalbar.batua.visible":
        this.toggleButtons("EuskalBar-Euskaltzaindia", "batua.visible");
        break;
      case "extensions.euskalbar.oeh.visible":
        this.toggleButtons("EuskalBar-OEH", "oeh.visible");
        break;
      case "extensions.euskalbar.uzei.visible":
        this.toggleButtons("EuskalBar-UZEI", "uzei.visible");
        break;
      case "extensions.euskalbar.itzul.visible":
        this.toggleButtons("EuskalBar-ItzuL", "itzul.visible");
        break;
      case "extensions.euskalbar.harluxet.visible":
        this.toggleButtons("EuskalBar-Harluxet", "harluxet.visible");
        break;
      case "extensions.euskalbar.wikipedia.visible":
        this.toggleButtons("EuskalBar-Wikipedia", "wikipedia.visible");
        break;
      case "extensions.euskalbar.mokoroa.visible":
        this.toggleButtons("EuskalBar-Mokoroa", "mokoroa.visible");
        break;
      case "extensions.euskalbar.intza.visible":
        this.toggleButtons("EuskalBar-Intza", "intza.visible");
        break;
      case "extensions.euskalbar.eurovoc.visible":
        this.toggleButtons("EuskalBar-Eurovoc", "eurovoc.visible");
        break;
      case "extensions.euskalbar.bergara.visible":
        this.toggleButtons("EuskalBar-Bergara", "bergara.visible");
        break;
      case "extensions.euskalbar.ereduzko.visible":
        this.toggleButtons("EuskalBar-Ereduzko", "ereduzko.visible");
        break;
      case "extensions.euskalbar.klasikoak.visible":
        this.toggleButtons("EuskalBar-Klasikoak", "klasikoak.visible");
        break;
      case "extensions.euskalbar.ztcorpusa.visible":
        this.toggleButtons("EuskalBar-ZTCorpusa", "ztcorpusa.visible");
        break;
      case "extensions.euskalbar.lb.visible":
        this.toggleButtons("EuskalBar-LB", "lb.visible");
        break;
      case "extensions.euskalbar.consumer.visible":
        this.toggleButtons("EuskalBar-Consumer", "consumer.visible");
        break;
      case "extensions.euskalbar.corpeus.visible":
        this.toggleButtons("EuskalBar-CorpEus", "corpeus.visible");
        break;
      case "extensions.euskalbar.xuxenweb.visible":
        this.toggleButtons("EuskalBar-XUXENweb", "xuxenweb.visible");
        break;
      case "extensions.euskalbar.elebila.visible":
        this.toggleButtons("EuskalBar-Elebila", "elebila.visible");
        break;
      case "extensions.euskalbar.goihata.visible":
        this.toggleButtons("EuskalBar-Goihata", "goihata.visible");
        break;
      case "extensions.euskalbar.danobat.visible":
        this.toggleButtons("EuskalBar-Danobat", "danobat.visible");
        break;
      }
    },

    /* Toggles buttons visibility */
    toggleButtons: function (name, apref) {
      var btn = euskalbarLib.$(name);
      var state = euskalbar.prefs.getBoolPref(apref);
      btn.collapsed = !state;
    },

    // HTML fitxategiak hasieratzen ditu
    initHTML: function (event) {
      // HTML fitxategietan estiloaren katea aldatzen du
      var prefStyle = euskalbar.prefs.getCharPref("style.combinedquery");
      var URL = event.target.location.href;

      if (URL.indexOf("chrome://euskalbar/content/html/") != -1) {
        var link = event.target.getElementsByTagName("link")[0];
        link.setAttribute("href", prefStyle);

        //Erakutsiko diren hiztegien zutabeak erakusteko funtzioari deitzen dio
        var l = "";
        if ((euskalbar.source == 'es') || (euskalbar.target == 'es')) {
          l = "es";
        } else if ((euskalbar.source == 'fr') || (euskalbar.target == 'fr')) {
          l = "fr";
        } else {
          l = "en";
        }
        var k = "";
        if (URL.indexOf("euskalbarshift") != -1) {
          k = "onkey1";
        } else if (URL.indexOf("euskalbarktrl") != -1) {
          k = "onkey2";
        }
        var cprefs = euskalbar.prefs.getChildList("", {});
        var sprefs = new Array();
        var x;
        for (x in cprefs) {
          if (cprefs[x].indexOf(k + "." + l) != -1) {
            sprefs.unshift(cprefs[x]);
          }
        }
        for (x in sprefs) {
          if (euskalbar.prefs.getBoolPref(sprefs[x])) {
            var burua = sprefs[x].split(".")[0];
            burua = burua.charAt(0).toUpperCase() + burua.slice(1);
            event.target.getElementById('buruak').innerHTML =
            event.target.getElementById('buruak').innerHTML + '<th id="burua' + burua + '">' + burua + '<\/th>';
            var atd = event.target.createElement('td');
            atd.setAttribute("id", "a" + burua);
            atd.setAttribute("class", "gorputza");
            event.target.getElementById('gorputzak').appendChild(atd);
            var ato = event.target.createElement('td');
            ato.setAttribute("id", "o" + burua);
            ato.setAttribute("class", "gorputza");
            event.target.getElementById('oinak').appendChild(ato);
          }
        }
        event.target.getElementById('oharra').innerHTML = euskalbarLib._("oharra");
      }
    },


    // Laguntza erakusten du
    openHelp: function () {
      var locale = euskalbarLib.langCode(euskalbar.ui.locale);

      if (euskalbar.ui.acceptedLocales.indexOf(locale) == -1) {
        var locale = 'en';
      }

      this.reuseOldTab(this.helpBaseURL + locale, "euskalbarhelp");
    },

    // Hiztegien menua erakusten/ezkutatzen du
    showhideDicts: function () {
      var menuEntry = euskalbarLib.$('euskalbar-menu');
      var appmenuEntry = euskalbarLib.$("appmenu_euskalbar");
      var appmenuSpacer = euskalbarLib.$("euskalbar-appmenu-spacer");

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


    // Testuinguru-menua erakusten/ezkutatzen du
    showContextmenu: function () {
      var sep = euskalbarLib.$('Euskalbar-context-menuseparator');
      var button = euskalbarLib.$('Euskalbar-context-menu');
      if (!this.prefs.getBoolPref("showcontextmenu.enabled")) {
        sep.setAttribute('hidden', true);
        button.setAttribute('hidden', true);
      } else {
        sep.removeAttribute('hidden');
        button.removeAttribute('hidden');
      }
    },


    // Aukeren koadroa erakusten du
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

      var el = euskalbarLib.$("euskalbar-toolbar");
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
        var el = euskalbarLib.$("EuskalBar-search-string");
        el.focus();
        el.select();
        break;
      case "toggledicts":
        this.changeEuskalbarLang();
        break;
      }
    },


    // *************************************
    //  Euskalbarren barneko funtzioak
    // *************************************
    /**
     * Emandako URLa zabaltzen du hobespenaren arabera
     * @param url
     *        Zabaldu beharreko URLa
     * @param zein
     *        URLaren baitan dagoen kate identifikagarri bat
     *        (fitxak URI bitartez berrerabiltzeko)
     * @param method
     *        HTTP eskaeran daturen bat igorri behar bada,
     *        zein metodo erabiliko den datuak pasatzeko (GET, POST)
     * @param params
     *        Parametroen array bat, elementu bakoitza
     *        izena/balioa bikote bat izanik (QueryParameter-ek sortuta)
     * Inspirazioa: /browser/components/search/nsSearchService.js
     *              EngineURL.prototype.getSubmission() metodoa
     */
    openURL: function (url, slug, method, params) {
      var postData = null;
      var dataString = "";

      if (params != null) { // momentuko soluzioa...
        for (var i = 0; i < params.length; ++i) {
          var param = params[i];

          dataString += (i > 0 ? "&" : "") + param.name + "=" + param.value;
        }
      }

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
    },


    // Izena/balioa pareak adierazteko objektua
    QueryParameter: function (aName, aValue) {
      this.name = aName;
      this.value = aValue;
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
      var found = false;
      var index = 0;
      var numTabs = gBrowser.tabs.length;

      while (index < numTabs && !found) {
        var currentTab = gBrowser.tabs[index];

        if (currentTab.hasAttribute('slug')
            && currentTab.getAttribute('slug') == slug) {
          found = true;
        }
        index++;
      }

      if (!found) {
        return -1;
      } else {
        return index - 1;
      };
    },


    // Kutxa hutsik badago, mezu bat bidali
    alertEmptyBox: function (katea) {
      //Kateari aurreko eta atzeko zuriuneak kendu
      katea = katea.replace(/^\s+|\s+$/g, "");
      if (katea == "") {
        alert(_("kutxahutsa"));

        return true;
      }
    },


    // Enter tekla sakatzean irekitzen diren hiztegiak
    goEuskalBarOnKey: function (event) {
      // Get search string entered by user
      var searchStr = euskalbarLib.$('EuskalBar-search-string').value;

      // If user pressed Enter key
      if (event.keyCode == 13) {
        if (this.alertEmptyBox(searchStr)) {
          return;
        }

        // Exekutatu euskalbarcomb.js fitxategian dauden skriptak
        var l = "";
        if ((euskalbar.source == 'es') || (euskalbar.target == 'es')) {
          l = "es";
        } else if ((euskalbar.source == 'fr') || (euskalbar.target == 'fr')) {
          l = "fr";
        } else if ((euskalbar.source == 'en') || (euskalbar.target == 'en')) {
          l = "en";
        } else if ((euskalbar.source == 'la') || (euskalbar.target == 'la')) {
          l = "la";
        } else if ((euskalbar.source == 'ja') || (euskalbar.target == 'ja')) {
          l = "ja";
        }

        var k = "";
        if ((event.shiftKey) || (event.ctrlKey)) {
          if (event.shiftKey) {
            k = "onkey1";
            var urlhizt = 'chrome://euskalbar/content/html/euskalbarshift.html';
            var zein = 'euskalbarshift';
          } else if (event.ctrlKey) {
            k = "onkey2";
            var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrl.html';
            var zein = 'euskalbarktrl';
          }
          this.openURL(urlhizt, zein, null, null);

          try {
            if (this.prefs.getBoolPref("euskalterm." + k + "." + l)) {
              euskalbar.comb.getShiftEuskalterm(this.source, searchStr);
              euskalbar.stats.writeStats(0);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("elhuyar." + k + "." + l)) {
              euskalbar.comb.getShiftElhuyar(this.source, this.target, searchStr);
              euskalbar.stats.writeStats(1);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("labayru." + k + "." + l)) {
              euskalbar.comb.getShiftLabayru(this.source, searchStr);
              euskalbar.stats.writeStats(22);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("zthiztegia." + k + "." + l)) {
              euskalbar.comb.getShiftZTHiztegia(this.source, searchStr);
              euskalbar.stats.writeStats(25);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("telekom." + k + "." + l)) {
              euskalbar.comb.getShiftTelekom(this.source, searchStr);
              euskalbar.stats.writeStats(27);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("batua." + k + "." + l)) {
              euskalbar.comb.getShiftEuskaltzaindia(this.source, searchStr);
              euskalbar.stats.writeStats(5);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("uzei." + k + "." + l)) {
              euskalbar.comb.getShiftUZEI(this.source, searchStr);
              euskalbar.stats.writeStats(6);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("mokoroa." + k + "." + l)) {
              euskalbar.comb.getShiftMokoroa(this.source, searchStr);
              euskalbar.stats.writeStats(11);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("intza." + k + "." + l)) {
              euskalbar.comb.getShiftIntza(this.source, searchStr);
              euskalbar.stats.writeStats(12);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("morris." + k + "." + l)) {
              euskalbar.comb.getShiftMorris(this.source, searchStr);
              euskalbar.stats.writeStats(3);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("opentran." + k + "." + l)) {
              euskalbar.comb.getShiftOpentran(this.source, searchStr);
              euskalbar.stats.writeStats(4);
            }
          } catch (err) {}
          try {
            if (this.prefs.getBoolPref("danobat." + k + "." + l)) {
              euskalbar.comb.getShiftDanobat(this.source, searchStr);
              euskalbar.stats.writeStats(32);
            }
          } catch (err) {}

        } else { // Shift tekla eta Ktrl tekla sakatuta ez badaude...
          // Begiratu kutxa hutsik dagoen
          if (this.alertEmptyBox(searchStr)) {
            return;
          }
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
          if (this.prefs.getBoolPref("uzei.onkey")) {
            euskalbar.dicts.goEuskalBarUZEI(searchStr);
          }
          if (this.prefs.getBoolPref("itzul.onkey")) {
            euskalbar.dicts.goEuskalBarItzuL(searchStr);
          }
          if (this.prefs.getBoolPref("harluxet.onkey")) {
            euskalbar.dicts.goEuskalBarHarluxet(searchStr);
          }
          if (this.prefs.getBoolPref("wikipedia.onkey")) {
            euskalbar.dicts.goEuskalBarWikipedia(searchStr);
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
          if (this.prefs.getBoolPref("klasikoak.onkey")) {
            euskalbar.dicts.goEuskalBarKlasikoak(searchStr);
          }
          if (this.prefs.getBoolPref("ztcorpusa.onkey")) {
            euskalbar.dicts.goEuskalBarZTCorpusa(searchStr);
          }
          if (this.prefs.getBoolPref("lb.onkey")) {
            euskalbar.dicts.goEuskalBarLB(searchStr);
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
      //Focus textbox
      var el = euskalbarLib.$("EuskalBar-search-string");
      el.focus();
    },


    // Euskalbarren hizkuntza txandakatzen du (toggle modukoa)
    changeEuskalbarLang: function () {
      if (this.target == 'es') {
        this.setEuskalbarLang('es', 'eu');
      } else if (this.target == 'en') {
        this.setEuskalbarLang('en', 'eu');
      } else if (this.target == 'fr') {
        this.setEuskalbarLang('fr', 'eu');
      } else if (this.target == 'eu') {
        // eu: aztertu iturburu hizkuntza
        if (this.source == 'es') {
          this.setEuskalbarLang('eu', 'es');
        } else if (this.source == 'en') {
          this.setEuskalbarLang('eu', 'en');
        } else if (this.source == 'fr') {
          this.setEuskalbarLang('eu', 'fr');
        }
      }
    },


    // Euskalbarren hizkuntza berria zehazten du
    setEuskalbarLang: function (source, target) {
      var button = euskalbarLib.$("euskalbar-language");
      button.setAttribute("label", source.toUpperCase() + " ‣ " + target.toUpperCase());
      this.source = source;
      this.target = target;
      var euskalbar_tooltip = source.toUpperCase() + " ‣ " + target.toUpperCase();
    },


    // Euskalbarreko hiztegiak moldatzen ditu hizkuntzaren arabera
    setEuskalbarDictionaries: function (hizk) {
      var euskalterm = euskalbarLib.$('EuskalBar-Search');
      var morris = euskalbarLib.$('EuskalBar-Morris');
      var opentran = euskalbarLib.$('EuskalBar-Opentran');
      var labayru = euskalbarLib.$('EuskalBar-Labayru');
      var zehazki = euskalbarLib.$('EuskalBar-Zehazki');
      var elhuyar = euskalbarLib.$('EuskalBar-Elhuyar');
      var goihata = euskalbarLib.$('EuskalBar-Goihata');
      var zthiztegia = euskalbarLib.$('EuskalBar-ZTHiztegia');
      var telekom = euskalbarLib.$('EuskalBar-Telekom');
      var danobat = euskalbarLib.$('EuskalBar-Danobat');

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
        break;
      }
    },

  };

  window.addEventListener("load", function(e) { euskalbar.init(); }, false);
  window.addEventListener("unload", function(e) { euskalbar.shutdown(); }, false);
