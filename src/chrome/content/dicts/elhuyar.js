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

    homePage: "http://www.elhuyar.org/hiztegia/",

    pairs: ['eu-es', 'eu-fr', 'eu-en',
            'es-eu', 'fr-eu', 'en-eu'],

    method: 'POST',

    getUrl: function (term, source, target) {
      var uiLang = $U.langCode(euskalbar.ui.locale);

      if (uiLang === 'en') {
        return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EN/Dictionary-search';
      } else if (uiLang === 'es') {
        return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/ES/Consulta-de-diccionarios';
      } else if (uiLang === 'fr') {
        return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/FR/Dictionnaire-recherche';
      } else {
        return 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta';
      }
    },

    getParams: function (term, source, target) {
      var chkHizkuntza, newTarget;
      var sourceMap = {
        'es': 'gazt',
        'fr': 'fran',
        'en': 'ing',
        'eu': 'eusk'
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

      var params = {
            'txtHitza': term,
            'nondik': sourceMap[source],
            'edozer': 'ehunekoa',
            'bot_kon': '>'
          };

      if (chkHizkuntza != '') {
        params[chkHizkuntza] = newTarget;
      }

      return params;
    },

    scrap: function (term, source, target, data) {
      var uiLang = $U.langCode(euskalbar.ui.locale),
          output = '';

      var errorMsgMap = {
        'es': 'No se han encontrado resultados para la b&uacute;squeda',
        'en': 'No match found',
        'fr': 'Aucun r&eacute;sultat pour votre entr&eacute;e'
      },
          errorMsg = errorMsgMap[uiLang] || 'Ez dago horrelako sarrerarik';

      if (data.indexOf(errorMsg) != -1) {
        // TODO: i18n
        output = 'Not found.';
      } else {
        var resultsList = data.split('div id="zerrenda"')[1],
            resultsArray = resultsList.split('a href="?'),
            hasResults = false;

        resultsArray.shift();

        resultsArray.forEach(function (result) {
          var linkWord = result.split(">")[1].split("<")[0],
              linkWordNorm = $U.normalize(linkWord),
              originalNorm = $U.normalize(term),
              params = result.split('"')[0].replace(/amp\;/g, "");

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
            output += euskalbar.dicts.elhuyar.getSubQueries(params, true);
          }
        });

        if (!hasResults) {
          resultsArray.forEach(function (result) {
            var linkWord = result.split(">")[1].split("<")[0],
                params = result.split('"')[0];
            // FIXME: This can probably done by retrieving the params object and
            // manipulating it
            params = params.replace(/amp\;/g, "");

            output = '<p><a href="' + this.url + "?" + params.replace('txtHitza='
                     + encodeURIComponent(term), 'txtHitza=' + linkWord) + '">'
                     + linkWord + '</a></p>';
          });
        }
      }

      return output;
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
