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

euskalbar.dicts.uzei = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'UZEI Sinonimoen Hiztegia',

    homePage: 'http://www.uzei.com/estatico/sinonimos.asp',

    method: 'GET',

    getUrl: function (term, source, target) {
      return 'http://www.uzei.com/estatico/sinonimos.asp';
    },

    getParams: function (term, source, target) {
      var uiLang = $U.langCode(euskalbar.ui.locale),
          langMap = {
            'en': '1347',
            'fr': '1348',
            'es': '1',
            'eu': '14',
          };

      return {
        'sesion': langMap[uiLang] || '14',
        'sarrera': term,
        'eragiketa': 'bilatu'
      };
    },

    scrap: function (term, source, target, data) {
      var output = data;

      var table = output.split("<TABLE");
      output = table[2].substring(-1);
      output = '<table' + output;

      var table2 = output.split("</table");
      output = table2[0].substring(-1);
      output = output + '</table>';
      output = output.replace(/sinonimos.asp/g, this.url);
      output = '<font face="bitstream vera sans, verdana, arial" size="3"><B>'
        + term + '</B></font><font face="bitstream vera sans, verdana, arial">'
        + output + '</font>';

      return output;
    },

  };

}();
