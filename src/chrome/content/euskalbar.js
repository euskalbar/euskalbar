// Developers: Juanan Pereira, Asier Sarasua Garmendia 2006
// This is Free Software (GPL License)
// juanan@diariolinux.com
// asarasua@vitoria-gasteiz.org
    var euskalbar_language = 'es';
    var euskalbar_image = 'eseu.gif';
    var euskalbar_tooltip = "es>eu";
    // Hobespenak eskuratzeko interfazea
    var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranch);


    // Laguntza erakusten du
    function openLaguntza() {
    //Lokalizazio paketeak kargatu
    strRes = document.getElementById('leuskal');
    const h = strRes.getString("hizk");
      if (h.match('euskara')) {
	var hurl = 'chrome://euskalbar/content/html/euskalbarhelpeu.html';
      }else{
	var hurl = 'chrome://euskalbar/content/html/euskalbarhelpes.html';
      }
      reuseOldtab(hurl, "euskalbarhelp");
    }

    //Hiztegien menua erakusten/ezkutatzen du
    function showhideDicts(nondik){
    //Lokalizazio paketeak kargatu
    strRes = document.getElementById('leuskal');
    const hiztegiakbai = strRes.getString("m1hiztegiak");
    const hiztegiakez = strRes.getString("m2hiztegiak");
    var button = document.getElementById('Euskalbar-menu');
    var ctlButton = document.getElementById('hideshowmenu');
    var prefDicts = prefManager.getBoolPref("euskalbar.showdicts.enabled");
      if (nondik=="dena"){
        if(prefDicts){
          button.setAttribute('hidden', true);
          ctlButton.setAttribute('label', hiztegiakez);
          prefManager.setBoolPref("euskalbar.showdicts.enabled", false);
        } else  {
          button.removeAttribute('hidden');
          ctlButton.setAttribute('label', hiztegiakbai);
          prefManager.setBoolPref("euskalbar.showdicts.enabled", true);
        }
      }else if(nondik=="etiketa"){
        if(prefDicts){
          ctlButton.setAttribute('label', hiztegiakez);
        } else  {
          ctlButton.setAttribute('label', hiztegiakbai);
        }
      }
    }


    // Displays the about dialog
    function euskalbar_about() {
          window.openDialog("chrome://euskalbar/content/about/about.xul", "euskalbar-about-dialog", "centerscreen,chrome,modal,resizable");
    }

    // Aukeren koadroa erakusten du
    function euskalbarOptions() {
	var dialogURL = "chrome://euskalbar/content/prefs.xul";
	window.openDialog(dialogURL, "", "chrome,modal,close");
    }


    // Hiztegia fitxa berri batean ireki
    function openNewtab(taburl){
    	var  theTab = getBrowser().addTab(taburl);
    	getBrowser().selectedTab = theTab;
    }

    // Hiztegia fitxa zaharrean ireki
    function reuseOldtab(taburl, tabzein){ 
	// Aztertu fitxa zahar bakoitza
    	var found = false;
	var index = 0
	var numTabs = getBrowser().mTabContainer.childNodes.length;
    	while (index < numTabs && !found) {
      	var currentTab = getBrowser().getBrowserAtIndex(index);
      	var currentTabURI = currentTab.currentURI.spec;
		if (currentTabURI.indexOf(tabzein)!= -1) {
		// Hiztegia irekita dago
        		currentTab.loadURI(taburl);
			//Enfokatu fitxa
			getBrowser().mTabContainer.selectedIndex = index;
        		found = true;
      		}
 
      	index++;
    	}
  	if (!found) {
    		openNewtab(taburl);
    	}
    }

    // Enter tekla sakatzean irekitzen diren hiztegiak
    function goEuskalBarOnKey(event){
	//Interfazak itzultzen duen hizkuntza balioa
	var lang = document.getElementById('euskalbar-language').value
	//Interfazak itzultzen duen bilaketa katea
	var searchStr = document.getElementById('EuskalBar-search-string').value
        //Lokalizazio paketeak kargatu
        strRes = document.getElementById('leuskal');
	//Enter tekla sakatzen bada...  
	if(event.keyCode == 13) {
	  // Shift tekla sakatuta badago...
	  if (event.shiftKey) {
            const h1 = strRes.getString("hizk");
            if (h1.match('euskara')) {
	      var urlhizt = 'chrome://euskalbar/content/html/euskalbarhizteu.html';
            }else{
	      var urlhizt = 'chrome://euskalbar/content/html/euskalbarhiztes.html';
            }
	    var zein = 'euskalbarhizt'
	    if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
		reuseOldtab(urlhizt, zein);
		//Exekutatu euskalbarshift.js fitxategian dauden skriptak
	        getShiftEuskalterm(euskalbar_language, lang, searchStr);
	        getShift3000(euskalbar_language, lang, searchStr);
	        getShiftElhuyar(euskalbar_language, lang, searchStr);
	    }
	    else{
		openNewtab(urlhizt);
	        getShiftEuskalterm(euskalbar_language, lang, searchStr);
	        getShift3000(euskalbar_language, lang, searchStr);
	        getShiftElhuyar(euskalbar_language, lang, searchStr);
	    }
	  }
	  // Ktrl tekla sakatuta badago...
          else if  (event.ctrlKey) {
            const h2 = strRes.getString("hizk");
            if (h2.match('euskara')) {
	      var urlsin = 'chrome://euskalbar/content/html/euskalbarsineu.html';
            }else{
	      var urlsin = 'chrome://euskalbar/content/html/euskalbarsines.html';
            }
	    var zein = 'euskalbarsin'
	    if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
		reuseOldtab(urlsin, zein);
		//Exekutatu euskalbarktrl.js fitxategian dauden skriptak
	        getKtrlSinonimoak(euskalbar_language, lang, searchStr);
	        getKtrlUZEI(euskalbar_language, lang, searchStr);
	    }
	    else{
		openNewtab(urlsin);
	        getKtrlSinonimoak(euskalbar_language, lang, searchStr);
	        getKtrlUZEI(euskalbar_language, lang, searchStr);
	    }

          }
	  // Shift tekla eta Ktrl tekla sakatuta ez badaude...
	  else{
	    if(prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
	      goEuskalBar(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.3000.onkey")) {
	      goEuskalBarAsk(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
	      goEuskalBarElhuyar(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.batua.onkey")) {
	      goEuskalBarEuskaltzaindia(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.itzul.onkey")) {
	      goEuskalBarItzuL(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.harluxet.onkey")) {
	      goEuskalBarHarluxet(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.mokoroa.onkey")) {
	      goEuskalBarMokoroa(euskalbar_language, lang, searchStr);
	    }
	    if(prefManager.getBoolPref("euskalbar.opentrad.onkey")) {
	      goEuskalBarOpentrad(euskalbar_language, lang, searchStr);
	    }
	  } 
	}
	//Testu kutxa berriro enfokatzeko... 
	document.getElementById('Euskalbar-search-string').focus();
    }



    function changeEuskalbarLang(){
	if (euskalbar_language=='es'){
		euskalbar_language='eu';
		euskalbar_image='eues.gif';
		euskalbar_tooltip='eu>es';
  	}else{
		euskalbar_language='es';
		euskalbar_image='eseu.gif';
		euskalbar_tooltip='es>eu';
	}

      var button = document.getElementById("euskalbar-language");
      button.setAttribute("image","chrome://euskalbar/skin/"+euskalbar_image);
      button.setAttribute("tooltiptext",euskalbar_tooltip);

    }

    //Euskaltermen bilaketak egiteko
    function goEuskalBarEuskalterm(source, target, term, sub) {
    strRes = document.getElementById('leuskal');
    const h = strRes.getString("hizk");
      if (h.match('euskara')) hiztegiarenhizkuntza='eu';
        else hiztegiarenhizkuntza='es';
      if (source=='es') idioma='G';
	else idioma='E';
      var url='http://www1.euskadi.net/euskalterm/cgibila7.exe?hizkun1='+idioma+'&hitz1='+escape(term)+'&gaiak='+sub+'&hizkuntza='+hiztegiarenhizkuntza;
      var zein='euskalterm'
      if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);
      }      
    }

    function goEuskalBarSelection(source, target, term) {
      var url='http://www.interneteuskadi.org/euskalbar/opentrad.php?testukutxa='+escape(term); 
      var zein='opentrad'
      if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

    function goEuskalBarAsk(source, target, term) {
      if (source=='es') {
	source='CAS'; idioma='Castellano';
      }else{
	source='EUS'; idioma='Euskera';
      }
	var url='http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe?Diccionario='+source+'&Idioma='+source+'&Txt_'+idioma+'='+escape(term);
	var zein='cgi-bin_m33'
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

    function goEuskalBarElhuyar(source, target, term) {
	// Hitzen arteko zuriuneen ordez beheko barrak idazten ditu, Elhuyarrentzako
	term = term.replace(/ /g, "_");
	var url='http://www.interneteuskadi.org/euskalbar/frames.php?term='+escape(term)+'&source='+source;
	var zein='interneteuskadi'
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

    function goEuskalBarElhuyar_(source, target, term) {
	if (source=='es') {
	var zein='hizt_el'
	var url = 'http://www1.euskadi.net/hizt_el/gazt_c.asp?Sarrera='+escape(term);
      	}else{
	var url = 'http://www1.euskadi.net/hizt_el/eusk_c.asp?Sarrera='+escape(term);
      	}

	var httpReq = new XMLHttpRequest();
        httpReq.parent = this;
        httpReq.open("GET", url);

	httpReq.onload = function(aEvent){
		try {
			accent = term.substring(term.length-1);
                        var texto = httpReq.responseText;

        		if ( texto.match(/ADODB.Recordset/) && (term.indexOf("  ")>0) ) 
				url = 'http://www1.euskadi.net/hizt_el/ezdago.asp?Hutsa=bai'
			else{
				goEuskalBarElhuyar(source, target, term);
			 }

			/*else if ( texto.match(/ADODB.Recordset/) && ((accent == 'á') || (accent == 'é') || (accent == 'í') || (accent == 'ó') || (accent == 'ú'))  ) {
				// si la palabra es aguda y terminada en vocal (plató, carné)
				// ElHuyar la trata así --> "plato  2"
				// La misma palabra sin acento (plato, carne) 
				// ElHuyar la trata así --> "plato  1"

			   	switch (accent) {
				case 'á' :
					term = term.substring(0,term.length-1) + 'a  2';
					break;
				case 'é' :
					term = term.substring(0,term.length-1) + 'e  2';
					break;
				case 'í' :
					term = term.substring(0,term.length-1) + 'i  2';
					break;
				case 'ó' :
					term = term.substring(0,term.length-1) + 'o  2';
					break;
				case 'ú' :
					term = term.substring(0,term.length-1) + 'u  2';
					break;
				}
				goEuskalBarElhuyar(source, target, term);
				return;

			} else if ( texto.match(/ADODB.Recordset/) && ((accent == 'a') || (accent == 'e') || (accent == 'i') || (accent == 'o') || (accent == 'u')) ) {
				goEuskalBarElhuyar(source, target, term + "  1");
				return;
			}
		
  			if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
				reuseOldtab(url, zein);
			}
			else{
				openNewtab(url);	
			}  */
			
		} 
		catch(err) {
			alert('Error');
		}
	}
      	try {
        	httpReq.setRequestHeader("User-Agent", "Euskalbar");
        	httpReq.overrideMimeType("application/xml");
        	httpReq.send(null);

        }
	catch(err) {
                httpReq.abort();
        }

    }

    function goEuskalBarItzuL(source, target, term) {
	var url = 'http://search.gmane.org/search.php?group=gmane.culture.language.basque.itzul&query='+encodeURI(term);
	var zein='gmane.culture.language.basque.itzul'
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

    function goEuskalBarHarluxet(source, target, term) {
	var url = 'http://www1.euskadi.net/harluxet/emaitza.asp?sarrera='+escape(term);
	var zein='harluxet'
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

    function goEuskalBarMokoroa(source, target, term) {
	var zein='mokoroa' 
     if (source=='es') {
	var url = 'http://www.hiru.com/hiztegiak/mokoroa/?gazt='+escape(term)+'&eusk=&nork=&kera=&bidali=Bilatu';
      }else{
	var url = 'http://www.hiru.com/hiztegiak/mokoroa/?gazt=&eusk='+escape(term)+'&nork=&kera=&bidali=Bilatu';
      }
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

     function goEuskalBarEuskaltzaindia(source, target, term) {
	var url = 'http://www.euskaltzaindia.net/hiztegibatua/bilatu.asp?sarrera='+escape(term)
	var zein='hiztegibatua'
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }

    function goEuskalBarOpentrad(source, target, term) {
	var url = 'http://www.opentrad.org/demo/libs/nabigatzailea.php?language=eu&inurl='+escape(window.content.document.location.href)+'&norantza=es-eu';
	var zein='opentrad'
	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }


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

	if(prefManager.getBoolPref("euskalbar.reusetabs.enabled")) {
	reuseOldtab(url, zein);
      }
      else{
	openNewtab(url);	
      }      
    }


    function selectionText ()
    {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection();
    }


