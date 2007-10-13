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
      var txtEuskalterm = strRes.getString("m1Euskalterm");;
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

	
    // Elhuyarren markoa kargatu
    function getShiftElhuyar(source, term){
      var txtElhuyar= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
    
      //Azentu markak, eñeak eta dieresiak aldatu
      term = escape(term); //honekin eñeak eta dieresiak konpontzen dira
      //term = term.replace(/\%20/g, "_");
      term = term.replace(/\%E1/g, "a");
      term = term.replace(/\%E9/g, "e");
      term = term.replace(/\%ED/g, "i");
      term = term.replace(/\%F3/g, "o");
      term = term.replace(/\%FA/g, "u");
      term = term.replace(/\%C1/g, "A");
      term = term.replace(/\%C9/g, "E");
      term = term.replace(/\%CD/g, "I");
      term = term.replace(/\%D3/g, "O");
      term = term.replace(/\%DA/g, "U");

      (source == 'es') ? source = 'gazt' : source = 'eusk';

      var urlElhuyar =  'http://www.euskara.euskadi.net/r59-15172x/eu/hizt_el/index.asp';
      var params = 'aplik_hizkuntza_ezkutua=null&optHizkuntza='+source+'&txtHitza='+term+'&bot_bilatu=%3E&edozer=ehunekoa';

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtElhuyar = strRes.getString("m1Elhuyar");
        return false;
      }
      xmlHttpReq.open('POST', urlElhuyar, true);
      xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=iso-8859-1");
      xmlHttpReq.send(params);

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
              //Elhuyarren katea manipulatu eta zerrendako hitz bakoitzaren parametroak erauzten dituen kodea
              var txtElhuyar1 = txtElhuyar.split("bistaratutestuinguruak")[1];
              var arrayElhuyar = txtElhuyar1.split("value=\"");
              arrayElhuyar.shift();
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML ="";
              // Hitza existitzen ez bada...
              if (txtElhuyar1.indexOf("hutsa") != -1){
                if (source=='es') {
                  txtElhuyar = 'No se ha encontrado la palabra '+term+'.';
                } else {
                  txtElhuyar = 'Ez da aurkitu '+term+' hitza.';
                }
                getBrowser().contentDocument.getElementById('aElhuyar').innerHTML=txtElhuyar;
              }
              for (i in arrayElhuyar){
                var params = arrayElhuyar[i].split("\"")[0];
                params = params.replace(/amp\;/g, "");
                if (params.indexOf("azpisarrera") == -1||txtElhuyar.indexOf("mota=sarrera") == -1){
                  getsubShiftElhuyar(params);
                }else{
                  if (prefManagerShift.getBoolPref("euskalbar.query.subqueries")){
                    getsubShiftElhuyar(params);
                  }
                }
              }
            } else {
              txtElhuyar = strRes.getString("m1Elhuyar");
            }
          }
        } catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
      }
    }

    // Elhuyarren sarrerak eta azpisarrerak kargatu
    function getsubShiftElhuyar(params){
      strRes = document.getElementById('leuskal');
      var urlElhuyar ="http://www.euskara.euskadi.net/r59-15172x/eu/hizt_el/emaitza.asp?"+params;

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtElhuyar = strRes.getString("m1Elhuyar");
        return false;
      }
      xmlHttpReq.open('GET', urlElhuyar, true);
      xmlHttpReq.setRequestHeader('Content-Type', 'charset=ISO-8859-1');
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
              //Emaitza HTMLan kargatu
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = getBrowser().contentDocument.getElementById('aElhuyar').innerHTML+txtElhuyar;
            }
          }
        } catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
      }
    }


    //Elhuyarren katea manipulatzen duen funtzioa
    function manipulateElhuyar(txtElhuyar){
      var txtElhuyar1 = txtElhuyar.split("Emaitza:")[1];
      txtElhuyar = txtElhuyar1.split("<!")[0];
      txtElhuyar = txtElhuyar.replace(/<h1>/, "<font face=\"bitstream vera sans, verdana, arial\" size=\"3\"><B>");
      txtElhuyar = txtElhuyar.replace(/<\/h1>/, "<\/B><\/font>");
      txtElhuyar = txtElhuyar.replace(/\"#\" onClick=\"bistaratutestuinguruak\(\'/g,"http://www.euskara.euskadi.net/r59-15172x/eu/hizt_el/emaitza.asp?");
      txtElhuyar = txtElhuyar.replace(/\'\)\;\"/g,"");
      txtElhuyar = txtElhuyar.replace(/\'\)\"/g,"");
      txtElhuyar = txtElhuyar.replace(/amp\;/g,'');
      txtElhuyar = txtElhuyar + "<hr size='1'>";
      return txtElhuyar;
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
                //3000ren katea manipulatzen duen funtzioa
                txt3000 = manipulate3000(wtable, txt3000);
                getBrowser().contentDocument.getElementById('a3000').innerHTML = txt3000;
                //azpisarrerak badauzka...
                if (txt3000.indexOf("cgi-bin_m33") != -1){
                  if (prefManagerShift.getBoolPref("euskalbar.query.subqueries")){
                    array3000 = txt3000.split("Href=\'");
                    array3000.shift();
                    for (i in array3000){
                      var url3000 = array3000[i].split("\'>")[0];
                      getsubShift3000(url3000);
                    }
                  }
                }
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

    // 3000ren sarrerak eta azpisarrerak kargatu
    function getsubShift3000(url3000){
      var txt3000="";
      strRes = document.getElementById('leuskal');
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
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txt3000 = xmlHttpReq.responseText;
              //Elhuyarren katea manipulatzen duen funtzioari deitu
              txt3000 = manipulate3000(3, txt3000);
              //Emaitza HTMLan kargatu
              getBrowser().contentDocument.getElementById('a3000').innerHTML = getBrowser().contentDocument.getElementById('a3000').innerHTML+txt3000;
            }
          }
        } catch(e) {
          txt3000 = strRes.getString("m13000");
        }
      }
    }

    //3000ren katea manipulatzen duen funtzioa
    function manipulate3000(wtable, txt3000){
      var txt3000table1array = txt3000.split("<TABLE");
      txt3000 = txt3000table1array[wtable].substring(txt3000table1array[wtable].lenght - 1);
      var txt3000table2array = txt3000.split("<\/TABLE>");;
      txt3000 = txt3000table2array[0].substring(txt3000table2array[0].lenght - 1);
      txt3000 = '<TABLE'+txt3000+'<\/TABLE>';
      txt3000 = txt3000.replace(/<blockquote>/g, "");
      txt3000 = txt3000.replace(/<\/blockquote>/g, "");
      txt3000 = txt3000.replace(/FFFFCC/g, " ");
      txt3000 = txt3000.replace(/font-size: 20pt/, "font-size: 12pt");
      txt3000 = txt3000.replace(/0000A0/g, "000000");
      txt3000 = txt3000.replace(/center/g, "left");
      txt3000 = txt3000.replace(/\/cgi-bin_m33/g, "http://www1.euskadi.net/cgi-bin_m33");
      txt3000 = txt3000 + "<hr size='1'>";
      return txt3000;
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
                txtSinonimoak = txtSinonimoak.replace(/table/, "td");
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
