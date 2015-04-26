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

euskalbar.dicts.eurovoc = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Eurovoc',
    description: 'Eurovoc Thesaurusa',

    homePage: 'http://www.bizkaia.net/kultura/eurovoc/',

    method: 'POST',

    mimeType: "text/html; charset=ISO-8859-1",

    getUrl: function (opts) {
      return 'http://web.bizkaia.net/kultura/eurovoc/busqueda.asp';
    },

    getParams: function (opts) {
      return {
        'txtBuscar': 'S',
        'query': opts.term,
        'idioma': $U.langCode(euskalbar.ui.locale) === 'es' ? 'CA' : 'EU',
      };
    },

  };

}();
