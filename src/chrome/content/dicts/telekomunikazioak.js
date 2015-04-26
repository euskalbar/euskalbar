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

euskalbar.dicts.telekomunikazioak = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Telekom.',
    description: 'Telekomunikazio Hiztegia',

    homePage: 'http://www.telekomunikaziohiztegia.org/',

    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'en-eu', 'fr-eu'],

    method: 'GET',

    mimeType: "text/html; charset=ISO-8859-1",

    getUrl: function (opts) {
      return 'http://www.telekomunikaziohiztegia.org/';
    },

    getParams: function (opts) {
      var dictLang,
          uiLang = $U.langCode(euskalbar.ui.locale);

      if (uiLang === 'es') {
        dictLang = 'gazt';
      } else {
        dictLang = 'eusk';
      }

      return {
        'hizk': dictLang,
      };
    },

    postQuery: function (opts) {
      var i = 0;
      switch (opts.source) {
        case 'eu':
          i = 0;
          break;
        case 'en':
          i = 2;
          break;
        case 'es':
          i = 1;
          break;
        case 'fr':
          i = 3;
          break;
      }

      var textbox = doc.getElementsByName("txtHitza")[0];
      textbox.value = opts.term;
      var langcombo = doc.getElementsByName("selectHizkuntza")[0];
      langcombo.selectedIndex = i;
      var button = doc.getElementsByName("submit")[0];
      button.click();
    },

    /*scrap: function (term, source, target, data) {
      // TODO: implementation
    },*/

  };

}();
