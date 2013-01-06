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

euskalbar.comb = {

  // Euskalterm kargatu
  getShiftEuskalterm: function (source, term) {
    term = term.trim();
    term = euskalbar.comb.normalize(term);

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

    euskalbarLib.ajax({
      url: url,

      onSuccess: function (data) {
        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http:\/\/www.euskara.euskadi.net\/euskalterm\">Euskalterm&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oEuskalterm', gBrowser.contentDocument));

        output = data;
        output = output.substring(output.indexOf('<input type="hidden" name="datuakaFormBil(unekoSailZenbakia)" value="" id="unekoSailZenbakia" />'), output.indexOf('<div class="clr"/>'));
        output = output.replace(/q91aBilaketaAction/g, "http://www.euskara.euskadi.net/r59-15172x/eu/q91EusTermWar/kontsultaJSP/q91aBilaketaAction");
        output = output.replace(/<table  class=\"erantzuna\"/g, "<hr><table  class=\"erantzuna\"");
      },

      onError: function () {
        output = euskalbarLib._f("euskalbar.comb.error", ["Euskalterm"]);
      },

      onComplete: function () {
        euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aEuskalterm', gBrowser.contentDocument));
      }
    });
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftEuskalterm, true);
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
    euskalbarLib.ajax({
      url: reqURL,
      data: reqData,

      onSuccess: function (data) {
        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http:\/\/www.elhuyar.org\/hiztegia\">Elhuyar&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oElhuyar', gBrowser.contentDocument));
        output = data;

        if (output.indexOf(errorMsg) != -1) {
          output = errorMsgTerm;
          var node = euskalbarLib.$('aElhuyar', gBrowser.contentDocument);
          euskalbarLib.cleanLoadHTML(output, node);
        } else {
          var resultsList = output.split('div id="zerrenda"')[1],
              resultsArray = resultsList.split('a href="?'),
              hasResults = false;

          resultsArray.shift();

          for (var i in resultsArray) {
            var linkWord = resultsArray[i].split(">")[1].split("<")[0],
                linkWordNorm = euskalbar.comb.normalize(linkWord),
                originalNorm = euskalbar.comb.normalize(term),
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
            euskalbarLib.cleanLoadHTML('<p><strong><font face="bitstream vera sans, verdana, arial" size="3">' + decodeURI(term) + '<font></strong></p><p></p><p><font color="black" face="bitstream vera sans, verdana, arial" size="-1">' + errorMsgList + '</font></p><p></p>', euskalbarLib.$('aElhuyar', gBrowser.contentDocument));

            for (var i in resultsArray) {
              var linkWord = resultsArray[i].split(">")[1].split("<")[0],
                  params = resultsArray[i].split('"')[0];
              params = params.replace(/amp\;/g, "");

              euskalbarLib.cleanLoadHTML('<p><a href="' + reqURL + "?" + params.replace('txtHitza=' + encodeURIComponent(term), 'txtHitza=' + linkWord) + '">' + linkWord + '</a></p>', euskalbarLib.$('aElhuyar', gBrowser.contentDocument));
            }
          }
        }
      },

      onError: function () {
        output = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
      },

      onComplete: function () {
        var node = euskalbarLib.$('Elhuyar', gBrowser.contentDocument);
        euskalbarLib.cleanLoadHTML(output, node);
      }
    });
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftElhuyar, true);
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
    euskalbarLib.ajax({
      url: reqURL,
      data: params,

      onSuccess: function (data) {
        output = data;
        // Elhuyarren katea manipulatzen duen funtzioari deitu
        var txtBody = euskalbar.comb.manipulateElhuyar(output);

        var node = euskalbarLib.$('aElhuyar', gBrowser.contentDocument);
        euskalbarLib.cleanLoadHTML(txtBody, node);

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
        output = euskalbarLib._f("euskalbar.comb.error", ["Elhuyar"]);
      },

      onComplete: function () {
        var node = euskalbarLib.$('Elhuyar', gBrowser.contentDocument);
        euskalbarLib.cleanLoadHTML(output, node);
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



  // ZT Hiztegiaren markoa kargatu
  getShiftZTHiztegia: function (source, term) {
    var output = euskalbarLib._f("euskalbar.comb.disabled", ["ZT hiztegia"]);
    euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://zthiztegia.elhuyar.org\">ZT hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oZthiztegia', gBrowser.contentDocument));
    euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));

    /* FIXME: Use new Ajax POST function
    var erroremezua, erroremezua2,
        lang = euskalbarLib._("hizk");

    if (lang.match('euskara')) {
      erroremezua = 'Ez dago horrelako terminorik';
      erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
    } else if (lang.match('english')) {
      erroremezua = 'Term not found';
      erroremezua2 = 'Word not found, choose from list';
    } else if (lang.match('français')) {
      erroremezua = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
      erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
    } else {
      erroremezua = 'No se han encontrado resultados para la b&uacute;squeda';
      erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
    }

    var xmlHttpReq = new XMLHttpRequest();
    if (!xmlHttpReq) {
      txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
      euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
      return false;
    }
    xmlHttpReq.open('GET', 'http://zthiztegia.elhuyar.org/api/search?action=searchTerms&term=' + euskalbar.comb.normalize(term) + '%25&lang=' + source, true);
    xmlHttpReq.send(null);

    //Hiztegiak kargatzen zenbat denbora egongo den, kargak huts egin arte
    var tout = euskalbar.prefs.getIntPref("query.timeout");
    tout = tout * 1000

    //Timerra sortu
    var requestTimer = setTimeout(function () {
      xmlHttpReq.abort();
      txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
      euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
    }, tout);
    xmlHttpReq.onreadystatechange = function () {
      try {
        if (xmlHttpReq.readyState == 4) {
          if (xmlHttpReq.status == 200) {
            //Timerra garbitu
            clearTimeout(requestTimer);
            var erantzuna = xmlHttpReq.responseText;
            if (erantzuna == '[]') {
              txtZTHiztegia = erroremezua;
              euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
            } else {
              ztzerrenda = JSON.parse(erantzuna);
              if (ztzerrenda[0].sortKey == euskalbar.comb.normalize(term)) {
                termida = ztzerrenda[0].termId;
                var xmlHttpReq2 = new XMLHttpRequest();
                if (!xmlHttpReq2) {
                  txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
                  euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                  return false;
                }
                xmlHttpReq2.open('GET', 'http://zthiztegia.elhuyar.org/api/search?action=retrieveTerm&key=' + termida, true);
                xmlHttpReq2.send(null);
                var requestTimer2 = setTimeout(function () {
                  xmlHttpReq2.abort();
                  txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
                  euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                }, tout);
                xmlHttpReq2.onreadystatechange = function () {
                  try {
                    if (xmlHttpReq2.readyState == 4) {
                      if (xmlHttpReq2.status == 200) {
                        //Timerra garbitu
                        clearTimeout(requestTimer2);
                        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://zthiztegia.elhuyar.org\">ZT hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oZthiztegia', gBrowser.contentDocument));
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
                        euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));

                      }
                    }
                  } catch (e) {
                    txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
                    euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
                  }
                }
              } else {
                txtZTHiztegia = erroremezua2;
                for (termind = 0; termind < ztzerrenda.length; termind++) {
                  txtZTHiztegia = txtZTHiztegia + '<p><a href="javascript:euskalbar.dicts.goEuskalBarZTHiztegiaKlik(\'' + source + '\',\'' + ztzerrenda[termind].term + '\')\">' + ztzerrenda[termind].term + '</a></p>';
                }
                euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
              }
            }
          }
        }
      } catch (e) {
        txtZTHiztegia = euskalbarLib._f("euskalbar.comb.error", ["ZT Hiztegia"]);
        euskalbarLib.cleanLoadHTML(txtZTHiztegia, euskalbarLib.$('aZthiztegia', gBrowser.contentDocument));
      }
    }
*/
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftZTHiztegia, true);
  },


  // Telekomunikazio Hiztegiaren markoa kargatu
  getShiftTelekom: function (source, term) {
    var output = euskalbarLib._f("euskalbar.comb.disabled", ["Telekomunikazio hiztegia"]);
    euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.telekomunikaziohiztegia.org\">Telekomunikazio hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oTelekom', gBrowser.contentDocument));
    euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aTelekom', gBrowser.contentDocument));

    /* FIXME: Use new Ajax POST function
    var erroremezua, erroremezua2, inthizk, hizkid
        lang = euskalbarLib._("hizk");

    if (lang.match('euskara')) {
      erroremezua = 'Ez dago horrelako terminorik';
      erroremezua2 = 'Hitza ez da aurkitu, aukeratu bat zerrendatik';
      inthizk = 'eusk'
    } else if (lang.match('english')) {
      erroremezua = 'Term not found';
      erroremezua2 = 'Word not found, choose from list';
      inthizk = 'gazt'
    } else if (lang.match('français')) {
      erroremezua = 'Aucun r&eacute;sultat pour votre entr&eacute;e';
      erroremezua2 = 'Pas de résultats, choisir un mot de la liste';
      inthizk = 'gazt'
    } else {
      erroremezua = 'No se han encontrado resultados para la b&uacute;squeda';
      erroremezua2 = 'No se ha encontrado la palabra, seleccione de la lista';
      inthizk = 'gazt'
    }

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
      txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
      euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
      return false;
    }
    var urlTelekom = 'http://www.telekomunikaziohiztegia.org/bilatu.asp?';
    var params = 'hizk=' + inthizk + '&txtHitza=' + euskalbar.comb.normalize(term).replace(' ', '%20') + '%25&selectHizkuntza=' + hizkid + '&optNon=Terminotan&selectAlorra=0';

    var xmlHttpReq = new XMLHttpRequest();
    if (!xmlHttpReq) {
      txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
      return false;
    }

    xmlHttpReq.onreadystatechange = function () {
      try {
        if (xmlHttpReq.readyState == 4) {
          if (xmlHttpReq.status == 200) {
            //Timerra garbitu
            clearTimeout(requestTimer);
            var erantzuna = xmlHttpReq.responseText;
            if (erantzuna.search(/\<select name\=\"selectTerm\"/i) == -1) {
              txtTelekom = erroremezua;
              euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
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
              if (euskalbar.comb.normalize(hitza) == euskalbar.comb.normalize(term)) {
                var xmlHttpReq2 = new XMLHttpRequest();
                if (!xmlHttpReq2) {
                  txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
                  euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                  return false;
                }
                xmlHttpReq2.onreadystatechange = function () {
                  try {
                    if (xmlHttpReq2.readyState == 4) {
                      if (xmlHttpReq2.status == 200) {
                        //Timerra garbitu
                        clearTimeout(requestTimer2);
                        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.telekomunikaziohiztegia.org/\">Telekomunikazio hiztegia&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oTelekom', gBrowser.contentDocument));
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
                        euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                      }
                    }
                  } catch (e) {
                    txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
                    euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
                  }
                }
                xmlHttpReq2.open('GET', 'http://www.telekomunikaziohiztegia.org/definizioa.asp?Kodea=' + definizioa + '&Hizkuntza=' + hizkid + '&hizk=' + inthizk, true);
                xmlHttpReq2.overrideMimeType("text/html; charset=ISO-8859-1");
                xmlHttpReq2.send(null);
                var requestTimer2 = setTimeout(function () {
                  xmlHttpReq2.abort();
                  txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
                  euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
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
                euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
              }
            }
          }
        }
      } catch (e) {
        txtTelekom = euskalbarLib._f("euskalbar.comb.error", ["Telekomunikazio Hiztegia"]);
        euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
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
      euskalbarLib.cleanLoadHTML(txtTelekom, euskalbarLib.$('aTelekom', gBrowser.contentDocument));
    }, tout);
*/

    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftTelekom, true);
  },


  // Morris hiztegia kargatu
  getShiftMorris: function (source, term) {
    var output = "",
        reqData = {},
        url = 'http://www1.euskadi.net/morris/resultado.asp',
        langMap = {'en': 'txtIngles'},
        lang = langMap[source] || 'txtEuskera';

    reqData[lang] = term;

    euskalbarLib.ajax({
      url: url,
      type: 'POST',
      data: reqData,

      onSuccess: function (data) {
        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www1.euskadi.net/morris\">Morris&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oMorris', gBrowser.contentDocument));
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
        output = euskalbarLib._f("euskalbar.comb.error", ["Morris"]);
      },

      onComplete: function () {
        var node = euskalbarLib.$('aMorris', gBrowser.contentDocument);
        euskalbarLib.cleanLoadHTML(output, node);
      }
    });
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftMorris, true);
  },


  // Labayru hiztegia kargatu
  getShiftLabayru: function (source, term) {
    var output = euskalbarLib._f("euskalbar.comb.disabled", ["Labayru"]);
    euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://zerbitzuak.labayru.org/diccionario/hiztegiasarrera.asp\">Labayru&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oLabayru', gBrowser.contentDocument));
    euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aLabayru', gBrowser.contentDocument));

    /* FIXME: Use new Ajax POST function
    var hizk,
        txtLabayru = "";

    if (source == 'es') {
      hizk = '';
    } else {
      hizk = 'EU';
    }
    // POST bidez pasatzeko parametroak
    var parametroak = 'txtPalabra=' + term + '&opc=1';
    var urlLabayru = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras' + hizk + '.asp';
    var xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.overrideMimeType('text/xml; charset=ISO-8859-1');
    if (!xmlHttpReq) {
      txtLabayru = euskalbarLib._f("euskalbar.comb.error", ["Labayru"]);
      return false;
    }
    xmlHttpReq.open('POST', urlLabayru, true);
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
      txtLabayru = euskalbarLib._f("euskalbar.comb.error", ["Labayru"]);
    }, tout);

    xmlHttpReq.onreadystatechange = function () {
      try {
        div = euskalbarLib.$('aLabayru', gBrowser.contentDocument);
        if (xmlHttpReq.readyState == 4) {
          // Timerra garbitu
          clearTimeout(requestTimer);
          euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://zerbitzuak.labayru.org/diccionario/hiztegiasarrera.asp\">Labayru&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oLabayru', gBrowser.contentDocument));
          if (xmlHttpReq.status == 200) {
            txtLabayru = xmlHttpReq.responseText;
            if (txtLabayru.match("No hay resultados") || txtLabayru.match("Ez dago holakorik")) {
              txtLabayru = "Ez da aurkitu " + term + " hitza.";
            } else {
              var txtLab1 = txtLabayru.split("HiztegiaPalabra");
              txtLabayru = txtLab1[1].slice(2 + term.length, txtLab1[1].indexOf("<form"));
              txtLabayru = "<p><b>" + term + "</b></p><br/>" + txtLabayru;
              txtLabayru = txtLabayru.replace(/<td/g, "<p");
              txtLabayru = txtLabayru.replace(/<\/td/g, "<\/p");
              txtLabayru = txtLabayru.replace(/<tr/g, "<p");
              txtLabayru = txtLabayru.replace(/<\/tr/g, "<\/p");
              txtLabayru = txtLabayru.replace(/CargaPalabra/g, "http://zerbitzuak.labayru.org/diccionario/CargaPalabra");
            }
          } else {
            txtLabayru = euskalbarLib._f("euskalbar.comb.error", ["Labayru"]);
          }
        }
      } catch (e) {
        txtLabayru = euskalbarLib._f("euskalbar.comb.error", ["Labayru"]);
      }
      euskalbarLib.cleanLoadHTML(txtLabayru, euskalbarLib.$('aLabayru', gBrowser.contentDocument));
    }
*/
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftLabayru, true);
  },


  getShiftUZEI: function (source, term) {
    var output = "",
        reqURL = 'http://www.uzei.com/estatico/sinonimos.asp',
        reqData = {sarrera: term, eragiketa: 'bilatu'};

    euskalbarLib.ajax({
      url: reqURL,
      data: reqData,
      mimeType: 'text/html; charset=ISO-8859-1',

      onSuccess: function (data) {
        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.uzei.com/estatico/sinonimos.asp\">UZEI&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oUzei', gBrowser.contentDocument));
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
        output = euskalbarLib._f("euskalbar.comb.error", ["UZEI"]);
      },

      onComplete: function () {
        var node = euskalbarLib.$('aUzei', gBrowser.contentDocument);
        euskalbarLib.cleanLoadHTML(output, node);
      }
    });
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftUZEI, true);
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
            euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.euskaltzaindia.net/hiztegibatua\">Batua&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oBatua', gBrowser.contentDocument));
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
            txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
          }
        }
      } catch (e) {
        txtEuskaltzaindia = euskalbarLib._f("euskalbar.comb.error", ["Hiztegi Batua"]);
      }
      euskalbarLib.cleanLoadHTML(txtEuskaltzaindia, euskalbarLib.$('aBatua', gBrowser.contentDocument));
    }
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftEuskaltzaindia, true);
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
            euskalbarLib.cleanLoadHTML("<hr>" + txtEuskaltzaindia, euskalbarLib.$('aBatua', gBrowser.contentDocument));
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
    var output = euskalbarLib._f("euskalbar.comb.disabled", ["Mokoroa"]);
    euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.hiru.com/hiztegiak/mokoroa\">Mokoroa&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oMokoroa', gBrowser.contentDocument));
    euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aMokoroa', gBrowser.contentDocument));

    /* FIXME: Use new Ajax POST function
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
            euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://www.hiru.com/hiztegiak/mokoroa\">Mokoroa&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oMokoroa', gBrowser.contentDocument));
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
      euskalbarLib.cleanLoadHTML(txtMokoroa, euskalbarLib.$('aMokoroa', gBrowser.contentDocument));
    }*/
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftMokoroa, true);
  },


  // Intza kargatu
  getShiftIntza: function (source, term) {
    var url, output = "";

    if (source == 'es') {
      url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?hitza1=' + encodeURIComponent(term) + '&eremu3=1&eremu1=eeki';
    } else {
      url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl?eremu1=giltzarriak&hitza1=' + encodeURIComponent(term) + '&eremu3=1';
    }

    euskalbarLib.ajax({
      url: url,

      onSuccess: function (data) {
        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://intza.armiarma.com/cgi-bin/bilatu2.pl\">Intza&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oIntza', gBrowser.contentDocument));
        output = data;
        var output2 = output.split("Bilaketaren emaitza")[2];
        output = "<strong><font face=\"bitstream vera sans, verdana, arial\" size=\"3\">" + term + "</font></strong>" + output2;
        var output3 = output.split("<form")[0];
        output = output3.replace(/<font size=5>/g, "<font size=\"3\">");
        output = output.replace(/\/cgi-bin/g, "http:\/\/intza.armiarma.com\/cgi-bin");
        output = output.replace(/\/intza\/kon/g, "http:\/\/intza.armiarma.com\/intza\/kon");

        euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aIntza', gBrowser.contentDocument));
      },

      onError: function () {
        output = euskalbarLib._f("euskalbar.comb.error", ["Intza"]);
        euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aIntza', gBrowser.contentDocument));
      }
    });
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftIntza, true);
  },


  // Open-tran kargatu
  getShiftOpentran: function (source, term) {
    var url = 'http://eu.open-tran.eu/suggest/' + encodeURIComponent(term);
    var output = "";

    euskalbarLib.ajax({
      url: url,

      onSuccess: function (data) {
        euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://eu.open-tran.eu\">Open-tran&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oOpentran', gBrowser.contentDocument));
        var txtOpentran1 = data.split("<h1>")[1];
        var txtOpentran2 = data.split("<h1>")[2];
        data = "<h1>" + txtOpentran1 + "<h1>" + txtOpentran2;

        var output = data.split("<div id=\"bottom\">")[0];
        output = output.replace(/\/images\//g, "http://eu.open-tran.eu/images/");
        output = output.replace(/<a href=\"javascript\:\;\"  onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<b>");
        output = output.replace(/<a href=\"javascript\:\;\" class=\"fuzzy\" onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g, "<i>fuzzy</i> <b>");
        output = output.replace(/\)<\/a>/g, ")</b>");
        euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aOpentran', gBrowser.contentDocument));
      },

      onError: function () {
        output = euskalbarLib._f("euskalbar.comb.error", ["Open-Tran"]);
        euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aOpentran', gBrowser.contentDocument));
      }
    });
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftOpentran, true);
  },


  // Danobat kargatu
  getShiftDanobat: function (source, term) {

    var output = euskalbarLib._f("euskalbar.comb.disabled", ["Danobat"]);
    euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://hiztegia.danobatgroup.com/eu/dictionary\">Danobat&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oDanobat', gBrowser.contentDocument));
    euskalbarLib.cleanLoadHTML(output, euskalbarLib.$('aDanobat', gBrowser.contentDocument));

    /* FIXME: Use new Ajax POST function
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
            euskalbarLib.cleanLoadHTML("<div id=\"oharra\"><a href=\"http://hiztegia.danobatgroup.com/eu/dictionary\">Danobat&nbsp;<sup>&curren;</sup></a></div>", euskalbarLib.$('oDanobat', gBrowser.contentDocument));
            txtDanobat = xmlHttpReq.responseText;
            txtDanobat = txtDanobat.substring(txtDanobat.indexOf('<div id="searchresult">'), txtDanobat.indexOf('</article>'));
          } else {
            txtDanobat = euskalbarLib._f("euskalbar.comb.error", ["Danobat"]);
          }
        }
      } catch (e) {
        txtDanobat = euskalbarLib._f("euskalbar.comb.error", ["Danobat"]);
      }
      euskalbarLib.cleanLoadHTML(txtDanobat, euskalbarLib.$('aDanobat', gBrowser.contentDocument));
    }
*/
    gBrowser.removeEventListener("DOMContentLoaded", euskalbar.comb.getShiftDanobat, true);
  },

  normalize: function (str) {
    var newStr = str.toLowerCase();

    newStr = newStr.replace(/á/, "a");
    newStr = newStr.replace(/à/, "a");
    newStr = newStr.replace(/ä/, "a");
    newStr = newStr.replace(/â/, "a");
    newStr = newStr.replace(/é/, "e");
    newStr = newStr.replace(/è/, "e");
    newStr = newStr.replace(/ë/, "e");
    newStr = newStr.replace(/ê/, "e");
    newStr = newStr.replace(/í/, "i");
    newStr = newStr.replace(/ì/, "i");
    newStr = newStr.replace(/ï/, "i");
    newStr = newStr.replace(/î/, "i");
    newStr = newStr.replace(/ó/, "o");
    newStr = newStr.replace(/ò/, "o");
    newStr = newStr.replace(/ö/, "o");
    newStr = newStr.replace(/ô/, "o");
    newStr = newStr.replace(/ú/, "u");
    newStr = newStr.replace(/ù/, "u");
    newStr = newStr.replace(/ü/, "u");
    newStr = newStr.replace(/û/, "u");
    newStr = newStr.replace(/Á/, "A");
    newStr = newStr.replace(/À/, "A");
    newStr = newStr.replace(/Ä/, "A");
    newStr = newStr.replace(/Â/, "A");
    newStr = newStr.replace(/É/, "E");
    newStr = newStr.replace(/È/, "E");
    newStr = newStr.replace(/Ë/, "E");
    newStr = newStr.replace(/Ê/, "E");
    newStr = newStr.replace(/Í/, "I");
    newStr = newStr.replace(/Ì/, "I");
    newStr = newStr.replace(/Ï/, "I");
    newStr = newStr.replace(/Î/, "I");
    newStr = newStr.replace(/Ó/, "O");
    newStr = newStr.replace(/Ò/, "O");
    newStr = newStr.replace(/Ö/, "O");
    newStr = newStr.replace(/Ô/, "O");
    newStr = newStr.replace(/Ú/, "U");
    newStr = newStr.replace(/Ù/, "U");
    newStr = newStr.replace(/Ü/, "U");
    newStr = newStr.replace(/Û/, "U");

    return newStr;
  },

};
