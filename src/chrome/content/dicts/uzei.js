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

euskalbar.dicts.uzei = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'UZEI sin.',
    description: 'UZEI Sinonimoen Hiztegia',
    contextCategory: 'context.Synonyms',

    homePage: 'http://sh.uzei.com',

    method: 'POST',

    getUrl: function (term, source, target) {
      return 'http://sh.uzei.com/listado';
    },

    getParams: function (term, source, target) {
      term = encodeURIComponent(term);
      return {
        'q': term
      };
    },

    scrap: function (term, source, target, data) {
      data = data.substring(data.indexOf('<div class=\'row-fluid\'>'),
                            data.indexOf('<table class="table table-striped">'));
      data = data.replace(/<pre>/g, "");
      if (data.indexOf('Ez dugu aurkitu') !== -1) {
        data = 'Ez dugu aurkitu zure bilaketa-irizpideak betetzen dituen formarik.'
      }
      return data;
    },

  };

}();
