// Developers: Asier Sarasua Garmendia 2006
// This is Free Software (GPL License)
// asarasua@vitoria-gasteiz.org


    // Sinonimoen hiztegia kargatu
    function getKtrlSinonimoak(source, term) {
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

      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtSinonimoak = strRes.getString("m1Sinonimoak");
      }, 5000);

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
                txtSinonimoak = '<font face="bitstream vera sans, verdana, arial" size="3"><B>'+term+'</B></font><BR><BR><font face="bitstream vera sans, verdana, arial">'+txtSinonimoak+'</font>';
              }
            } else {
              txtSinonimoak = strRes.getString("m1Sinonimoak");
            }
          }
        } catch(e) {
          txtSinonimoak = strRes.getString("m1Sinonimoak");
        }
        getBrowser().contentDocument.getElementById('aSinonimoak').innerHTML = txtSinonimoak;
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

      //Timerra sortu
      var requestTimer = setTimeout(function() {
        xmlHttpReq.abort();
        txtUZEI = strRes.getString("m1UZEI");
      }, 5000);

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
