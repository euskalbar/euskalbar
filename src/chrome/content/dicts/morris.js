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

euskalbar.dicts.morris = function () {

  return {
    displayName: 'Morris',
    description: 'Morris Hiztegia',

    homePage: 'http://www1.euskadi.net/morris/',

    pairs: ['eu-en', 'en-eu'],

    method: 'POST',

    getUrl: function (opts) {
      return 'http://www1.euskadi.net/morris/resultado.asp';
    },

    getParams: function (opts) {
      var lang,
          params = {};

      if (opts.source === 'en') {
        var lang = 'txtIngles';
      } else {
        var lang = 'txtEuskera';
      }

      params[lang] = opts.term;

      return params;

    },

    scrap: function (data, opts) {
      if (data.match("Barkatu, baina sarrera hau ez dago hiztegian")) {
        // FIXME: L10n
        return "Ez da aurkitu " + opts.term + " hitza.";
      }

      var output = data;
      var table = output.split("<hr>");

      output = table[1].slice(0, table[1].lastIndexOf("<table"));
      output = output.split("<td class=\"titularMaior\"")[0];
      output = output.replace(
          /images/g,
          "http://www1.euskadi.net/morris/images"
      );
      output = output.replace(
          /datuak/g,
          "http://www1.euskadi.net/morris/datuak"
      );
      output = output.replace(
          /font-size: 8pt/g,
          "font-size: 10pt"
      );
      output = output.replace(
          /font-size:11ptl/g,
          "font-size: 12pt<br>"
      );
      output = output.replace(
          /color:green/g,
          "color: #000000"
      );
      output = output.replace(
          /Arial, Helvetica, sans-serif/g,
          "bitstream vera sans, verdana, arial"
      );
      output = output.replace(
          /width="550"/g,
          ""
      );
      output = output.replace(
          /width="150"/g,
          ""
      );

      return output;
    }

  };

}();
