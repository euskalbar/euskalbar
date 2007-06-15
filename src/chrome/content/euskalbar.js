﻿// Developers: Juanan Pereira, Asier Sarasua Garmendia 2006
//             Julen Ruiz Aizpuru 2007
// This is Free Software (GPL License)
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com

    // Hobespenak eskuratzeko interfazea
    const prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranch);

    // Hasieratu hizkuntza lehenetsia bere hiztegiekin
    function startEuskalbar() {
      var lang = prefManager.getCharPref("euskalbar.language.startup");
      euskalbar_source = lang[0]+lang[1];
      euskalbar_target = lang[3]+lang[4];
      setEuskalbarLang(euskalbar_source, euskalbar_target);
      if (euskalbar_source != 'eu') {
        setEuskalbarDictionaries(euskalbar_source);
      } else {
        setEuskalbarDictionaries(euskalbar_target);
      }
    }


    // Laguntza erakusten du
    function openLaguntza() {    
      //Lokalizazio paketeak kargatu
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


    //Hiztegien menua erakusten/ezkutatzen du
    function showhideDicts(nondik) {
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      const hiztegiakbai = strRes.getString("m1hiztegiak");
      const hiztegiakez = strRes.getString("m2hiztegiak");
      var button = document.getElementById('Euskalbar-menu');
      var ctlButton = document.getElementById('hideshowmenu');
      var prefDicts = prefManager.getBoolPref("euskalbar.showdicts.enabled");
      if (nondik == "dena"){
        if (prefDicts) {
          button.setAttribute('hidden', true);
          ctlButton.setAttribute('label', hiztegiakez);
          prefManager.setBoolPref("euskalbar.showdicts.enabled", false);
        } else  {
          button.removeAttribute('hidden');
          ctlButton.setAttribute('label', hiztegiakbai);
          prefManager.setBoolPref("euskalbar.showdicts.enabled", true);
        }
      } else if (nondik == "etiketa") {
        if (prefDicts) {
          ctlButton.setAttribute('label', hiztegiakez);
        } else {
          ctlButton.setAttribute('label', hiztegiakbai);
        }
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


    // *************************************
    //  Euskalbarren barneko funtzioak
    // *************************************


    // Emandako URLa zabaltzen du hobespenaren arabera
    function openURL(url, zein) {
      if (prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
        reuseOldtab(url, zein);
      } else {
        openNewtab(url);
      }
    }


    // Hiztegia fitxa berri batean ireki
    function openNewtab(taburl) {
      var theTab = getBrowser().addTab(taburl);
      // enfokatu hala eskatu bada
      if (!prefManager.getBoolPref("euskalbar.bgtabs.enabled")) {
        getBrowser().selectedTab = theTab;
      }
    }


    // Hiztegia fitxa zaharrean ireki
    function reuseOldtab(taburl, tabzein){ 
      // Aztertu fitxa zahar bakoitza
      var oldTab = getBrowser().selectedTab;
      var found = false;
      var index = 0
      var numTabs = getBrowser().mTabContainer.childNodes.length;
      while (index < numTabs && !found) {
        var currentTab = getBrowser().getBrowserAtIndex(index);
        var currentTabURI = currentTab.currentURI.spec;
    	  if (currentTabURI.indexOf(tabzein)!= -1) {
          // Hiztegia irekita dago
          currentTab.loadURI(taburl);
          // enfokatu hala eskatu bada
          if (!prefManager.getBoolPref("euskalbar.bgtabs.enabled")) {
            getBrowser().mTabContainer.selectedIndex = index;
          }
          found = true;
        }
       	index++;
      }
      if (!found) {
        openNewtab(taburl);
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
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarhizteu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarhizten.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarhiztes.html';
            }
            var zein = 'euskalbarhizt';
            openURL(urlhizt, zein);
            // eu-es eta es-eu kasutarako euskalterm, h3000 eta elhuyar kontsultatu
            getShiftEuskalterm(euskalbar_source, searchStr);
            getShift3000(euskalbar_source, searchStr);
            getShiftElhuyar(euskalbar_source, searchStr);
          } else {
            // Interfazearen hizkuntza
            if (h.match('euskara')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarhizt2eu.html';
            } else if (h.match('english')) {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarhizt2en.html';
            } else {
              var urlhizt = 'chrome://euskalbar/content/html/euskalbarhizt2es.html';
            }
            var zein = 'euskalbarhizt';
            openURL(urlhizt, zein);
            // eu-en eta en-eu kasutarako euskalterm eta morris kontsultatu
            getShiftEuskalterm(euskalbar_source, searchStr);
            getShiftMorris(euskalbar_source, searchStr);
          }
        } else if (event.ctrlKey) { // Ktrl tekla sakatuta badago...
          if (h.match('euskara')) {
            var urlsin = 'chrome://euskalbar/content/html/euskalbarsineu.html';
          } else if (h.match('english')) {
            var urlsin = 'chrome://euskalbar/content/html/euskalbarsinen.html';
          } else {
            var urlsin = 'chrome://euskalbar/content/html/euskalbarsines.html';
          }
          var zein = 'euskalbarsin';
          openURL(urlsin, zein);
          //Exekutatu euskalbarktrl.js fitxategian dauden skriptak
          getKtrlSinonimoak(euskalbar_source, searchStr);
          getKtrlUZEI(euskalbar_source, searchStr);
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
          if (prefManager.getBoolPref("euskalbar.itzul.onkey")) {
            goEuskalBarItzuL(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.harluxet.onkey")) {
            goEuskalBarHarluxet(searchStr);
          }
          if (prefManager.getBoolPref("euskalbar.mokoroa.onkey")) {
            goEuskalBarMokoroa(searchStr);
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
      // Testu kutxa berriro enfokatzeko... 
      document.getElementById('Euskalbar-search-string').focus();
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
      euskalbar_tooltip = source+' » '+target;
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
      var url = 'http://www1.euskadi.net/euskalterm/cgibila7.exe?hizkun1='+idioma+'&hitz1='+escape(term)+'&gaiak='+sub+'&hizkuntza='+hiztegiarenhizkuntza;
      var zein = 'euskalterm';
      openURL(url, zein);
    }


    // Aukeratutako testua itzultzen du opentrad erabiliz edo xuxenweb kontsultatzen du
    function goEuskalBarSelection(term, action) {
      switch (action) {
        case 'opentrad' :
          var url = 'http://www.interneteuskadi.org/euskalbar/opentrad.php?testukutxa='+escape(term); 
          var zein = 'opentrad';
        break;
        case 'xuxenweb' :
          var url = 'http://www.xuxen.com/socketBezero.php?idatzArea='+term; 
          var zein = 'xuxen';
        break;
      }
      openURL(url, zein);
    }


    // Bilaketak 3000 hiztegian
    function goEuskalBarAsk(source, term) {
      if (source == 'es') {
        source = 'CAS';
        idioma = 'Castellano';
      } else {
        source = 'EUS';
        idioma = 'Euskera';
      }
      var url = 'http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe?Diccionario='+source+'&Idioma='+source+'&Txt_'+idioma+'='+escape(term);
      var zein = 'cgi-bin_m33';
      openURL(url, zein);
    }


    // Elhuyar hiztegiko bilaketak
    function goEuskalBarElhuyar(source, term) {
      // Hitzen arteko zuriuneen ordez beheko barrak idazten ditu, Elhuyarrentzako
      term = term.replace(/ /g, "_");
      var url = 'http://www.interneteuskadi.org/euskalbar/frames.php?term='+escape(term)+'&source='+source;
      var zein = 'interneteuskadi';
      openURL(url, zein);
    }


    // Morrisen bilaketak egiteko
    function goEuskalBarMorris(source, term) {
      if (source == 'en') {
        hizk = 'txtIngles';
      } else {
        hizk = 'txtEuskera';
      }
      var url = 'chrome://euskalbar/content/html/hiztegiak/goeuskalbarmorris.html?hizkuntza='+hizk+'&hitza='+escape(term);
      var zein = 'morris'
      openURL(url, zein);
    }


    // eu.open-tran.eu itzulpen datu-basean bilaketak
    function goEuskalBarOpentran(term) {
      var url = 'http://eu.open-tran.eu/suggest/'+escape(term);
      var zein = 'opentran'
      openURL(url, zein);
    }


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    function goEuskalBarEuskaltzaindia(term) {
      var url = 'http://www.euskaltzaindia.net/hiztegibatua/bilatu.asp?sarrera='+escape(term);
      var zein = 'hiztegibatua';
      openURL(url, zein);
    }


    // ItzuL posta-zerrendan bilaketak
    function goEuskalBarItzuL(term) {
      var url = 'http://search.gmane.org/search.php?group=gmane.culture.language.basque.itzul&query='+encodeURI(term);
      var zein = 'gmane.culture.language.basque.itzul';
      if (prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
        reuseOldtab(url, zein);
      } else {
        openNewtab(url);	
      }      
    }


    // Harluxet  hiztegi entziklopedikoa
    function goEuskalBarHarluxet(term) {
      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp?sarrera='+escape(term);
      var zein = 'harluxet';
      openURL(url, zein);   
    }


    // Mokoroan bilaketak
    function goEuskalBarMokoroa(source, term) {
      var zein = 'mokoroa'; 
      if (source == 'es') {
        var url = 'http://www.hiru.com/hiztegiak/mokoroa/?gazt='+escape(term)+'&eusk=&nork=&kera=&bidali=Bilatu';
      } else {
        var url = 'http://www.hiru.com/hiztegiak/mokoroa/?gazt=&eusk='+escape(term)+'&nork=&kera=&bidali=Bilatu';
      }
      openURL(url, zein);
    }


    // ZT Corpusa
    function goEuskalBarZTCorpusa(term) {
      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py?testu-hitza1='+escape(term);
      var zein = 'ztcorpusa';
      openURL(url, zein);
    }


    // Eurovoc Tesaurusa
    function goEuskalBarEurovoc(term) {
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        hizk = 'EU';
      } else {
        hizk = 'CA';
      }
      var url = 'chrome://euskalbar/content/html/hiztegiak/goeuskalbareurovoc.html?hizkuntza='+hizk+'&hitza='+escape(term);
      var zein = 'eurovoc';
      openURL(url, zein);
    }

    // Opentrad
    function goEuskalBarOpentrad(source, term) {
      var url = 'http://www.opentrad.org/demo/libs/nabigatzailea.php?language=eu&inurl='+escape(window.content.document.location.href)+'&norantza=es-eu';
      var zein = 'opentrad';
      openURL(url, zein);    
    }


    // XUXENweb
    function goEuskalBarXUXENweb(term) {
      var url = 'http://www.xuxen.com/socketBezero.php?idatzArea='+term;
      var zein = 'xuxen';
      openURL(url, zein);
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
      openURL(url, zein);
    }


    // Adorez sinonimoen hiztegia
    function goEuskalBarAdorez(term) {
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        var url = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe?Palabra=Introducida&Idioma=EUS&txtpalabra='+escape(term);
      } else {
        var url = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe?Palabra=Introducida&Idioma=CAS&txtpalabra='+escape(term);
      }
      var zein = 'adorez';
      openURL(url, zein);
    }


    // UZEIren sinonimoen hiztegia
    function goEuskalBarUZEI(term) {
      var url = 'http://www.uzei.com/estatico/sinonimos.asp?sarrera='+escape(term)+'&eragiketa=bilatu';
      var zein = 'uzei';
      openURL(url, zein);
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
		8 == event.which || 13 == event.which || 0 == event.which)
	  {
		return;
	  }
	  else{
		event.preventDefault();
		return;
	  }
	} 