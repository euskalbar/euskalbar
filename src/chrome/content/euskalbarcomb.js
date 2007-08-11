// Developers:
// Asier Sarasua Garmendia 2006
// Julen Ruiz Aizpuru 2007
// This is Free Software (GPL License)
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com

    // Hobespenak eskuratzeko interfazea
    const prefManagerShift	= Components.classes["@mozilla.org/preferences-service;1"]
                                .getService(Components.interfaces.nsIPrefBranch);
	

    // Euskalterm kargatu
    function getShiftEuskalterm(source, term) {
      var txtEuskalterm= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (euskalbar_source == 'es') {
        idioma = 'G';
      } else if (euskalbar_source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
      }

      var urlEuskalterm = 'http://www1.euskadi.net/euskalterm/cgibila7.exe?hizkun1='+idioma+'&hitz1='+escape(term)+'&gaiak=0&hizkuntza='+source;
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskalterm = strRes.getString("m1Euskalterm");
        return false;
      }

      xmlHttpReq.open('GET', urlEuskalterm, true);
      xmlHttpReq.send(null);
	  
      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
	    xmlHttpReq.abort();
        txtEuskalterm = strRes.getString("m1Euskalterm");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtEuskalterm = xmlHttpReq.responseText;
              txtEuskalterm = txtEuskalterm.replace(/<HTML>/, " ");
              txtEuskalterm = txtEuskalterm.replace(/<HEAD><TITLE>Fitxak<\/TITLE><\/HEAD>/, " ");
              txtEuskalterm = txtEuskalterm.replace(/<BODY  bgcolor=lavender leftmargin="10">/, "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">"+term+"<font></strong>");
              txtEuskalterm = txtEuskalterm.replace(/<\/body><\/html>/, " ");
              txtEuskalterm = txtEuskalterm.replace(/steelblue/g, "black");
              txtEuskalterm = txtEuskalterm.replace(/Verdana/g, "\"bitstream vera sans, verdana, arial\"");
            } else {
              txtEuskalterm = strRes.getString("m1Euskalterm");
            }
          }
        } catch(e) {
          txtEuskalterm = strRes.getString("m1Euskalterm");
        }
      getBrowser().contentDocument.getElementById('aEuskalterm').innerHTML = txtEuskalterm;
      }
    }

    //Elhuyarren katea manipulatzen duen funtzioa
    function manipulateElhuyar(txtElhuyar){
      var txtElhuyartable1array = txtElhuyar.split("<table");
      txtElhuyar = txtElhuyartable1array[1].substring(txtElhuyartable1array[1].lenght - 1);
      txtElhuyar = '<table'+txtElhuyar;
      var txtElhuyartr1array = txtElhuyar.split("<tr");
      txtElhuyar = txtElhuyartr1array[2].substring(txtElhuyartr1array[2].lenght - 1);
      txtElhuyar = '<p><tr'+txtElhuyar;
      txtElhuyar = txtElhuyar.replace(/<\/table>/, " ");
      txtElhuyar = txtElhuyar.replace(/009999/g, "  ");
      txtElhuyar = txtElhuyar.replace(/FFFFFF/g, "000000");
      txtElhuyar = txtElhuyar.replace(/003399/g, "000000");
      txtElhuyar = txtElhuyar.replace(/Arial, Helvetica, sans-serif/g, "bitstream vera sans, verdana, arial");
      txtElhuyar = txtElhuyar.replace(/Times New Roman, Times, serif/g, "bitstream vera sans, verdana, arial");
      txtElhuyar = txtElhuyar.replace(/azpisarrera/g, "http://www1.euskadi.net/hizt_el/azpisarrera");
      //azentuen arazoa konpontzeko azpisarreretan
      var txtElhuyar2array = txtElhuyar.split("href");
      var finalElhuyar = txtElhuyar2array[0];
      for (i in txtElhuyar2array){
        if (i>0){
          var txtElhuyar3array = txtElhuyar2array[i].split("target");
          //funtzio honek azentuen arazoa konpontzen du azpisarreretan, hurrengo datorren funtzioa da
          var subElhuyar = correctAccents(txtElhuyar3array[0]);
          finalElhuyar = finalElhuyar+"href"+subElhuyar+"target"+txtElhuyar3array[1];
        }
      }
      return finalElhuyar;
    }
	
    function correctAccents(katea){
      katea = katea.replace(/\u00E1/g, "%E1");
      katea = katea.replace(/\u00E9/g, "%E9");
      katea = katea.replace(/\u00ED/g, "%ED");
      katea = katea.replace(/\u00F3/g, "%F3");
      katea = katea.replace(/\u00FA/g, "%FA");
      katea = katea.replace(/\u00F1/g, "%F1"); //ñ letra
      katea = katea.replace(/\u00FC/g, "%FC"); //dieresia
      katea = katea.replace(/\u00C1/g, "%C1");
      katea = katea.replace(/\u00C9/g, "%C9");
      katea = katea.replace(/\u00CD/g, "%CD");
      katea = katea.replace(/\u00D3/g, "%D3");
      katea = katea.replace(/\u00DA/g, "%DA");
      katea = katea.replace(/\u00D1/g, "%D1"); //ñ letra maiuskula
      katea = katea.replace(/\u00DC/g, "%DC"); //dieresi maiuskula
      return katea;
    }
	
    // Elhuyar kargatu
    function getShiftElhuyar(source, term){
      var txtElhuyar= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
    
      //Azentu markak, eñeak eta dieresiak aldatu
      term = encodeURI(term);
      term = term.replace(/\%20/g, "_");
      term = term.replace(/\%C3\%A1/g, "a");
      term = term.replace(/\%C3\%A9/g, "e");
      term = term.replace(/\%C3\%AD/g, "i");
      term = term.replace(/\%C3\%B3/g, "o");
      term = term.replace(/\%C3\%BA/g, "u");
      term = term.replace(/\%C3\%B1/g, "nzz");
      term = term.replace(/\%C3\%BC/g, "u");
      term = term.replace(/\%C3\%81/g, "A");
      term = term.replace(/\%C3\%89/g, "E");
      term = term.replace(/\%C3\%8D/g, "I");
      term = term.replace(/\%C3\%93/g, "O");
      term = term.replace(/\%C3\%9A/g, "U");
      term = term.replace(/\%C3\%91/g, "NZZ");
      term = term.replace(/\%C3\%9C/g, "U");
    
      if (source == 'es') {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/gazt.asp?Sarrera='+term;
      } else {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/eusk.asp?Sarrera='+term;
      }
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtElhuyar = strRes.getString("m1Elhuyar");
        return false;
      }
      xmlHttpReq.open('GET', urlElhuyar, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtElhuyar = strRes.getString("m1Elhuyar");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtElhuyar = xmlHttpReq.responseText;
              //Elhuyarren katea manipulatzen duen funtzioari deitu
              txtElhuyar = manipulateElhuyar(txtElhuyar);
            } else {
              //Hitza aurkitzen ez bada, beste funtzio hau exekutatu
              getShiftElhuyarAlt1(source, term);
            }
          }
        } catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
        getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = txtElhuyar;
      }
    }


    // Elhuyar kargatu hitzak sarrera bat baino gehiago duenean (adib: "cola" hitza): lehen sarrera
    function getShiftElhuyarAlt1(source, term){
      var txtElhuyar = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (source == 'es') {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/gazt.asp?Sarrera='+term+'%20%201';
      } else {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/eusk.asp?Sarrera='+term+'%20%201';
      }
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtElhuyar = strRes.getString("m1Elhuyar");
        return false;
      }
      xmlHttpReq.open('GET', urlElhuyar, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtElhuyar = strRes.getString("m1Elhuyar");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
          	  //Timerra garbitu
          	  clearTimeout(requestTimer);
              txtElhuyar = xmlHttpReq.responseText;
			  //Elhuyarren katea manipulatzen duen funtzioari deitu
			  txtElhuyar = manipulateElhuyar(txtElhuyar);
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = txtElhuyar;
    	  getShiftElhuyarAlt2(source, term);
            }
          } else {
            if (source=='es') {
              txtElhuyar = 'No se ha encontrado la palabra '+term+'.';
            } else {
              txtElhuyar = 'Ez da aurkitu '+term+' hitza.';
            }
          getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = txtElhuyar;
          }
        } catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
      }
    }


    // Elhuyar kargatu hitzak sarrera bat baino gehiago duenean (adib: "cola" hitza): bigarren sarrera
    function getShiftElhuyarAlt2(source, term){
      var txtElhuyar = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (source == 'es') {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/gazt.asp?Sarrera='+term+'%20%202';
      } else {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/eusk.asp?Sarrera='+term+'%20%202';
      }
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtElhuyar = strRes.getString("m1Elhuyar");
        return false;
      }
      xmlHttpReq.open('GET', urlElhuyar, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000

      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtElhuyar = strRes.getString("m1Elhuyar");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtElhuyar = xmlHttpReq.responseText;
			  //Elhuyarren katea manipulatzen duen funtzioari deitu
			  txtElhuyar = manipulateElhuyar(txtElhuyar);
    	  //Lehen sarrerari bigarren sarrera erantsi
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = getBrowser().contentDocument.getElementById('aElhuyar').innerHTML+txtElhuyar;
    	  getShiftElhuyarAlt3(source, term);
            }
          }
        }
        catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
      }
    }


    //Elhuyar kargatu hitzak sarrera bat baino gehiago duenean (adib: "cola" hitza): hirugarren sarrera
    function getShiftElhuyarAlt3(source, term) {
      var txtElhuyar = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (source == 'es') {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/gazt.asp?Sarrera='+term+'%20%203';
      } else {
        var urlElhuyar = 'http://www1.euskadi.net/hizt_el/eusk.asp?Sarrera='+term+'%20%203';
      }
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtElhuyar = strRes.getString("m1Elhuyar");
        return false;
      }
      xmlHttpReq.open('GET', urlElhuyar, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtElhuyar = strRes.getString("m1Elhuyar");
      }, tout);
      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
    	  //Timerra garbitu
    	  clearTimeout(requestTimer);
              txtElhuyar = xmlHttpReq.responseText;
			  //Elhuyarren katea manipulatzen duen funtzioari deitu
			  txtElhuyar = manipulateElhuyar(txtElhuyar);
              //Lehen bi sarrerei hirugarren sarrera erantsi
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = getBrowser().contentDocument.getElementById('aElhuyar').innerHTML+txtElhuyar;
            }
          }
        } catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
      }
    }



    // 3000 kargatu
    function getShift3000(source, term){
      var txt3000 = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
    
      if (source == 'es') {
        source = 'CAS'; idioma = 'Castellano';
      } else{
        source = 'EUS'; idioma = 'Euskera';
      }
    
      var url3000='http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe?Diccionario='+source+'&Idioma='+source+'&Txt_'+idioma+'='+escape(term);
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txt3000 = strRes.getString("m13000");
        return false;
      }
    
      xmlHttpReq.open('GET', url3000, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txt3000 = strRes.getString("m13000");
      }, tout);
    
      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
    	//Timerra garbitu
    	clearTimeout(requestTimer);
            if (xmlHttpReq.status == 200) {
              txt3000 = xmlHttpReq.responseText;
              var wtable = 3;
              if (txt3000.match("No se ha encontrado")) {
                wtable = 2;
                txt3000 = "No se ha encontrado la palabra "+term+".";
              } else if (txt3000.match("ez da aurkitu")) {
                wtable = 2;
                txt3000 = term +" hitza ez da aurkitu.";
              } else {
                var txt3000table1array = txt3000.split("<TABLE");
                txt3000 = txt3000table1array[wtable].substring(txt3000table1array[wtable].lenght - 1);
                var txt3000table2array = txt3000.split("<\/TABLE>");;
                txt3000 = txt3000table2array[0].substring(txt3000table2array[0].lenght - 1);
                txt3000 = '<TABLE'+txt3000+'<\/TABLE>';
                txt3000 = txt3000.replace(/FFFFCC/g, " ");
                txt3000 = txt3000.replace(/font-size: 20pt/, "font-size: 12pt");
                txt3000 = txt3000.replace(/0000A0/g, "000000");
                txt3000 = txt3000.replace(/center/g, "left");
		txt3000 = txt3000.replace(/\/cgi-bin_m33/g, "http://www1.euskadi.net/cgi-bin_m33");
              }
            } else {
               txt3000 = strRes.getString("m13000");
            }
          }
        } catch(e) {
          txt3000 = strRes.getString("m13000");
        }
        getBrowser().contentDocument.getElementById('a3000').innerHTML = txt3000;
      }
    }


    // Morris hiztegia kargatu
    function getShiftMorris(source, term) {
      var txtMorris = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');

      if (source == 'en') {
        hizk = 'txtIngles';
      } else {
        hizk = 'txtEuskera';
      }
      // POST bidez pasatzeko parametroak
      var parametroak = hizk+'='+escape(term);
      var urlMorris = 'http://www1.euskadi.net/morris/resultado.asp';
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtMorris = strRes.getString("m1Morris");
        return false;
      }
      xmlHttpReq.open('POST', urlMorris, true);
      // Beharrezkoa web zerbitzariak jakin dezan zer bidaltzen dugun 
      xmlHttpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      xmlHttpReq.setRequestHeader("Content-length", parametroak.length);
      xmlHttpReq.send(parametroak);
	  
      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000

      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtMorris = strRes.getString("m1Morris");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          div = getBrowser().contentDocument.getElementById('aMorris');
          if (xmlHttpReq.readyState == 4) {
            // Timerra garbitu
            clearTimeout(requestTimer);
            if (xmlHttpReq.status == 200) {
              txtMorris = xmlHttpReq.responseText;
              if (txtMorris.match("Barkatu, baina sarrera hau ez dago hiztegian")) {
                txtMorris = "Ez da aurkitu "+term+" hitza.";
              } else {
                var txtMorrisTable1 = txtMorris.split("<hr>");
                txtMorris = txtMorrisTable1[1].slice(0, txtMorrisTable1[1].lastIndexOf("<table"));
                txtMorris = txtMorris.replace(/images/g, "http://www1.euskadi.net/morris/images");
                txtMorris = txtMorris.replace(/datuak/g, "http://www1.euskadi.net/morris/datuak");
                txtMorris = txtMorris.replace(/font-size: 8pt/g, "font-size: 10pt");
                txtMorris = txtMorris.replace(/font-size:11ptl/g, "font-size: 12pt<br>");
                txtMorris = txtMorris.replace(/color:green/g, "color: #000000");
                txtMorris = txtMorris.replace(/Arial, Helvetica, sans-serif/g, "bitstream vera sans, verdana, arial");
                txtMorris = txtMorris.replace(/width="550"/g, "");
                txtMorris = txtMorris.replace(/width="150"/g, "");
              }
            } else {
              txtMorris = strRes.getString("m1Morris");
            }
          }
        } catch(e) {
          txtMorris = strRes.getString("m1Morris");
        }
        getBrowser().contentDocument.getElementById('aMorris').innerHTML = txtMorris;
      }
    
    }


    // Adorez sinonimoen hiztegia kargatu
    function getKtrlAdorez(source, term) {
      var txtSinonimoak= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (source == 'eu') {
        var urlSinonimoak = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe?Palabra=Introducida&Idioma=EUS&txtpalabra='+escape(term);
      } else {
        var urlSinonimoak = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe?Palabra=Introducida&Idioma=CAS&txtpalabra='+escape(term);
      }
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtSinonimoak = strRes.getString("m1Sinonimoak");
        return false;
      }
      xmlHttpReq.open('GET', urlSinonimoak, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtSinonimoak = strRes.getString("m1Sinonimoak");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
          	//Timerra garbitu
          	clearTimeout(requestTimer);
            if (xmlHttpReq.status == 200) {
              txtSinonimoak = xmlHttpReq.responseText;
              if (txtSinonimoak.match("No se ha encontrado")) {
                txtSinonimoak = "No se ha encontrado la palabra "+term+".";
              } else if (txtSinonimoak.match("ez da aurkitu")){
                txtSinonimoak = term +" hitza ez da aurkitu.";
              } else {
                txtSinonimoaktable1array = txtSinonimoak.split("<TABLE");
                txtSinonimoak = txtSinonimoaktable1array[6].substring(txtSinonimoaktable1array[1].lenght - 1);
                txtSinonimoak = '<table'+txtSinonimoak;
                txtSinonimoak = txtSinonimoak.replace(/RIGHT/g, "LEFT");
                txtSinonimoak = txtSinonimoak.replace(/CA0000/g, "000000");
                txtSinonimoak = txtSinonimoak.replace(/<B>/g, " ");
                txtSinonimoak = txtSinonimoak.replace(/<\/B>/g, " ");
                txtSinonimoak = txtSinonimoak.replace(/EAEBFB/g, "");
                txtSinonimoak = txtSinonimoak.replace(/<I>/g, " ");
                txtSinonimoak = txtSinonimoak.replace(/<\/I>/g, " ");
                txtSinonimoak = txtSinonimoak.replace(/<CLASS=\'2\'>/g, " ");
                txtSinonimoak = txtSinonimoak.replace(/WIDTH=\'268\'/, " ");
                txtSinonimoak = '<font face="bitstream vera sans, verdana, arial" size="3"><B>'+term+'</B></font><BR><BR><font face="bitstream vera sans, verdana, arial">'+txtSinonimoak+'</font>';
              }
            } else {
              txtSinonimoak = strRes.getString("m1Sinonimoak");
            }
          }
        } catch(e) {
          txtSinonimoak = strRes.getString("m1Sinonimoak");
        }
        getBrowser().contentDocument.getElementById('aAdorez').innerHTML = txtSinonimoak;
      }
    }


    //UZEIren sinonimoen hiztegia kargatu
    function getKtrlUZEI(source, term){
      var txtUZEI= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      var urlUZEI = 'http://www.uzei.com/estatico/sinonimos.asp?sarrera='+escape(term)+'&eragiketa=bilatu';
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtUZEI = strRes.getString("m1UZEI");
        return false;
      }
      xmlHttpReq.open('GET', urlUZEI, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManager.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtUZEI = strRes.getString("m1UZEI");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            //Timerra garbitu
            clearTimeout(requestTimer);
            if (xmlHttpReq.status == 200) {
              txtUZEI =xmlHttpReq.responseText;
              txtUZEItable1array = txtUZEI.split("<TABLE");
              txtUZEI = txtUZEItable1array[2].substring(txtUZEItable1array[1].lenght - 1);
              txtUZEI = '<table'+txtUZEI;
              txtUZEItable2array = txtUZEI.split("</table");
              txtUZEI = txtUZEItable2array[0].substring(txtUZEItable2array[1].lenght - 1);
              txtUZEI = txtUZEI+'</table>';
              txtUZEI = txtUZEI.replace(/sinonimos.asp/g, "http://www.uzei.com/estatico/sinonimos.asp");
              txtUZEI = '<font face="bitstream vera sans, verdana, arial" size="3"><B>'+term+'</B></font><font face="bitstream vera sans, verdana, arial">'+txtUZEI+'</font>';
            } else {
              txtUZEI = strRes.getString("m1UZEI");
            }
          }
        } catch(e) {
          txtUZEI = strRes.getString("m1UZEI");
        }
        getBrowser().contentDocument.getElementById('aUZEI').innerHTML = txtUZEI;
      }
    }


    // Hiztegi Batua kargatu
    function getShiftEuskaltzaindia(source, term) {
      var txtEuskaltzaindia= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (euskalbar_source == 'es') {
        idioma = 'G';
      } else if (euskalbar_source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
      }

      var urlEuskaltzaindia = 'http://www.euskaltzaindia.net/hiztegibatua/bilatu.asp?sarrera='+escape(term);
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = strRes.getString("m1Batua");
        return false;
      }

      xmlHttpReq.open('GET', urlEuskaltzaindia, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
	xmlHttpReq.abort();
        txtEuskaltzaindia = strRes.getString("m1Batua");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtEuskaltzaindia = xmlHttpReq.responseText;
              var txtEuskaltzaindiaTable1 = txtEuskaltzaindia.split("burua3\"");
              txtEuskaltzaindia = txtEuskaltzaindiaTable1[1].slice(0, txtEuskaltzaindiaTable1[1].lastIndexOf("#9A8C07"));
              txtEuskaltzaindia = "<td "+txtEuskaltzaindia;
              txtEuskaltzaindia = txtEuskaltzaindia.replace(/bilatu.asp/g, "http://www.euskaltzaindia.net/hiztegibatua/bilatu.asp");
            } else {
              txtEuskaltzaindia = strRes.getString("m1Batua");
            }
          }
        } catch(e) {
          txtEuskaltzaindia = strRes.getString("m1Batua");
        }
        getBrowser().contentDocument.getElementById('aBatua').innerHTML = txtEuskaltzaindia;
      }
    }



    // Mokoroa kargatu
    function getMokoroa(source, term) {
      var txtMokoroa = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (source == 'es') {
        var urlMokoroa = 'http://www.hiru.com/hiztegiak/mokoroa/?gazt='+escape(term)+'&eusk=&nork=&kera=&bidali=Bilatu';
      } else {
        var urlMokoroa = 'http://www.hiru.com/hiztegiak/mokoroa/?gazt=&eusk='+escape(term)+'&nork=&kera=&bidali=Bilatu';
      }

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtMokoroa = strRes.getString("m1Mokoroa");
        return false;
      }

      xmlHttpReq.open('GET', urlMokoroa, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
	xmlHttpReq.abort();
        txtMokoroa = strRes.getString("m1Mokoroa");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtMokoroa = xmlHttpReq.responseText;
              var txtMokoroa2 = txtMokoroa.split("<h2>")[2];
              txtMokoroa = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">"+term+"</font></strong>"+"<h2>"+txtMokoroa2;
              var txtMokoroa3 = txtMokoroa.split("<\/div>")[0];
              txtMokoroa = txtMokoroa3.replace(/<p>/g, "<p><br>");
            } else {
              txtMokoroa = strRes.getString("m1Mokoroa");
            }
          }
        } catch(e) {
          txtMokoroa = strRes.getString("m1Mokoroa");
        }
        getBrowser().contentDocument.getElementById('aMokoroa').innerHTML = txtMokoroa;
      }
    }


    // Intza kargatu
    function getIntza(source, term) {
      var txtIntza = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (source == 'es') {
        var urlIntza = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?hitza1='+escape(term)+'&eremu3=1&eremu1=eeki';
      } else {
        var urlIntza = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?eremu1=giltzarriak&hitza1='+escape(term)+'&eremu3=1';
      }

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtIntza = strRes.getString("m1Intza");
        return false;
      }

      xmlHttpReq.open('GET', urlIntza, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
	xmlHttpReq.abort();
        txtIntza = strRes.getString("m1Intza");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtIntza = xmlHttpReq.responseText;
              var txtIntza2 = txtIntza.split("Bilaketaren emaitza")[2];
              txtIntza = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">"+term+"</font></strong>"+txtIntza2;
              var txtIntza3 = txtIntza.split("<form")[0];
              txtIntza = txtIntza3.replace(/<font size=5>/g, "<font size=\"3\">");
              txtIntza = txtIntza.replace(/\/cgi-bin/g, "http:\/\/intza.armiarma.com\/cgi-bin");
              txtIntza = txtIntza.replace(/\/intza\/kon/g, "http:\/\/intza.armiarma.com\/intza\/kon");
            } else {
              txtIntza = strRes.getString("m1Intza");
            }
          }
        } catch(e) {
          txtIntza = strRes.getString("m1Intza");
        }
        getBrowser().contentDocument.getElementById('aIntza').innerHTML = txtIntza;
      }
    }
