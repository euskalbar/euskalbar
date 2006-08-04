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
        		found = true;
      		}
      	index++;
    	}
  	if (!found) {
    		var  theTab = getBrowser().addTab(taburl);
    		getBrowser().selectedTab = theTab; 
    	}
    }

    // Enter tekla sakatzean irekitzen diren hiztegiak
    function goEuskalBarOnKey(event){
  	if(event.keyCode != 13) {
      		return
	}else{
		if(prefManager.getBoolPref("euskalbar.euskalterm.onkey")) {
			goEuskalBar(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.3000.onkey")) {
			goEuskalBarAsk(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.elhuyar.onkey")) {
			goEuskalBarElhuyar(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.batua.onkey")) {
			goEuskalBarEuskaltzaindia(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.itzul.onkey")) {
			goEuskalBarItzuL(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.harluxet.onkey")) {
			goEuskalBarHarluxet(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.mokoroa.onkey")) {
			goEuskalBarMokoroa(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
		if(prefManager.getBoolPref("euskalbar.opentrad.onkey")) {
			goEuskalBarOpentrad(euskalbar_language, document.getElementById('euskalbar-language').value, document.getElementById('EuskalBar-search-string').value);
		}
	}
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

    function goEuskalBar(source, target, term) {
	if (source=='es') idioma='G';
		else idioma='E';
      var url='http://www1.euskadi.net/euskalterm/cgibila7.exe?hizkun1='+idioma+'&hitz1='+escape(term)+'&gaiak=0&hizkuntza='+source;
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
	var url = 'http://search.gmane.org/?query='+encodeURI(term)+'&email=&group=gmane.culture.language.basque.itzul&sort=relevance&DEFAULTOP=and&xFILTERS=Gculture.language.basque.itzul---A'
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
	var url = 'http://www.opentrad.org/demo/libs/nabigatzailea.php?language=eu&inurl='+escape(window.content.document.location.href)+'&norantza=es-eu'
	var zein='opentrad'
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


