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

euskalbar.dicts.oeh = function () {

  return {
    displayName: 'Orotarikoa',
    description: 'Orotariko Euskal Hiztegia',

    homePage: 'http://www.euskaltzaindia.net/',

    method: 'GET',

    getUrl: function (term, source, target) {
      return 'http://www.euskaltzaindia.net/index.php';
    },

    getParams: function (term, source, target) {
      return {
        'option': 'com_oeh',
        'lang': 'eu',
        'view': 'frontpage',
        'Itemid': '340',
        'sarrera': term
      };
    },

    scrap: function (term, source, target, data) {
      data = data.substring(data.indexOf('<div class="grid7 oehResultContent">'),
                            data.indexOf('<div class="contentSearchBlock oehSearchBlock">'));
      if (data.indexOf('oehResultContent') === -1) {
        data = "Ez da aurkitu";
      }
      data = data.replace(
            /index.php/g,
            "http://www.euskaltzaindia.net/index.php"

      );
      data = data.replace(
            /images/g,
            "http://www.euskaltzaindia.net/images"

      );
      return data;
    },

  };

}();
