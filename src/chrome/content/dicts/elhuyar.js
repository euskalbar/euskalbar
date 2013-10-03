/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2013 Euskalbar Taldea (see AUTHORS file)
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

if (!euskalbar.dicts) euskalbar.dicts = {};

euskalbar.dicts.elhuyar = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Elhuyar',
    description: 'Elhuyar Hiztegia',

    homePage: "http://hiztegiak.elhuyar.org",

    pairs: ['eu-es', 'eu-fr', 'eu-en',
            'es-eu', 'fr-eu', 'en-eu'],

    method: 'GET',

    getUrl: function (term, source, target) {
      //var uiLang = $U.langCode(euskalbar.ui.locale);
      //if (uiLang === 'en') {
      //  return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
      //} else if (uiLang === 'es') {
      //  return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
      //} else if (uiLang === 'fr') {
      //  return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
      //} else {
      //  return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
      //}
      return 'http://hiztegiak.elhuyar.org/'+source+'_'+target+'/'+term
    },

    getParams: function (term, source, target) {
      //var chkHizkuntza, newTarget;
      //var sourceMap = {
      //  'es': 'gazt',
      //  'fr': 'fran',
      //  'en': 'ing',
      //  'eu': 'eusk'
      //}
      //switch (target) {
      //  case 'es':
      //    chkHizkuntza = 'chkHizkuntzaG';
      //    newTarget = 'gazt';
      //    break;
      //  case 'fr':
      //    chkHizkuntza = 'chkHizkuntzaF';
      //    newTarget = 'fran';
      //    break;
      //  case 'en':
      //    chkHizkuntza = 'chkHizkuntzaI';
      //    newTarget = 'ing';
      //    break;
      //  case 'eu':
      //    chkHizkuntza = '';
      //    newTarget = '';
      //    break;
      //}
      //var params = {
      //      'txtHitza': term,
      //      'nondik': sourceMap[source],
      //      'edozer': 'ehunekoa',
      //      'bot_kon': '>'
      //    };
      //if (chkHizkuntza != '') {
      //  params[chkHizkuntza] = newTarget;
      //}
      //return params;
      return {}
    },

    scrap: function (term, source, target, data) {
      //var uiLang = $U.langCode(euskalbar.ui.locale),
      //    output = '';
      //var errorMsgMap = {
      //  'es': 'No se han encontrado resultados para la b&uacute;squeda',
      //  'en': 'No match found',
      //  'fr': 'Aucun r&eacute;sultat pour votre entr&eacute;e'
      //},
      //    errorMsg = errorMsgMap[uiLang] || 'Ez dago horrelako sarrerarik';
      //if (data.indexOf(errorMsg) != -1) {
      //  // TODO: i18n
      //  output = 'Not found.';
      //} else {
      //  var resultsList = data.split('div id="zerrenda"')[1],
      //      resultsArray = resultsList.split('a href="?'),
      //      hasResults = false;
      //  resultsArray.shift();
      //  resultsArray.forEach(function (result) {
      //    var linkWord = result.split(">")[1].split("<")[0],
      //        linkWordNorm = $U.normalize(linkWord),
      //        originalNorm = $U.normalize(term),
      //        params = result.split('"')[0].replace(/amp\;/g, "");
      //    if (linkWordNorm === originalNorm ||
      //        linkWordNorm === '1 ' + originalNorm ||
      //        linkWordNorm === '2 ' + originalNorm ||
      //        linkWordNorm === '3 ' + originalNorm ||
      //        linkWordNorm === '4 ' + originalNorm ||
      //        linkWordNorm === '5 ' + originalNorm ||
      //        linkWordNorm === '6 ' + originalNorm ||
      //        linkWordNorm === '7 ' + originalNorm ||
      //        linkWordNorm === '8 ' + originalNorm ||
      //        linkWordNorm === '9 ' + originalNorm ||
      //        linkWordNorm === '10 ' + originalNorm) {
      //      hasResults = true;
      //      output += euskalbar.dicts.elhuyar.getSubQueries(params, true);
      //    }
      //  });
      //  if (!hasResults) {
      //    resultsArray.forEach(function (result) {
      //      var linkWord = result.split(">")[1].split("<")[0],
      //          params = result.split('"')[0];
      //      // FIXME: This can probably done by retrieving the params object and
      //      // manipulating it
      //      params = params.replace(/amp\;/g, "");
      //      output = '<p><a href="' + this.url + "?" + params.replace('txtHitza='
      //               + encodeURIComponent(term), 'txtHitza=' + linkWord) + '">'
      //               + linkWord + '</a></p>';
      //    });
      //  }
      //}
      //return output;
      function map(lambda, values)
      {
	switch (values.length)
	{
		case 0:
			return values;
		case 1:
			return [lambda(values.shift())];
		default:
			return [lambda(values.shift())].concat(map(lambda, values));
	}
      };

      var emaitzak=data.split('<div class="bilaketa_emaitza" id="emaitza_kutxa">')[1].split('</div>\n\n</div>\n            <div class="column bat">')[0];
      if (emaitzak.indexOf('<div class="innerDef">')!=-1)
      {
	var hitza=emaitzak.split('<div class="innerDef">')[1].split('</div>\n                        <!-- Lexiak/lokuzioak -->')[0];
	var azpihitzak=emaitzak.split('</div>\n                        <!-- Lexiak/lokuzioak -->')[1].split('</div>\n\n\n\n        \n\n\n\n</div>\n\n</div>\n            <div class="column bat">')[0];
	emaitzak=hitza+azpihitzak;
	var linkhasiera="<a href=\"#\" onclick='erakutsi_sarrera_berria(\"";
	while (emaitzak.indexOf(linkhasiera)!=-1)
	{
		var linkaurrekoa=emaitzak.split(linkhasiera)[0];
		var linkostekoa=emaitzak.substring(emaitzak.indexOf(linkhasiera)+linkhasiera.length);
		var terminoa=linkostekoa.split('"')[0];
		var terminoostekoa=linkostekoa.substring(linkostekoa.indexOf('"')+1);
		var hizk1=terminoostekoa.substring(2,4);
		var hizk2=terminoostekoa.substring(7,9);
		linkostekoa=linkostekoa.substring(linkostekoa.indexOf('>')+1);
	        emaitzak=linkaurrekoa+'<a href="http://hiztegiak.elhuyar.org/'+hizk1+'_'+hizk2+'/'+terminoa+'">'+linkostekoa;
	};
	var linkhasiera2="<a class=\"lexia_link\" onclick=\"gorde('id_lexia_";
	while (emaitzak.indexOf(linkhasiera2)!=-1)
	{
		var linkaurrekoa2=emaitzak.split(linkhasiera2)[0];
		var linkostekoa2=emaitzak.substring(emaitzak.indexOf(linkhasiera2)+linkhasiera2.length);
		var terminoa2=linkostekoa2.split('_')[0];
		var terminoa2=map(function(x){return x.split('/')[0]},terminoa2.split(' ')).join(' ');
		var terminoostekoa2=linkostekoa2.substring(linkostekoa2.indexOf('_')+1);
		var hizk3=terminoostekoa2.substring(0,2);
		var hizk4=terminoostekoa2.substring(3,5);
		linkostekoa2=linkostekoa2.substring(linkostekoa2.indexOf('>')+1);
	        emaitzak=linkaurrekoa2+'<a href="http://hiztegiak.elhuyar.org/'+hizk3+'_'+hizk4+'/'+terminoa2+'">'+linkostekoa2;
	};
	var linkhasiera3="<a class=\"lokuzioa_link\" onclick=\"gorde('id_lokuzioa_";
	while (emaitzak.indexOf(linkhasiera3)!=-1)
	{
		var linkaurrekoa3=emaitzak.split(linkhasiera3)[0];
		var linkostekoa3=emaitzak.substring(emaitzak.indexOf(linkhasiera3)+linkhasiera3.length);
		var terminoa3=linkostekoa3.split('_')[0];
		var terminoa3=map(function(x){return x.split('/')[0]},terminoa3.split(' ')).join(' ');
		var terminoostekoa3=linkostekoa3.substring(linkostekoa3.indexOf('_')+1);
		var hizk5=terminoostekoa3.substring(0,2);
		var hizk6=terminoostekoa3.substring(3,5);
		linkostekoa3=linkostekoa3.substring(linkostekoa3.indexOf('>')+1);
	        emaitzak=linkaurrekoa3+'<a href="http://hiztegiak.elhuyar.org/'+hizk5+'_'+hizk6+'/'+terminoa3+'">'+linkostekoa3;
	};
      };
      return emaitzak;
    },

    getSubQueries: function (params, isSubQuery) {
      var uiLang = $U.langCode(euskalbar.ui.locale),
          output = [];
      var subEntryMap = {
        'es': 'Subentradas',
        'en': 'Sub-headwords',
        'fr': 'Sous-entrées'
      },
          subEntryText = subEntryMap[uiLang] || 'Azpisarrerak';
      $U.ajax({
        url: this.url,
        data: params,
        async: false,
        onSuccess: function (data) {
          // Elhuyarren katea manipulatzen duen funtzioari deitu
          output.push(euskalbar.dicts.elhuyar.manipulate(data));
          // Only make subqueries if the function isn't being called
          // recursively and subqueries are enabled
          if (isSubQuery && euskalbar.app.prefs.getBoolPref("query.subqueries")) {
            var arrayElhuyar = [],
                txtElhuyar2 = data.split(subEntryText)[1];
            if (txtElhuyar2) {
              arrayElhuyar = txtElhuyar2.split('a href="?');
              arrayElhuyar.shift();
            }
            arrayElhuyar.forEach(function (result) {
              // FIXME: convert params into an array
              var params = arrayElhuyar[i].split('"')[0];
              params = params.replace(/amp\;/g, "");
              if (params.indexOf("mota=azpisarrera") !== -1) {
                output.push(
                  euskalbar.dicts.elhuyar.getSubQueries(params, false)
                );
              }
            });
          }
        },
      });
      return output.join('\n');
    },

    manipulate: function (txt) {
      var uiLang = $U.langCode(euskalbar.ui.locale),
          txtSplitMap = {
        'es': 'Resultado:',
        'en': 'Result:',
        'fr': 'R&eacute;sultat:'
      },
          txtSplit = txtSplitMap[uiLang] || 'Emaitza:';

      var output = txt.split(txtSplit)[1];

      // Remove kxo! ad
      output = output.split('<h2>')[1];

      if (output.indexOf("<!-- _______  end") === -1) {
        output = output.split("<!-- end")[0];
      } else {
        output = output.split("<!-- _______  end")[0];
      }

      output = output.replace(
          /<h2>/,
          '<font face="bitstream vera sans, verdana, arial" size="3"><B>'
      );
      output = output.replace(
          /<\/h2>/,
          "<\/B><\/font>"
      );
      output = output.replace(
          /<p class="hiz"><strong lang="\w{2}">.*<\/strong><\/p>/,
          ""
      );
      output = output.replace(
          /<a href="\?/g,
          '<a href="' + this.url + '\?'
      );
      output = output.replace(/amp\;/g, '');
      output = output + "<hr size='1'>";

      return output;
    }

  };

}();
