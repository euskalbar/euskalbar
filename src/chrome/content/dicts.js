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

euskalbar.dicts = function () {

  // Private vars
  var $L = euskalbarLib,
      $ = $L.$;

  // Public interface
  return {

    // Euskaltermen bilaketak egiteko
    goEuskalBarEuskalterm: function (source, term, sub) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      term = term.trim();

      var idioma,
          uiLang = $L.langCode(euskalbar.ui.locale);

      var dictLang = ['en', 'fr', 'es'].indexOf(uiLang) !== -1 ? uiLang : 'eu';

      // bilaketaren hizkuntza zehaztu
      if (source == 'es') {
        idioma = 'ES';
      } else if (source == 'en') {
        idioma = 'EN';
      } else if (source == 'fr') {
        idioma = 'FR';
      } else if (source == 'la') {
        idioma = 'LA';
      } else {
        idioma = 'EU';
      }
      // Hitz zatiak erabiltzen direnean, * komodina erabiliko bailitzan egin
      // ditzala bilaketak
      if (encodeURIComponent(term).charAt(encodeURIComponent(term).length - 1) != "%") {
        term = term + "%";
      }

      var url = 'http://www.euskara.euskadi.net/r59-15172x/eu/q91EusTermWar/kontsultaJSP/q91aAction.do',
          id = 'euskalterm',
          params = {
            'ekintza': 'HASI',
            'ekin': 'HASI',
            'datuakaBilaketarako(galderakoHizkuntza)': idioma,
            'datuakaBilaketarako(galdera)': term,
            'zerrenda': '',
            'hizkuntza': dictLang
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Elhuyar hiztegiko bilaketak
    goEuskalBarElhuyar: function (source, dest, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var dictURL,
          uiLang = $L.langCode(euskalbar.ui.locale);

      if (uiLang === 'en') {
        dictURL = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
      } else if (uiLang === 'es') {
        dictURL = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
      } else if (uiLang === 'fr') {
        dictURL = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
      } else {
        dictURL = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
      }

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

      var id = 'elhuyar',
          params = {
            txtHitza: term,
            edozer: 'ehunekoa',
            nondik: source2,
            bot_kon: '%3E'
          };
      if (chkHizkuntza != '') {
        params[chkHizkuntza] = dest2;
      }

      euskalbar.openURL(dictURL, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    goEuskalBarZTHiztegia: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("load", euskalbar.dicts.goEuskalBarZTHiztegiaKlik, true);

      var url = 'http://zthiztegia.elhuyar.org',
          id = 'zthiztegia';

      euskalbar.openURL(url, id, 'GET', null);

      euskalbar.stats.write(id);
    },

    //Triggered with a load event listener
    goEuskalBarZTHiztegiaKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("zthiztegia") != -1) {
        var langbutton = $("euskalbar-language");
        var hizk = langbutton.getAttribute("label").substr(0,2);
        var i = "0";
        switch (hizk) {
        case 'EU':
          i = "0";
          break;
        case 'EN':
          i = "1";
          break;
        case 'ES':
          i = "2";
          break;
        case 'FR':
          i = "3";
          break;
        case 'LA':
          i = "4";
          break;
        }
        var textbox = doc.getElementById("txtBilagaila");
        textbox.value = $("EuskalBar-search-string").value;
        var langcombo = doc.getElementById("selectHizkuntza");
        langcombo.selectedIndex = i;
        var button = doc.getElementById("bot_bilatu");
        button.click();

        gBrowser.removeEventListener("load", euskalbar.dicts.goEuskalBarZTHiztegiaKlik, true);
      }
    },


    goEuskalBarTelekom: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("load", euskalbar.dicts.goEuskalBarTelekomKlik, true);

      var dictLang,
          dictURL = 'http://www.telekomunikaziohiztegia.org/',
          uiLang = $L.langCode(euskalbar.ui.locale),
          id = 'telekom';

      if (uiLang === 'es') {
        dictLang = 'gazt';
      } else {
        dictLang = 'eusk';
      }

      var params = {
        'hizk': dictLang,
      };

      euskalbar.openURL(dictURL, id, 'GET', params);

      euskalbar.stats.write(id);
    },

    //Triggered with a load event listener
    goEuskalBarTelekomKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("telekomunikaziohiztegia") != -1) {
        var langbutton = $("euskalbar-language");
        var hizk = langbutton.getAttribute("label").substr(0,2);
        var i = "0";
        switch (hizk) {
        case 'EU':
          i = "0";
          break;
        case 'EN':
          i = "2";
          break;
        case 'ES':
          i = "1";
          break;
        case 'FR':
          i = "3";
          break;
        }
        var textbox = doc.getElementsByName("txtHitza")[0];
        textbox.value = $("EuskalBar-search-string").value;
        var langcombo = doc.getElementsByName("selectHizkuntza")[0];
        langcombo.selectedIndex = i;
        var button = doc.getElementsByName("submit")[0];
        button.click();

        gBrowser.removeEventListener("load", euskalbar.dicts.goEuskalBarTelekomKlik, true);
      }
    },


    // Bilaketak Labayru hiztegian
    goEuskalBarLabayru: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var idioma,
          id = 'labayru';

      if (source == 'es') {
        var url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras.asp'
      } else {
        var url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabrasEU.asp'
      }

      var params = {
        'opc': '1',
        'txtPalabra': term
      };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Bilaketak Zehazki hiztegian
    goEuskalBarZehazki: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }
      term = $L.normalize(term);
      var url = 'http://ehu.es/ehg/cgi/zehazki/bila',
          id = 'zehazki',
          params = {
            'm': 'has',
            'z': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // EHUskaratuak
    goEuskalBarEHUskaratuak: function (source, dest, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://ehuskaratuak.ehu.es/bilaketa/',
          id = 'ehuskaratuak',
          params = {
            'mota': 'arrunta',
            'hizkuntza': source,
            'formalema': 'lema',
            'testuhitza': term,
            'kategoria': '',
            'alor': 'guz',
            'azpialor': 'guz',
            'aurreratua': 'arrunta',
            'hizkuntza2': dest,
            'formalema2': 'forma',
            'testuhitza2': '',
            'kategoria2': '',
            'distantzia': '0',
            'osagaietan': dest,
            'grafauk': '1forma',
            'grafiko_aukerak': '1forma'
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Morrisen bilaketak egiteko
    goEuskalBarMorris: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      if (source == 'en') {
        var hizk = 'txtIngles';
      } else {
        var hizk = 'txtEuskera';
      }

      var url = 'http://www1.euskadi.net/morris/resultado.asp',
          id = 'morris',
          params = {};

      params[hizk] = term;

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // eu.open-tran.eu itzulpen datu-basean bilaketak
    goEuskalBarOpentran: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://eu.open-tran.eu/suggest/' + encodeURIComponent(term),
          id = 'opentran';

      euskalbar.openURL(url, id, 'GET', null);

      euskalbar.stats.write(id);
    },


    // Goihata hiztegiko bilaketak
    goEuskalBarGoihata: function (source, dest, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.kotobai.com/eu/euskara-japoniera-hiztegia/',
          id = 'goihata',
          params = {
            'tx_ghdictionary_pi1[cmd]': '2',
            'tx_ghdictionary_pi1[q]': term,
            'tx_ghdictionary_pi1[l]': 'basque',
            'tx_ghdictionary_pi1[t]': '1'
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    goEuskalBarEuskaltzaindia: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskaltzaindia.net/index.php',
          id = 'batua',
          params = {
            'option': 'com_hiztegianbilatu',
            'lang': 'eu',
            'view': 'frontpage',
            'Itemid': '410',
            'sarrera': term
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },

    // Euskaltzaindiaren OEHn bilaketa burutzen du
    goEuskalBarOEH: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskaltzaindia.net/index.php?option=com_oeh&amp;view=frontpage&amp;Itemid=340&amp;lang=eu',
          id = 'oeh',
          params = {
            'sarrera': term
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    goEuskalBarHauta: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("DOMContentLoaded", euskalbar.dicts.goEuskalBarHautaKlik, true); 

      var url = 'http://www.euskara.euskadi.net/r59-15172x/eu/sarasola/sarasola.apl',
          id = 'hauta';
      euskalbar.openURL(url, id, 'POST', null);

      euskalbar.stats.write(id);
    },

    //Triggered with an event listener of DOMContentLoaded
    goEuskalBarHautaKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("r59-15172x") != -1) {
        var textbox = doc.getElementById("hitza");
        var button = doc.getElementById("bilatu");
        textbox.value = $("EuskalBar-search-string").value;
        button.click();

        gBrowser.removeEventListener("DOMContentLoaded", euskalbar.dicts.goEuskalBarHautaKlik, true); 
      }
    },


    // UZEIren sinonimoen hiztegia
    goEuskalBarUZEI: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var dictLang,
          uiLang = $L.langCode(euskalbar.ui.locale);

      if (uiLang === 'en') {
        dictLang = '1347';
      } else if (uiLang === 'fr') {
        dictLang = '1348';
      } else if (uiLang === 'es') {
        dictLang = '1';
      } else {
        dictLang = '14';
      }

      var url = 'http://www.uzei.com/estatico/sinonimos.asp',
          id = 'uzei',
          params = {
            'sesion': dictLang,
            'sarrera': term,
            'eragiketa': 'bilatu'
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // ItzuL posta-zerrendan bilaketak
    goEuskalBarItzuL: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.google.es/search',
          id = 'itzul',
          params = {
            'hl': 'eu',
            'btnG': 'Google+Bilaketa',
            'q': term + ' site:http://postaria.com/pipermail/itzul/'
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Lur hiztegi entziklopedikoa
    goEuskalBarLurhe: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskara.euskadi.net/r59-lursresd/eu?r01kQry=tC:euskadi;tF:diccionario_enciclopedia;tT:termino;m:documentLanguage.EQ.eu;m:documentName.BEGINNING.' + encodeURIComponent(term);
      var id = 'lurhe';

      euskalbar.openURL(url, id, 'GET', null);

      euskalbar.stats.write(id);
    },


    // ItzuL posta-zerrendan bilaketak
    goEuskalBarLuret: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }
      var url = 'http://www.euskara.euskadi.net/r59-lursresu/eu?r01kQry=tC:euskadi;tF:diccionario_enciclopedia;tT:articulo;m:documentLanguage.EQ.eu;m:documentDescription.LIKE.' + encodeURIComponent(term);
      var id = 'luret';

      euskalbar.openURL(url, id, 'GET', null);

      euskalbar.stats.write(id);
    },


    // Harluxet hiztegi entziklopedikoa
    goEuskalBarHarluxet: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp',
          id = 'harluxet',
          params = {
            'sarrera': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // eu.wikipedia.org
    goEuskalBarWikipedia: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://eu.wikipedia.org/wiki/Aparteko:Search',
          id = 'eu.wikipedia.org',
          params = {
            'search': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Mokoroan bilaketak
    goEuskalBarMokoroa: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.hiru.com/hirupedia?p_p_id=indice_WAR_w25cIndexWAR_INSTANCE_zPs2&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2&_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_action=buscarMokoroa',
          id = 'mokoroa',

          params = {
            '_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaFuente': '',
            '_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaDialecto': 'Edozein Euskalki'
          };

      if (source == 'es') {
        params['_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoCastellano'] = term;
      } else {
        params['_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoEuskera'] = term;
      }

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Intzaren bilaketak
    goEuskalBarIntza: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl',
          id = 'intza',
          params = {
            'hitza1': term,
            'eremu3': '1'
          };

      // XXX: Review if this is necessary
      if (source == 'es') {
        params['eremu1'] = 'eeki';
      } else {
        params['eremu1'] = 'giltzarriak';
      }

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Eurovoc Tesaurusa
    goEuskalBarEurovoc: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var dictLang,
          uiLang = $L.langCode(euskalbar.ui.locale);

      if (uiLang === 'es') {
        dictLang = 'CA';
      } else {
        dictLang = 'EU';
      }

      var url = 'http://www.bizkaia.net/kultura/eurovoc/busqueda.asp',
          id = 'eurovoc',
          params = {
            'txtBuscar': 'S',
            'query': term,
            'idioma': dictLang
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Bergara aldeko hiztegia
    goEuskalBarBergara: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.bergarakoeuskara.net/hiztegia/bilatu',
          id = 'bergarakoeuskara',
          params = {
            'berbaki': term,
            'form_id': 'berba_bilatu'
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Ereduzko Prosa
    goEuskalBarEreduzko: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.ehu.es/cgi-bin/ereduzkoa/bilatu09.pl',
          id = 'ereduzko-prosa',
          params = {
            'o': '1',
            'h': '1',
            'n': 'bietan',
            'k1': '1',
            'm1': 'hitza',
            'h1': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Egungo Euskararen Hiztegia
    goEuskalBarEgungo: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'www.ehu.es/eeh/cgi/bila',
          id = 'eeh',
          params = {
            'z': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Klasikoen gordailua
    goEuskalBarKlasikoak: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://klasikoak.armiarma.com/cgi-bin/corpusBila.pl',
          id = 'klasikoak',
          params = {
            'check1': '1',
            'hitza1': term,
            'mota1': 'hasi',
            'alda': '1',
            'idazlea': '',
            'generoa': '0',
            'garaia': '0',
            'euskalkia': '0'
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // ZT Corpusa
    goEuskalBarZTCorpusa: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py',
          id = 'ztcorpusa',
          params = {
            'testu-hitza1': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Lexikoaren Behatokia
    goEuskalBarLB: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://lexikoarenbehatokia.euskaltzaindia.net/cgi-bin/kontsulta.py',
          id = 'lexikoaren-behatokia',
          params = {
            'testu-hitza1': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Consumer Corpusa
    goEuskalBarConsumer: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var source2;
      if (source == 'eu') {
        source2 = 'eu';
      } else {
        source2 = 'es';
      };

      var url = 'http://corpus.consumer.es/corpus/kontsulta',
          id = 'consumer',
          params = {
            'mota': 'arrunta',
            'hizkuntza': source2,
            'formalema': 'lema',
            'konparazioa': 'da',
            'testuhitza': euskalbar.comb.normalize(term),
            'kategoria': '',
            'hizkuntza2': source2,
            'formalema2': '',
            'konparazioa2': '',
            'testuhitza2': '',
            'kategoria2': '',
            'osagaietan': 'eu',
            'grafiko_aukerak': '1forma'
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // Literatura terminoen hiztegia
    goEuskalBarLiteratura: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskaltzaindia.net/index.php',
          id = 'lth',
          params = {
            'option': 'com_xslt',
            'lang': 'eu',
            'layout': 'lth_detail',
            'view': 'frontpage',
            'Itemid': '474',
            'search': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },

    // Lanbide heziketarako hiztegia
    goEuskalBarLanbide: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("load", euskalbar.dicts.goEuskalBarLanbideKlik, true);

      var url = 'http://kantauri.eleka.net/laneki',
          id = 'lanbide-heziketa';

      euskalbar.openURL(url, id, null, null);

      euskalbar.stats.write(id);
    },


    // Lanbide heziketarako hiztegia Klik
    //Triggered with a load event listener
    goEuskalBarLanbideKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("laneki") != -1) {
        var langbutton = $("euskalbar-language");
        var hizk = langbutton.getAttribute("label").substr(0,2);
        var i = "0";
        switch (hizk) {
        case 'EU':
          i = "0";
          break;
        case 'ES':
          i = "1";
          break;
        }

        var textbox = doc.getElementById("field-bilatu");
        textbox.value = $("EuskalBar-search-string").value;
        var langcombo = doc.getElementById("selectHizkuntza");
        langcombo.selectedIndex = i;
        var button = doc.getElementById("bot_bilatu");
        button.click();

        gBrowser.removeEventListener("load", euskalbar.dicts.goEuskalBarLanbideKlik, true);
      }
    },


    // Epaitegietako lexikoa
    goEuskalBarEpaitegiak: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var source2;
      if (source == 'eu') {
        source2 = 'EU';
      } else {
        source2 = 'ES';
      };

      var url = 'http://www.justizia.net/euskara-justizian',
          id = 'epaitegiak',
          params = {
            '_charset_': 'ISO-8859-1',
            'cjterm': term,
            'bjterm': 'Bilatu',
            'idiomaBusq': source2
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // CorpEus
    goEuskalBarCorpEus: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.corpeus.org/cgi-bin/kontsulta.py',
          id = 'corpeus',
          params = {
            'bilagaiid': ' ',
            'formalema': 'lema',
            'motorea': 'googleajax',
            'testu-hitza': term
          };

      if (term.indexOf(' ') != -1) {
        params['testu-hitza'] = '"' + term + '"';
      }

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },


    // XUXENweb
    goEuskalBarXUXENweb: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.xuxen.com/socketBezero.php',
          id = 'xuxen',
          params = {
            'idatzArea': term
          };

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Elebila
    goEuskalBarElebila: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.elebila.eu/search/',
          id = 'elebila',
          params = {
            'bilatu': term,
            'optNon': '1'
          };

      if (term.indexOf(' ') != -1) {
        params['bilatu'] = '"' + term + '"';
      }

      euskalbar.openURL(url, id, 'GET', params);

      euskalbar.stats.write(id);
    },


    // Bilaketak Danobat hiztegian
    goEuskalBarDanobat: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      if (source == 'es') {
        source = 'es-eu';
      } else {
        source = 'eu-es';
      }

      var url = 'http://hiztegia.danobatgroup.com/eu/dictionary/search',
          id = 'danobat',
          params = {
            'direction_filter': source,
            'term_filter': term
          };

      euskalbar.openURL(url, id, 'POST', params);

      euskalbar.stats.write(id);
    },

    // Aukeratutako testua itzultzen du
    selectionText: function () {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection();
    },

  };

}();
