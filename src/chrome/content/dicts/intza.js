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

euskalbar.dicts.intza = function () {

  return {
    displayName: 'Intza',

    homepage: 'http://intza.armiarma.com/',

    sourceLangs: ['eu'],

    targetLangs: ['eu'],

    method: 'GET',

    getUrl: function (term, source, target) {
      return 'http://intza.armiarma.com/cgi-bin/bilatu2.pl';
    },

    getParams: function (term, source, target) {
      var params = {
        'hitza1': term,
        'eremu3': '1'
      };

      if (source === 'es') {
        params['eremu1'] = 'eeki';
      } else {
        params['eremu1'] = 'giltzarriak';
      }

      return params;
    },

    scrap: function (term, source, target, data) {
      var output = data;

      var output2 = output.split("Bilaketaren emaitza")[2];
      output = '<strong><font face="bitstream vera sans, verdana, arial" size="3">'
        + term + '</font></strong>' + output2;

      var output3 = output.split("<form")[0];
      output = output3.replace(
          /<font size=5>/g,
          '<font size="3">'
      );
      output = output.replace(
          /\/cgi-bin/g,
          "http:\/\/intza.armiarma.com\/cgi-bin"
      );
      output = output.replace(
          /\/intza\/kon/g,
          "http:\/\/intza.armiarma.com\/intza\/kon"
      );

      return output;
    },

  };

}();
