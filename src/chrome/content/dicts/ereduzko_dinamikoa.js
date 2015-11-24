/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2015 Euskalbar Taldea (see AUTHORS file)
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

euskalbar.dicts.ereduzko_dinamikoa = function () {

  return {
    displayName: 'EPD',
    description: 'Ereduzko Prosa Dinamikoa',

    homePage: 'http://www.ehu.eus/ehg/epd/',

    method: 'GET',

    mimeType: "text/html; charset=ISO-8859-1",

    getUrl: function (opts) {
      return 'http://www.ehu.eus/ehg/cgi/epd/bilatu10.pl';
    },

    getParams: function (opts) {
      return {
        'o': '1',
        'c-04-08': '04-08',
        'c-09-13': '09-13',
        'm1': 'lema',
        'n': 'bietan',
        'k1': '1',
        'd2': '1',
        'h1': opts.term,
      };
    },

  };

}();
