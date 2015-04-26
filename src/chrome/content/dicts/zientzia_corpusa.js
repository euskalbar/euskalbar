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

euskalbar.dicts.zientzia_corpusa = function () {

  return {
    displayName: 'ZIO',
    description: 'Zientzia Corpusa',

    homePage: 'http://www.ehu.eus/ehg/zio/',

    method: 'GET',

    mimeType: "text/html; charset=ISO-8859-1",

    getUrl: function (opts) {
      return 'http://www.ehu.es/ehg/cgi/zio/bilatuZio.pl';
    },

    getParams: function (opts) {
      return {
        'o': '1',
        'n': 'liburuak',
        'k1': '1',
        'm1': 'lema',
        'd1': '1',
        'h1': opts.term,
      };
    },

  };

}();
