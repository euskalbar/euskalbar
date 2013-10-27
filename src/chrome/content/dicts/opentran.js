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

euskalbar.dicts.opentran = function () {

  var $U = euskalbar.lib.utils,
      $ = $U.$;

  return {
    displayName: 'OpenTran',
    description: 'OpenTran.eu informatikako itzulpen-memoriak',

    homePage: 'http://open-tran.eu/',

    pairs: ['eu-en', 'en-eu'],

    method: 'GET',

    mimetype: "text/html; charset=UTF-8",

    getUrl: function (term, source, target) {
      return 'http://' + source + '.' + target + '.open-tran.eu/suggest/' +
             encodeURIComponent(term);
    },

    getParams: function (term, source, target) {
      return {};
    },

    scrap: function (term, source, target, data) {
      var output = "<h1>" + data.split("<h1>")[1] +
                   "<h1>" + data.split("<h1>")[2];

      output = output.split("<div id=\"bottom\">")[0];
      output = output.replace(
          /\/images\//g,
          "http://eu.open-tran.eu/images/"
      );
      output = output.replace(
          /<a href=\"javascript\:\;\"  onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g,
          "<b>"
      );
      output = output.replace(
          /<a href=\"javascript\:\;\" class=\"fuzzy\" onclick=\"return visibility_switch\(\'sug([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\'\)\">/g,
          "<i>fuzzy</i> <b>"
      );
      output = output.replace(
          /\)<\/a>/g,
          ")</b>"
      );

      return output;
    },

  };

}();
