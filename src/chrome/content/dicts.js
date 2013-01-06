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

  euskalbar.dicts = {

    // Euskaltermen bilaketak egiteko
    goEuskalBarEuskalterm: function (source, term, sub) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }
      term = term.trim();
      var lang = euskalbarLib._("hizk");
      var hiztegiarenhizkuntza;
      var idioma;

      if (lang.match('euskara')) {
        hiztegiarenhizkuntza = 'eu';
      } else if (lang.match('english')) {
        hiztegiarenhizkuntza = 'en';
      } else if (lang.match('français')) {
        hiztegiarenhizkuntza = 'fr';
      } else {
        hiztegiarenhizkuntza = 'es';
      }
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
          zein = 'euskalterm',
          params = {
            'ekintza': 'HASI',
            'ekin': 'HASI',
            'datuakaBilaketarako(galderakoHizkuntza)': idioma,
            'datuakaBilaketarako(galdera)': term,
            'zerrenda': '',
            'hizkuntza': hiztegiarenhizkuntza
          };

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('euskalterm');
    },


    // Elhuyar hiztegiko bilaketak
    goEuskalBarElhuyar: function (source, dest, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var lang = euskalbarLib._("hizk");
      var hiztegiarenhizkuntza;
      if (lang.match('euskara')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
        hiztegiarenhizkuntza = 'eu';
      } else if (lang.match('english')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
        hiztegiarenhizkuntza = 'en';
      } else if (lang.match('français')) {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
        hiztegiarenhizkuntza = 'fr';
      } else {
        var urlElhuyar = 'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
        hiztegiarenhizkuntza = 'es';
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

      var zein = 'elhuyar.org',
          params = {
            txtHitza: term,
            edozer: 'ehunekoa',
            nondik: source2,
            bot_kon: '%3E'
          };
      if (chkHizkuntza != '') {
        params[chkHizkuntza] = dest2;
      }

      euskalbar.openURL(urlElhuyar, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('elhuyar');
    },


    goEuskalBarZTHiztegia: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("load", euskalbar.dicts.goEuskalBarZTHiztegiaKlik, true);

      var url = 'http://zthiztegia.elhuyar.org',
          zein = 'zthiztegia';
      euskalbar.openURL(url, zein, 'GET', null);
      //Estatistika lokalak idatzi
      euskalbar.stats.write('zthiztegia');
    },

    //Triggered with a load event listener
    goEuskalBarZTHiztegiaKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("zthiztegia") != -1) {
        var langbutton = euskalbarLib.$("euskalbar-language");
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
        textbox.value = euskalbarLib.$("EuskalBar-search-string").value;
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

      var lang = euskalbarLib._("hizk");
      var inthizk;
      if (lang.match('euskara')) {
        inthizk = 'eusk';
      } else {
        inthizk = 'gazt';
      }
      euskalbar.openURL('http://www.telekomunikaziohiztegia.org/index.asp?hizk=' + inthizk, 'telekom', 'GET', null);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('telekom');
    },

    //Triggered with a load event listener
    goEuskalBarTelekomKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("telekomunikaziohiztegia") != -1) {
        var langbutton = euskalbarLib.$("euskalbar-language");
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
        textbox.value = euskalbarLib.$("EuskalBar-search-string").value;
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
          zein = 'labayru';

      if (source == 'es') {
        var url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabras.asp'
      } else {
        var url = 'http://zerbitzuak.labayru.org/diccionario/CargaListaPalabrasEU.asp'
      }

      var params = {
        'opc': '1',
        'txtPalabra': term
      };

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi .  Labayru dict = 22
      euskalbar.stats.write('labayru');
    },


    // Bilaketak Zehazki hiztegian
    goEuskalBarZehazki: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://ehu.es/ehg/cgi/zehazki/bila',
          zein = 'zehazki',
          params = {
            'm': 'has',
            'z': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('zehazki');
    },


    // EHUskaratuak
    goEuskalBarEHUskaratuak: function (source, dest, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://ehuskaratuak.ehu.es/bilaketa/',
          zein = 'ehuskaratuak',
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

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('ehuskaratuak');
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
          zein = 'morris',
          params = {};

      params[hizk] = term;

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('morris');
    },


    // eu.open-tran.eu itzulpen datu-basean bilaketak
    goEuskalBarOpentran: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://eu.open-tran.eu/suggest/' + encodeURIComponent(term),
          zein = 'open-tran';

      euskalbar.openURL(url, zein, 'GET', null);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('opentran');
    },


    // Goihata hiztegiko bilaketak
    goEuskalBarGoihata: function (source, dest, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.kotobai.com/eu/euskara-japoniera-hiztegia/',
          zein = 'kotobai.com',
          params = {
            'tx_ghdictionary_pi1[cmd]': '2',
            'tx_ghdictionary_pi1[q]': term,
            'tx_ghdictionary_pi1[l]': 'basque',
            'tx_ghdictionary_pi1[t]': '1'
          };

      euskalbar.openURL(url, zein, 'POST', params);

      // Update search stats; 21 = Index of Goihata in stats file
      euskalbar.stats.write('goihata');
    },


    // Euskaltzaindiaren hiztegi batuan bilaketa burutzen du
    goEuskalBarEuskaltzaindia: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskaltzaindia.net/index.php',
          zein = 'com_hiztegianbilatu',
          params = {
            'option': 'com_hiztegianbilatu',
            'lang': 'eu',
            'view': 'frontpage',
            'Itemid': '410',
            'sarrera': term
          };

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('batua');
    },

    // Euskaltzaindiaren OEHn bilaketa burutzen du
    goEuskalBarOEH: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskaltzaindia.net/index.php?option=com_oeh&amp;view=frontpage&amp;Itemid=340&amp;lang=eu',
          zein = 'OEH',
          params = {
            'sarrera': term
          };

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('oeh');
    },


    goEuskalBarHauta: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("DOMContentLoaded", euskalbar.dicts.goEuskalBarHautaKlik, true); 

      var url = 'http://www.euskara.euskadi.net/r59-15172x/eu/sarasola/sarasola.apl',
          zein = 'sarasola';
      euskalbar.openURL(url, zein, 'POST', null);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('hauta');
    },

    //Triggered with an event listener of DOMContentLoaded
    goEuskalBarHautaKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("r59-15172x") != -1) {
        var textbox = doc.getElementById("hitza");
        var button = doc.getElementById("bilatu");
        textbox.value = euskalbarLib.$("EuskalBar-search-string").value;
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

      var lang = euskalbarLib._("hizk");
      var hiztegiarenhizkuntza;
      if (lang.match('euskara')) {
        hiztegiarenhizkuntza = '14';
      } else if (lang.match('english')) {
        hiztegiarenhizkuntza = '1347';
      } else if (lang.match('français')) {
        hiztegiarenhizkuntza = '1348';
      } else {
        hiztegiarenhizkuntza = '1';
      }

      var url = 'http://www.uzei.com/estatico/sinonimos.asp',
          zein = 'uzei',
          params = {
            'sesion': hiztegiarenhizkuntza,
            'sarrera': term,
            'eragiketa': 'bilatu'
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('uzei');
    },


    // ItzuL posta-zerrendan bilaketak
    goEuskalBarItzuL: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.google.es/search',
          zein = 'postaria.com',
          params = {
            'hl': 'eu',
            'btnG': 'Google+Bilaketa',
            'q': term + ' site:http://postaria.com/pipermail/itzul/'
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('itzul');
    },


    // Lur hiztegi entziklopedikoa
    goEuskalBarLurhe: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskara.euskadi.net/r59-lursresd/eu?r01kQry=tC:euskadi;tF:diccionario_enciclopedia;tT:termino;m:documentLanguage.EQ.eu;m:documentName.BEGINNING.' + encodeURIComponent(term);
      var zein = 'r59-lursresd';

      euskalbar.openURL(url, zein, 'GET', null);
      //Estatistika lokalak idatzi
      euskalbar.stats.write('lurhe');
    },


    // ItzuL posta-zerrendan bilaketak
    goEuskalBarLuret: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }
      var url = 'http://www.euskara.euskadi.net/r59-lursresu/eu?r01kQry=tC:euskadi;tF:diccionario_enciclopedia;tT:articulo;m:documentLanguage.EQ.eu;m:documentDescription.LIKE.' + encodeURIComponent(term);
      var zein = 'r59-lursresu';

      euskalbar.openURL(url, zein, 'GET', null);

      //Estatistika lokalak idatzi*/
      euskalbar.stats.write('luret');
    },


    // Harluxet hiztegi entziklopedikoa
    goEuskalBarHarluxet: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www1.euskadi.net/harluxet/emaitza.asp',
          zein = 'harluxet',
          params = {
            'sarrera': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('harluxet');
    },


    // eu.wikipedia.org
    goEuskalBarWikipedia: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://eu.wikipedia.org/wiki/Aparteko:Search',
          zein = 'eu.wikipedia.org',
          params = {
            'search': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('wikipedia');
    },


    // Mokoroan bilaketak
    goEuskalBarMokoroa: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.hiru.com/hirupedia?p_p_id=indice_WAR_w25cIndexWAR_INSTANCE_zPs2&p_p_lifecycle=1&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=1&p_p_col_count=2&_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_action=buscarMokoroa',
          zein = 'Mokoroa',
          params = {
            '_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaDialecto': 'Edozein%20Euskalki'
          };

      if (source == 'es') {
        params['_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoCastellano'] = term;
      } else {
        params['_indice_WAR_w25cIndexWAR_INSTANCE_zPs2_mokoroaTextoEuskera'] = term;
      }

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('mokoroa');
    },


    // Intzaren bilaketak
    goEuskalBarIntza: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://intza.armiarma.com/cgi-bin/bilatu2.pl',
          zein = 'intza',
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

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbar.stats.write('intza');
    },


    // Eurovoc Tesaurusa
    goEuskalBarEurovoc: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var lang = euskalbarLib._("hizk");

      if (lang.match('euskara')) {
        var hizk = 'EU';
      } else {
        var hizk = 'CA';
      }

      var url = 'http://www.bizkaia.net/kultura/eurovoc/busqueda.asp',
          zein = 'eurovoc',
          params = {
            'txtBuscar': 'S',
            'query': term,
            'idioma': hizk
          };

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('eurovoc');
    },


    // Bergara aldeko hiztegia
    goEuskalBarBergara: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.bergarakoeuskara.net/hiztegia/bilatu',
          zein = 'bergarakoeuskara',
          params = {
            'berbaki': term,
            'form_id': 'berba_bilatu'
          };

      euskalbar.openURL(url, zein, 'POST', params);

      euskalbar.stats.write('bergara');
    },


    // Ereduzko Prosa
    goEuskalBarEreduzko: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.ehu.es/cgi-bin/ereduzkoa/bilatu09.pl',
          zein = 'ereduzkoa',
          params = {
            'o': '1',
            'h': '1',
            'n': 'bietan',
            'k1': '1',
            'm1': 'hitza',
            'h1': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbar.stats.write('ereduzko');
    },


    // Egungo Euskararen Hiztegia
    goEuskalBarEgungo: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'www.ehu.es/eeh/cgi/bila',
          zein = 'www.ehu.es/eeh',
          params = {
            'z': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbar.stats.write('egungo');
    },


    // Klasikoen gordailua
    goEuskalBarKlasikoak: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://klasikoak.armiarma.com/cgi-bin/corpusBila.pl',
          zein = 'klasikoak',
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

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi, hau aldatu egin behar da
      euskalbar.stats.write('klasikoak');
    },


    // ZT Corpusa
    goEuskalBarZTCorpusa: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.ztcorpusa.net/cgi-bin/kontsulta.py',
          zein = 'ztcorpusa',
          params = {
            'testu-hitza1': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('ztcorpusa');
    },


    // Lexikoaren Behatokia
    goEuskalBarLB: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://lexikoarenbehatokia.euskaltzaindia.net/cgi-bin/kontsulta.py',
          zein = 'lexikoaren-behatokia',
          params = {
            'testu-hitza1': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('lb');
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
          zein = 'consumer',
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

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('consumer');
    },


    // Literatura terminoen hiztegia
    goEuskalBarLiteratura: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.euskaltzaindia.net/index.php',
          zein = 'lth_detail',
          params = {
            'option': 'com_xslt',
            'lang': 'eu',
            'layout': 'lth_detail',
            'view': 'frontpage',
            'Itemid': '474',
            'search': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('lth');
    },

    // Lanbide heziketarako hiztegia
    goEuskalBarLanbide: function (source, term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      gBrowser.addEventListener("load", euskalbar.dicts.goEuskalBarLanbideKlik, true);

      var url = 'http://kantauri.eleka.net/laneki',
          zein = 'laneki'

      euskalbar.openURL(url, zein, null, null);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('lanbide');
    },


    // Lanbide heziketarako hiztegia Klik
    //Triggered with a load event listener
    goEuskalBarLanbideKlik: function (aEvent) {
      var doc = aEvent.originalTarget;
      if (doc.location.href.indexOf("laneki") != -1) {
        var langbutton = euskalbarLib.$("euskalbar-language");
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
        textbox.value = euskalbarLib.$("EuskalBar-search-string").value;
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
          zein = 'justizia',
          params = {
            '_charset_': 'ISO-8859-1',
            'cjterm': term,
            'bjterm': 'Bilatu',
            'idiomaBusq': source2
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('epaitegiak');
    },


    // CorpEus
    goEuskalBarCorpEus: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.corpeus.org/cgi-bin/kontsulta.py',
          zein = 'corpeus',
          params = {
            'bilagaiid': ' ',
            'formalema': 'lema',
            'motorea': 'googleajax',
            'testu-hitza': term
          };

      if (term.indexOf(' ') != -1) {
        params['testu-hitza'] = '"' + term + '"';
      }

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('corpeus');
    },


    // XUXENweb
    goEuskalBarXUXENweb: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.xuxen.com/socketBezero.php',
          zein = 'xuxen',
          params = {
            'idatzArea': term
          };

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('xuxenweb');
    },


    // Elebila
    goEuskalBarElebila: function (term) {
      // Begiratu kutxa hutsik dagoen
      if (euskalbar.alertEmptyBox(term)) {
        return;
      }

      var url = 'http://www.elebila.eu/search/',
          zein = 'elebila',
          params = {
            'bilatu': term,
            'optNon': '1'
          };

      if (term.indexOf(' ') != -1) {
        params['bilatu'] = '"' + term + '"';
      }

      euskalbar.openURL(url, zein, 'GET', params);

      //Estatistika lokalak idatzi
      euskalbar.stats.write('elebila');
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
          zein = 'danobat',
          params = {
            'direction_filter': source,
            'term_filter': term
          };

      euskalbar.openURL(url, zein, 'POST', params);

      //Estatistika lokalak idatzi .  Danobat dict = 32
      euskalbar.stats.write('danobat');
    },

    // Aukeratutako testua itzultzen du
    selectionText: function () {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection();
    },

  };
