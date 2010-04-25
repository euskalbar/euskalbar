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

//Hobespenak atzitzeko interfazea
const prefManager = Components.classes["@mozilla.org/preferences-service;1"]
.getService(Components.interfaces.nsIPrefBranch);

//Hurrengo bi lerroek Euskalbarren direktorio nagusiaren URIa atzitzen dute
const guid = "euskalbar@interneteuskadi.org";
var extNon = Components.classes["@mozilla.org/extensions/manager;1"]
                        .getService(Components.interfaces.nsIExtensionManager)
                        .getInstallLocation(guid)
                        .getItemLocation(guid);

// Euskalbar hasieratzen du
// Euskalbar deskargatzen du
// Hobespenen observerra sortzen eta deusezten du (honetan oinarritua ->
// http://developer.mozilla.org/en/docs/Adding_preferences_to_an_extension)
var euskalbar = {

  prefs: null,

  euskalbar_source: null,

  euskalbar_target: null,


  // Funtzio honek Euskalbar hasieratzen du
  startup: function() {
    // Register to receive notifications of preference changes	
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefService)
                .getBranch("euskalbar.");
    this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
    //Hasieratu observerra
    this.prefs.addObserver("", this, false);

    // Euskalbar abian jartzen den lehen aldia bada...
    if (navigator.preference('extensions.' + guid +'.welcome')) {
      //Azalen hobespena aldatzen du
      navigator.preference ('euskalbar.style.combinedquery', 'skins/human.css');
      // Ongietorri leihoa erakusten du (ikusi http://forums.mozillazine.org/viewtopic.php?t=562299)
      var file = Components.classes["@mozilla.org/extensions/manager;1"]
                .getService(Components.interfaces.nsIExtensionManager)
                .getInstallLocation(guid)
                .getItemLocation(guid);
      file.append("defaults");
      file.append("preferences");
      file.append("welcome.js");
      file.remove(false);
      var welcomedialogURL = "chrome://euskalbar/content/about/about.xul";
      var t = setTimeout("window.openDialog('chrome://euskalbar/content/about/about.xul', 'euskalbar-about-dialog','centerscreen,chrome,modal,resizable');",1000);

      //Estatistiken fitxategia sortu
      euskalbarstats.createEuskalbarStatsFile();

    }

    //Hasieratu hizkuntza hautatzeko botoia
    var lang = prefManager.getCharPref("euskalbar.language.startup");
    this.euskalbar_source = lang[0]+lang[1];
    this.euskalbar_target = lang[3]+lang[4];
    this.setEuskalbarLang(this.euskalbar_source, this.euskalbar_target);
    if (this.euskalbar_source != 'eu') {
      this.setEuskalbarDictionaries(this.euskalbar_source);
    } else {
      this.setEuskalbarDictionaries(this.euskalbar_target);
    }

    // Azalak aldatzeko funtzioari deitu (DOMContentLoaded gertaerapean)
    getBrowser().addEventListener("DOMContentLoaded", this.initHTML, true);

    // Hasieratu barrako hiztegiak erakutsi eta ezkutatzeko menua
    // (oharra: persist="checked" ez dabil)
    var dicts = document.getElementById('Euskalbar-dicts-general').childNodes;
    var hsMenu = document.getElementById('Euskalbar-hsButtons').childNodes;
    for (i=0; i < hsMenu.length; i++) {
      hsMenu[i].setAttribute('checked',!dicts[i].collapsed);
    }
  },


  // Euskalbar deskargatu: observerra ezabatu
  shutdown: function() {
    this.prefs.removeObserver("", this);
    document.persist("EuskalBar-Toolbar", "currentset"); 

  },


  // Observerra erabili: hobespenetan aldaketa bat dagoenean exekutatzen da
  observe: function(subject, topic, data) {
    if (topic != "nsPref:changed") {
      return;
    }

    switch(data) {
      //Hiztegien menua erakutsi/ezkutatu
      case "showdicts.enabled":
        this.showhideDicts();
      break;
      case "showcontextmenu.enabled":
        this.showContextmenu();
      break;
    }
  },


  //HTML fitxategiak hasieratzen ditu
  initHTML: function(event) {
    //HTML fitxategietan estiloaren katea aldatzen du
    var prefStyle = prefManager.getCharPref("euskalbar.style.combinedquery");
    var URL = event.target.location.href;
    if (URL.indexOf("chrome://euskalbar/content/html/") != -1) {
      var link = event.target.getElementsByTagName("link")[0];
      link.setAttribute("href", prefStyle);
    }
  
    //Erakutsiko diren hiztegien zutabeak erakusteko funtzioari deitzen dio
    strRes = document.getElementById('leuskal');
    const oh = strRes.getString("oharra");
    var l = "";
    if ((euskalbar.euskalbar_source == 'es') || (euskalbar.euskalbar_target == 'es')) { 
      l = "es";
    } else if ((euskalbar.euskalbar_source == 'fr') || (euskalbar.euskalbar_target == 'fr')) {
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
    var cprefs = prefManager.getBranch("euskalbar.").getChildList("",{});
    var sprefs = new Array();
    for (x in cprefs) {
      if (cprefs[x].indexOf(k+"."+l) != -1) {
        sprefs.unshift(cprefs[x]);       
      }
    }
    for (x in sprefs) {
      if (prefManager.getBoolPref("euskalbar."+sprefs[x])) {
        var burua = sprefs[x].split(".")[0];
        burua = burua.charAt(0).toUpperCase() + burua.slice(1);
        event.target.getElementById('buruak').innerHTML = event.target.getElementById('buruak').innerHTML+'<th>'+burua+'<\/th>';
        var atd = event.target.createElement('td');
        atd.setAttribute("id","a"+burua);
        atd.setAttribute("class","gorputza");
        event.target.getElementById('gorputzak').appendChild(atd);
        var ato = event.target.createElement('td');
        ato.setAttribute("id","o"+burua);
        ato.setAttribute("class","gorputza");
        event.target.getElementById('oinak').appendChild(ato);
      }
    }
    event.target.getElementById('oharra').innerHTML = oh;
  },

  
  // Laguntza erakusten du
  openLaguntza: function() {
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
  showhideDicts: function() {
    var button = document.getElementById('Euskalbar-menu');
    if (!prefManager.getBoolPref("euskalbar.showdicts.enabled")) {
      button.setAttribute('hidden', true);
    } else  {
      button.removeAttribute('hidden');
    }
  },
  
  
  // Testuinguru-menua erakusten/ezkutatzen du
  showContextmenu: function() {
    var sep = document.getElementById('Euskalbar-context-menuseparator');
    var button = document.getElementById('Euskalbar-context-menu');
    if (!prefManager.getBoolPref("euskalbar.showcontextmenu.enabled")) {
      sep.setAttribute('hidden', true);
      button.setAttribute('hidden', true);
    } else  {
      sep.removeAttribute('hidden');
      button.removeAttribute('hidden');
    }
  },
  
  
  // Aukeren koadroa erakusten du
  euskalbarOptions: function() {
    var dialogURL = "chrome://euskalbar/content/prefs.xul";
    window.openDialog(dialogURL, "", "chrome,modal,close");
  },
  
  
  // Estatistika lokalak erakusten ditu
  showLocalstats: function() {
    var dialogURL = "chrome://euskalbar/content/stats.xul";
    window.openDialog(dialogURL, "statsDlg", "chrome,modal,resizable");
  },
  
  
  //Azal pertsonalizatuetarako script-ak (hau eta hurrengoa)
  setUserSkinDisabled: function() {
    var chkSkins = document.getElementById("chkUserSkinEnable");
    document.getElementById("txtUserSkinPath").disabled = !chkSkins.checked;
    document.getElementById("btnUserSkinPath").disabled = !chkSkins.checked;
    document.getElementById("menuStartupSkin").disabled = chkSkins.checked;
    if (!chkSkins.checked){
      prefManager.setCharPref("euskalbar.style.combinedquery", document.getElementById("menuStartupSkin").selectedItem.value);
    }
  },
  
  
  browseSkin: function() {
    var fpicker = Components.classes["@mozilla.org/filepicker;1"]
                  .createInstance(Components.interfaces.nsIFilePicker);
  
    fpicker.init(window, "CSS", fpicker.modeOpen);
    fpicker.appendFilter("CSS (*.css)", "*.css");
    fpicker.appendFilters(fpicker.filterAll);
  
    var showResult = fpicker.show();
    if(showResult == fpicker.returnOK) {
      document.getElementById("txtUserSkinPath").value = fpicker.file.path;
      prefManager.setCharPref("euskalbar.style.combinedquery", "file://"+fpicker.file.path);
    }
  },
  
  
  // Laster-teklen aginduak exekutatzen ditu
  teklakEuskalbar: function(prefer) {
    switch (prefer){
    case "showdicts":
      prefManager.setBoolPref("euskalbar."+prefer+".enabled", !prefManager.getBoolPref("euskalbar."+prefer+".enabled"));
      break;
    case "showcontextmenu":
      prefManager.setBoolPref("euskalbar."+prefer+".enabled", !prefManager.getBoolPref("euskalbar."+prefer+".enabled"));
      break;
    case "showeuskalbar":
      var el = document.getElementById("EuskalBar-Toolbar");
      var state = el.collapsed;
      el.collapsed = !state;
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
  openURL: function(url, zein, method, params) {
    var postData = null; // POSTen kasuan bakarrik aldatuko da
    var dataString = ""; // parametroak jasotzeko stringa
    if (params != null) { // momentuko soluzioa...
      for (var i = 0; i < params.length; ++i) {
        var param = params[i];
  
        dataString += (i > 0 ? "&" : "") + param.name + "=" + param.value;
      }
    }
    if (method == 'GET') {
      if (url.indexOf("?") == -1 && dataString)
        url += "?";
      url += dataString;
    } else if (method == "POST") {
      var stringStream = Cc["@mozilla.org/io/string-input-stream;1"]
                         .createInstance(Components.interfaces.nsIStringInputStream);
      // Mozilla bug #318193
      if ("data" in stringStream) // Gecko 1.9 or newer
        stringStream.data = dataString;
      else // 1.8 or older
        stringStream.setData(dataString, dataString.length);
  
      var postData = Cc["@mozilla.org/network/mime-input-stream;1"]
                     .createInstance(Components.interfaces.nsIMIMEInputStream);
      postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
      postData.addContentLength = true;
      postData.setData(stringStream);
    }
    if (prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
      this.reuseOldtab(url, zein, postData);
    } else {
      this.openNewtab(url, postData);
    }
  },
  
  
  // Izena/balioa pareak adierazteko objektua
  QueryParameter: function(aName, aValue) {
    this.name = aName;
    this.value = aValue;
  },
  
  
  // Hiztegia fitxa berri batean ireki
  openNewtab: function(taburl, aPostData) {
    var theTab = getBrowser().addTab(taburl, null, null, aPostData);
    // enfokatu hala eskatu bada
    if (!prefManager.getBoolPref("euskalbar.bgtabs.enabled")) {
      getBrowser().selectedTab = theTab;
    }
  },
  
  
  // Hiztegia fitxa zaharrean ireki
  reuseOldtab: function(taburl, tabzein, aPostData) {
    // Aztertu fitxa zahar bakoitza
    var oldTab = getBrowser().selectedTab;
    var found = false;
    var index = 0;
    var numTabs = getBrowser().mTabContainer.childNodes.length;
    while (index < numTabs && !found) {
      var currentTab = getBrowser().getBrowserAtIndex(index);
      var currentTabURI = currentTab.currentURI.spec;
        if (currentTabURI.indexOf(tabzein)!= -1) {
        // Hiztegia irekita dago
        currentTab.webNavigation.loadURI(taburl, null, null, aPostData, null);
        // enfokatu hala eskatu bada
        if (!prefManager.getBoolPref("euskalbar.bgtabs.enabled")) {
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
  
  
  // Kutxa hutsik badago, mezu bat bidali
  alertEmptyBox: function(katea) {
    //Kateari aurreko eta atzeko zuriuneak kendu
    katea  = katea.replace(/^\s+|\s+$/g,"");
    if(katea ==""){
      // Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      alert(strRes.getString("kutxahutsa"));
      return true;
    }
  },
  
  
  // Enter tekla sakatzean irekitzen diren hiztegiak
  goEuskalBarOnKey: function(event) {
    // Get search string entered by user
    var searchStr = document.getElementById('EuskalBar-search-string').value;
    // Lokalizazio paketeak kargatu
    strRes = document.getElementById('leuskal');
    const h = strRes.getString("hizk");
    // If user pressed Enter key  
    if (event.keyCode == 13) {
      if (this.alertEmptyBox(searchStr)){
        return;
      }

      // Exekutatu euskalbarcomb.js fitxategian dauden skriptak
      var l = "";
      if ((euskalbar.euskalbar_source == 'es') || (euskalbar.euskalbar_target == 'es')) { 
        l = "es";
      } else if ((euskalbar.euskalbar_source == 'fr') || (euskalbar.euskalbar_target == 'fr')) {
        l = "fr";
      } else {
        l = "en";
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
          if (prefManager.getBoolPref("euskalbar.euskalterm."+k+"."+l)){
            euskalbarcomb.getShiftEuskalterm(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(0);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.elhuyar."+k+"."+l)){
            euskalbarcomb.getShiftElhuyar(this.euskalbar_source, this.euskalbar_target, searchStr);
            euskalbarstats.writeStats(1);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.3000."+k+"."+l)){
            euskalbarcomb.getShift3000(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(2);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.labayru."+k+"."+l)){
            euskalbarcomb.getShiftLabayru(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(22);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.batua."+k+"."+l)){
            euskalbarcomb.getShiftEuskaltzaindia(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(5);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.uzei."+k+"."+l)){
            euskalbarcomb.getShiftUZEI(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(6);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.adorez."+k+"."+l)){
            euskalbarcomb.getShiftAdorez(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(7);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.mokoroa."+k+"."+l)){
            euskalbarcomb.getShiftMokoroa(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(11);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.intza."+k+"."+l)){
            euskalbarcomb.getShiftIntza(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(12);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.morris."+k+"."+l)){
            euskalbarcomb.getShiftMorris(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(3);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.opentran."+k+"."+l)){
            euskalbarcomb.getShiftOpentran(this.euskalbar_source, searchStr);
            euskalbarstats.writeStats(4);
          }
        } catch(err) {}
        try {
          if (prefManager.getBoolPref("euskalbar.goihata.onkey") ) {
            euskalbardicts.goEuskalBarGoihata( this.euskalbar_source, this.euskalbar_target, searchStr );
          }
        } catch(err) {}

      } else { // Shift tekla eta Ktrl tekla sakatuta ez badaude...
        // Begiratu kutxa hutsik dagoen 
        if (this.alertEmptyBox(searchStr)){
          return;
        }
        if ((this.euskalbar_source == 'es') || (this.euskalbar_target == 'es')) {
          // eu-es eta es-eu hizkuntzan hobetsitako hiztegiak kargatu
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
            euskalbardicts.goEuskalBarEuskalterm(this.euskalbar_source, searchStr, '0');
          }
          if (prefManager.getBoolPref("euskalbar.3000.onkey")) {
            euskalbardicts.goEuskalBarAsk(this.euskalbar_source, searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
            euskalbardicts.goEuskalBarElhuyar(this.euskalbar_source,this.euskalbar_target,searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.labayru.onkey")) {
            euskalbardicts.goEuskalBarLabayru(this.euskalbar_source, searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.zehazki.onkey")) {
            euskalbardicts.goEuskalBarZehazki(this.euskalbar_source, searchStr);
          }
        } else if ((this.euskalbar_source == 'fr') || (this.euskalbar_target == 'fr')) {
          // eu-fr eta fr-eu hizkuntzan hobetsitako hiztegiak kargatu
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
            euskalbardicts.goEuskalBarEuskalterm(this.euskalbar_source, searchStr, '0');
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
            euskalbardicts.goEuskalBarElhuyar(this.euskalbar_source,this.euskalbar_target,searchStr);
          }
        } else if ( (this.euskalbar_source == 'eu') && (this.euskalbar_target == 'jp') ) {
          // Go to Goihata dictionary if translating from Basque to Japanese
          if ( prefManager.getBoolPref("euskalbar.goihata.onkey") ) {
            euskalbardicts.goEuskalBarGoihata( this.euskalbar_source, this.euskalbar_target, searchStr );
          }
        } else {
          // eu-en eta en-eu hizkuntzan hobetsitako hiztegiak kargatu
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
            euskalbardicts.goEuskalBarEuskalterm(this.euskalbar_source, searchStr, '0');
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
            euskalbardicts.goEuskalBarElhuyar(this.euskalbar_source,this.euskalbar_target,searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.morris.onkey")) {
            euskalbardicts.goEuskalBarMorris(this.euskalbar_source, searchStr);
          }
          // Open-tran.eu jatorrizko hizkuntza ingelesa denean bakarrik dabil
          if (this.euskalbar_source == 'en') {
            if (prefManager.getBoolPref("euskalbar.opentran.onkey")) {
              euskalbardicts.goEuskalBarOpentran(searchStr);
            }
          }
        }
        // Aukeratutako hizkuntzarekiko menpekotasunik ez dutenak kargatu
        if (prefManager.getBoolPref("euskalbar.batua.onkey")) {
          euskalbardicts.goEuskalBarEuskaltzaindia(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.oeh.onkey")) {
          euskalbardicts.goEuskalBarOEH(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.adorez.onkey")) {
          euskalbardicts.goEuskalBarAdorez(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.uzei.onkey")) {
          euskalbardicts.goEuskalBarUZEI(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.itzul.onkey")) {
          euskalbardicts.goEuskalBarItzuL(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.harluxet.onkey")) {
          euskalbardicts.goEuskalBarHarluxet(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.wikipedia.onkey")) {
          euskalbardicts.goEuskalBarWikipedia(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.mokoroa.onkey")) {
          euskalbardicts.goEuskalBarMokoroa(this.euskalbar_source, searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.intza.onkey")) {
          euskalbardicts.goEuskalBarIntza(this.euskalbar_source, searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.eurovoc.onkey")) {
          euskalbardicts.goEuskalBarEurovoc(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.bergara.onkey")) {
          euskalbardicts.goEuskalBarBergara(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.ereduzko.onkey")) {
          euskalbardicts.goEuskalBarEreduzko(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.klasikoak.onkey")) {
          euskalbardicts.goEuskalBarKlasikoak(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.ztcorpusa.onkey")) {
          euskalbardicts.goEuskalBarZTCorpusa(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.corpeus.onkey")) {
          euskalbardicts.goEuskalBarCorpEus(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.xuxenweb.onkey")) {
          euskalbardicts.goEuskalBarXUXENweb(searchStr);
        }
        if (prefManager.getBoolPref("euskalbar.elebila.onkey")) {
          euskalbardicts.goEuskalBarElebila(searchStr);
        }
      } 
    }
    //Testu kutxa enfokatzen du
    var el = document.getElementById("EuskalBar-search-string");
    el.focus();
  },
  
  
  // Euskalbarren hizkuntza txandakatzen du (toggle modukoa)
  changeEuskalbarLang: function() {
    if (this.euskalbar_target == 'es') {
      this.setEuskalbarLang('es', 'eu');
    } else if (this.euskalbar_target == 'en') {
      this.setEuskalbarLang('en', 'eu');
    } else if (this.euskalbar_target == 'fr') {
      this.setEuskalbarLang('fr', 'eu');
    } else if (this.euskalbar_target == 'eu') {
      // eu: aztertu iturburu hizkuntza
      if (this.euskalbar_source == 'es') {
        this.setEuskalbarLang('eu', 'es');
      } else if (this.euskalbar_source == 'en') {
        this.setEuskalbarLang('eu', 'en');
      } else if (this.euskalbar_source == 'fr') {
        this.setEuskalbarLang('eu', 'fr');
      }
    }
  },
  
  
  // Euskalbarren hizkuntza berria zehazten du
  setEuskalbarLang: function(source, target) {
    var button = document.getElementById("euskalbar-language");
    button.setAttribute("label", source.toUpperCase()+" ‣ "+target.toUpperCase());
    this.euskalbar_source = source;
    this.euskalbar_target = target;
    euskalbar_tooltip = source.toUpperCase()+" ‣ "+target.toUpperCase();
  },
  
  
  // Euskalbarreko hiztegiak moldatzen ditu hizkuntzaren arabera
  setEuskalbarDictionaries: function(hizk) {
    var euskalterm = document.getElementById('EuskalBar-Search');
    var morris = document.getElementById('EuskalBar-Morris');
    var opentran = document.getElementById('EuskalBar-Opentran');
    var h3000 = document.getElementById('EuskalBar-Ask');
    var labayru = document.getElementById('EuskalBar-Labayru');
    var zehazki = document.getElementById('EuskalBar-Zehazki');
    var elhuyar = document.getElementById('EuskalBar-Elhuyar');
    var goihata = document.getElementById('EuskalBar-Goihata');
    
    switch (hizk) {
      case 'es':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", false);
        goihata.setAttribute("hidden", true);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        h3000.setAttribute("hidden", false);
        labayru.setAttribute("hidden", false);
        zehazki.setAttribute("hidden", false);
      break;
      case 'fr':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", false);
        goihata.setAttribute("hidden", true);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        h3000.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
      break;
      case 'en':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", false);
        goihata.setAttribute("hidden", true);
        morris.setAttribute("hidden", false);
        opentran.setAttribute("hidden", false);
        h3000.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
      break;
      case 'la':
        euskalterm.setAttribute("hidden", false);
        elhuyar.setAttribute("hidden", true);
        goihata.setAttribute("hidden", true);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        h3000.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
      break;
      case 'jp':
        euskalterm.setAttribute("hidden", true);
        elhuyar.setAttribute("hidden", true);
        goihata.setAttribute("hidden", false);
        morris.setAttribute("hidden", true);
        opentran.setAttribute("hidden", true);
        h3000.setAttribute("hidden", true);
        labayru.setAttribute("hidden", true);
        zehazki.setAttribute("hidden", true);
      break;
    }
  },

} // euskalbar

