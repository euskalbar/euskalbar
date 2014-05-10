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

euskalbar.dicts.zehazki = function () {

  return {
    displayName: 'Zehazki',
    description: 'Zehazki Hiztegia',

    homePage: 'http://ehu.es/ehg/cgi/zehazki/bila',

    pairs: ['es-eu'],

    method: 'GET',

    mimeType: "text/html; charset=ISO-8859-1",

    getUrl: function (term, source, target) {
      return 'http://ehu.es/ehg/cgi/zehazki/bila';
    },

    getParams: function (term, source, target) {
      return {
        'm': 'has',
        'z': term
      };
    },

    scrap: function (term, source, target, data) {
      data = data.substring(data.indexOf('adibideak</label')+16,
                            data.indexOf('</td></tr></table>'));
      data = data.replace(
            /<img/g,
            "<span"

        );

      return data;
    },

  };

}();
