/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2013 Euskalbar Taldea (see AUTHORS file)
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

if (!euskalbar) var euskalbar = {};

euskalbar.comb = function () {

  // Private vars
  var $L = euskalbarLib,
      $ = $L.$;

  // Public interface
  return {

    // Euskalterm kargatu
    getShiftEuskalterm: function (source, term) {
      term = term.trim();
      term = $L.normalize(term);

      var langMap = {
            'es': 'ES',
            'en': 'EN',
            'fr': 'FR',
          },
          lang = langMap[euskalbar.source] || 'EU';

      // Hitz zatiak erabiltzen direnean, * komodina erabiliko bailitzan
      // egin ditzala bilaketak
      if (term.charAt(term.length - 1) != "%") {
        term = term + "%";
      }

      var output = '',
          url = 'http://www.euskara.euskadi.net/r59-15172x/eu/q91EusTermWar/kontsultaJSP/q91aAction.do?ekintza=HASI&ekin=HASI&datuakaBilaketarako%28galderakoHizkuntza%29=' + lang + '&datuakaBilaketarako%28galdera%29='+term+'&zerrenda=&hizkuntza=eu';

      $L.ajax({
        url: url,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http:\/\/www.euskara.euskadi.net\/euskalterm\">Euskalterm&nbsp;<sup>&curren;</sup></a></div>", $('oEuskalterm', gBrowser.contentDocument));

          output = data;
          output = output.substring(output.indexOf('<input type="hidden" name="datuakaFormBil(unekoSailZenbakia)" value="" id="unekoSailZenbakia" />'), output.indexOf('<div class="clr"/>'));
          output = output.replace(/q91aBilaketaAction/g, "http://www.euskara.euskadi.net/r59-15172x/eu/q91EusTermWar/kontsultaJSP/q91aBilaketaAction");
          output = output.replace(/<table  class=\"erantzuna\"/g, "<hr><table  class=\"erantzuna\"");
          output = output.replace(/<table/g, "<p");
          output = output.replace(/<\/table/g, "</p");
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Euskalterm"]);
        },

        onComplete: function () {
          $L.cleanLoadHTML(output, $('aEuskalterm', gBrowser.contentDocument));
        }
      });
    },


    getShiftElhuyar: function (source, target, term) {
      var reqURL, errorMsg, errorMsgTerm, errorMsgList,
          subEntryText, chkHizkuntza, newTarget,
          reqData = {},
          reqURL = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/',
          output = "";

      // FIXME: implement a better way to naively match locale codes
      if (/eu(-[A-Z])?/.test(euskalbar.ui.locale)) {
        reqURL += 'EU/Hiztegi-kontsulta';
        errorMsg = 'Ez dago horrelako sarrerarik';
        errorMsgTerm = 'Ez da aurkitu ' + term + ' hitza.';
        errorMsgList = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
        subEntryText = 'Azpisarrerak';
      } else if (/en(-[A-Z])?/.test(euskalbar.ui.locale)) {
        reqURL += 'EN/Dictionary-search';
        errorMsg = 'No match found';
        errorMsgTerm = 'Word ' + term + ' not found.';
        errorMsgList = 'Word not found, choose from list';
        subEntryText = 'Azpisarrerak';
      } else if (/fr(-[A-Z])?/.test(euskalbar.ui.locale)) {
        reqURL += 'FR/Dictionnaire-recherche';
        errorMsg = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
        errorMsgTerm = 'Pas de résultats pour le mot ' + term + '.';
        errorMsgList = 'Pas de résultats, choisir un mot de la liste';
        subEntryText = 'Azpisarrerak';
      } else {
        reqURL += 'ES/Consulta-de-diccionarios';
        errorMsg = 'No se han encontrado resultados para la b&uacute;squeda';
        errorMsgTerm = 'No se ha encontrado la palabra ' + term + '.';
        errorMsgList = 'No se ha encontrado la palabra, seleccione de la lista';
        subEntryText = 'Azpisarrerak';
      }

      var sourceMap = {
        es: 'gazt',
        fr: 'fran',
        en: 'ing',
        eu: 'eusk',
      }

      switch (target) {
      case 'es':
        chkHizkuntza = 'chkHizkuntzaG';
        newTarget = 'gazt';
        break;
      case 'fr':
        chkHizkuntza = 'chkHizkuntzaF';
        newTarget = 'fran';
        break;
      case 'en':
        chkHizkuntza = 'chkHizkuntzaI';
        newTarget = 'ing';
        break;
      case 'eu':
        chkHizkuntza = '';
        newTarget = '';
        break;
      }

      reqData = {
        txtHitza: term,
        nondik: sourceMap[source],
        edozer: 'ehunekoa',
        bot_kon: '>'
      }

      if (chkHizkuntza != '') {
        reqData[chkHizkuntza] = newTarget;
      }

      // TODO: Review if iso-8859-1 is necessary
      $L.ajax({
        url: reqURL,
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http:\/\/www.elhuyar.org\/hiztegia\">Elhuyar&nbsp;<sup>&curren;</sup></a></div>", $('oElhuyar', gBrowser.contentDocument));
          output = data;

          if (output.indexOf(errorMsg) != -1) {
            output = errorMsgTerm;
            var node = $('aElhuyar', gBrowser.contentDocument);
            $L.cleanLoadHTML(output, node);
          } else {
            var resultsList = output.split('div id="zerrenda"')[1],
                resultsArray = resultsList.split('a href="?'),
                hasResults = false;

            resultsArray.shift();

            for (var i in resultsArray) {
              var linkWord = resultsArray[i].split(">")[1].split("<")[0],
                  linkWordNorm = $L.normalize(linkWord),
                  originalNorm = $L.normalize(term),
                  params = resultsArray[i].split('"')[0].replace(/amp\;/g, "");

              if (linkWordNorm === originalNorm ||
                  linkWordNorm === '1 ' + originalNorm ||
                  linkWordNorm === '2 ' + originalNorm ||
                  linkWordNorm === '3 ' + originalNorm ||
                  linkWordNorm === '4 ' + originalNorm ||
                  linkWordNorm === '5 ' + originalNorm ||
                  linkWordNorm === '6 ' + originalNorm ||
                  linkWordNorm === '7 ' + originalNorm ||
                  linkWordNorm === '8 ' + originalNorm ||
                  linkWordNorm === '9 ' + originalNorm ||
                  linkWordNorm === '10 ' + originalNorm) {
                hasResults = true;
                euskalbar.comb.getsubShiftElhuyar(reqURL, params, true);
              }
            }

            if (!hasResults) {
              $L.cleanLoadHTML('<p><strong><font face="bitstream vera sans, verdana, arial" size="3">' + decodeURI(term) + '<font></strong></p><p></p><p><font color="black" face="bitstream vera sans, verdana, arial" size="-1">' + errorMsgList + '</font></p><p></p>', $('aElhuyar', gBrowser.contentDocument));

              for (var i in resultsArray) {
                var linkWord = resultsArray[i].split(">")[1].split("<")[0],
                    params = resultsArray[i].split('"')[0];
                params = params.replace(/amp\;/g, "");

                $L.cleanLoadHTML('<p><a href="' + reqURL + "?" + params.replace('txtHitza=' + encodeURIComponent(term), 'txtHitza=' + linkWord) + '">' + linkWord + '</a></p>', $('aElhuyar', gBrowser.contentDocument));
              }
            }
          }
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Elhuyar"]);
        },

        onComplete: function () {
          var node = $('Elhuyar', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },

    getsubShiftElhuyar: function (reqURL, params, isSubQuery) {
      var subEntryText,
          output = "";

      if (/eu(-[A-Z])?/.test(euskalbar.ui.locale)) {
        subEntryText = 'Azpisarrerak';
      } else if (/en(-[A-Z])?/.test(euskalbar.ui.locale)) {
        subEntryText = 'Sub-headwords';
      } else if (/fr(-[A-Z])?/.test(euskalbar.ui.locale)) {
        subEntryText = 'Sous-entrées';
      } else {
        subEntryText = 'Subentradas';
      }

      // TODO: Review if iso-8859-1 is necessary
      $L.ajax({
        url: reqURL,
        data: params,

        onSuccess: function (data) {
          output = data;
          // Elhuyarren katea manipulatzen duen funtzioari deitu
          var txtBody = euskalbar.comb.manipulateElhuyar(output);

          var node = $('aElhuyar', gBrowser.contentDocument);
          $L.cleanLoadHTML(txtBody, node);

          // Only make subqueries if the function isn't being called
          // recursively and subqueries are enabled
          if (isSubQuery && euskalbar.prefs.getBoolPref("query.subqueries")) {
            var txtElhuyar2 = output.split(subEntryText)[1];
            var arrayElhuyar = txtElhuyar2.split('a href="?');
            arrayElhuyar.shift();

            for (var i in arrayElhuyar) {
              var params = arrayElhuyar[i].split('"')[0];
              params = params.replace(/amp\;/g, "");
              if (params.indexOf("mota=azpisarrera") !== -1) {
                euskalbar.comb.getsubShiftElhuyar(reqURL, params, false);
              }
            }
          }
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Elhuyar"]);
        },

        onComplete: function () {
          var node = $('Elhuyar', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }

      });
    },


    manipulateElhuyar: function (txt) {
      var txtSplit,
          reqURL = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/';

      // FIXME: implement a better way to naively match locale codes
      if (/eu(-[A-Z])?/.test(euskalbar.ui.locale)) {
        reqURL += 'EU/Hiztegi-kontsulta';
        txtSplit = 'Emaitza:';
      } else if (/en(-[A-Z])?/.test(euskalbar.ui.locale)) {
        reqURL += 'EN/Dictionary-search';
        txtSplit = 'Result:';
      } else if (/fr(-[A-Z])?/.test(euskalbar.ui.locale)) {
        reqURL += 'FR/Dictionnaire-recherche';
        txtSplit = 'R&eacute;sultat:';
      } else {
        reqURL += 'ES/Consulta-de-diccionarios';
        txtSplit = 'Resultado:';
      }

      var txtBody = txt.split(txtSplit)[1];

      // Remove kxo! ad
      txtBody = txtBody.split('<h2>')[1];

      if (txtBody.indexOf("<!-- _______  end") === -1) {
        txt = txtBody.split("<!-- end")[0];
      } else {
        txt = txtBody.split("<!-- _______  end")[0];
      }

      txt = txt.replace(/<h2>/, '<font face="bitstream vera sans, verdana, arial" size="3"><B>');
      txt = txt.replace(/<\/h2>/, "<\/B><\/font>");
      txt = txt.replace(/<p class="hiz"><strong lang="\w{2}">.*<\/strong><\/p>/, "");
      txt = txt.replace(/<a href="\?/g, '<a href="' + reqURL + '\?');
      txt = txt.replace(/amp\;/g, '');
      txt = txt + "<hr size='1'>";

      return txt;
    },


    // ZT Hiztegia
    getShiftZTHiztegia: function (source, term) {

      var output = "",
          reqData = {},
          lang = '',
          url = 'http://zthiztegia.elhuyar.org/api/search';

      var langMap = {
        es: 'es',
        fr: 'fr',
        en: 'en',
        eu: 'eu',
        la: 'la',
      }
      lang = langMap[source];

      reqData = {
        'action': 'searchTerms',
        'term': term,
        'lang': lang,
        'selectAlorra': '0'
      }

      $L.ajax({
        url: url,
        type: 'GET',
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://zthiztegia.elhuyar.org\">ZT hiztegia&nbsp;<sup>&curren;</sup></a></div>", $('oZthiztegia', gBrowser.contentDocument));
          output = data;
          if (output.match('termId')) {
            var id = JSON.parse(output)[0].termId;
            euskalbar.comb.getsubShiftZTHiztegia(id);
          } else {
            output = $L._f("euskalbar.comb.noword", [term]);
            var node = $('aZthiztegia', gBrowser.contentDocument);
            $L.cleanLoadHTML(output, node);
          }
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["ZT Hiztegia"]);
        },

        onComplete: function () {

        }
      });
    },


    getsubShiftZTHiztegia: function (id) {
      var output = "",
          url = 'http://zthiztegia.elhuyar.org/api/search?action=retrieveTerm&key=' + id,
          reqData = {};

      $L.ajax({
        url: url,
        type: 'GET',
        data: reqData,

        onSuccess: function (data) {
          output = data;
          output = output.substring(output.indexOf('<dl class="testua">'), output.indexOf('<ul id="menu_3">'));
          output = output.replace(/<a/g, "<span");
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["ZT Hiztegia"]);
        },

        onComplete: function () {
          var node = $('aZthiztegia', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },


    // Telekomunikazio Hiztegia
    getShiftTelekom: function (source, term) {

      var output = "",
          reqData = {},
          lang = '',
          url = 'http://www.telekomunikaziohiztegia.org/bilatu.asp';

      var langMap = {
        es: 'G',
        fr: 'F',
        en: 'I',
        eu: 'E',
      }
      lang = langMap[source];

      reqData = {
        'hizk': 'eusk',
        'txtHitza': term,
        'optNon': 'Terminotan',
        'selectHizkuntza': lang,
        'selectAlorra': '0'
      }

      $L.ajax({
        url: url,
        type: 'POST',
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.telekomunikaziohiztegia.org\">Telekomunikazio hiztegia&nbsp;<sup>&curren;</sup></a></div>", $('oTelekom', gBrowser.contentDocument));
          output = data;
          if (output.match("Hutsa=bai")) {
            output = $L._f("euskalbar.comb.noword", [term]);
          } else {
            output = output.substring(output.indexOf('<form name="form2"'), output.indexOf('document.form1.txtHitza.focus'));
            output = output.replace(/selected/g, "");
            var urls = output.split("definizioa.asp");
            urls.shift();
            urls.shift();
            output = "";
            for (var i in urls) {
              var reqURL = urls[i].split("\"")[0];
              reqURL = "http://www.telekomunikaziohiztegia.org/definizioa.asp" + reqURL;
              euskalbar.comb.getsubShiftTelekom(reqURL);
            }
          }
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Telekomunikazioak"]);
        },

        onComplete: function () {
          var node = $('aTelekom', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },

    getsubShiftTelekom: function (url) {

      var output = "",
          reqData = {};

      $L.ajax({
        url: url,
        type: 'GET',
        mimeType: 'text/html; charset=ISO-8859-1',
        data: reqData,

        onSuccess: function (data) {
          output = data;
          output = output.substring(output.indexOf('<td class="sarrera">'), output.indexOf('IKUS'));
          output = output.replace(/irudiak\/espacio.gif/g, "");
          output = output.replace(/irudiak\/naranja.gif/g, "");
          output = output.replace(/irudiak\/bot-inprimatu.gif/g, "");
          output = output.replace(/width=\"...\"/g, "width=\"\"");
          output = output.replace(/width=\"..\"/g, "width=\"\"");
          output = output.replace(/definizioa.asp/g, "http://www.telekomunikaziohiztegia.org/definizioa.asp");
          output = "<hr/>" + output;
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Telekomunikazioak"]);
        },

        onComplete: function () {
          var node = $('aTelekom', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },

    // Morris hiztegia kargatu
    getShiftMorris: function (source, term) {
      var output = "",
          reqData = {},
          url = 'http://www1.euskadi.net/morris/resultado.asp',
          langMap = {'en': 'txtIngles'},
          lang = langMap[source] || 'txtEuskera';

      reqData[lang] = term;

      $L.ajax({
        url: url,
        type: 'POST',
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www1.euskadi.net/morris\">Morris&nbsp;<sup>&curren;</sup></a></div>", $('oMorris', gBrowser.contentDocument));
          output = data;
          if (output.match("Barkatu, baina sarrera hau ez dago hiztegian")) {
            // FIXME: L10n
            output = "Ez da aurkitu " + term + " hitza.";
          } else {
            var table = output.split("<hr>");
            output = table[1].slice(0, table[1].lastIndexOf("<table"));
            output = output.split("<td class=\"titularMaior\"")[0];
            output = output.replace(/images/g, "http://www1.euskadi.net/morris/images");
            output = output.replace(/datuak/g, "http://www1.euskadi.net/morris/datuak");
            output = output.replace(/font-size: 8pt/g, "font-size: 10pt");
            output = output.replace(/font-size:11ptl/g, "font-size: 12pt<br>");
            output = output.replace(/color:green/g, "color: #000000");
            output = output.replace(/Arial, Helvetica, sans-serif/g, "bitstream vera sans, verdana, arial");
            output = output.replace(/width="550"/g, "");
            output = output.replace(/width="150"/g, "");
          }
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Morris"]);
        },

        onComplete: function () {
          var node = $('aMorris', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },


    // Labayru hiztegia kargatu
    getShiftLabayru: function (source, term) {

      var lang;

      if (source == 'es') {
        lang = '';
      } else {
        lang = 'EU';
      }

      var output = "",
          reqData = {},
          url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras' + lang + '.asp';

      reqData = {
        txtPalabra: term,
        opc: '1'
      }

      $L.ajax({
        url: url,
        type: 'POST',
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://zerbitzuak.labayru.org/diccionario/hiztegiasarrera.asp\">Labayru&nbsp;<sup>&curren;</sup></a></div>", $('oLabayru', gBrowser.contentDocument));
          output = data;
          if (output.match("Ez dago holakorik") || output.match("No hay resultados")) {
            output = $L._f("euskalbar.comb.noword", [term]);
          } else {
            var output1 = output.split("HiztegiaPalabra");
            output = output1[1].slice(2 + term.length, output1[1].indexOf("<form"));
            output = "<p><b>" + term + "</b></p><br/>" + output;
            output = output.replace(/<td/g, "<p");
            output = output.replace(/<\/td/g, "<\/p");
            output = output.replace(/<tr/g, "<p");
            output = output.replace(/<\/tr/g, "<\/p");
            output = output.replace(/CargaPalabra/g, "http://zerbitzuak.labayru.org/diccionario/CargaPalabra");
          }
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Labayru"]);
        },

        onComplete: function () {
          var node = $('aLabayru', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },


    getShiftUZEI: function (source, term) {
      var output = "",
          reqURL = 'http://www.uzei.com/estatico/sinonimos.asp',
          reqData = {sarrera: term, eragiketa: 'bilatu'};

      $L.ajax({
        url: reqURL,
        data: reqData,
        mimeType: 'text/html; charset=ISO-8859-1',

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.uzei.com/estatico/sinonimos.asp\">UZEI&nbsp;<sup>&curren;</sup></a></div>", $('oUzei', gBrowser.contentDocument));
          output = data;
          var table = output.split("<TABLE");
          output = table[2].substring(-1);
          output = '<table' + output;
          var table2 = output.split("</table");
          output = table2[0].substring(-1);
          output = output + '</table>';
          output = output.replace(/sinonimos.asp/g, reqURL);
          output = '<font face="bitstream vera sans, verdana, arial" size="3"><B>'
            + term + '</B></font><font face="bitstream vera sans, verdana, arial">'
            + output + '</font>';
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["UZEI"]);
        },

        onComplete: function () {
          var node = $('aUzei', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },

    // Hiztegi Batua kargatu
    getShiftEuskaltzaindia: function (source, term) {
      var idioma,
          txtEuskaltzaindia = "";

      if (euskalbar.source == 'es') {
        idioma = 'G';
      } else if (euskalbar.source == 'en') {
        idioma = 'I';
      } else {
        idioma = 'E';
      }

      var urlEuskaltzaindia = 'http://www.euskaltzaindia.net/hiztegibatua/index.php?option=com_hiztegianbilatu&amp;Itemid=189&amp;lang=eu&amp;view=frontpage&amp;bila=bai&amp;sarrera=' + encodeURIComponent(term);
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
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
        txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
      }, tout);

      xmlHttpReq.onreadystatechange = function () {
        try {
          if (xmlHttpReq.readyState == 4) {
            if (xmlHttpReq.status == 200) {
              //Timerra garbitu
              clearTimeout(requestTimer);
              $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.euskaltzaindia.net/hiztegibatua\">Batua&nbsp;<sup>&curren;</sup></a></div>", $('oBatua', gBrowser.contentDocument));
              txtEuskaltzaindia = xmlHttpReq.responseText;
              txtEuskaltzaindia = euskalbar.comb.manipulateEuskaltzaindia(txtEuskaltzaindia);
              txtEuskaltzaindia = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">" + term + "<font></strong>" + txtEuskaltzaindia;
              //azpisarrerak badauzka...
              if (txtEuskaltzaindia.indexOf("index.php") != -1) {
                if (euskalbar.prefs.getBoolPref("query.subqueries")) {
                  var arrayEuskaltzaindia = txtEuskaltzaindia.split("index.php");
                  arrayEuskaltzaindia.shift();
                  for (var i in arrayEuskaltzaindia) {
                    var urlEuskaltzaindia = arrayEuskaltzaindia[i].split("frontpage")[0];
                    urlEuskaltzaindia = urlEuskaltzaindia + "frontpage";
                    euskalbar.comb.getsubShiftEuskaltzaindia(urlEuskaltzaindia);
                  }
                }
              }
            } else {
              txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
            }
          }
        } catch (e) {
          txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
        }
        $L.cleanLoadHTML(txtEuskaltzaindia, $('aBatua', gBrowser.contentDocument));
      }
    },

    // Batuaren sarrerak eta azpisarrerak kargatu
    getsubShiftEuskaltzaindia: function (urlEuskaltzaindia) {
      urlEuskaltzaindia = "http://www.euskaltzaindia.net/hiztegibatua/index.php" + urlEuskaltzaindia;
      var txtEuskaltzaindia = "";

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
      if (!xmlHttpReq) {
        txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
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
        txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
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
              $L.cleanLoadHTML("<hr>" + txtEuskaltzaindia, $('aBatua', gBrowser.contentDocument));
            }
          }
        } catch (e) {
          txtEuskaltzaindia = $L._f("euskalbar.comb.error", ["Hiztegi Batua"]);
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

      var output = "",
          reqData = {},
          url = 'http://www.hiru.com/hirupedia?p_p_id=indice_WAR_w25cIndexWAR_INSTANCE_zPs2&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2&_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_action=buscarMokoroa';

      reqData = {
        '_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaFuente': '',
        '_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaDialecto': 'Edozein Euskalki'
      }

      if (source == 'es') {
        reqData['_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoCastellano'] = term;
      } else {
        reqData['_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoEuskera'] = term;
      }

      $L.ajax({
        url: url,
        type: 'POST',
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.hiru.com/hiztegiak/mokoroa\">Mokoroa&nbsp;<sup>&curren;</sup></a></div>", $('oMokoroa', gBrowser.contentDocument));
          output = data;
          output = output.substring(output.indexOf('<font color=red >'), output.indexOf('<div id="justo_mokoroa">'));
        },
        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Mokoroa"]);
        },

        onComplete: function () {
          var node = $('aMokoroa', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },


    // Intza kargatu
    getShiftIntza: function (source, term) {
      var url, output = "";

      if (source == 'es') {
        url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?hitza1=' + encodeURIComponent(term) + '&eremu3=1&eremu1=eeki';
      } else {
        url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?eremu1=giltzarriak&hitza1=' + encodeURIComponent(term) + '&eremu3=1';
      }

      $L.ajax({
        url: url,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://intza.armiarma.com/cgi-bin/bilatu2.pl\">Intza&nbsp;<sup>&curren;</sup></a></div>", $('oIntza', gBrowser.contentDocument));
          output = data;
          var output2 = output.split("Bilaketaren emaitza")[2];
          output = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">" + term + "</font></strong>" + output2;
          var output3 = output.split("<form")[0];
          output = output3.replace(/<font size=5>/g, "<font size=\"3\">");
          output = output.replace(/\/cgi-bin/g, "http:\/\/intza.armiarma.com\/cgi-bin");
          output = output.replace(/\/intza\/kon/g, "http:\/\/intza.armiarma.com\/intza\/kon");

          $L.cleanLoadHTML(output, $('aIntza', gBrowser.contentDocument));
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Intza"]);
          $L.cleanLoadHTML(output, $('aIntza', gBrowser.contentDocument));
        }
      });
    },


    // Open-tran kargatu
    getShiftOpentran: function (source, term) {
      var url = 'http://eu.open-tran.eu/suggest/' + encodeURIComponent(term);
      var output = "";

      $L.ajax({
        url: url,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://eu.open-tran.eu\">Open-tran&nbsp;<sup>&curren;</sup></a></div>", $('oOpentran', gBrowser.contentDocument));
          var txtOpentran1 = data.split("<h1>")[1];
          var txtOpentran2 = data.split("<h1>")[2];
          data = "<h1>" + txtOpentran1 + "<h1>" + txtOpentran2;

          var output = data.split("<div id=\"bottom\">")[0];
          output = output.replace(/\/images\//g, "http://eu.open-tran.eu/images/");
          output = output.replace(/<a href=\"javascript\:\;\"  onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<b>");
          output = output.replace(/<a href=\"javascript\:\;\" class=\"fuzzy\" onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<i>fuzzy</i> <b>");
          output = output.replace(/\)<\/a>/g, ")</b>");
          $L.cleanLoadHTML(output, $('aOpentran', gBrowser.contentDocument));
        },

        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Open-Tran"]);
          $L.cleanLoadHTML(output, $('aOpentran', gBrowser.contentDocument));
        }
      });
    },


    // Danobat kargatu
    getShiftDanobat: function (source, term) {

      var lang;
      if (source == 'es') {
        lang = 'es-eu';
      } else {
        lang = 'eu-es';
      }

      var output = "",
          reqData = {},
          url = 'http://hiztegia.danobatgroup.com/eu/dictionary/search';

      reqData = {
        "term_filter": term,
        "direction_filter": lang
      }

      $L.ajax({
        url: url,
        type: 'POST',
        data: reqData,

        onSuccess: function (data) {
          $L.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://hiztegia.danobatgroup.com/eu/dictionary\">Danobat&nbsp;<sup>&curren;</sup></a></div>", $('oDanobat', gBrowser.contentDocument));

          output = data;
          output = output.substring(output.indexOf('<div id="searchresult">'), output.indexOf('</article>'));

        },
        onError: function () {
          output = $L._f("euskalbar.comb.error", ["Danobat"]);
        },

        onComplete: function () {
          var node = $('aDanobat', gBrowser.contentDocument);
          $L.cleanLoadHTML(output, node);
        }
      });
    },

  };

}();
