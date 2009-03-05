// Developers: Juanan Pereira, Asier Sarasua Garmendia 2006
//             Julen Ruiz Aizpuru, Asier Sarasua Garmendia 2007
// This is Free Software (GPL License)
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com

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

          /*OHARRA: AZPIKO KODEAK AKATS BAT ERAGITEN DU, EUSKALBAR INSTALATZEAN KODE HAU EXEKUTATZEN DA ETA BARRAKO BOTOIAK BLOKEATZEN DIRA*/ 
          /*Hasieratu barrako hiztegiak (ezkutatu hasieran erakutsi behar ez direnak)
          var dicts = document.getElementById('Euskalbar-dicts-general').childNodes;
          dicts[1].setAttribute('collapsed', true);
          dicts[2].setAttribute('collapsed', true);
          dicts[3].setAttribute('collapsed', true);
          dicts[8].setAttribute('collapsed', true);
          dicts[9].setAttribute('collapsed', true);
          dicts[14].setAttribute('collapsed', true);
          dicts[15].setAttribute('collapsed', true);
          dicts[16].setAttribute('collapsed', true);*/
        }
		
        //Hasieratu hizkuntza hautatzeko botoia
        var lang = prefManager.getCharPref("euskalbar.language.startup");
        euskalbar_source = lang[0]+lang[1];
        euskalbar_target = lang[3]+lang[4];
        setEuskalbarLang(euskalbar_source, euskalbar_target);
        if (euskalbar_source != 'eu') {
          setEuskalbarDictionaries(euskalbar_source);
        } else {
          setEuskalbarDictionaries(euskalbar_target);
        }
  
        // Azalak aldatzeko funtzioari deitu (DOMContentLoaded gertaerapean)
        getBrowser().addEventListener("DOMContentLoaded", initHTML, true);

        // Hasieratu barrako hiztegiak erakutsi eta ezkutatzeko menua
        // (oharra: persist="checked" ez dabil)
        var dicts = document.getElementById('Euskalbar-dicts-general').childNodes;
        var hsMenu = document.getElementById('Euskalbar-hsButtons').childNodes;
        for (i=0; i < hsMenu.length; i++) {
          hsMenu[i].setAttribute('checked',!dicts[i].collapsed);
        }

        //Estatistiken fitxategia sortzen du (lehendik existitzen ez bada)
        createEuskalbarStatsFile();

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
            showhideDicts();
          break;
          case "showcontextmenu.enabled":
            showContextmenu();
          break;
        }
      }

    }

    //HTML fitxategiak hasieratzen ditu
    function initHTML(event) {
      //HTML fitxategietan estiloaren katea aldatzen du
      var prefStyle = prefManager.getCharPref("euskalbar.style.combinedquery");
      var URL = event.target.location.href;
      if (URL.indexOf("chrome://euskalbar/content/html/") != -1) {
        var link = event.target.getElementsByTagName("link")[0];
        link.setAttribute("href", prefStyle);
      }

      //Erakutsiko diren hiztegien zutabeak erakusteko funtzioari deitzen dio
      if(URL.indexOf("euskalbarshift") != -1){ //Shift erabiltzen bada...
        if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) { //eu-es eta es-eu itzulpenetarako
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey1.es")){
            showHTMLColumns("Euskalterm", event);
          }
          if (prefManager.getBoolPref("euskalbar.3000.onkey1.es")){
            showHTMLColumns("3000", event);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey1.es")){
            showHTMLColumns("Elhuyar", event);
          }
          if (prefManager.getBoolPref("euskalbar.batua.onkey1.es")){
            showHTMLColumns("Batua", event);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey1.es")){
            showHTMLColumns("Adorez", event);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey1.es")){
            showHTMLColumns("UZEI", event);
          }
          if (prefManager.getBoolPref("euskalbar.mokoroa.onkey1.es")){
            showHTMLColumns("Mokoroa", event);
          }
          if (prefManager.getBoolPref("euskalbar.intza.onkey1.es")){
            showHTMLColumns("Intza", event);
          }
        } else if ((euskalbar_source == 'fr') || (euskalbar_target == 'fr')) { //eu-fr eta fr-eu itzulpenetarako
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey1.fr")){
            showHTMLColumns("Euskalterm", event);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey1.fr")){
            showHTMLColumns("Elhuyar", event);
          }
          if (prefManager.getBoolPref("euskalbar.batua.onkey1.fr")){
            showHTMLColumns("Batua", event);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey1.fr")){
            showHTMLColumns("Adorez", event);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey1.fr")){
            showHTMLColumns("UZEI", event);
          }
        } else { //eu-en eta en-eu itzulpenetarako
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey1.en")){
            showHTMLColumns("Euskalterm", event);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey1.en")){
            showHTMLColumns("Elhuyar", event);
          }
          if (prefManager.getBoolPref("euskalbar.morris.onkey1.en")){
            showHTMLColumns("Morris", event);
          }
          if (prefManager.getBoolPref("euskalbar.opentran.onkey1.en")){
            showHTMLColumns("Opentran", event);
          }
          if (prefManager.getBoolPref("euskalbar.batua.onkey1.en")){
            showHTMLColumns("Batua", event);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey1.en")){
            showHTMLColumns("Adorez", event);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey1.en")){
            showHTMLColumns("UZEI", event);
          }
        }
      }else if(URL.indexOf("euskalbarktrl") != -1){ //Ktrl erabiltzen bada...
        if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) { //eu-es eta es-eu itzulpenetarako
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey2.es")){
            showHTMLColumns("Euskalterm", event);
          }
          if (prefManager.getBoolPref("euskalbar.3000.onkey2.es")){
            showHTMLColumns("3000", event);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey2.es")){
            showHTMLColumns("Elhuyar", event);
          }
          if (prefManager.getBoolPref("euskalbar.batua.onkey2.es")){
            showHTMLColumns("Batua", event);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey2.es")){
            showHTMLColumns("Adorez", event);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey2.es")){
            showHTMLColumns("UZEI", event);
          }
          if (prefManager.getBoolPref("euskalbar.mokoroa.onkey2.es")){
            showHTMLColumns("Mokoroa", event);
          }
          if (prefManager.getBoolPref("euskalbar.intza.onkey2.es")){
            showHTMLColumns("Intza", event);
          }
        } else if ((euskalbar_source == 'fr') || (euskalbar_target == 'fr')) { //eu-fr eta fr-eu itzulpenetarako
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey2.fr")){
            showHTMLColumns("Euskalterm", event);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey2.fr")){
            showHTMLColumns("Elhuyar", event);
          }
          if (prefManager.getBoolPref("euskalbar.batua.onkey2.fr")){
            showHTMLColumns("Batua", event);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey2.fr")){
            showHTMLColumns("Adorez", event);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey2.fr")){
            showHTMLColumns("UZEI", event);
          }
        } else { //eu-en eta en-eu itzulpenetarako
          if (prefManager.getBoolPref("euskalbar.euskalterm.onkey2.en")){
            showHTMLColumns("Euskalterm", event);
          }
          if (prefManager.getBoolPref("euskalbar.elhuyar.onkey2.en")){
            showHTMLColumns("Elhuyar", event);
          }
          if (prefManager.getBoolPref("euskalbar.morris.onkey2.en")){
            showHTMLColumns("Morris", event);
          }
          if (prefManager.getBoolPref("euskalbar.opentran.onkey1.en")){
            showHTMLColumns("Opentran", event);
          }
          if (prefManager.getBoolPref("euskalbar.batua.onkey2.en")){
            showHTMLColumns("Batua", event);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey2.en")){
            showHTMLColumns("Adorez", event);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey2.en")){
            showHTMLColumns("UZEI", event);
          }
        }
      } 
    }

    //Aurrekoaren luzapena: HTMLetako zutabeak erakusten ditu
    function showHTMLColumns(name, event){
      event.target.getElementById("b"+name).style.display = "";
      event.target.getElementById("a"+name).parentNode.style.display = "";      
    }

    // Laguntza erakusten du
    function openLaguntza() {
      // Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        var hurl = 'chrome://euskalbar/content/html/euskalbarhelpeu.html';
      } else if (h.match('english')) {  
        var hurl = 'chrome://euskalbar/content/html/euskalbarhelpen.html';
      } else if (h.match('français')) {  
        var hurl = 'chrome://euskalbar/content/html/euskalbarhelpfr.html';
      } else {
        var hurl = 'chrome://euskalbar/content/html/euskalbarhelpes.html';
      }
      reuseOldtab(hurl, "euskalbarhelp");
    }


    // Hiztegien menua erakusten/ezkutatzen du
    function showhideDicts() {
      var button = document.getElementById('Euskalbar-menu');
      if (!prefManager.getBoolPref("euskalbar.showdicts.enabled")) {
        button.setAttribute('hidden', true);
      } else  {
        button.removeAttribute('hidden');
      }
    }

    // Testuinguru-menua erakusten/ezkutatzen du
    function showContextmenu() {
      var sep = document.getElementById('Euskalbar-context-menuseparator');
      var button = document.getElementById('Euskalbar-context-menu');
      if (!prefManager.getBoolPref("euskalbar.showcontextmenu.enabled")) {
        sep.setAttribute('hidden', true);
        button.setAttribute('hidden', true);
      } else  {
        sep.removeAttribute('hidden');
        button.removeAttribute('hidden');
      }
    }

    // Honi buruz koadroa erakusten du
    function euskalbar_about() {
      window.openDialog("chrome://euskalbar/content/about/about.xul", "euskalbar-about-dialog","centerscreen,chrome,modal,resizable");
    }

    // Aukeren koadroa erakusten du
    function euskalbarOptions() {
      var dialogURL = "chrome://euskalbar/content/prefs.xul";
      window.openDialog(dialogURL, "", "chrome,modal,close");
    }


    // Estatistika lokalak erakusten ditu
    function showLocalstats() {
      var dialogURL = "chrome://euskalbar/content/stats.xul";
      window.openDialog(dialogURL, "statsDlg", "chrome,modal,resizable");
    }

    //Azal pertsonalizatuetarako script-ak (hau eta hurrengoa)
    function setUserSkinDisabled() {
      var chkSkins = document.getElementById("chkUserSkinEnable");
      document.getElementById("txtUserSkinPath").disabled = !chkSkins.checked;
      document.getElementById("btnUserSkinPath").disabled = !chkSkins.checked;
      document.getElementById("menuStartupSkin").disabled = chkSkins.checked;
      if (!chkSkins.checked){
        prefManager.setCharPref("euskalbar.style.combinedquery", document.getElementById("menuStartupSkin").selectedItem.value);
      }
    }

    function browseSkin() {
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
    }

    // Laster-teklen aginduak exekutatzen ditu
    function teklakEuskalbar(prefer) {
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
        changeEuskalbarLang();
        break;
      }
    }


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
    function openURL(url, zein, method, params) {
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
        reuseOldtab(url, zein, postData);
      } else {
        openNewtab(url, postData);
      }
    }


    // Izena/balioa pareak adierazteko objektua
    function QueryParameter(aName, aValue) {
      this.name = aName;
      this.value = aValue;
    }


    // Hiztegia fitxa berri batean ireki
    function openNewtab(taburl, aPostData) {
      var theTab = getBrowser().addTab(taburl, null, null, aPostData);
      // enfokatu hala eskatu bada
      if (!prefManager.getBoolPref("euskalbar.bgtabs.enabled")) {
        getBrowser().selectedTab = theTab;
      }
    }


    // Hiztegia fitxa zaharrean ireki
    function reuseOldtab(taburl, tabzein, aPostData){ 
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
        openNewtab(taburl, aPostData);
      }
    }

    // Kutxa hutsik badago, mezu bat bidali
    function alertEmptyBox(katea) {
      //Kateari aurreko eta atzeko zuriuneak kendu
      katea  = katea.replace(/^\s+|\s+$/g,"");
      if(katea ==""){
        // Lokalizazio paketeak kargatu
        strRes = document.getElementById('leuskal');
        alert(strRes.getString("kutxahutsa"));
        return true;
      }
    }

    // Enter tekla sakatzean irekitzen diren hiztegiak
    function goEuskalBarOnKey(event) {
      // Interfazeak itzultzen duen bilaketa katea
      var searchStr = document.getElementById('EuskalBar-search-string').value;
      // Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      // Enter tekla sakatzen bada...  
      if (event.keyCode == 13) {
        if (alertEmptyBox(searchStr)){
          return;
        }
        if (event.shiftKey) { // Shift tekla sakatuta badago...
          // Exekutatu euskalbarshift.js fitxategian dauden skriptak          
          if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshifteseu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftesen.html';
            } else if (h.match('français')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftesfr.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshifteses.html';
            }
            var zein = 'euskalbarshiftes';
            openURL(urlhizt, zein, null, null);
            // eu-es eta es-eu kasuetarako Shift hiztegiak kontsultatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey1.es")){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey1.es")){
              getShiftElhuyar(euskalbar_source, euskalbar_target, searchStr);
              writeStats(1);
            }
            if (prefManager.getBoolPref("euskalbar.3000.onkey1.es")){
              getShift3000(euskalbar_source, searchStr);
              writeStats(2);
            }
            if (prefManager.getBoolPref("euskalbar.batua.onkey1.es")){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getBoolPref("euskalbar.uzei.onkey1.es")){
              getShiftUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getBoolPref("euskalbar.adorez.onkey1.es")){
              getShiftAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
            if (prefManager.getBoolPref("euskalbar.mokoroa.onkey1.es")){
              getShiftMokoroa(euskalbar_source, searchStr);
              writeStats(11);
            }
            if (prefManager.getBoolPref("euskalbar.intza.onkey1.es")){
              getShiftIntza(euskalbar_source, searchStr);
              writeStats(12);
            }
          } else if ((euskalbar_source == 'fr') || (euskalbar_target == 'fr')) {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftfreu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftfren.html';
            } else if (h.match('français')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftfrfr.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftfres.html';
            }
            var zein = 'euskalbarshiftfr';
            openURL(urlhizt, zein, null, null);
            // eu-fr eta fr-eu kasuetarako Shift hiztegiak kontsultatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey1.fr")){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey1.fr")){
              getShiftElhuyar(euskalbar_source, euskalbar_target, searchStr);
              writeStats(1);
            }
            if (prefManager.getBoolPref("euskalbar.batua.onkey1.fr")){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getBoolPref("euskalbar.uzei.onkey1.fr")){
              getShiftUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getBoolPref("euskalbar.adorez.onkey1.fr")){
              getShiftAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
          } else if ((euskalbar_source == 'en') || (euskalbar_target == 'en')) {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshifteneu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftenen.html';
            } else if (h.match('français')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftenfr.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftenes.html';
            }
            var zein = 'euskalbarshiften';
            openURL(urlhizt, zein, null, null);
            // eu-en eta en-eu kasuetarako Shift hiztegiak kontsultatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey1.en")){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey1.en")){
              getShiftElhuyar(euskalbar_source, euskalbar_target, searchStr);
              writeStats(1);
            }
            if (prefManager.getBoolPref("euskalbar.morris.onkey1.en")){
              getShiftMorris(euskalbar_source, searchStr);
              writeStats(3);
            }
            if (prefManager.getBoolPref("euskalbar.opentran.onkey1.en")){
              getShiftOpentran(euskalbar_source, searchStr);
              writeStats(4);
            }
            if (prefManager.getBoolPref("euskalbar.batua.onkey1.en")){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getBoolPref("euskalbar.uzei.onkey1.en")){
              getShiftUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getBoolPref("euskalbar.adorez.onkey1.en")){
              getShiftAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
          } else {
	    goEuskalBarEuskalterm(euskalbar_source, searchStr, "");
	  }
        } else if (event.ctrlKey) { // Ktrl tekla sakatuta badago...
          if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) {
            if (h.match('euskara')) {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrleseu.html';
            } else if (h.match('english')) {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrlesen.html';
            } else if (h.match('français')) {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrlesfr.html';
            } else {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrleses.html';
            }
            var zein = 'euskalbarktrles';
            openURL(urlsin, zein, null, null);
            // eu-es eta es-eu kasuetarako Ktrl hiztegiak kontsultatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey2.es")){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey2.es")){
              getShiftElhuyar(euskalbar_source, euskalbar_target, searchStr);
              writeStats(1);
            }
            if (prefManager.getBoolPref("euskalbar.3000.onkey2.es")){
              getShift3000(euskalbar_source, searchStr);
              writeStats(2);
            }
            if (prefManager.getBoolPref("euskalbar.batua.onkey2.es")){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getBoolPref("euskalbar.uzei.onkey2.es")){
              getShiftUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getBoolPref("euskalbar.adorez.onkey2.es")){
              getShiftAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
            if (prefManager.getBoolPref("euskalbar.mokoroa.onkey2.es")){
              getShiftMokoroa(euskalbar_source, searchStr);
              writeStats(11);
            }
            if (prefManager.getBoolPref("euskalbar.intza.onkey2.es")){
              getShiftIntza(euskalbar_source, searchStr);
              writeStats(12);
            }
          } else if ((euskalbar_source == 'fr') || (euskalbar_target == 'fr')) {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlfreu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlfren.html';
            } else if (h.match('français')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlfren.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlfres.html';
            }
            var zein = 'euskalbarktrlfr';
            openURL(urlhizt, zein, null, null);
            // eu-fr eta fr-eu kasuetarako Ktrl hiztegiak kontsultatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey2.fr")){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey2.fr")){
              getShiftElhuyar(euskalbar_source, euskalbar_target, searchStr);
              writeStats(1);
            }
            if (prefManager.getBoolPref("euskalbar.batua.onkey2.fr")){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getBoolPref("euskalbar.uzei.onkey2.fr")){
              getShiftUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getBoolPref("euskalbar.adorez.onkey2.fr")){
              getShiftAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
          } else if ((euskalbar_source == 'en') || (euskalbar_target == 'en')) {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrleneu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlenen.html';
            } else if (h.match('français')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlenen.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlenes.html';
            }
            var zein = 'euskalbarktrlen';
            openURL(urlhizt, zein, null, null);
            // eu-en eta en-eu kasuetarako Ktrl hiztegiak kontsultatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey2.en")){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey2.en")){
              getShiftElhuyar(euskalbar_source, euskalbar_target, searchStr);
              writeStats(1);
            }
            if (prefManager.getBoolPref("euskalbar.morris.onkey2.en")){
              getShiftMorris(euskalbar_source, searchStr);
              writeStats(3);
            }
            if (prefManager.getBoolPref("euskalbar.opentran.onkey2.en")){
              getShiftOpentran(euskalbar_source, searchStr);
              writeStats(4);
            }
            if (prefManager.getBoolPref("euskalbar.batua.onkey2.en")){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getBoolPref("euskalbar.uzei.onkey2.en")){
              getShiftUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getBoolPref("euskalbar.adorez.onkey2.en")){
              getShiftAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
          } else {
	    goEuskalBarEuskalterm(euskalbar_source, searchStr, "");
          }
        } else { // Shift tekla eta Ktrl tekla sakatuta ez badaude...
          // Begiratu kutxa hutsik dagoen 
          if (alertEmptyBox(searchStr)){
            return;
          }
          if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) {
            // eu-es eta es-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
              goEuskalBarEuskalterm(euskalbar_source, searchStr, '0');
            }
            if (prefManager.getBoolPref("euskalbar.3000.onkey")) {
              goEuskalBarAsk(euskalbar_source, searchStr);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
              goEuskalBarElhuyar(euskalbar_source,euskalbar_target,searchStr);
            }
          } else if ((euskalbar_source == 'fr') || (euskalbar_target == 'fr')) {
            // eu-fr eta fr-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
              goEuskalBarEuskalterm(euskalbar_source, searchStr, '0');
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
              goEuskalBarElhuyar(euskalbar_source,euskalbar_target,searchStr);
            }
          } else {
            // eu-en eta en-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
              goEuskalBarEuskalterm(euskalbar_source, searchStr, '0');
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
              goEuskalBarElhuyar(euskalbar_source,euskalbar_target,searchStr);
            }
            if (prefManager.getBoolPref("euskalbar.morris.onkey")) {
              goEuskalBarMorris(euskalbar_source, searchStr);
            }
            // Open-tran.eu jatorrizko hizkuntza ingelesa denean bakarrik dabil
            if (euskalbar_source == 'en') {
              if (prefManager.getBoolPref("euskalbar.opentran.onkey")) {
                goEuskalBarOpentran(searchStr);
              }
            }
          }
          // Aukeratutako hizkuntzarekiko menpekotasunik ez dutenak kargatu
          if (prefManager.getBoolPref("euskalbar.batua.onkey")) {
            goEuskalBarEuskaltzaindia(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.adorez.onkey")) {
            goEuskalBarAdorez(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.uzei.onkey")) {
            goEuskalBarUZEI(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.itzul.onkey")) {
            goEuskalBarItzuL(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.harluxet.onkey")) {
            goEuskalBarHarluxet(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.wikipedia.onkey")) {
            goEuskalBarWikipedia(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.mokoroa.onkey")) {
            goEuskalBarMokoroa(euskalbar_source, searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.intza.onkey")) {
            goEuskalBarIntza(euskalbar_source, searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.eurovoc.onkey")) {
            goEuskalBarEurovoc(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.bergara.onkey")) {
            goEuskalBarBergara(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.ereduzko.onkey")) {
            goEuskalBarEreduzko(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.klasikoak.onkey")) {
            goEuskalBarKlasikoak(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.ztcorpusa.onkey")) {
            goEuskalBarZTCorpusa(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.corpeus.onkey")) {
            goEuskalBarCorpEus(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.xuxenweb.onkey")) {
            goEuskalBarXUXENweb(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.elebila.onkey")) {
            goEuskalBarElebila(searchStr);
          }
        } 
      }
      //Testu kutxa enfokatzen du
      var el = document.getElementById("EuskalBar-search-string");
      el.focus();
    }


    // Euskalbarren hizkuntza txandakatzen du (toggle modukoa)
    function changeEuskalbarLang() {
      if (euskalbar_target == 'es') {
        setEuskalbarLang('es', 'eu');
      } else if (euskalbar_target == 'en') {
        setEuskalbarLang('en', 'eu');
      } else if (euskalbar_target == 'fr') {
        setEuskalbarLang('fr', 'eu');
      } else if (euskalbar_target == 'eu') {
        // eu: aztertu iturburu hizkuntza
        if (euskalbar_source == 'es') {
          setEuskalbarLang('eu', 'es');
        } else if (euskalbar_source == 'en') {
          setEuskalbarLang('eu', 'en');
        } else if (euskalbar_source == 'fr') {
          setEuskalbarLang('eu', 'fr');
        }
      }
    }

    // Euskalbarren hizkuntza berria zehazten du
    function setEuskalbarLang(source, target) {
      var button = document.getElementById("euskalbar-language");
      button.setAttribute("label", source.toUpperCase()+" ‣ "+target.toUpperCase());
      euskalbar_source = source;
      euskalbar_target = target;
      euskalbar_tooltip = source.toUpperCase()+" ‣ "+target.toUpperCase();
    }

    // Euskalbarreko hiztegiak moldatzen ditu hizkuntzaren arabera
    function setEuskalbarDictionaries(hizk) {
      var morris = document.getElementById('EuskalBar-Morris');
      var opentran = document.getElementById('EuskalBar-Opentran');
      var h3000 = document.getElementById('EuskalBar-Ask');
      var elhuyar = document.getElementById('EuskalBar-Elhuyar');
      switch (hizk) {
        case 'es':
          elhuyar.setAttribute("hidden", false);
          morris.setAttribute("hidden", true);
          opentran.setAttribute("hidden", true);
          h3000.setAttribute("hidden", false);
        break;
        case 'fr':
          elhuyar.setAttribute("hidden", false);
          morris.setAttribute("hidden", true);
          opentran.setAttribute("hidden", true);
          h3000.setAttribute("hidden", true);
        break;
        case 'en':
          elhuyar.setAttribute("hidden", false);
          morris.setAttribute("hidden", false);
          opentran.setAttribute("hidden", false);
          h3000.setAttribute("hidden", true);
        break;
        case 'la':
          elhuyar.setAttribute("hidden", true);
          morris.setAttribute("hidden", true);
          opentran.setAttribute("hidden", true);
          h3000.setAttribute("hidden", true);
        break;
      }
    }
