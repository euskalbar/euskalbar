// Developers:
// Asier Sarasua Garmendia 2006
// Julen Ruiz Aizpuru 2007
// This is Free Software (GPL License)
// asarasua@vitoria-gasteiz.org
// julenx@gmail.com

// Hobespenak eskuratzeko interfazea
const prefManagerShift	= Components.classes["@mozilla.org/preferences-service;1"]
                                    .getService(Components.interfaces.nsIPrefBranch);

var euskalbarcomb = {

    // Euskalterm kargatu
    getShiftEuskalterm: function(source, term) {
      var txtEuskalterm = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (euskalbar.euskalbar_source == 'es') {
        idioma = 'G';
      } else if (euskalbar.euskalbar_source == 'en') {
        idioma = 'I';
      } else if (euskalbar.euskalbar_source == 'fr') {
        idioma = 'F';
      } else {
        idioma = 'E';
      }
      //Hitz zatiak erabiltzen direnean, * komodina erabiliko bailitzan egin ditzala bilaketak
      if (term.charAt(term.length - 1) != "*"){
        term = term+"*";
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
              txtEuskalterm = txtEuskalterm.replace(/<BODY  bgcolor=lavender leftmargin="10">/, "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">"+term.replace(/\*/, "")+"<font></strong>");
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
    },

    // Elhuyarren markoa kargatu
    getShiftElhuyar: function(source, dest, term) {
      var txtElhuyar= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
        var elhuyarerroremezua='Ez dago horrelako sarrerarik';
        var erroremezua = 'Ez da aurkitu '+term+' hitza.';
        var erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
        var azpisarreraktestua='Azpisarrerak';
      } else if (h.match('english')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
        var elhuyarerroremezua='No match found';
        var erroremezua = 'Word '+term+' not found.';
        var erroremezua2 = 'Word not found, choose from list';
        var azpisarreraktestua='Azpisarrerak';
      } else if (h.match('français')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
        var elhuyarerroremezua='Aucun r&eacute;sultat pour votre entr&eacute;e';
        var erroremezua = 'Pas de résultats pour le mot '+term+'.';
        var erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
        var azpisarreraktestua='Azpisarrerak';
      } else {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
        var elhuyarerroremezua='No se han encontrado resultados para la b&uacute;squeda';
        var erroremezua = 'No se ha encontrado la palabra '+term+'.';
        var erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
        var azpisarreraktestua='Azpisarrerak';
      }

      //Azentu markak, eñeak eta dieresiak aldatu
      var jatorrizkoa=term;
      term = encodeURI(term); //honekin eñeak eta dieresiak konpontzen dira

      switch (source) {
        case 'es':
          var source2 = 'gazt';
        break;
        case 'fr':
          var source2 = 'fran';
        break;
        case 'en':
          var source2 = 'ing';
        break;
        case 'eu':
          var source2 = 'eusk';
        break;
      }
      switch (dest) {
        case 'es':
          var chkHizkuntza = 'chkHizkuntzaG';
          var dest2 = 'gazt';
        break;
        case 'fr':
          var chkHizkuntza = 'chkHizkuntzaF';
          var dest2 = 'fran';
        break;
        case 'en':
          var chkHizkuntza = 'chkHizkuntzaI';
          var dest2 = 'ing';
        break;
        case 'eu':
          var chkHizkuntza = '';
          var dest2 = '';
        break;
      }

      var params = 'txtHitza='+term+'&nondik='+source2+'&edozer=ehunekoa&bot_kon=%3E';
      if (chkHizkuntza!='') {
	      params=params+'&'+chkHizkuntza+'='+dest2;
      }

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
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML ="";
              // Hitza existitzen ez bada...
              if (txtElhuyar.indexOf(elhuyarerroremezua) != -1){
                txtElhuyar = erroremezua;
                getBrowser().contentDocument.getElementById('aElhuyar').innerHTML=txtElhuyar;
              }
	      else {
                var txtElhuyar1 = txtElhuyar.split("div id=\"zerrenda\"")[1];
                var arrayElhuyar = txtElhuyar1.split("a href=\"?");
                arrayElhuyar.shift();
                badago=0;
                for (i in arrayElhuyar){
                  var estekakohitza = arrayElhuyar[i].split(">")[1];
                  estekakohitza = estekakohitza.split("<")[0];
                  estekakohitza2 = euskalbarcomb.normalizatuetaminuskularatu(estekakohitza);
                  jatorrizkoa2 = euskalbarcomb.normalizatuetaminuskularatu(jatorrizkoa);
                  var params = arrayElhuyar[i].split("\"")[0];
                  params = params.replace(/amp\;/g, "");
                  if (estekakohitza2==jatorrizkoa2 || estekakohitza2=='1 '+jatorrizkoa2 || estekakohitza2=='2 '+jatorrizkoa2 || estekakohitza2=='3 '+jatorrizkoa2 || estekakohitza2=='4 '+jatorrizkoa2 || estekakohitza2=='5 '+jatorrizkoa2 || estekakohitza2=='6 '+jatorrizkoa2 || estekakohitza2=='7 '+jatorrizkoa2 || estekakohitza2=='8 '+jatorrizkoa2 || estekakohitza2=='9 '+jatorrizkoa2 || estekakohitza2=='10 '+jatorrizkoa2) {
		    badago=1;
                    euskalbarcomb.getsubShiftElhuyar(params,1);
                  }
		}
		if (badago==0) {
                  getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = getBrowser().contentDocument.getElementById('aElhuyar').innerHTML+'<p><strong><font face="bitstream vera sans, verdana, arial" size="3">'+decodeURI(term)+'<font></strong></p><p></p><p><font color="black" face="bitstream vera sans, verdana, arial" size="-1">'+erroremezua2+'</font></p><p></p>';
                  for (i in arrayElhuyar){
                    var estekakohitza = arrayElhuyar[i].split(">")[1];
                    estekakohitza = estekakohitza.split("<")[0];
                    var params = arrayElhuyar[i].split("\"")[0];
                    params = params.replace(/amp\;/g, "");
                    getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = getBrowser().contentDocument.getElementById('aElhuyar').innerHTML+'<p><a href="'+urlElhuyar+"?"+params.replace('txtHitza='+encodeURI(term),'txtHitza='+estekakohitza)+'">'+estekakohitza+'</a></p>';
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
    },

    // Elhuyarren sarrerak eta azpisarrerak kargatu
    getsubShiftElhuyar: function(params,azpi) {
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
        var azpisarreraktestua='Azpisarrerak';
      } else if (h.match('english')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
        var azpisarreraktestua='Azpisarrerak';
      } else if (h.match('français')) {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
        var azpisarreraktestua='Azpisarrerak';
      } else {
        var urlElhuyar =  'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
        var azpisarreraktestua='Azpisarrerak';
      }
      urlElhuyar =urlElhuyar+"?"+params;

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
              txtElhuyar1 = euskalbarcomb.manipulateElhuyar(txtElhuyar);
              //Emaitza HTMLan kargatu
              getBrowser().contentDocument.getElementById('aElhuyar').innerHTML = getBrowser().contentDocument.getElementById('aElhuyar').innerHTML+txtElhuyar1;
	      if (azpi==1) {
                if (prefManagerShift.getBoolPref("euskalbar.query.subqueries")){
                  var txtElhuyar2 = txtElhuyar.split(azpisarreraktestua)[1];
                  var arrayElhuyar = txtElhuyar2.split("a href=\"?");
                  arrayElhuyar.shift();
                  for (i in arrayElhuyar){
                    var params = arrayElhuyar[i].split("\"")[0];
                    params = params.replace(/amp\;/g, "");
		    if (params.indexOf("mota=azpisarrera")!=-1) {
	              euskalbarcomb.getsubShiftElhuyar(params,0);
		    }
  		  }
		}
	      }
            }
          }
        } catch(e) {
          txtElhuyar = strRes.getString("m1Elhuyar");
        }
      }
    },


    //Elhuyarren katea manipulatzen duen funtzioa
    manipulateElhuyar: function(txtElhuyar) {
      strRes = document.getElementById('leuskal');
      const h = strRes.getString("hizk");
      if (h.match('euskara')) {
        var urlElhuyar =  'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/EU\/Hiztegi-kontsulta';
        var txtsplit='Emaitza:';
      } else if (h.match('english')) {
        var urlElhuyar =  'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/EN\/Dictionary-search';
        var txtsplit='Result:';
      } else if (h.match('français')) {
        var urlElhuyar =  'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/FR\/Dictionnaire-recherche';
        var txtsplit='R&eacute;sultat:';
      } else {
        var urlElhuyar =  'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/ES\/Consulta-de-diccionarios';
        var txtsplit='Resultado:';
      }
      var txtElhuyar1 = txtElhuyar.split(txtsplit)[1];
      if (txtElhuyar1.indexOf("<!-- _______  end")==-1) {
        txtElhuyar = txtElhuyar1.split("<!-- end")[0];
      } else {
        txtElhuyar = txtElhuyar1.split("<!-- _______  end")[0];
      };
      txtElhuyar = txtElhuyar.replace(/<h2>/, "<font face=\"bitstream vera sans, verdana, arial\" size=\"3\"><B>");
      txtElhuyar = txtElhuyar.replace(/<\/h2>/, "<\/B><\/font>");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"eu\">euskara gaztelania<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"es\">euskara gaztelania<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"eu\">euskara frantsesa<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"fr\">euskara frantsesa<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"eu\">euskara ingelesa<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"en\">euskara ingelesa<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"es\">castellano vasco<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"eu\">castellano vasco<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"fr\">français basque<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"eu\">français basque<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"en\">english basque<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<p class=\"hiz\"><strong lang=\"eu\">english basque<\/strong><\/p>/, "");
      txtElhuyar = txtElhuyar.replace(/<a href=\"\?/g,"<a href=\""+urlElhuyar+"\?");
      txtElhuyar = txtElhuyar.replace(/amp\;/g,'');
      txtElhuyar = txtElhuyar + "<hr size='1'>";
      return txtElhuyar;
    },


    // 3000 kargatu
    getShift3000: function(source, term) {
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
              if (txt3000.match("No se ha encontrado") || txt3000.match("ez da aurkitu")) {
                wtable = 2;
              }
              //3000ren katea manipulatzen duen funtzioa
              txt3000 = euskalbarcomb.manipulate3000(wtable, txt3000);
              getBrowser().contentDocument.getElementById('a3000').innerHTML = txt3000;
              //azpisarrerak badauzka...
              if (txt3000.indexOf("cgi-bin_m33") != -1){
                if (prefManagerShift.getBoolPref("euskalbar.query.subqueries")){
                  array3000 = txt3000.split("Href=\'");
                  array3000.shift();
                  for (i in array3000){
                    var url3000 = array3000[i].split("\'>")[0];
                    euskalbarcomb.getsubShift3000(url3000);
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
    },

    // 3000ren sarrerak eta azpisarrerak kargatu
    getsubShift3000: function(url3000) {
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
              txt3000 = euskalbarcomb.manipulate3000(3, txt3000);
              //Emaitza HTMLan kargatu
              getBrowser().contentDocument.getElementById('a3000').innerHTML = getBrowser().contentDocument.getElementById('a3000').innerHTML+txt3000;
            }
          }
        } catch(e) {
          txt3000 = strRes.getString("m13000");
        }
      }
    },

    //3000ren katea manipulatzen duen funtzioa
    manipulate3000: function(wtable, txt3000) {
      switch(wtable){
        case 3:
          var txt3000table1array = txt3000.split("<TABLE");
          txt3000 = txt3000table1array[wtable].substring(txt3000table1array[wtable].lenght - 1);
          var txt3000table2array = txt3000.split("<\/TABLE>");
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
        break;
        case 2:
          var txt3000b = txt3000.split("<IMG")[3];
          txt3000 = "<IMG"+txt3000b;
          var txt3000b = txt3000.split("<P")[1]
          var txt3000c = txt3000.split("<P")[2];
          txt3000 = "<P"+txt3000b+"<P"+txt3000c;
          txt3000 = txt3000.replace(/SIZE=\'3\'/g, "");
          txt3000 = txt3000.replace(/<TD/g, "<P");
          txt3000 = txt3000.replace(/<\/TD>/g, "<\/P>");
          txt3000 = txt3000.replace(/<TR/g, "<B");
          txt3000 = txt3000.replace(/<\/TR>/g, "<\/B>");
          txt3000 = txt3000.replace(/<SELECT/g, "<SELECT ALIGN=\'CENTER\'");
          txt3000 = txt3000.replace(/<P>/g, "<P ALIGN=\'CENTER\'>");
          txt3000 = txt3000.replace(/\/cgi-bin_m33/g, "http://www1.euskadi.net/cgi-bin_m33");
          return txt3000;
        break;
      }
    },


    // Morris hiztegia kargatu
    getShiftMorris: function(source, term) {
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
    
    },


    // Labayru hiztegia kargatu
    getShiftLabayru: function(source, term) {
      var txtLabayru = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');

      if (source == 'es') {
        hizk = '';
      } else {
        hizk = 'EU';
      }
      // POST bidez pasatzeko parametroak
      var parametroak = 'txtPalabra='+term+'&opc=1';
      var urlLabayru = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras'+hizk+'.asp';
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtLabayru = strRes.getString("m1Labayru");
        return false;
      }
      xmlHttpReq.open('POST', urlLabayru, true);
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
        txtLabayru = strRes.getString("m1Labayru");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          div = getBrowser().contentDocument.getElementById('aLabayru');
          if (xmlHttpReq.readyState == 4) {
            // Timerra garbitu
            clearTimeout(requestTimer);
            if (xmlHttpReq.status == 200) {
              txtLabayru = xmlHttpReq.responseText;
              if (txtLabayru.match("No hay resultados") || txtLabayru.match("Ez dago holakorik")) {
                txtLabayru = "Ez da aurkitu "+term+" hitza.";
              } else {
                var txtLab1 = txtLabayru.split("HiztegiaPalabra");
                txtLabayru = txtLab1[1].slice(2+term.length, txtLab1[1].indexOf("<form"));
                txtLabayru = "<p><b>"+term+"</b></p>"+txtLabayru;
		txtLabayru = txtLabayru.replace(/<td>/g, "<p>");
		txtLabayru = txtLabayru.replace(/<\/td>/g, "<\/p>");
		txtLabayru = txtLabayru.replace(/<tr>/g, "");
		txtLabayru = txtLabayru.replace(/<\/tr>/g, "");
		txtLabayru = txtLabayru.replace(/<\/td>/g, "<\/p>");
                txtLabayru = txtLabayru.replace(/CargaPalabra/g,"http://zerbitzuak.labayru.org/diccionario/CargaPalabra");
              }
            } else {
              txtLabayru = strRes.getString("m1Labayru");
            }
          }
        } catch(e) {
          txtLabayru = strRes.getString("m1Labayru");
        }
        getBrowser().contentDocument.getElementById('aLabayru').innerHTML = txtLabayru;
      }
    },


    // Adorez sinonimoen hiztegia kargatu
    getShiftAdorez: function(source, term) {
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
    },


    //UZEIren sinonimoen hiztegia kargatu
    getShiftUZEI: function(source, term) {
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
    },


    // Hiztegi Batua kargatu
    getShiftEuskaltzaindia: function(source, term) {
      var txtEuskaltzaindia= "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      if (euskalbar.euskalbar_source == 'es') {
        idioma = 'G';
      } else if (euskalbar.euskalbar_source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
      }

      var urlEuskaltzaindia = 'http://www.euskaltzaindia.net/hiztegibatua/index.php?option=com_hiztegianbilatu&amp;Itemid=189&amp;lang=eu&amp;view=frontpage&amp;bila=bai&amp;sarrera='+escape(term);
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = strRes.getString("m1Batua");
        return false;
      }

      xmlHttpReq.open('POST', urlEuskaltzaindia, true);
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
              txtEuskaltzaindia = euskalbarcomb.manipulateEuskaltzaindia(txtEuskaltzaindia);
              txtEuskaltzaindia = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">"+term+"<font></strong>"+txtEuskaltzaindia;
              getBrowser().contentDocument.getElementById('aBatua').innerHTML = txtEuskaltzaindia;
              //azpisarrerak badauzka...
              if (txtEuskaltzaindia.indexOf("index.php") != -1){
                if (prefManagerShift.getBoolPref("euskalbar.query.subqueries")){
                  arrayEuskaltzaindia = txtEuskaltzaindia.split("index.php");
                  arrayEuskaltzaindia.shift();
                  for (i in arrayEuskaltzaindia){
                    var urlEuskaltzaindia = arrayEuskaltzaindia[i].split("frontpage")[0];
                    urlEuskaltzaindia = urlEuskaltzaindia+"frontpage";
                    euskalbarcomb.getsubShiftEuskaltzaindia(urlEuskaltzaindia);
                  }
                }
              }
            } else {
              txtEuskaltzaindia = strRes.getString("m1Batua");
            }
          }
        } catch(e) {
          txtEuskaltzaindia = strRes.getString("m1Batua");
        }
        getBrowser().contentDocument.getElementById('aBatua').innerHTML = txtEuskaltzaindia;
      }
    },

    // Batuaren sarrerak eta azpisarrerak kargatu
    getsubShiftEuskaltzaindia: function(urlEuskaltzaindia) {
      urlEuskaltzaindia="http://www.euskaltzaindia.net/hiztegibatua/index.php"+urlEuskaltzaindia;
      var txtEuskaltzaindia="";
      strRes = document.getElementById('leuskal');
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = strRes.getString("m1Batua");
        return false;
      }
      xmlHttpReq.open('POST', urlEuskaltzaindia, true);
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
              //Batuaren katea manipulatzen duen funtzioari deitu
              txtEuskaltzaindia = euskalbarcomb.manipulateEuskaltzaindia(txtEuskaltzaindia);
              //Emaitza HTMLan kargatu
              getBrowser().contentDocument.getElementById('aBatua').innerHTML = getBrowser().contentDocument.getElementById('aBatua').innerHTML+"<hr>"+txtEuskaltzaindia;
            }
          }
        } catch(e) {
          txtEuskaltzaindia = strRes.getString("m1Batua");
        }
      }
    },

    //Batuaren katea manipulatzen duen funtzioa
    manipulateEuskaltzaindia: function(txtEuskaltzaindia) {
      var txtEuskaltzaindia = txtEuskaltzaindia.split("contentheading")[1];
      txtEuskaltzaindia = "<div class=\"contentheading"+txtEuskaltzaindia;
      txtEuskaltzaindia = txtEuskaltzaindia.split("<p><b>Oharra")[0];
      txtEuskaltzaindia = txtEuskaltzaindia.replace(/Hiztegi Batua/, "<br>");
      txtEuskaltzaindia = txtEuskaltzaindia.replace(/\/index.php/g, "http://www.euskaltzaindia.net/hiztegibatua/index.php");
      txtEuskaltzaindia = "<font size=\"2pt\">"+txtEuskaltzaindia+"<\/font>";
      return txtEuskaltzaindia;
    },


    // Mokoroa kargatu
    getShiftMokoroa: function(source, term) {
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
    },


    // Intza kargatu
    getShiftIntza: function(source, term) {
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
    },


    // Open-tran kargatu
    getShiftOpentran: function(source, term) {
      var txtOpentran = "";
      //Lokalizazio paketeak kargatu
      strRes = document.getElementById('leuskal');
      var urlOpentran = 'http://eu.open-tran.eu/suggest/'+escape(term);

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtOpentran = strRes.getString("m1Opentran");
        return false;
      }

      xmlHttpReq.open('GET', urlOpentran, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = prefManagerShift.getIntPref("euskalbar.query.timeout");
      tout=tout*1000
	  
      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtOpentran = strRes.getString("m1Opentran");
      }, tout);

      xmlHttpReq.onreadystatechange = function() {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtOpentran = xmlHttpReq.responseText;
              var txtOpentran1 = txtOpentran.split("<h1>")[1];
              var txtOpentran2 = txtOpentran.split("<h1>")[2];
              txtOpentran = "<h1>"+txtOpentran1+"<h1>"+txtOpentran2;
              var txtOpentran3 = txtOpentran.split("<div id=\"bottom\">")[0];
              txtOpentran3 = txtOpentran3.replace(/\/images\//g,"http://eu.open-tran.eu/images/");
              txtOpentran3 = txtOpentran3.replace(/<a href=\"javascript\:\;\"  onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<b>");
              txtOpentran3 = txtOpentran3.replace(/<a href=\"javascript\:\;\" class=\"fuzzy\" onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<i>fuzzy</i> <b>");
              txtOpentran3 = txtOpentran3.replace(/\)<\/a>/g,")</b>");
            } else {
              txtOpentran = strRes.getString("m1Opentran");
            }
          }
        } catch(e) {
          txtOpentran = strRes.getString("m1Opentran");
        }
        getBrowser().contentDocument.getElementById('aOpentran').innerHTML = txtOpentran3;
      }
    },

    normalizatuetaminuskularatu: function(katea) {
        kateberria=katea.toLowerCase();
    //	kateberria=kateberria.trim(); Hau ez dabil Linuxen
        kateberria=kateberria.replace(/á/,"a");
        kateberria=kateberria.replace(/à/,"a");
        kateberria=kateberria.replace(/ä/,"a");
        kateberria=kateberria.replace(/â/,"a");
        kateberria=kateberria.replace(/é/,"e");
        kateberria=kateberria.replace(/è/,"e");
        kateberria=kateberria.replace(/ë/,"e");
        kateberria=kateberria.replace(/ê/,"e");
        kateberria=kateberria.replace(/í/,"i");
        kateberria=kateberria.replace(/ì/,"i");
        kateberria=kateberria.replace(/ï/,"i");
        kateberria=kateberria.replace(/î/,"i");
        kateberria=kateberria.replace(/ó/,"o");
        kateberria=kateberria.replace(/ò/,"o");
        kateberria=kateberria.replace(/ö/,"o");
        kateberria=kateberria.replace(/ô/,"o");
        kateberria=kateberria.replace(/ú/,"u");
        kateberria=kateberria.replace(/ù/,"u");
        kateberria=kateberria.replace(/ü/,"u");
        kateberria=kateberria.replace(/û/,"u");

        return kateberria;
    },

}
