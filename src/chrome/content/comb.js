/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2012 Euskalbar Taldea (see AUTHORS file)
 *
 * This file is part of Euskalbar.
 *
 * Euskalbar is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

  euskalbar.comb = {

    // Euskalterm kargatu
    getShiftEuskalterm: function (source, term) {
      var txtEuskalterm = "";
      var idioma;
      if (euskalbar.source == 'es') {
        idioma = 'G';
      } else if (euskalbar.source == 'en') {
        idioma = 'I';
      } else if (euskalbar.source == 'fr') {
        idioma = 'F';
      } else {
        idioma = 'E';
      }

      /* Hitz zatiak erabiltzen direnean, * komodina erabiliko bailitzan
       * egin ditzala bilaketak */
      if (term.charAt(term.length - 1) != "*") {
        term = term + "*";
      }

      var url = 'http://www1.euskadi.net/euskalterm/cgibila7.exe?hizkun1='
        + idioma + '&hitz1=' + escape(term) + '&gaiak=0&hizkuntza=' + source;
      var output = "";

      euskalbarLib.ajax({
        url: url,

        onSuccess: function (data) {
          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www1.euskadi.net/euskalterm/indice_e.htm\">Euskalterm&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oEuskalterm', gBrowser.contentDocument));
          data = data.replace(/<HTML>/, " ");
          data = data.replace(/<HEAD><TITLE>Fitxak<\/TITLE><\/HEAD>/, " ");
          data = data.replace(/<BODY  bgcolor=lavender leftmargin="10">/, "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">" + term.replace(/\*/, "") + "<font></strong>");
          data = data.replace(/<\/body><\/html>/, " ");
          data = data.replace(/steelblue/g, "black");
          data = data.replace(/Verdana/g, "\"bitstream vera sans, verdana, arial\"");

          output = data;
        },

        onError: function () {
          output = euskalbarLib._f("euskalbar.comb.error", ["Euskalterm"]);
        },

        onComplete: function () {
          euskalbarLib.cleanloadHTML(output, euskalbarLib.$('aEuskalterm', gBrowser.contentDocument));
        }
      });
    },


    // Elhuyarren markoa kargatu
    getShiftElhuyar: function (source, dest, term) {
      var txtElhuyar = "";

      var lang = euskalbarLib._("hizk");

      if (lang.match('euskara')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
        var elhuyarerroremezua = 'Ez dago horrelako sarrerarik';
        var erroremezua = 'Ez da aurkitu ' + term + ' hitza.';
        var erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
        var azpisarreraktestua = 'Azpisarrerak';
      } else if (lang.match('english')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
        var elhuyarerroremezua = 'No match found';
        var erroremezua = 'Word ' + term + ' not found.';
        var erroremezua2 = 'Word not found, choose from list';
        var azpisarreraktestua = 'Azpisarrerak';
      } else if (lang.match('français')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
        var elhuyarerroremezua = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
        var erroremezua = 'Pas de résultats pour le mot ' + term + '.';
        var erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
        var azpisarreraktestua = 'Azpisarrerak';
      } else {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
        var elhuyarerroremezua = 'No se han encontrado resultados para la b&uacute;squeda';
        var erroremezua = 'No se ha encontrado la palabra ' + term + '.';
        var erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
        var azpisarreraktestua = 'Azpisarrerak';
      }

      //Azentu markak, eñeak eta dieresiak aldatu
      var jatorrizkoa = term;
      term = encodeURI(term); //honekin eñeak eta dieresiak konpontzen dira
      var source2;
      var dest2;
      var chkHizkuntza;
      switch (source) {
      case 'es':
        source2 = 'gazt';
        break;
      case 'fr':
        source2 = 'fran';
        break;
      case 'en':
        source2 = 'ing';
        break;
      case 'eu':
        source2 = 'eusk';
        break;
      }
      switch (dest) {
      case 'es':
        chkHizkuntza = 'chkHizkuntzaG';
        dest2 = 'gazt';
        break;
      case 'fr':
        chkHizkuntza = 'chkHizkuntzaF';
        dest2 = 'fran';
        break;
      case 'en':
        chkHizkuntza = 'chkHizkuntzaI';
        dest2 = 'ing';
        break;
      case 'eu':
        chkHizkuntza = '';
        dest2 = '';
        break;
      }

      var params = 'txtHitza=' + term + '&nondik=' + source2 + '&edozer=ehunekoa&bot_kon=%3E';
      if (chkHizkuntza != '') {
        params = params + '&' + chkHizkuntza + '=' + dest2;
      }

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
        return false;
      }
      xmlHttpReq.open('POST', urlElhuyar, true);
      xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=iso-8859-1");
      xmlHttpReq.send(params);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
      }, tout);
      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta\">Elhuyar&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oElhuyar', gBrowser.contentDocument));
              txtElhuyar = xmlHttpReq.responseText;
              // Hitza existitzen ez bada...
              if (txtElhuyar.indexOf(elhuyarerroremezua) != -1) {
                txtElhuyar = erroremezua;
                euskalbarLib.cleanloadHTML(txtElhuyar, euskalbarLib.$('aElhuyar', gBrowser.contentDocument));
              } else {
                var txtElhuyar1 = txtElhuyar.split("div id=\"zerrenda\"")[1];
                var arrayElhuyar = txtElhuyar1.split("a href=\"?");
                arrayElhuyar.shift();
                badago = 0;
                for (i in arrayElhuyar) {
                  var estekakohitza = arrayElhuyar[i].split(">")[1];
                  estekakohitza = estekakohitza.split("<")[0];
                  estekakohitza2 = euskalbar.comb.normalizatuetaminuskularatu(estekakohitza);
                  jatorrizkoa2 = euskalbar.comb.normalizatuetaminuskularatu(jatorrizkoa);
                  var params = arrayElhuyar[i].split("\"")[0];
                  params = params.replace(/amp\;/g, "");
                  if (estekakohitza2 == jatorrizkoa2 || estekakohitza2 == '1 ' + jatorrizkoa2 || estekakohitza2 == '2 ' + jatorrizkoa2 || estekakohitza2 == '3 ' + jatorrizkoa2 || estekakohitza2 == '4 ' + jatorrizkoa2 || estekakohitza2 == '5 ' + jatorrizkoa2 || estekakohitza2 == '6 ' + jatorrizkoa2 || estekakohitza2 == '7 ' + jatorrizkoa2 || estekakohitza2 == '8 ' + jatorrizkoa2 || estekakohitza2 == '9 ' + jatorrizkoa2 || estekakohitza2 == '10 ' + jatorrizkoa2) {
                    badago = 1;
                    euskalbar.comb.getsubShiftElhuyar(params, 1);
                  }
                }
                if (badago == 0) {
                  euskalbarLib.cleanloadHTML('<p><strong><font face="bitstream vera sans, verdana, arial" size="3">' + decodeURI(term) + '<font></strong></p><p></p><p><font color="black" face="bitstream vera sans, verdana, arial" size="-1">' + erroremezua2 + '</font></p><p></p>', euskalbarLib.$('aElhuyar', gBrowser.contentDocument));
                  for (i in arrayElhuyar) {
                    var estekakohitza = arrayElhuyar[i].split(">")[1];
                    estekakohitza = estekakohitza.split("<")[0];
                    var params = arrayElhuyar[i].split("\"")[0];
                    params = params.replace(/amp\;/g, "");
                    euskalbarLib.cleanloadHTML('<p><a href="' + urlElhuyar + "?" + params.replace('txtHitza=' + encodeURI(term), 'txtHitza=' + estekakohitza) + '">' + estekakohitza + '</a></p>', euskalbarLib.$('aElhuyar', gBrowser.contentDocument));
                  }
                }
              }
            } else {
              txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
            }
          }
        } catch (e) {
          txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
        }
      }
    },

    // Elhuyarren sarrerak eta azpisarrerak kargatu
    getsubShiftElhuyar: function (params, azpi) {
      var lang = euskalbarLib._("hizk");

      if (lang.match('euskara')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
        var azpisarreraktestua = 'Azpisarrerak';
      } else if (lang.match('english')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
        var azpisarreraktestua = 'Azpisarrerak';
      } else if (lang.match('français')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
        var azpisarreraktestua = 'Azpisarrerak';
      } else {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
        var azpisarreraktestua = 'Azpisarrerak';
      }

      urlElhuyar = urlElhuyar + "?" + params;

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
        return false;
      }
      xmlHttpReq.open('GET', urlElhuyar, true);
      xmlHttpReq.setRequestHeader('Content-Type', 'charset=ISO-8859-1');
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtElhuyar = xmlHttpReq.responseText;
              //Elhuyarren katea manipulatzen duen funtzioari deitu
              txtElhuyar1 = euskalbar.comb.manipulateElhuyar(txtElhuyar);
              //Emaitza HTMLan kargatu
              euskalbarLib.cleanloadHTML(txtElhuyar1, euskalbarLib.$('aElhuyar', gBrowser.contentDocument));
              if (azpi == 1) {
                if (euskalbar.prefs.getBoolPref("query.subqueries")) {
                  var txtElhuyar2 = txtElhuyar.split(azpisarreraktestua)[1];
                  var arrayElhuyar = txtElhuyar2.split("a href=\"?");
                  arrayElhuyar.shift();
                  for (i in arrayElhuyar) {
                    var params = arrayElhuyar[i].split("\"")[0];
                    params = params.replace(/amp\;/g, "");
                    if (params.indexOf("mota=azpisarrera") != -1) {
                      euskalbar.comb.getsubShiftElhuyar(params, 0);
                    }
                  }
                }
              }
            }
          }
        } catch (e) {
          txtElhuyar = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
        }
      }
    },


    //Elhuyarren katea manipulatzen duen funtzioa
    manipulateElhuyar: function (txtElhuyar) {
      var lang = euskalbarLib._("hizk");
      var urlElhuyar = "";
      var txtsplit ="";
      if (lang.match('euskara')) {
        urlElhuyar = 'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/EU\/Hiztegi-kontsulta';
        txtsplit = 'Emaitza:';
      } else if (lang.match('english')) {
        urlElhuyar = 'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/EN\/Dictionary-search';
        txtsplit = 'Result:';
      } else if (lang.match('français')) {
        urlElhuyar = 'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/FR\/Dictionnaire-recherche';
        txtsplit = 'R&eacute;sultat:';
      } else {
        urlElhuyar = 'http:\/\/www.elhuyar.org\/hizkuntza-zerbitzuak\/ES\/Consulta-de-diccionarios';
        txtsplit = 'Resultado:';
      }
      var txtElhuyar1 = txtElhuyar.split(txtsplit)[1];
      if (txtElhuyar1.indexOf("<!-- _______  end") == -1) {
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
      txtElhuyar = txtElhuyar.replace(/<a href=\"\?/g, "<a href=\"" + urlElhuyar + "\?");
      txtElhuyar = txtElhuyar.replace(/amp\;/g, '');
      txtElhuyar = txtElhuyar + "<hr size='1'>";
      return txtElhuyar;
    },


    // ZT Hiztegiaren markoa kargatu
    getShiftZTHiztegia: function (source, term) {
      var lang = euskalbarLib._("hizk");

      if (lang.match('euskara')) {
        var erroremezua = 'Ez dago horrelako terminorik';
        var erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
      } else if (lang.match('english')) {
        var erroremezua = 'Term not found';
        var erroremezua2 = 'Word not found, choose from list';
      } else if (lang.match('français')) {
        var erroremezua = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
        var erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
      } else {
        var erroremezua = 'No se han encontrado resultados para la b&uacute;squeda';
        var erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
      }

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
        return false;
      }
      xmlHttpReq.open('GET', 'http://zthiztegia.elhuyar.org/api/search?action=searchTerms&term=' + euskalbar.comb.normalizatuetaminuskularatu(term) + '%25&lang=' + source, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
      }, tout);
      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              erantzuna = xmlHttpReq.responseText;
              if (erantzuna == '[]') {
                txtZTHiztegia = erroremezua;
                euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
              } else {
                ztzerrenda = JSON.parse(erantzuna);
                if (ztzerrenda[0].sortKey == euskalbar.comb.normalizatuetaminuskularatu(term)) {
                  termida = ztzerrenda[0].termId;
                  var xmlHttpReq2 = new XMLHttpRequest();
                  if (!xmlHttpReq2) {
                    txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
                    euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                    return false;
                  }
                  xmlHttpReq2.open('GET', 'http://zthiztegia.elhuyar.org/api/search?action=retrieveTerm&key=' + termida, true);
                  xmlHttpReq2.send(null);
                  var requestTimer2 = setTimeout(function () {
                    xmlHttpReq2.abort();
                    txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
                    euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                  }, tout);
                  xmlHttpReq2.onreadystatechange = function () {
                    try {
                      if (xmlHttpReq2.readyState == 4) {
                        if (xmlHttpReq2.status == 200) {
                          //Timerra garbitu
                          clearTimeout(requestTimer2);
                          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://zthiztegia.elhuyar.org\">ZT hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oZthiztegia', gBrowser.contentDocument));
                          euskalbarLib.$('buruaZthiztegia', gBrowser.contentDocument).innerHTML = "ZT hiztegia";
                          erantzuna2 = xmlHttpReq2.responseText;
                          txtZTHiztegia = erantzuna2.substring(0, erantzuna2.search('<ul id="menu_3">'));
                          txtZTHiztegia = txtZTHiztegia.replace(/\<a href\=\"javascript\:showTermEntryOf\(\'(.).+?\'\,\%20/g, '<a href="javascript:euskalbar.dicts.goEuskalBarZTHiztegiaKlik(\'$1hizkuntzaid\',');
                          txtZTHiztegia = txtZTHiztegia.replace(/Ehizkuntzaid/g, 'eu');
                          txtZTHiztegia = txtZTHiztegia.replace(/Ghizkuntzaid/g, 'es');
                          txtZTHiztegia = txtZTHiztegia.replace(/Fhizkuntzaid/g, 'fr');
                          txtZTHiztegia = txtZTHiztegia.replace(/Ihizkuntzaid/g, 'en');
                          txtZTHiztegia = txtZTHiztegia.replace(/Lhizkuntzaid/g, 'la');
                          txtZTHiztegia = txtZTHiztegia.replace(/\<a href\=\"javascript\:showImage\(\'irudiak\/irudiak\/.*?\<\/a\>/g, '');
                          txtZTHiztegia = txtZTHiztegia.replace(/\<a href\=\"javascript\:showImage\(\'irudiak\/irudiak\/.*?\<\/a\>/g, '');
                          txtZTHiztegia = txtZTHiztegia.replace(/\<div class\=\"ikus\"\>/g, '<div class="ikus"><img src="http://zthiztegia.elhuyar.org//irudiak/iko_ikus.gif" />');
                          txtZTHiztegia = txtZTHiztegia.replace(/ onclick\=\"javascript\:showTermEntryOf\(\'.+?\'\, this\.innerHTML\)\; return false\;\"\>/g, '>');
                          txtZTHiztegia = txtZTHiztegia.replace(/\<a href\=\"javascript\:showArticle\(/g, '<a href="javascript:euskalbar.dicts.goEuskalBarZTHiztegiaArtikulua(');
                          if (ztzerrenda.length - 1 > 1) {
                            txtZTHiztegia = txtZTHiztegia + '<p>Beste batzuk:</p>';
                            for (termind = 1; termind < ztzerrenda.length; termind++) {
                              txtZTHiztegia = txtZTHiztegia + '<p><a href="javascript:euskalbar.dicts.goEuskalBarZTHiztegiaKlik(\'' + source + '\',\'' + ztzerrenda[termind].term + '\')\">' + ztzerrenda[termind].term + '</a></p>';
                            }
                          };
                          euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));

                        }
                      }
                    } catch (e) {
                      txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
                      euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                    }
                  }
                } else {
                  txtZTHiztegia = erroremezua2;
                  for (termind = 0; termind < ztzerrenda.length; termind++) {
                    txtZTHiztegia = txtZTHiztegia + '<p><a href="javascript:euskalbar.dicts.goEuskalBarZTHiztegiaKlik(\'' + source + '\',\'' + ztzerrenda[termind].term + '\')\">' + ztzerrenda[termind].term + '</a></p>';
                  }
                  euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                }
              }
            }
          }
        } catch (e) {
          var txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
          euskalbarLib.cleanloadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
        }
      }
    },

    // Energia Hiztegiaren markoa kargatu
    getShiftEnergia: function (source, term) {
      var lang = euskalbarLib._("hizk");
      var txtEnergia = "";
      if (lang.match('euskara')) {
        var erroremezua = 'Ez dago horrelako terminorik';
        var erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
      } else if (lang.match('english')) {
        var erroremezua = 'Term not found';
        var erroremezua2 = 'Word not found, choose from list';
      } else if (lang.match('français')) {
        var erroremezua = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
        var erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
      } else {
        var erroremezua = 'No se han encontrado resultados para la b&uacute;squeda';
        var erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
      }
      var hizkid = "";
      if (source == 'eu') {
        hizkid = 'E';
      } else if (source == 'es') {
        hizkid = 'G';
      } else if (source == 'en') {
        hizkid = 'I';
      } else if (source == 'fr') {
        hizkid = 'F';
      };

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
        return false;
      }
      var urlEnergia = 'http://www.eve.es/energia/bilatu.asp';
      var params = 'txtHitza=' + euskalbar.comb.normalizatu(term).replace(' ', '%20') + '%25&selectHizkuntza=' + hizkid + '&optNon=Terminotan&selectGaia=-%20Guztiak%20-';

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
        return false;
      }

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              erantzuna = xmlHttpReq.responseText;
              if (erantzuna.search(/\<select name\=\"selectTerm\"/i) == -1) {
                txtEnergia = erroremezua;
                euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
              } else {
                zerrenda = erantzuna.substring(erantzuna.search(/\<select name\=\"selectTerm\"/i));
                zerrenda = zerrenda.substring(zerrenda.search(/\<\/script\>/i) + 10);
                zerrenda = zerrenda.substring(0, zerrenda.search(/\<\/select\>/i));
                zerrenda = zerrenda.split(/\<\/option\>/i);
                elementua = zerrenda[0];
                definizioa = elementua.substring(elementua.search(/\<option value\= \"\'definizioa\.asp\?Kodea\=/i) + '<option value= "\'definizioa.asp?Kodea='.length);
                hitza = definizioa.substring(definizioa.search('>') + 8);
                hitza = hitza.substring(0, hitza.length - 6);
                definizioa = definizioa.substring(0, definizioa.search("','"));
                if (euskalbar.comb.normalizatuetaminuskularatu(hitza) == euskalbar.comb.normalizatuetaminuskularatu(term)) {
                  var xmlHttpReq2 = new XMLHttpRequest();
                  if (!xmlHttpReq2) {
                    txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
                    euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
                    return false;
                  }
                  xmlHttpReq2.onreadystatechange = function () {
                    try {
                      if (xmlHttpReq2.readyState == 4) {
                        if (xmlHttpReq2.status == 200) {
                          //Timerra garbitu
                          clearTimeout(requestTimer2);
                          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www.eve.es/energia/index.html\">Energia hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oEnergia', gBrowser.contentDocument));
                          euskalbarLib.$('buruaEnergia', gBrowser.contentDocument).innerHTML = "Energia hiztegia";
                          erantzuna2 = xmlHttpReq2.responseText;
                          txtEnergia = erantzuna2;
                          txtEnergia = txtEnergia.substring(txtEnergia.search('<p>'));
                          txtEnergia = txtEnergia.substring(0, txtEnergia.search('</body>'));
                          txtEnergia = txtEnergia.replace(/\<a href\=\"javascript\:definizioa\(\'definizioa\.asp\?kodea\=(.).+?\>(.*?)\</g, '<a href="javascript:euskalbar.dicts.goEuskalBarEnergiaKlik(\'$1hizkuntzaid\'\,\'$2\')">$2<');
                          txtEnergia = txtEnergia.replace(/Ehizkuntzaid/g, 'eu');
                          txtEnergia = txtEnergia.replace(/Ghizkuntzaid/g, 'es');
                          txtEnergia = txtEnergia.replace(/Fhizkuntzaid/g, 'fr');
                          txtEnergia = txtEnergia.replace(/Ihizkuntzaid/g, 'en');
                          txtEnergia = txtEnergia.replace(/artikulua\.asp\?kodea\=/g, 'http://www.eve.es/energia/artikulua.asp?kodea=');
                          txtEnergia = txtEnergia.replace(/\<img src\=\"\.\.\/energia\/irudiak\/eskua\.gif\"/g, '<img src="http://www.eve.es/energia/irudiak/eskua.gif"');
                          txtEnergia = txtEnergia.replace(/\.\.\/energia\/pdf/g, 'http://www.eve.es/energia/pdf');
                          if (zerrenda.length - 1 > 1) {
                            txtEnergia = txtEnergia + '<p>Beste batzuk:</p>';
                            for (elemind = 1; elemind < zerrenda.length - 1; elemind++) {
                              elementua = zerrenda[elemind];
                              definizioa = elementua.substring(elementua.search(/\<option value\= \"\'definizioa\.asp\?Kodea\=/i) + '<option value= "\'definizioa.asp?Kodea='.length);
                              hitza = definizioa.substring(definizioa.search('>') + 8);
                              hitza = hitza.substring(0, hitza.length - 5);
                              definizioa = definizioa.substring(0, definizioa.search("','"));
                              txtEnergia = txtEnergia + '<p><a href="javascript:euskalbar.dicts.goEuskalBarEnergiaKlik2(\'' + definizioa + '\',\'' + hitza + '\')\">' + hitza + '</a></p>';
                            };
                          };
                          euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
                        }
                      }
                    } catch (e) {
                      txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
                      euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
                    }
                  }
                  xmlHttpReq2.open('GET', 'http://www.eve.es/energia/definizioa.asp?Kodea=' + definizioa, true);
                  xmlHttpReq2.overrideMimeType("text/html; charset=ISO-8859-1");
                  xmlHttpReq2.send(null);
                  var requestTimer2 = setTimeout(function () {
                    xmlHttpReq2.abort();
                    txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
                    euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
                  }, tout);
                } else {
                  txtEnergia = erroremezua2;
                  for (elemind = 0; elemind < zerrenda.length - 1; elemind++) {
                    elementua = zerrenda[elemind];
                    definizioa = elementua.substring(elementua.search(/\<option value\= \"\'definizioa\.asp\?Kodea\=/i) + '<option value= "\'definizioa.asp?Kodea='.length);
                    hitza = definizioa.substring(definizioa.search('>') + 8);
                    hitza = hitza.substring(0, hitza.length - 5);
                    definizioa = definizioa.substring(0, definizioa.search("','"));
                    txtEnergia = txtEnergia + '<p><a href="javascript:euskalbar.dicts.goEuskalBarEnergiaKlik2(\'' + definizioa + '\',\'' + hitza + '\')\">' + hitza + '</a></p>';
                  };
                  euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
                }
              }
            }
          }
        } catch (e) {
          txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
          euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
        }
      }
      xmlHttpReq.open('POST', urlEnergia, true);
      xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=iso-8859-1");
      xmlHttpReq.overrideMimeType("text/html; charset=ISO-8859-1");
      xmlHttpReq.send(params);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtEnergia = euskalbarLib._f("euskalbar.comb.error", ["Energia Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtEnergia, euskalbarLib.$('aEnergia', gBrowser.contentDocument));
      }, tout);
    },

    // Telekomunikazio Hiztegiaren markoa kargatu
    getShiftTelekom: function (source, term) {
      var lang = euskalbarLib._("hizk");
      var txtTelekom = "";
      if (lang.match('euskara')) {
        var erroremezua = 'Ez dago horrelako terminorik';
        var erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
        var inthizk = 'eusk'
      } else if (lang.match('english')) {
        var erroremezua = 'Term not found';
        var erroremezua2 = 'Word not found, choose from list';
        var inthizk = 'gazt'
      } else if (lang.match('français')) {
        var erroremezua = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
        var erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
        var inthizk = 'gazt'
      } else {
        var erroremezua = 'No se han encontrado resultados para la b&uacute;squeda';
        var erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
        var inthizk = 'gazt'
      }
      var hizkid = "";
      if (source == 'eu') {
        hizkid = 'E';
      } else if (source == 'es') {
        hizkid = 'G';
      } else if (source == 'en') {
        hizkid = 'I';
      } else if (source == 'fr') {
        hizkid = 'F';
      };

/*      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
        return false;
      }*/
      var urlTelekom = 'http://www.telekomunikaziohiztegia.org/bilatu.asp?';
      var params = 'hizk=' + inthizk + '&txtHitza=' + euskalbar.comb.normalizatu(term).replace(' ', '%20') + '%25&selectHizkuntza=' + hizkid + '&optNon=Terminotan&selectAlorra=0';

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
        return false;
      }

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              erantzuna = xmlHttpReq.responseText;
              if (erantzuna.search(/\<select name\=\"selectTerm\"/i) == -1) {
                txtTelekom = erroremezua;
                euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
              } else {
                zerrenda = erantzuna.substring(erantzuna.search(/\<select name\=\"selectTerm\"/i));
                zerrenda = zerrenda.substring(zerrenda.search(/\<\/script\>/i) + 10);
                zerrenda = zerrenda.substring(0, zerrenda.search(/\<\/select\>/i));
                zerrenda = zerrenda.split(/\<\/option\>/i);
                elementua = zerrenda[0];
                definizioa = elementua.substring(elementua.search(/\<option value\= \"definizioa\.asp\?Kodea\=/i) + '<option value= "definizioa.asp?Kodea='.length);
                hitza = definizioa.substring(definizioa.search('>') + 20);
                hitza = hitza.substring(0, hitza.length - 18);
                definizioa = definizioa.substring(0, definizioa.search("&"));
                if (euskalbar.comb.normalizatuetaminuskularatu(hitza) == euskalbar.comb.normalizatuetaminuskularatu(term)) {
                  var xmlHttpReq2 = new XMLHttpRequest();
                  if (!xmlHttpReq2) {
                    txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
                    euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                    return false;
                  }
                  xmlHttpReq2.onreadystatechange = function () {
                    try {
                      if (xmlHttpReq2.readyState == 4) {
                        if (xmlHttpReq2.status == 200) {
                          //Timerra garbitu
                          clearTimeout(requestTimer2);
                          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www.telekomunikaziohiztegia.org/\">Telekomunikazio hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oTelekom', gBrowser.contentDocument));
                          euskalbarLib.$('buruaTelekom', gBrowser.contentDocument).innerHTML = "Telekomunikazio hiztegia";
                          erantzuna2 = xmlHttpReq2.responseText;
                          txtTelekom = erantzuna2;
                          hasiera = '<p>' + txtTelekom.substring(txtTelekom.search('<td class="sarrera">') + '<td class="sarrera">'.length);
                          hasiera = hasiera.substring(0, hasiera.search('</td>')) + '</p>';
                          amaiera = '';
                          if (txtTelekom.indexOf('<table ', txtTelekom.search('          ARTIKULUAK')) != -1) {
                            amaiera = txtTelekom.substring(txtTelekom.indexOf('<table ', txtTelekom.search('          ARTIKULUAK')), txtTelekom.indexOf('</table>', txtTelekom.search('          ARTIKULUAK')) + 8);
                            txtTelekom = txtTelekom.substring(0, txtTelekom.indexOf('<table ', txtTelekom.search('          ARTIKULUAK'))) + txtTelekom.substring(txtTelekom.indexOf('</table>', txtTelekom.search('          ARTIKULUAK')) + 8);
                          };
                          if (txtTelekom.indexOf('<table ', txtTelekom.search('          IRUDIAK')) != -1 && txtTelekom.indexOf('<table ', txtTelekom.search('          IRUDIAK')) < txtTelekom.search('          ARTIKULUAK')) {
                            txtTelekom = txtTelekom.substring(0, txtTelekom.indexOf('<table ', txtTelekom.search('          IRUDIAK'))) + txtTelekom.substring(txtTelekom.indexOf('</table>', txtTelekom.search('          IRUDIAK')) + 8);
                          };
                          txtTelekom = txtTelekom.substring(txtTelekom.search('<td class="body">') + '<td class="body">'.length);
                          txtTelekom = txtTelekom.substring(0, txtTelekom.search('</td>'));
                          txtTelekom = hasiera + txtTelekom + amaiera;
                          txtTelekom = txtTelekom.replace(/\<a href\=\"definizioa\.asp\?Kodea\=(.).+?\>(.*?)\</g, '<a href="javascript:euskalbar.dicts.goEuskalBarTelekomKlik(\'$1hizkuntzaid\'\,\'$2\')">$2<');
                          txtTelekom = txtTelekom.replace(/Ehizkuntzaid/g, 'eu');
                          txtTelekom = txtTelekom.replace(/Ghizkuntzaid/g, 'es');
                          txtTelekom = txtTelekom.replace(/Fhizkuntzaid/g, 'fr');
                          txtTelekom = txtTelekom.replace(/Ihizkuntzaid/g, 'en');
                          txtTelekom = txtTelekom.replace(/\<img src\=\"irudiak\/eskua\.gif\"/g, '<img src="http://www.telekomunikaziohiztegia.org/irudiak/eskua.gif"');
                          txtTelekom = txtTelekom.replace(/TL_artikuluak/g, 'http://www.telekomunikaziohiztegia.org/TL_artikuluak');
                          if (zerrenda.length - 1 > 1) {
                            txtTelekom = txtTelekom + '<p>Beste batzuk:</p>';
                            for (elemind = 1; elemind < zerrenda.length - 1; elemind++) {
                              elementua = zerrenda[elemind];
                              definizioa = elementua.substring(elementua.search(/\<option value\= \"definizioa\.asp\?Kodea\=/i) + '<option value= "definizioa.asp?Kodea='.length);
                              hitza = definizioa.substring(definizioa.search('>') + 20);
                              hitza = hitza.substring(0, hitza.length - 18);
                              definizioa = definizioa.substring(0, definizioa.search("&"));
                              txtTelekom = txtTelekom + '<p><a href="javascript:euskalbar.dicts.goEuskalBarTelekomKlik2(\'' + definizioa + '\',\'' + hitza + '\')\">' + hitza + '</a></p>';
                            };
                          };
                          euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                        }
                      }
                    } catch (e) {
                      txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
                      euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                    }
                  }
                  xmlHttpReq2.open('GET', 'http://www.telekomunikaziohiztegia.org/definizioa.asp?Kodea=' + definizioa + '&Hizkuntza=' + hizkid + '&hizk=' + inthizk, true);
                  xmlHttpReq2.overrideMimeType("text/html; charset=ISO-8859-1");
                  xmlHttpReq2.send(null);
                  var requestTimer2 = setTimeout(function () {
                    xmlHttpReq2.abort();
                    txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
                    euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                  }, tout);
                } else {
                  txtTelekom = erroremezua2;
                  for (elemind = 1; elemind < zerrenda.length - 1; elemind++) {
                    elementua = zerrenda[elemind];
                    definizioa = elementua.substring(elementua.search(/\<option value\= \"definizioa\.asp\?Kodea\=/i) + '<option value= "definizioa.asp?Kodea='.length);
                    hitza = definizioa.substring(definizioa.search('>') + 20);
                    hitza = hitza.substring(0, hitza.length - 18);
                    definizioa = definizioa.substring(0, definizioa.search("&"));
                    txtTelekom = txtTelekom + '<p><a href="javascript:euskalbar.dicts.goEuskalBarTelekomKlik2(\'' + definizioa + '\',\'' + hitza + '\')\">' + hitza + '</a></p>';
                  };
                  euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                }
              }
            }
          }
        } catch (e) {
          txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
          euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
        }
      }
      xmlHttpReq.open('POST', urlTelekom, true);
      xmlHttpReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=iso-8859-1");
      xmlHttpReq.overrideMimeType("text/html; charset=ISO-8859-1");
      xmlHttpReq.send(params);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
        euskalbarLib.cleanloadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
      }, tout);
    },

    // 3000 kargatu
    getShift3000: function (source, term) {
      var txt3000 = "";
      var lang = "";
      if (source == 'es') {
        source = 'CAS';
        lang = 'Castellano';
      } else {
        source = 'EUS';
        lang = 'Euskera';
      }

      var url3000 = 'http://www1.euskadi.net/cgi-bin_m33/DicioIe.exe?Diccionario=' + source + '&Idioma=' + source + '&Txt_' + lang + '=' + escape(term);
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txt3000 = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
        return false;
      }

      xmlHttpReq.open('GET', url3000, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txt3000 = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            //Timerra garbitu
            clearTimeout(requestTimer);
            euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www1.euskadi.net/hizt_3000/indice_e.htm\">3000 hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('o3000', gBrowser.contentDocument));
            if (xmlHttpReq.status == 200) {
              txt3000 = xmlHttpReq.responseText;
              var wtable = 3;
              if (txt3000.match("No se ha encontrado") || txt3000.match("ez da aurkitu")) {
                wtable = 2;
              }
              //3000ren katea manipulatzen duen funtzioa
              txt3000 = euskalbar.comb.manipulate3000(wtable, txt3000);
              //azpisarrerak badauzka...
              if (txt3000.indexOf("cgi-bin_m33") != -1) {
                if (euskalbar.prefs.getBoolPref("query.subqueries")) {
                  array3000 = txt3000.split("Href=\'");
                  array3000.shift();
                  for (i in array3000) {
                    var url3000 = array3000[i].split("\'>")[0];
                    var txt3000s = euskalbar.comb.getsubShift3000(url3000);
                  }
                }
              }
            } else {
              txt3000 = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
            }
          }
        } catch (e) {
          txt3000 = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
        }
        euskalbarLib.cleanloadHTML(txt3000, euskalbarLib.$('a3000', gBrowser.contentDocument));
      }
    },

    // 3000ren sarrerak eta azpisarrerak kargatu
    getsubShift3000: function (url3000) {
      var txt3000s = "";

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txt3000s = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
      }
      xmlHttpReq.open('GET', url3000, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txt3000s = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txt3000s = xmlHttpReq.responseText;
              //Elhuyarren katea manipulatzen duen funtzioari deitu
              txt3000s = euskalbar.comb.manipulate3000(3, txt3000s);
              euskalbarLib.cleanloadHTML(txt3000s, euskalbarLib.$('a3000', gBrowser.contentDocument));
            }
          }
        } catch (e) {
          txt3000s = euskalbarLib._f("euskalbar.comb.error", ["3000 Hiztegia"]);
        }
      }
    },

    //3000ren katea manipulatzen duen funtzioa
    manipulate3000: function (wtable, txt3000) {
      switch (wtable) {
      case 3:
        var txt3000table1array = txt3000.split("<TABLE");
        txt3000 = txt3000table1array[wtable].substring(txt3000table1array[wtable].lenght - 1);
        var txt3000table2array = txt3000.split("<\/TABLE>");
        txt3000 = txt3000table2array[0].substring(txt3000table2array[0].lenght - 1);
        txt3000 = '<TABLE' + txt3000 + '<\/TABLE>';
        txt3000 = txt3000.replace(/<blockquote>/g, "");
        txt3000 = txt3000.replace(/<\/blockquote>/g, "");
        txt3000 = txt3000.replace(/#FFFFCC/g, " ");
        txt3000 = txt3000.replace(/font-size: 20pt/, "font-size: 12pt");
        txt3000 = txt3000.replace(/0000A0/g, "000000");
        txt3000 = txt3000.replace(/center/g, "left");
        txt3000 = txt3000.replace(/\/cgi-bin_m33/g, "http://www1.euskadi.net/cgi-bin_m33");
        txt3000 = txt3000 + "<hr size='1'>";
        return txt3000;
        break;
      case 2:
        var txt3000b = txt3000.split("<IMG")[3];
        txt3000 = "<IMG" + txt3000b;
        var txt3000b = txt3000.split("<P")[1]
        var txt3000c = txt3000.split("<P")[2];
        txt3000 = "<P" + txt3000b + "<P" + txt3000c;
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
    getShiftMorris: function (source, term) {
      var txtMorris = "";
      var lang = "";
      if (source == 'en') {
        lang = 'txtIngles';
      } else {
        lang = 'txtEuskera';
      }
      // POST bidez pasatzeko parametroak
      var parametroak = hizk + '=' + escape(term);
      var urlMorris = 'http://www1.euskadi.net/morris/resultado.asp';
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtMorris = euskalbarLib._f("euskalbar.comb.error", ["Morris"]);
        return false;
      }
      xmlHttpReq.open('POST', urlMorris, true);
      // Beharrezkoa web zerbitzariak jakin dezan zer bidaltzen dugun
      xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlHttpReq.setRequestHeader("Content-length", parametroak.length);
      xmlHttpReq.send(parametroak);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtMorris = euskalbarLib._f("euskalbar.comb.error", ["Morris"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          var div = euskalbarLib.$('aMorris', gBrowser.contentDocument);
          if (xmlHttpReq.readyState == 4) {
            // Timerra garbitu
            clearTimeout(requestTimer);
            euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www1.euskadi.net/morris/indice_e.htm\">Morris&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oMorris', gBrowser.contentDocument));
            if (xmlHttpReq.status == 200) {
              txtMorris = xmlHttpReq.responseText;
              if (txtMorris.match("Barkatu, baina sarrera hau ez dago hiztegian")) {
                txtMorris = "Ez da aurkitu " + term + " hitza.";
              } else {
                var txtMorrisTable1 = txtMorris.split("<hr>");
                txtMorris = txtMorrisTable1[1].slice(0, txtMorrisTable1[1].lastIndexOf("<table"));
                txtMorris = txtMorris.split("<td class=\"titularMaior\"")[0];
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
              txtMorris = euskalbarLib._f("euskalbar.comb.error", ["Morris"]);
            }
          }
        } catch (e) {
          txtMorris = euskalbarLib._f("euskalbar.comb.error", ["Morris"]);
        }
        euskalbarLib.cleanloadHTML(txtMorris, euskalbarLib.$('aMorris', gBrowser.contentDocument));
      }
    },


    // Labayru hiztegia kargatu
    getShiftLabayru: function (source, term) {
      var txtLabayru = "";
      var lang = "";
      if (source == 'es') {
        lang = '';
      } else {
        lang = 'EU';
      }
      // POST bidez pasatzeko parametroak
      var parametroak = 'txtPalabra=' + term + '&opc=1';
alert(parametroak);
      var urlLabayru = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras' + lang + '.asp';
alert(urlLabayru);
      var output = "";

      euskalbarLib.ajax({
        url: urlLabayru,

        onSuccess: function (data) {
          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://zerbitzuak.labayru.org/diccionario/hiztegiasarrera.asp\">Labayru&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oLabayru', gBrowser.contentDocument));

              if (data.match("No hay resultados") || data.match("Ez dago holakorik")) {
                data = "Ez da aurkitu " + term + " hitza.";
              } else {
                var data2 = data.split("Table4");
/*                data = data2[1].slice(2 + term.length, data2[1].indexOf("<form"));
                data = "<p><b>" + term + "</b></p><br/>" + data;
                data = data.replace(/<td/g, "<p");
                data = data.replace(/<\/td/g, "<\/p");
                data = data.replace(/<tr/g, "<p");
                data = data.replace(/<\/tr/g, "<\/p");*/
                data = data.replace(/CargaPalabra/g, "http://zerbitzuak.labayru.org/diccionario/CargaPalabra");
              }

          output = data;
        },

        onError: function () {
          output = euskalbarLib._f("euskalbar.comb.error", ["Labayru"]);
        },

        onComplete: function () {
          euskalbarLib.cleanloadHTML(output, euskalbarLib.$('aLabayru', gBrowser.contentDocument));
        }
      });

    },


    // Adorez sinonimoen hiztegia kargatu
    getShiftAdorez: function (source, term) {
      var txtSinonimoak = "";

      if (source == 'eu') {
        var urlSinonimoak = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe?Palabra=Introducida&Idioma=EUS&txtpalabra=' + escape(term);
      } else {
        var urlSinonimoak = 'http://www1.euskadi.net/cgi-bin_m32/sinonimoak.exe?Palabra=Introducida&Idioma=CAS&txtpalabra=' + escape(term);
      }
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtSinonimoak = euskalbarLib._f("euskalbar.comb.error", ["Adorez"]);
        return false;
      }
      xmlHttpReq.open('GET', urlSinonimoak, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtSinonimoak = euskalbarLib._f("euskalbar.comb.error", ["Adorez"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            //Timerra garbitu
            clearTimeout(requestTimer);
            euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www1.euskadi.net/hizt_sinon/indice_e.htm\">Adorez&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oAdorez', gBrowser.contentDocument));
            if (xmlHttpReq.status == 200) {
              txtSinonimoak = xmlHttpReq.responseText;
              if (txtSinonimoak.match("No se ha encontrado")) {
                txtSinonimoak = "No se ha encontrado la palabra " + term + ".";
              } else if (txtSinonimoak.match("ez da aurkitu")) {
                txtSinonimoak = term + " hitza ez da aurkitu.";
              } else {
                txtSinonimoaktable1array = txtSinonimoak.split("<TABLE");
                txtSinonimoak = txtSinonimoaktable1array[6].substring(txtSinonimoaktable1array[1].lenght - 1);
                txtSinonimoak = '<table' + txtSinonimoak;
                txtSinonimoak = txtSinonimoak.split("\/TABLE>")[0] + "/TABLE>";
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
                txtSinonimoak = '<font face="bitstream vera sans, verdana, arial" size="3"><B>' + term + '</B></font><BR><BR><font face="bitstream vera sans, verdana, arial">' + txtSinonimoak + '</font>';
              }
            } else {
              txtSinonimoak = euskalbarLib._f("euskalbar.comb.error", ["Adorez"]);
            }
          }
        } catch (e) {
          txtSinonimoak = euskalbarLib._f("euskalbar.comb.error", ["Adorez"]);
        }
        euskalbarLib.cleanloadHTML(txtSinonimoak, euskalbarLib.$('aAdorez', gBrowser.contentDocument));
      }
    },


    //UZEIren sinonimoen hiztegia kargatu
    getShiftUZEI: function (source, term) {
      var txtUZEI = "";
      var urlUZEI = 'http://www.uzei.com/estatico/sinonimos.asp?sarrera=' + escape(term) + '&eragiketa=bilatu';
      var xmlHttpReq = new XMLHttpRequest();

      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtUZEI = euskalbarLib._f("euskalbar.comb.error", ["UZEI"]);
        return false;
      }
      xmlHttpReq.open('GET', urlUZEI, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtUZEI = euskalbarLib._f("euskalbar.comb.error", ["UZEI"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            //Timerra garbitu
            clearTimeout(requestTimer);
            euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www.uzei.com/estatico/sinonimos.asp\">UZEI&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oUzei', gBrowser.contentDocument));
            if (xmlHttpReq.status == 200) {
              txtUZEI = xmlHttpReq.responseText;
              txtUZEItable1array = txtUZEI.split("<TABLE");
              txtUZEI = txtUZEItable1array[2].substring(txtUZEItable1array[1].lenght - 1);
              txtUZEI = '<table' + txtUZEI;
              txtUZEItable2array = txtUZEI.split("</table");
              txtUZEI = txtUZEItable2array[0].substring(txtUZEItable2array[1].lenght - 1);
              txtUZEI = txtUZEI + '</table>';
              txtUZEI = txtUZEI.replace(/sinonimos.asp/g, "http://www.uzei.com/estatico/sinonimos.asp");
              txtUZEI = '<font face="bitstream vera sans, verdana, arial" size="3"><B>' + term + '</B></font><font face="bitstream vera sans, verdana, arial">' + txtUZEI + '</font>';
            } else {
              txtUZEI = euskalbarLib._f("euskalbar.comb.error", ["UZEI"]);
            }
          }
        } catch (e) {
          txtUZEI = euskalbarLib._f("euskalbar.comb.error", ["UZEI"]);
        }
        euskalbarLib.cleanloadHTML(txtUZEI, euskalbarLib.$('aUzei', gBrowser.contentDocument));
      }
    },


    // Hiztegi Batua kargatu
    getShiftEuskaltzaindia: function (source, term) {
      var txtEuskaltzaindia = "";

      if (euskalbar.source == 'es') {
        idioma = 'G';
      } else if (euskalbar.source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
      }

      var urlEuskaltzaindia = 'http://www.euskaltzaindia.net/hiztegibatua/index.php?option=com_hiztegianbilatu&amp;Itemid=189&amp;lang=eu&amp;view=frontpage&amp;bila=bai&amp;sarrera=' + escape(term);
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
        return false;
      }

      xmlHttpReq.open('POST', urlEuskaltzaindia, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www.euskaltzaindia.net/hiztegibatua\">Batua&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oBatua', gBrowser.contentDocument));
              txtEuskaltzaindia = xmlHttpReq.responseText;
              txtEuskaltzaindia = euskalbar.comb.manipulateEuskaltzaindia(txtEuskaltzaindia);
              txtEuskaltzaindia = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">" + term + "<font></strong>" + txtEuskaltzaindia;
              //azpisarrerak badauzka...
              if (txtEuskaltzaindia.indexOf("index.php") != -1) {
                if (euskalbar.prefs.getBoolPref("query.subqueries")) {
                  arrayEuskaltzaindia = txtEuskaltzaindia.split("index.php");
                  arrayEuskaltzaindia.shift();
                  for (i in arrayEuskaltzaindia) {
                    var urlEuskaltzaindia = arrayEuskaltzaindia[i].split("frontpage")[0];
                    urlEuskaltzaindia = urlEuskaltzaindia + "frontpage";
                    euskalbar.comb.getsubShiftEuskaltzaindia(urlEuskaltzaindia);
                  }
                }
              }
            } else {
              txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
            }
          }
        } catch (e) {
          txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
        }
        euskalbarLib.cleanloadHTML(txtEuskaltzaindia, euskalbarLib.$('aBatua', gBrowser.contentDocument));
      }
    },

    // Batuaren sarrerak eta azpisarrerak kargatu
    getsubShiftEuskaltzaindia: function (urlEuskaltzaindia) {
      urlEuskaltzaindia = "http://www.euskaltzaindia.net/hiztegibatua/index.php" + urlEuskaltzaindia;
      var txtEuskaltzaindia = "";

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
        return false;
      }
      xmlHttpReq.open('POST', urlEuskaltzaindia, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              txtEuskaltzaindia = xmlHttpReq.responseText;
              //Batuaren katea manipulatzen duen funtzioari deitu
              txtEuskaltzaindia = euskalbar.comb.manipulateEuskaltzaindia(txtEuskaltzaindia);
              //Emaitza HTMLan kargatu
              euskalbarLib.cleanloadHTML("<hr>" + txtEuskaltzaindia, euskalbarLib.$('aBatua', gBrowser.contentDocument));
            }
          }
        } catch (e) {
          txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
        }
      }
    },

    //Batuaren katea manipulatzen duen funtzioa
    manipulateEuskaltzaindia: function (txtEuskaltzaindia) {
      var arrayEl = txtEuskaltzaindia.split("xmlns");
      arrayEl.shift();
      arrayEl.shift();
      var azkena = arrayEl.pop();
      var retEuskaltzaindia = arrayEl.join("");
      retEuskaltzaindia = "<p>&nbsp;</p><p xmlns" + retEuskaltzaindia + azkena.split("<\/td>")[0];
      return retEuskaltzaindia;
    },


    // Mokoroa kargatu
    getShiftMokoroa: function (source, term) {
      var txtMokoroa = "";

      var params = [];
      var urlMokoroa = 'http://www.hiru.com/hirupedia?p_p_id=indice_WAR_w25cIndexWAR_INSTANCE_zPs2&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2&_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_action=buscarMokoroa';
      if (source == 'es') {
        params.push(new euskalbar.QueryParameter('_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoCastellano', encodeURI(term)));
        params.push(new euskalbar.QueryParameter('_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaDialecto', 'Edozein%20Euskalki'));
      } else {
        params.push(new euskalbar.QueryParameter('_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoEuskera', encodeURI(term)));
        params.push(new euskalbar.QueryParameter('_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaDialecto', 'Edozein%20Euskalki'));
      }


      var dataString = "";
      for (var i = 0; i < params.length; ++i) {
        var param = params[i];

        dataString += (i > 0 ? "&" : "") + param.name + "=" + param.value;
      }

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=UTF-8');
      if (!xmlHttpReq) {
        txtMokoroa = euskalbarLib._f("euskalbar.comb.error", ["Mokoroa"]);
        return false;
      }
      xmlHttpReq.open('POST', urlMokoroa + "&" + dataString, true);
      xmlHttpReq.send(null);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtMokoroa = euskalbarLib._f("euskalbar.comb.error", ["Mokoroa"]);
      }, tout);
      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://www.hiru.com/hiztegiak/mokoroa\">Mokoroa&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oMokoroa', gBrowser.contentDocument));
              txtMokoroa = xmlHttpReq.responseText;
              if (txtMokoroa.indexOf("Emaitza gehiegi aurkitzen da") != -1) {
                txtMokoroa = "Emaitza gehiegi aurkitzen da";
              } else if (txtMokoroa.indexOf("Ez da emaitzarik aurkitu") != -1) {
                txtMokoroa = "Ez da emaitzarik aurkitu";
              } else {
                var txtMokoroa2 = txtMokoroa.split("<ul>	<li>	<a")[1];
                txtMokoroa = "<ul>	<li>	<a" + txtMokoroa2;
                var txtMokoroa3 = txtMokoroa.split("<div id\=\"justo")[0];
                txtMokoroa = "<strong>" + term + "<\/strong><br\/><br\/>" + txtMokoroa3 + "<div id\=\"justo";
              }
            } else {
              txtMokoroa = euskalbarLib._f("euskalbar.comb.error", ["Mokoroa"]);
            }
          }
        } catch (e) {
          txtMokoroa = euskalbarLib._f("euskalbar.comb.error", ["Mokoroa"]);
        }
        euskalbarLib.cleanloadHTML(txtMokoroa, euskalbarLib.$('aMokoroa', gBrowser.contentDocument));
      }
    },


    // Intza kargatu
    getShiftIntza: function (source, term) {
      var output = "";

      if (source == 'es') {
        var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?hitza1=' + escape(term) + '&eremu3=1&eremu1=eeki';
      } else {
        var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?eremu1=giltzarriak&hitza1=' + escape(term) + '&eremu3=1';
      }

      euskalbarLib.ajax({
        url: url,

        onSuccess: function (data) {
          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://intza.armiarma.com/cgi-bin/bilatu2.pl\">Intza&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oIntza', gBrowser.contentDocument));
          output = data;
          var output2 = output.split("Bilaketaren emaitza")[2];
          output = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">" + term + "</font></strong>" + output2;
          var output3 = output.split("<form")[0];
          output = output3.replace(/<font size=5>/g, "<font size=\"3\">");
          output = output.replace(/\/cgi-bin/g, "http:\/\/intza.armiarma.com\/cgi-bin");
          output = output.replace(/\/intza\/kon/g, "http:\/\/intza.armiarma.com\/intza\/kon");

          euskalbarLib.cleanloadHTML(output, euskalbarLib.$('aIntza', gBrowser.contentDocument));
        },

        onError: function () {
          output = euskalbarLib._f("euskalbar.comb.error", ["Intza"]);
          euskalbarLib.cleanloadHTML(output, euskalbarLib.$('aIntza', gBrowser.contentDocument));
        }
      });
    },


    // Open-tran kargatu
    getShiftOpentran: function (source, term) {
      var url = 'http://eu.open-tran.eu/suggest/' + escape(term);
      var output = "";

      euskalbarLib.ajax({
        url: url,

        onSuccess: function (data) {
          euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://eu.open-tran.eu\">Open-tran&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oOpentran', gBrowser.contentDocument));
          var txtOpentran1 = data.split("<h1>")[1];
          var txtOpentran2 = data.split("<h1>")[2];
          data = "<h1>" + txtOpentran1 + "<h1>" + txtOpentran2;

          var output = data.split("<div id=\"bottom\">")[0];
          output = output.replace(/\/images\//g, "http://eu.open-tran.eu/images/");
          output = output.replace(/<a href=\"javascript\:\;\"  onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<b>");
          output = output.replace(/<a href=\"javascript\:\;\" class=\"fuzzy\" onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<i>fuzzy</i> <b>");
          output = output.replace(/\)<\/a>/g, ")</b>");
          euskalbarLib.cleanloadHTML(output, euskalbarLib.$('aOpentran', gBrowser.contentDocument));
        },

        onError: function () {
          output = euskalbarLib._f("euskalbar.comb.error", ["Open-Tran"]);
          euskalbarLib.cleanloadHTML(output, euskalbarLib.$('aOpentran', gBrowser.contentDocument));
        }
      });

    },


    // Danobat kargatu
    getShiftDanobat: function (source, term) {
      txtDanobat = "";

      var params = [];
      var url = 'http://hiztegia.danobatgroup.com/eu/dictionary/search';
      if (source == 'es') {
        params.push(new euskalbar.QueryParameter('direction_filter', 'es-eu'));
      } else {
        params.push(new euskalbar.QueryParameter('direction_filter', 'eu-es'));
      }

      params.push(new euskalbar.QueryParameter('term_filter', term));

      var dataString = "";
      for (var i = 0; i < params.length; ++i) {
        var param = params[i];

        dataString += (i > 0 ? "&" : "") + param.name + "=" + param.value;
      }

      var xmlHttpReq = new XMLHttpRequest();
      if (!xmlHttpReq) {
        txtDanobat = euskalbarLib._f("euskalbar.comb.error", ["Danobat"]);
        return false;
      }

      xmlHttpReq.open('POST', url, true);
      xmlHttpReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xmlHttpReq.setRequestHeader("Content-length", dataString.length);
      xmlHttpReq.overrideMimeType('text/xml; charset=UTF-8');
      xmlHttpReq.send(dataString);

      //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
      var tout = euskalbar.prefs.getIntPref("query.timeout");
      tout = tout * 1000

      //Timerra sortu
      var requestTimer = setTimeout(function () {
        xmlHttpReq.abort();
        txtDanobat = euskalbarLib._f("euskalbar.comb.error", ["Danobat"]);
      }, tout);
      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              euskalbarLib.cleanloadHTML("<div id=\"oharra\"><a href=\"http://hiztegia.danobatgroup.com/eu/dictionary\">Danobat&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oDanobat', gBrowser.contentDocument));
              txtDanobat = xmlHttpReq.responseText;
              txtDanobat = txtDanobat.substring(txtDanobat.indexOf('<div id="searchresult">'), txtDanobat.indexOf('</article>'));
            } else {
              txtDanobat = euskalbarLib._f("euskalbar.comb.error", ["Danobat"]);
            }
          }
        } catch (e) {
          txtDanobat = euskalbarLib._f("euskalbar.comb.error", ["Danobat"]);
        }
        euskalbarLib.cleanloadHTML(txtDanobat, euskalbarLib.$('aDanobat', gBrowser.contentDocument));
      }
    },

    normalizatu: function (katea) {
      var kateberria;
      kateberria = katea.replace(/á/, "a");
      kateberria = kateberria.replace(/à/, "a");
      kateberria = kateberria.replace(/ä/, "a");
      kateberria = kateberria.replace(/â/, "a");
      kateberria = kateberria.replace(/é/, "e");
      kateberria = kateberria.replace(/è/, "e");
      kateberria = kateberria.replace(/ë/, "e");
      kateberria = kateberria.replace(/ê/, "e");
      kateberria = kateberria.replace(/í/, "i");
      kateberria = kateberria.replace(/ì/, "i");
      kateberria = kateberria.replace(/ï/, "i");
      kateberria = kateberria.replace(/î/, "i");
      kateberria = kateberria.replace(/ó/, "o");
      kateberria = kateberria.replace(/ò/, "o");
      kateberria = kateberria.replace(/ö/, "o");
      kateberria = kateberria.replace(/ô/, "o");
      kateberria = kateberria.replace(/ú/, "u");
      kateberria = kateberria.replace(/ù/, "u");
      kateberria = kateberria.replace(/ü/, "u");
      kateberria = kateberria.replace(/û/, "u");
      kateberria = kateberria.replace(/Á/, "A");
      kateberria = kateberria.replace(/À/, "A");
      kateberria = kateberria.replace(/Ä/, "A");
      kateberria = kateberria.replace(/Â/, "A");
      kateberria = kateberria.replace(/É/, "E");
      kateberria = kateberria.replace(/È/, "E");
      kateberria = kateberria.replace(/Ë/, "E");
      kateberria = kateberria.replace(/Ê/, "E");
      kateberria = kateberria.replace(/Í/, "I");
      kateberria = kateberria.replace(/Ì/, "I");
      kateberria = kateberria.replace(/Ï/, "I");
      kateberria = kateberria.replace(/Î/, "I");
      kateberria = kateberria.replace(/Ó/, "O");
      kateberria = kateberria.replace(/Ò/, "O");
      kateberria = kateberria.replace(/Ö/, "O");
      kateberria = kateberria.replace(/Ô/, "O");
      kateberria = kateberria.replace(/Ú/, "U");
      kateberria = kateberria.replace(/Ù/, "U");
      kateberria = kateberria.replace(/Ü/, "U");
      kateberria = kateberria.replace(/Û/, "U");
      return kateberria;
    },

    normalizatuetaminuskularatu: function (katea) {
      var kateberria;
      kateberria = katea.toLowerCase();
      kateberria = euskalbar.comb.normalizatu(kateberria);
      return kateberria;
    },

  };

