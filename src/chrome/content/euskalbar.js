// Developers:  Juanan Pereira, Asier Sarasua Garmendia 2006
//              Julen Ruiz Aizpuru, Asier Sarasua Garmendia 2007
// Modified by: Chetan Thapliyal 2009
//
// This is Free Software (GPL License)
//
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com
// chetan.thapliyal@discreteguidepost.in

Components.utils.import("resource://gre/modules/Services.jsm");

euskalbar = {

  guid: "euskalbar@euskalbar.eu",

  firstrunURL: "http://euskalbar.eu/firstrun",

  // URI of the current user's profile directory
  profileURI: Services.dirsvc.get("ProfD", Components.interfaces.nsIFile),

  prefs: Services.prefs.getBranch("extensions.euskalbar."),

  source: null,

  target: null,


  /* Euskalbar initialization function */
  /* XXX: Try to minimize the actions executed here, as it affects to the
     overall browser startup time */
  startup: function () {

    // Register to receive notifications of preference changes
    Services.prefs.addObserver("extensions.euskalbar.", this, false);

    AddonManager.getAddonByID(this.guid, function (addon) {
      /* Store version information for later use */
      euskalbar.curVersion = addon.version;

      var firstrun = euskalbar.prefs.getBoolPref("firstrun");
      var openInfo = false;
      var infoURL = euskalbar.firstrunURL;

      if (firstrun) {
        euskalbar.prefs.setBoolPref("firstrun", false);
        euskalbar.prefs.setCharPref("installedVersion", euskalbar.curVersion);

        /* Add Euskalbar button to the navigation bar */
        euskalbarButton.appendToToolbar();

        var file = addon.getResourceURI("").
        QueryInterface(Components.interfaces.nsIFileURL).file;
        euskalbar.stats.createEuskalbarStatsFile(file);

        openInfo = true;
      } else {
        try {
          /* XXX: As previous Euskalbar versions don't have the
           * installedVersion pref, we must ensure they get the button
           * when upgrading from older versions.
           * This behaviour MUST be changed just after releasing 3.9.
           */
          /* Add Euskalbar button to the navigation bar */
          euskalbar.ui.appendButtonToToolbar();

          var installedVersion = euskalbar.prefs.getCharPref("installedVersion");

          /* We are in the middle of an upgrade */
          if (euskalbar.curVersion > installedVersion) {
            euskalbar.prefs.setCharPref("installedVersion", euskalbar.curVersion);

            openInfo = true;
            infoURL += "?v=" + euskalbar.curVersion;
          }
        } catch (ex) { /* Reinstall: do we need to do something in this situation? */
        }
      }

      if (openInfo) {
        window.gBrowser.selectedTab = window.gBrowser.addTab(infoURL);
      }
    });

    //Hasieratu hizkuntza hautatzeko botoia
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
    getBrowser().addEventListener("DOMContentLoaded", this.initHTML, true);

    // Hasieratu barrako hiztegiak erakutsi eta ezkutatzeko menua
    // (oharra: persist="checked" ez dabil)
    var dicts = document.getElementById('Euskalbar-dicts-general').childNodes;
    var hsMenu = document.getElementById('Euskalbar-hsButtons').childNodes;
    for (i = 0; i < hsMenu.length; i++) {
      hsMenu[i].setAttribute('checked', !dicts[i].collapsed);
    }

    // Initialize dictionaries menu in Tools and in Firefox menu
    var euskalbarMenuPopup = document.getElementById("euskalbar-menuPopup");
    euskalbar.ui.initMenu("euskalbar-menu", euskalbarMenuPopup);
    euskalbar.ui.initMenu("appmenu_euskalbar", euskalbarMenuPopup);
  },


  // Euskalbar deskargatu: observerra ezabatu
  shutdown: function () {
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
      strRes = document.getElementById('leuskal');
      const oh = strRes.getString("oharra");
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
      event.target.getElementById('oharra').innerHTML = oh;
    }
  },


  // Laguntza erakusten du
  openLaguntza: function () {
    // Lokalizazio paketeak kargatu
    strRes = document.getElementById('leuskal');
    const h = strRes.getString("hizk");
    if (h.match('euskara')) {
      var hurl = 'chrome://euskalbar/content/html/euskalbarhelpeu.html';
    } else if (h.match('english')) {
      var hurl = 'chrome://euskalbar/content/html/euskalbarhelpen.html';
    } else if (h.match('français')) {
      var hurl = 'chrome://euskalbar/content/html/euskalbarhelpfr.html';
    } else if (h.match('japanese')) {
      var hurl = 'chrome://euskalbar/content/html/euskalbarhelpja.html';
    } else {
      var hurl = 'chrome://euskalbar/content/html/euskalbarhelpes.html';
    }
    this.reuseOldtab(hurl, "euskalbarhelp");
  },

  // Hiztegien menua erakusten/ezkutatzen du
  showhideDicts: function () {
    var menuEntry = document.getElementById('euskalbar-menu');
    var appmenuEntry = document.getElementById("appmenu_euskalbar");
    var appmenuSpacer = document.getElementById("euskalbar-appmenu-spacer");

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
    var sep = document.getElementById('Euskalbar-context-menuseparator');
    var button = document.getElementById('Euskalbar-context-menu');
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
    window.openDialog(dialogURL, "", "chrome,modal,close");
  },


  // Estatistika lokalak erakusten ditu
  showLocalstats: function () {
    var dialogURL = "chrome://euskalbar/content/stats.xul";
    window.openDialog(dialogURL, "statsDlg", "chrome,modal,resizable");
  },


  //Azal pertsonalizatuetarako script-ak (hau eta hurrengoa)
  setUserSkinDisabled: function () {
    var chkSkins = document.getElementById("chkUserSkinEnable");
    document.getElementById("txtUserSkinPath").disabled = !chkSkins.checked;
    document.getElementById("btnUserSkinPath").disabled = !chkSkins.checked;
    document.getElementById("menuStartupSkin").disabled = chkSkins.checked;
    if (!chkSkins.checked) {
      this.prefs.setCharPref("style.combinedquery", document.getElementById("menuStartupSkin").selectedItem.value);
    }
  },


  browseSkin: function () {
    var fpicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);

    fpicker.init(window, "CSS", fpicker.modeOpen);
    fpicker.appendFilter("CSS (*.css)", "*.css");
    fpicker.appendFilters(fpicker.filterAll);

    var showResult = fpicker.show();
    if (showResult == fpicker.returnOK) {
      document.getElementById("txtUserSkinPath").value = fpicker.file.path;
      this.prefs.setCharPref("style.combinedquery", "file://" + fpicker.file.path);
    }
  },

  /* Toggles Euskalbar status */
  toggleBar: function (event) {
    if (event.target.id != "cmd_toggleEuskalbar") {
      return;
    }

    var el = document.getElementById("euskalbar-toolbar");
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
      var el = document.getElementById("EuskalBar-search-string");
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
  openURL: function (url, zein, method, params) {
    var postData = null; // POSTen kasuan bakarrik aldatuko da
    var dataString = ""; // parametroak jasotzeko stringa
    if (params != null) { // momentuko soluzioa...
      for (var i = 0; i < params.length; ++i) {
        var param = params[i];

        dataString += (i > 0 ? "&" : "") + param.name + "=" + param.value;
      }
    }
    if (method == 'GET') {
      if (url.indexOf("?") == -1 && dataString) url += "?";
      url += dataString;
    } else if (method == "POST") {
      var stringStream = Cc["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
      // Mozilla bug #318193
      if ("data" in stringStream) // Gecko 1.9 or newer
      stringStream.data = dataString;
      else // 1.8 or older
      stringStream.setData(dataString, dataString.length);

      var postData = Cc["@mozilla.org/network/mime-input-stream;1"].createInstance(Components.interfaces.nsIMIMEInputStream);
      postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
      postData.addContentLength = true;
      postData.setData(stringStream);
    }
    if (this.prefs.getBoolPref("reusetabs.enabled")) {
      this.reuseOldtab(url, zein, postData);
    } else {
      this.openNewtab(url, postData);
    }
  },


  // Izena/balioa pareak adierazteko objektua
  QueryParameter: function (aName, aValue) {
    this.name = aName;
    this.value = aValue;
  },


  // Hiztegia fitxa berri batean ireki
  openNewtab: function (taburl, aPostData) {
    var theTab = getBrowser().addTab(taburl, null, null, aPostData);
    // enfokatu hala eskatu bada
    if (!this.prefs.getBoolPref("bgtabs.enabled")) {
      getBrowser().selectedTab = theTab;
    }
  },


  // Hiztegia fitxa zaharrean ireki
  reuseOldtab: function (taburl, tabzein, aPostData) {
    // Aztertu fitxa zahar bakoitza
    var oldTab = getBrowser().selectedTab;
    var found = false;
    var index = 0;
    var numTabs = getBrowser().mTabContainer.childNodes.length;
    while (index < numTabs && !found) {
      var currentTab = getBrowser().getBrowserAtIndex(index);
      var currentTabURI = currentTab.currentURI.spec;
      if (currentTabURI.indexOf(tabzein) != -1) {
        // Hiztegia irekita dago
        currentTab.webNavigation.loadURI(taburl, null, null, aPostData, null);
        // enfokatu hala eskatu bada
        if (!this.prefs.getBoolPref("bgtabs.enabled")) {
          getBrowser().mTabContainer.selectedIndex = index;
        }
        found = true;
      }
      index++;
    }
    if (!found) {
      this.openNewtab(taburl, aPostData);
    }
  },

  // Fitxa zenbakia itzuli
  getTab: function (tabzein) {
    // Aztertu fitxa zahar bakoitza
    var found = false;
    var index = 0;
    var numTabs = getBrowser().mTabContainer.childNodes.length;
    while (index < numTabs && !found) {
      var currentTab = getBrowser().getBrowserAtIndex(index);
      var currentTabURI = currentTab.currentURI.spec;
      if (currentTabURI.indexOf(tabzein) != -1) {
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
      // Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      alert(strRes.getString("kutxahutsa"));
      return true;
    }
  },


  // Enter tekla sakatzean irekitzen diren hiztegiak
  goEuskalBarOnKey: function (event) {
    // Get search string entered by user
    var searchStr = document.getElementById('EuskalBar-search-string').value;
    // Lokalizazio paketeak kargatu
    strRes = document.getElementById('leuskal');
    const h = strRes.getString("hizk");
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
            euskalbarcomb.getShiftEuskalterm(this.source, searchStr);
            euskalbar.stats.writeStats(0);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("elhuyar." + k + "." + l)) {
            euskalbarcomb.getShiftElhuyar(this.source, this.target, searchStr);
            euskalbar.stats.writeStats(1);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("3000." + k + "." + l)) {
            euskalbarcomb.getShift3000(this.source, searchStr);
            euskalbar.stats.writeStats(2);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("labayru." + k + "." + l)) {
            euskalbarcomb.getShiftLabayru(this.source, searchStr);
            euskalbar.stats.writeStats(22);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("zthiztegia." + k + "." + l)) {
            euskalbarcomb.getShiftZTHiztegia(this.source, searchStr);
            euskalbar.stats.writeStats(25);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("energia." + k + "." + l)) {
            euskalbarcomb.getShiftEnergia(this.source, searchStr);
            euskalbar.stats.writeStats(26);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("telekom." + k + "." + l)) {
            euskalbarcomb.getShiftTelekom(this.source, searchStr);
            euskalbar.stats.writeStats(27);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("batua." + k + "." + l)) {
            euskalbarcomb.getShiftEuskaltzaindia(this.source, searchStr);
            euskalbar.stats.writeStats(5);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("uzei." + k + "." + l)) {
            euskalbarcomb.getShiftUZEI(this.source, searchStr);
            euskalbar.stats.writeStats(6);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("adorez." + k + "." + l)) {
            euskalbarcomb.getShiftAdorez(this.source, searchStr);
            euskalbar.stats.writeStats(7);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("mokoroa." + k + "." + l)) {
            euskalbarcomb.getShiftMokoroa(this.source, searchStr);
            euskalbar.stats.writeStats(11);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("intza." + k + "." + l)) {
            euskalbarcomb.getShiftIntza(this.source, searchStr);
            euskalbar.stats.writeStats(12);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("morris." + k + "." + l)) {
            euskalbarcomb.getShiftMorris(this.source, searchStr);
            euskalbar.stats.writeStats(3);
          }
        } catch (err) {}
        try {
          if (this.prefs.getBoolPref("opentran." + k + "." + l)) {
            euskalbarcomb.getShiftOpentran(this.source, searchStr);
            euskalbar.stats.writeStats(4);
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
          if (this.prefs.getBoolPref("3000.onkey")) {
            euskalbar.dicts.goEuskalBarAsk(this.source, searchStr);
          }
          if (this.prefs.getBoolPref("elhuyar.onkey")) {
            euskalbar.dicts.goEuskalBarElhuyar(this.source, this.target, searchStr);
          }
          if (this.prefs.getBoolPref("zthiztegia.onkey")) {
            euskalbar.dicts.goEuskalBarZTHiztegia(this.source, searchStr);
          }
          if (this.prefs.getBoolPref("energia.onkey")) {
            euskalbar.dicts.goEuskalBarEnergia(this.source, searchStr);
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
          if (this.prefs.getBoolPref("energia.onkey")) {
            euskalbar.dicts.goEuskalBarEnergia(this.source, searchStr);
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
          if (this.prefs.getBoolPref("energia.onkey")) {
            euskalbar.dicts.goEuskalBarEnergia(this.source, searchStr);
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
        if (this.prefs.getBoolPref("adorez.onkey")) {
          euskalbar.dicts.goEuskalBarAdorez(searchStr);
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
    //Testu kutxa enfokatzen du
    var el = document.getElementById("EuskalBar-search-string");
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
    var button = document.getElementById("euskalbar-language");
    button.setAttribute("label", source.toUpperCase() + " ‣ " + target.toUpperCase());
    this.source = source;
    this.target = target;
    euskalbar_tooltip = source.toUpperCase() + " ‣ " + target.toUpperCase();
  },


  // Euskalbarreko hiztegiak moldatzen ditu hizkuntzaren arabera
  setEuskalbarDictionaries: function (hizk) {
    var euskalterm = document.getElementById('EuskalBar-Search');
    var morris = document.getElementById('EuskalBar-Morris');
    var opentran = document.getElementById('EuskalBar-Opentran');
    var h3000 = document.getElementById('EuskalBar-Ask');
    var labayru = document.getElementById('EuskalBar-Labayru');
    var zehazki = document.getElementById('EuskalBar-Zehazki');
    var elhuyar = document.getElementById('EuskalBar-Elhuyar');
    var goihata = document.getElementById('EuskalBar-Goihata');
    var zthiztegia = document.getElementById('EuskalBar-ZTHiztegia');
    var energia = document.getElementById('EuskalBar-Energia');
    var telekom = document.getElementById('EuskalBar-Telekom');

    switch (hizk) {
    case 'es':
      euskalterm.setAttribute("hidden", false);
      elhuyar.setAttribute("hidden", false);
      goihata.setAttribute("hidden", true);
      zthiztegia.setAttribute("hidden", false);
      morris.setAttribute("hidden", true);
      opentran.setAttribute("hidden", true);
      h3000.setAttribute("hidden", false);
      labayru.setAttribute("hidden", false);
      zehazki.setAttribute("hidden", false);
      energia.setAttribute("hidden", false);
      telekom.setAttribute("hidden", false);
      break;
    case 'fr':
      euskalterm.setAttribute("hidden", false);
      elhuyar.setAttribute("hidden", false);
      goihata.setAttribute("hidden", true);
      zthiztegia.setAttribute("hidden", false);
      morris.setAttribute("hidden", true);
      opentran.setAttribute("hidden", true);
      h3000.setAttribute("hidden", true);
      labayru.setAttribute("hidden", true);
      zehazki.setAttribute("hidden", true);
      energia.setAttribute("hidden", false);
      telekom.setAttribute("hidden", false);
      break;
    case 'en':
      euskalterm.setAttribute("hidden", false);
      elhuyar.setAttribute("hidden", false);
      goihata.setAttribute("hidden", true);
      zthiztegia.setAttribute("hidden", false);
      morris.setAttribute("hidden", false);
      opentran.setAttribute("hidden", false);
      h3000.setAttribute("hidden", true);
      labayru.setAttribute("hidden", true);
      zehazki.setAttribute("hidden", true);
      energia.setAttribute("hidden", false);
      telekom.setAttribute("hidden", false);
      break;
    case 'la':
      euskalterm.setAttribute("hidden", false);
      elhuyar.setAttribute("hidden", true);
      goihata.setAttribute("hidden", true);
      zthiztegia.setAttribute("hidden", false);
      morris.setAttribute("hidden", true);
      opentran.setAttribute("hidden", true);
      h3000.setAttribute("hidden", true);
      labayru.setAttribute("hidden", true);
      zehazki.setAttribute("hidden", true);
      energia.setAttribute("hidden", true);
      telekom.setAttribute("hidden", true);
      break;
    case 'jp':
      euskalterm.setAttribute("hidden", true);
      elhuyar.setAttribute("hidden", true);
      goihata.setAttribute("hidden", false);
      zthiztegia.setAttribute("hidden", true);
      morris.setAttribute("hidden", true);
      opentran.setAttribute("hidden", true);
      h3000.setAttribute("hidden", true);
      labayru.setAttribute("hidden", true);
      zehazki.setAttribute("hidden", true);
      energia.setAttribute("hidden", true);
      telekom.setAttribute("hidden", true);
      break;
    }
  },

};
