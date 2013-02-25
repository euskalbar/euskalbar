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

euskalbar.dicts.zthiztegia = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: "ZT Hiztegia",

    homePage: 'http://zthiztegia.elhuyar.org',

    pairs: ['eu-es', 'eu-fr', 'eu-en', 'eu-la',
            'es-eu', 'fr-eu', 'en-eu', 'la-eu'],

    method: 'GET',

    getUrl: function (term, source, target) {
      return 'http://zthiztegia.elhuyar.org';
    },

    getParams: function (term, source, target) {
      return null;
    },

    postQuery: function (term, source, target, doc) {
        var i = 0;
        switch (source) {
          case 'eu':
            i = 0;
            break;
          case 'en':
            i = 1;
            break;
          case 'es':
            i = 2;
            break;
          case 'fr':
            i = 3;
            break;
          case 'la':
            i = 4;
            break;
        }

        $('txtBilagaila', doc).value = term;
        $('selectHizkuntza', doc).selectedIndex = i;
        $('bot_bilatu', doc).click();
    },

    scrap: function (term, source, target, data) {
      // TODO: implementation
    },

  };

}();
