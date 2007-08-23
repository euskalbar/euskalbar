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
        //Hasieratu hiztegien menuen etiketa
        strRes = document.getElementById('leuskal');
        const hiztegiakbai = strRes.getString("m1hiztegiak");
        const hiztegiakez = strRes.getString("m2hiztegiak");
        var ctlButton = document.getElementById('hideshowmenu');
        var button = document.getElementById('Euskalbar-menu');
        var prefDicts = prefManager.getBoolPref("euskalbar.showdicts.enabled");
        if (prefDicts) {
          button.setAttribute('hidden', false);
          ctlButton.setAttribute('label', hiztegiakez);
        } else {
          button.setAttribute('hidden', true);
          ctlButton.setAttribute('label', hiztegiakbai);
        }
  
        // Azalak aldatzeko funtzioari deitu (DOMContentLoaded gertaerapean)
        getBrowser().addEventListener("DOMContentLoaded", initHTML, true);

        // Hasieratu barrako hiztegiak erakutsi eta ezkutatzeko menua
        // (oharra: persist="checked" ez dabil) -> orain bai??
        document.getElementById('Euskalbar-hs-batua').setAttribute ("checked",!document.getElementById('EuskalBar-Euskaltzaindia').hidden);
        document.getElementById('Euskalbar-hs-adorez').setAttribute ("checked",!document.getElementById('EuskalBar-Adorez').hidden);
        document.getElementById('Euskalbar-hs-uzei').setAttribute ("checked",!document.getElementById('EuskalBar-UZEI').hidden);
        document.getElementById('Euskalbar-hs-itzul').setAttribute ("checked",!document.getElementById('EuskalBar-ItzuL').hidden);
        document.getElementById('Euskalbar-hs-harluxet').setAttribute ("checked",!document.getElementById('EuskalBar-Harluxet').hidden);
        document.getElementById('Euskalbar-hs-mokoroa').setAttribute ("checked",!document.getElementById('EuskalBar-Mokoroa').hidden);
        document.getElementById('Euskalbar-hs-intza').setAttribute ("checked",!document.getElementById('EuskalBar-Intza').hidden);
        document.getElementById('Euskalbar-hs-ztcorpusa').setAttribute ("checked",!document.getElementById('EuskalBar-ZTCorpusa').hidden);
        document.getElementById('Euskalbar-hs-eurovoc').setAttribute ("checked",!document.getElementById('EuskalBar-Eurovoc').hidden);
        document.getElementById('Euskalbar-hs-xuxenweb').setAttribute ("checked",!document.getElementById('EuskalBar-XUXENweb').hidden);
        document.getElementById('Euskalbar-hs-opentrad').setAttribute ("checked",!document.getElementById('EuskalBar-Opentrad').hidden);

        // Ongietorri leihoa erakutsi (ikusi http://forums.mozillazine.org/viewtopic.php?t=562299)
        if (navigator.preference('extensions.' + guid +'.welcome')) {
          var file = Components.classes["@mozilla.org/extensions/manager;1"]
                    .getService(Components.interfaces.nsIExtensionManager)
                    .getInstallLocation(guid)
                    .getItemLocation(guid);
          file.append("defaults");
          file.append("preferences");
          file.append("welcome.js");
          file.remove(false);
          var welcomedialogURL = "chrome://euskalbar/content/about/about.xul";
          var t = setTimeout("window.openDialog('chrome://euskalbar/content/about/about.xul', 'euskalbar-about-dialog','centerscreen,chrome,modal,resizable');",3000);
        }
      },

      // Euskalbar deskargatu: observerra ezabatu	
      shutdown: function() {
        this.prefs.removeObserver("", this);
      },

      // Observerra erabili: hobespenetan aldaketa bat dagoenean exekutatzen da
      // (hau dagoeneko ez da beharrezkoa baina badaezpada ere utzi egingo dugu
      // etorkizunean erabili nahi bada-edo)	
      observe: function(subject, topic, data) {
        if (topic != "nsPref:changed") {
          return;
        }

      /*switch(data) {
          case "style.shiftandcontrol":
            callChangeStyle();
        break;
        }*/
      }

    }


    //HTML fitxategiak hasieratzen ditu
    function initHTML(event) {
      //HTML fitxategietan estiloaren katea aldatzen du
      var prefStyle = prefManager.getCharPref("euskalbar.style.shiftandcontrol");
      var URL = event.target.location.href;
      if (URL.indexOf("chrome://euskalbar/content/html/") != -1) {
        var link = event.target.getElementsByTagName("link")[0];
        link.setAttribute("href", "skins/"+prefStyle+".css");
      }
      //Erakutsiko ez diren hiztegien zutabeak ezkutatzen ditu
      if(URL.indexOf("euskalbarshift") != -1){ //Shift erabiltzen bada...
        if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) { //eu-es eta es-eu itzulpenetarako
          var esshiftpref = prefManager.getCharPref("euskalbar.es.onshift").split(",");
          for (h in esshiftpref){
            event.target.getElementById("b"+esshiftpref[h]).style.display = "";
            event.target.getElementById("a"+esshiftpref[h]).parentNode.style.display = "";
          }
        } else { //eu-en eta en-eu itzulpenetarako
          var enshiftpref = prefManager.getCharPref("euskalbar.en.onshift").split(",");
          for (h in enshiftpref){
            event.target.getElementById("b"+enshiftpref[h]).style.display = "";
            event.target.getElementById("a"+enshiftpref[h]).parentNode.style.display = "";
          }
        }
      }else if(URL.indexOf("euskalbarktrl") != -1){ //Ktrl erabiltzen bada...
        if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) { //eu-es eta es-eu itzulpenetarako
          var esctrlpref = prefManager.getCharPref("euskalbar.es.onctrl").split(",");
          for (h in esctrlpref){
            event.target.getElementById("b"+esctrlpref[h]).style.display = "";
            event.target.getElementById("a"+esctrlpref[h]).parentNode.style.display = "";
          }
        } else { //eu-en eta en-eu itzulpenetarako
          var enctrlpref = prefManager.getCharPref("euskalbar.en.onctrl").split(",");
          for (h in enctrlpref){
            event.target.getElementById("b"+enctrlpref[h]).style.display = "";
            event.target.getElementById("a"+enctrlpref[h]).parentNode.style.display = "";
          }
        }
      } 
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
      } else {
        var hurl = 'chrome://euskalbar/content/html/euskalbarhelpes.html';
      }
      reuseOldtab(hurl, "euskalbarhelp");
    }


    // Hiztegien menua erakusten/ezkutatzen du
    function showhideDicts() {
      // Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      const hiztegiakbai = strRes.getString("m1hiztegiak");
      const hiztegiakez = strRes.getString("m2hiztegiak");
      var button = document.getElementById('Euskalbar-menu');
      var ctlButton = document.getElementById('hideshowmenu');
      var prefDicts = prefManager.getBoolPref("euskalbar.showdicts.enabled");
      if (prefDicts) {
        button.setAttribute('hidden', true);
        ctlButton.setAttribute('label', hiztegiakbai);
        prefManager.setBoolPref("euskalbar.showdicts.enabled", false);
      } else  {
        button.removeAttribute('hidden');
        ctlButton.setAttribute('label', hiztegiakez);
        prefManager.setBoolPref("euskalbar.showdicts.enabled", true);
      }
    }

    // Displays the about dialog
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
      URLstats = extNon.clone();
      URLstats.append("stats.txt");
      // Estatistiken fitxategia ireki eta irakurri
      var statfs = Components.classes["@mozilla.org/network/file-input-stream;1"]
                   .createInstance(Components.interfaces.nsIFileInputStream);
      var statss = Components.classes["@mozilla.org/scriptableinputstream;1"]
                   .createInstance(Components.interfaces.nsIScriptableInputStream);

      statfs.init(URLstats, -1, 0, 0);
      statss.init(statfs);
      var statsText = statss.read(statfs.available());
      statss.close();
      statfs.close();
      // Leihoa ireki eta estatistiken fitxategia pasatu argumentu gisa
      var dialogURL = "chrome://euskalbar/content/stats.xul";
      window.openDialog(dialogURL, "statsDlg", "chrome,modal,resizable", statsText);
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


    // izena/balioa pareak adierazteko objektua
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


    // Enter tekla sakatzean irekitzen diren hiztegiak
    function goEuskalBarOnKey(event) {
      // Interfazeak itzultzen duen bilaketa katea
      var searchStr = document.getElementById('EuskalBar-search-string').value;
      // Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      // Enter tekla sakatzen bada...  
      if (event.keyCode == 13) {
        if (event.shiftKey) { // Shift tekla sakatuta badago...
          // Exekutatu euskalbarshift.js fitxategian dauden skriptak          
          if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshifteseu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftesen.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshifteses.html';
            }
            var zein = 'euskalbarshiftes';
            openURL(urlhizt, zein, null, null);
            // eu-es eta es-eu kasuetarako Shift hiztegiak kontsultatu
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("Euskalterm") != -1){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("Elhuyar") != -1){
              getShiftElhuyar(euskalbar_source, searchStr);
              writeStats(2);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("3000") != -1){
              getShift3000(euskalbar_source, searchStr);
              writeStats(1);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("Batua") != -1){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("Adorez") != -1){
              getKtrlAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("UZEI") != -1){
              getKtrlUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("Mokoroa") != -1){
              getMokoroa(euskalbar_source, searchStr);
              writeStats(10);
            }
            if (prefManager.getCharPref("euskalbar.es.onshift").indexOf("Intza") != -1){
              getIntza(euskalbar_source, searchStr);
              writeStats(11);
            }
          } else {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshifteneu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftenen.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarshiftenes.html';
            }
            var zein = 'euskalbarshiften';
            openURL(urlhizt, zein, null, null);
            // eu-en eta en-eu kasuetarako Shift hiztegiak kontsultatu
            if (prefManager.getCharPref("euskalbar.en.onshift").indexOf("Euskalterm") != -1){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getCharPref("euskalbar.en.onshift").indexOf("Morris") != -1){
              getShiftMorris(euskalbar_source, searchStr);
              writeStats(3);
            }
            if (prefManager.getCharPref("euskalbar.en.onshift").indexOf("Batua") != -1){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getCharPref("euskalbar.en.onshift").indexOf("Adorez") != -1){
              getKtrlAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
            if (prefManager.getCharPref("euskalbar.en.onshift").indexOf("UZEI") != -1){
              getKtrlUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
          }
        } else if (event.ctrlKey) { // Ktrl tekla sakatuta badago...
          if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) {
            if (h.match('euskara')) {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrleseu.html';
            } else if (h.match('english')) {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrlesen.html';
            } else {
              var urlsin = 'chrome://euskalbar/content/html/euskalbarktrleses.html';
            }
            var zein = 'euskalbarktrles';
            openURL(urlsin, zein, null, null);
            // eu-es eta es-eu kasuetarako Ktrl hiztegiak kontsultatu
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("Euskalterm") != -1){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("Elhuyar") != -1){
              getShiftElhuyar(euskalbar_source, searchStr);
              writeStats(2);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("3000") != -1){
              getShift3000(euskalbar_source, searchStr);
              writeStats(1);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("Batua") != -1){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("Adorez") != -1){
              getKtrlAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("UZEI") != -1){
              getKtrlUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("Mokoroa") != -1){
              getMokoroa(euskalbar_source, searchStr);
              writeStats(10);
            }
            if (prefManager.getCharPref("euskalbar.es.onctrl").indexOf("Intza") != -1){
              getIntza(euskalbar_source, searchStr);
              writeStats(11);
            }
          }else {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrleneu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlenen.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarktrlenes.html';
            }
            var zein = 'euskalbarktrlen';
            openURL(urlhizt, zein, null, null);
            // eu-en eta en-eu kasuetarako Ktrl hiztegiak kontsultatu
            if (prefManager.getCharPref("euskalbar.en.onctrl").indexOf("Euskalterm") != -1){
              getShiftEuskalterm(euskalbar_source, searchStr);
              writeStats(0);
            }
            if (prefManager.getCharPref("euskalbar.en.onctrl").indexOf("Morris") != -1){
              getShiftMorris(euskalbar_source, searchStr);
              writeStats(3);
            }
            if (prefManager.getCharPref("euskalbar.en.onctrl").indexOf("Batua") != -1){
              getShiftEuskaltzaindia(euskalbar_source, searchStr);
              writeStats(5);
            }
            if (prefManager.getCharPref("euskalbar.en.onctrl").indexOf("Adorez") != -1){
              getKtrlAdorez(euskalbar_source, searchStr);
              writeStats(7);
            }
            if (prefManager.getCharPref("euskalbar.en.onctrl").indexOf("UZEI") != -1){
              getKtrlUZEI(euskalbar_source, searchStr);
              writeStats(6);
            }
          }
        } else { // Shift tekla eta Ktrl tekla sakatuta ez badaude...
          if ((euskalbar_source == 'es') || (euskalbar_target == 'es')) {
            // eu-es eta es-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
              goEuskalBarEuskalterm(euskalbar_source, searchStr, '0');
            }
            if (prefManager.getBoolPref("euskalbar.3000.onkey")) {
              goEuskalBarAsk(euskalbar_source, searchStr);
            }
            if (prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
              goEuskalBarElhuyar(euskalbar_source, searchStr);
            }
          } else {
            // eu-en eta en-eu hizkuntzan hobetsitako hiztegiak kargatu
            if (prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
              goEuskalBarEuskalterm(euskalbar_source, searchStr, '0');
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
          if (prefManager.getBoolPref("euskalbar.mokoroa.onkey")) {
            goEuskalBarMokoroa(euskalbar_source, searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.intza.onkey")) {
            goEuskalBarIntza(euskalbar_source, searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.ztcorpusa.onkey")) {
            goEuskalBarZTCorpusa(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.eurovoc.onkey")) {
            goEuskalBarEurovoc(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.xuxenweb.onkey")) {
            goEuskalBarXUXENweb(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.opentrad.onkey")) {
            goEuskalBarOpentrad(euskalbar_source, searchStr);
          }
        } 
      }
      // Testu kutxa berriro enfokatzeko... -> Erroreak errore kontsolan 
      // document.getElementById('Euskalbar-search-string').focus();
    }


    // Euskalbarren hizkuntzaren irudia eguneratzen du
    function setEuskalbarImage() {
      var button = document.getElementById("euskalbar-language");
      button.setAttribute("image", "chrome://euskalbar/skin/"+euskalbar_image);
      button.setAttribute("tooltiptext", euskalbar_tooltip);
    }


    // Euskalbarren hizkuntza txandakatzen du (toggle modukoa)
    function changeEuskalbarLang() {
      if (euskalbar_target == 'es') {
        setEuskalbarLang('es', 'eu');
      } else if (euskalbar_target == 'en') {
        setEuskalbarLang('en', 'eu');
      } else if (euskalbar_target == 'eu') {
        // eu: aztertu iturburu hizkuntza
        if (euskalbar_source == 'es') {
          setEuskalbarLang('eu', 'es');
        } else if (euskalbar_source == 'en') {
          setEuskalbarLang('eu', 'en');
        }
      }
    }


    // Euskalbarren hizkuntza berria zehazten du
    function setEuskalbarLang(source, target) {
      euskalbar_source = source;
      euskalbar_target = target;
      euskalbar_image = source+target+'.png';
      euskalbar_tooltip = source+' > '+target;
      setEuskalbarImage();
    }


    // Euskalbarreko hiztegiak moldatzen ditu hizkuntzaren arabera
    function setEuskalbarDictionaries(hizk) {
      var morris = document.getElementById('EuskalBar-Morris');
      var opentran = document.getElementById('EuskalBar-Opentran');
      var h3000 = document.getElementById('EuskalBar-Ask');
      var elhuyar = document.getElementById('EuskalBar-Elhuyar');
      switch (hizk) {
        case 'es':
          // eu>en eta en>eu hiztegiak ezgaitu
          morris.setAttribute("hidden", true);
          opentran.setAttribute("hidden", true);
          // eu>es eta es>eu hiztegiak gaitu
          h3000.setAttribute("hidden", false);
          elhuyar.setAttribute("hidden", false);
        break;
        case 'en':
          // eu>en eta en>eu hiztegiak gaitu
          morris.setAttribute("hidden", false);
          opentran.setAttribute("hidden", false);
          // eu>es eta es>eu hiztegiak ezgaitu
          h3000.setAttribute("hidden", true);
          elhuyar.setAttribute("hidden", true);
        break;
      }
    }


    // *************************************
    //  Hiztegien bilaketak
    // *************************************


    // Euskaltermen bilaketak egiteko
    function goEuskalBarEuskalterm(source, term, sub) {
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      // interfazearen hizkuntza zehaztu
      if (h.match('euskara')) {
        hiztegiarenhizkuntza = 'eu';
      } else if (h.match('english')) {
        hiztegiarenhizkuntza = 'en';
      } else {
        hiztegiarenhizkuntza = 'es';
      }
      // bilaketaren hizkuntza zehaztu
      if (source == 'es') {
        idioma = 'G';
      } else if (source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
      }
      var url = 'http://www1.euskadi.net/euskalterm/cgibila7.exe';
      var params = [];
      params.push(new QueryParameter('hizkun1', idioma));
      params.push(new QueryParameter('hitz1', escape(term)));
      params.push(new QueryParameter('gaiak', sub));
      params.push(new QueryParameter('hizkuntza', hiztegiarenhizkuntza));
      var zein = 'euskalterm';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(0);
    }


    // Aukeratutako testua itzultzen du opentrad erabiliz edo xuxenweb kontsultatzen du
    function goEuskalBarSelection(term, action) {
      var params = [];
      switch (action) {
        case 'opentrad' :
          var url = 'http://www.interneteuskadi.org/euskalbar/opentrad.php';
          params.push(new QueryParameter('testukutxa', escape(term))); 
          var zein = 'opentrad';
          //Estatistika lokalak idatzi
          writeStats(14);
        break;
        case 'xuxenweb' :
          var url = 'http://www.xuxen.com/socketBezero.php';
          params.push(new QueryParameter('idatzArea', term)); 
          var zein = 'xuxen';
          //Estatistika lokalak idatzi
          writeStats(13);
        break;
      }
      openURL(url, zein, 'GET', params);
    }


    // Bilaketak 3000 hiztegian
    function goEuskalBarAsk(source, term) {
      var params = [];
      if (source == 'es') {
        source = 'CAS';
        idioma = 'Castellano';
      } else {
        source = 'EUS';
        idioma = 'Euskera';
      }
      var url = 'http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe';
      params.push(new QueryParameter('Diccionario', source));
      params.push(new QueryParameter('Idioma', source))
      params.push(new QueryParameter('Txt_'+idioma, escape(term)));
      var zein = 'cgi-bin_m33';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(1);
    }


    // Elhuyar hiztegiko bilaketak
    function goEuskalBarElhuyar(source, term) {
      var params = [];
      // Hitzen arteko zuriuneen ordez beheko barrak idazten ditu, Elhuyarrentzako
      term = term.replace(/ /g, "_");
      var url = 'http://www.interneteuskadi.org/euskalbar/frames.php';
      params.push(new QueryParameter('term', escape(term)));
      params.push(new QueryParameter('source', source));
      var zein = 'interneteuskadi';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(2);
    }


    // Morrisen bilaketak egiteko
    function goEuskalBarMorris(source, term) {
      if (source == 'en') {
        var hizk = 'txtIngles';
      } else {
        var hizk = 'txtEuskera';
      }
      var url = 'http://www1.euskadi.net/morris/resultado.asp';
      var params = [];
      params.push(new QueryParameter(hizk, escape(term)));
      var zein = 'morris';
      openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(3);
    }


    // eu.open-tran.eu itzulpen datu-basean bilaketak
    function goEuskalBarOpentran(term) {
      var url = 'http://eu.open-tran.eu/suggest/'+escape(term);
      var zein = 'open-tran';
      openURL(url, zein, null, null);
      //Estatistika lokalak idatzi
      writeStats(4);
    }


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    function goEuskalBarEuskaltzaindia(term) {
      var params = [];
      var url = 'http://www.euskaltzaindia.net/hiztegibatua/bilatu.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      var zein = 'hiztegibatua';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(5);
    }


    // ItzuL posta-zerrendan bilaketak
    function goEuskalBarItzuL(term) {
      var params = [];
      var url = 'http://search.gmane.org/search.php';
      params.push(new QueryParameter('group', 'gmane.culture.language.basque.itzul'));
      params.push(new QueryParameter('query', encodeURI(term)));
      var zein = 'gmane.culture.language.basque.itzul';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(8);
    }


    // Harluxet hiztegi entziklopedikoa
    function goEuskalBarHarluxet(term) {
      var params = [];
      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      var zein = 'harluxet';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(9);
    }


    // Mokoroan bilaketak
    function goEuskalBarMokoroa(source, term) {
      var params = [];
      var zein = 'mokoroa';
      var url = 'http://www.hiru.com/hiztegiak/mokoroa/';
      if (source == 'es') {
        params.push(new QueryParameter('gazt', escape(term)));
        params.push(new QueryParameter('bidali', 'Bilatu'));
      } else {
        params.push(new QueryParameter('eusk', escape(term)));
        params.push(new QueryParameter('bidali', 'Bilatu'));
      }
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(10);
    }

    // Intzaren bilaketak
    function goEuskalBarIntza(source, term) {
      var params = [];
      var zein = 'intza';
      var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl'; 
      if (source == 'es') {
        params.push(new QueryParameter('hitza1', escape(term)));
        params.push(new QueryParameter('eremu3', '1'));
        params.push(new QueryParameter('eremu1', 'eeki'));
      } else {
        params.push(new QueryParameter('eremu1', 'giltzarriak'));
        params.push(new QueryParameter('hitza1', escape(term)));
        params.push(new QueryParameter('eremu3','1'));
      }
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi, hau aldatu egin behar da
      writeStats(11);
    }

    // ZT Corpusa
    function goEuskalBarZTCorpusa(term) {
      var params = [];
      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py';
      params.push(new QueryParameter('testu-hitza1', escape(term)));
      var zein = 'ztcorpusa';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(12);
    }


    // Eurovoc Tesaurusa
    function goEuskalBarEurovoc(term) {
      var params = [];
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        hizk = 'EU';
      } else {
        hizk = 'CA';
      }
      var url = 'http://www.bizkaia.net/kultura/eurovoc/busqueda.asp';
      params.push(new QueryParameter('txtBuscar', 'S'));
      params.push(new QueryParameter('query', term));
      params.push(new QueryParameter('idioma', hizk));
      var zein = 'eurovoc';
      openURL(url, zein, 'POST', params);
      //Estatistika lokalak idatzi
      writeStats(13);
    }

    // Opentrad
    function goEuskalBarOpentrad(source, term) {
      var params = [];
      var url = 'http://www.opentrad.org/demo/libs/nabigatzailea.php';
      params.push(new QueryParameter('language', 'eu'));
      params.push(new QueryParameter('inurl', escape(window.content.document.location.href)));
      params.push(new QueryParameter('norantza', 'es-eu'));
      var zein = 'opentrad';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(15);
    }


    // XUXENweb
    function goEuskalBarXUXENweb(term) {
      var params = [];
      var url = 'http://www.xuxen.com/socketBezero.php';
      params.push(new QueryParameter('idatzArea', term));
      var zein = 'xuxen';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(14);
    }


    // Zenbait hiztegi atzitzen ditu
    function goEuskalBarOthers(zein) {
      switch (zein) {
        case 'SAunamendi':
          var url = 'http://www.euskomedia.org/euskomedia/SAunamendi?idi=eu&op=1';
        break;
        case 'kapsula':
          var url = 'http://tresnak.kapsula.com/cgi-bin-jo/HTMODFOR?ActionField=getmodel&$BaseNumber=02&$Modelo=01&CmdGetModel=KAPSULA.HTMLMOD.JOMODBIL';
        break;
        case 'oeegunea':
          var url = 'http://www.oeegunea.org/default.cfm?atala=hiztegia';
        break;
      }
      openURL(url, zein, null, null);
    }


    // Adorez sinonimoen hiztegia
    function goEuskalBarAdorez(term) {
      var params = [];
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      var url = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe';
      if (h.match('euskara')) {
        params.push(new QueryParameter('Palabra', 'Introducida'));
        params.push(new QueryParameter('Idioma', 'EUS'));
        params.push(new QueryParameter('txtpalabra', escape(term)));
      } else {
        params.push(new QueryParameter('Palabra', 'Introducida'));
        params.push(new QueryParameter('Idioma', 'CAS'));
        params.push(new QueryParameter('txtpalabra', escape(term)));
      }
      var zein = 'adorez';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(7);
    }


    // UZEIren sinonimoen hiztegia
    function goEuskalBarUZEI(term) {
      var params = [];
      var url = 'http://www.uzei.com/estatico/sinonimos.asp';
      params.push(new QueryParameter('sarrera', escape(term)));
      params.push(new QueryParameter('eragiketa', 'bilatu'));
      var zein = 'uzei';
      openURL(url, zein, 'GET', params);
      //Estatistika lokalak idatzi
      writeStats(6);
    }


    // Aukeratutako testua itzultzen du
    function selectionText () {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection();
    }


    // Testu kutxan sartzen den katea zenbakia dela balidatzen du
    function numField(event){
      if (event.which >= 48 && event.which <= 57 ||
          (event.which==46 && this.input.value.search('\\.')== -1)  ||
          8 == event.which || 13 == event.which || 0 == event.which) {
        return;
      } else {
        event.preventDefault();
        return;
      }
    }
