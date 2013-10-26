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

euskalbar.dicts.consumer = function () {

  return {
    displayName: 'Consumer',
    description: 'Consumer Corpusa',

    homePage: 'http://corpus.consumer.es/',

    pairs: ['eu-es', 'es-eu'],

    method: 'POST',

    getUrl: function (term, source, target) {
      return 'http://corpus.consumer.es/corpus/kontsulta';
    },

    getParams: function (term, source, target) {
      term = encodeURIComponent(term);
      return {
        'mota': 'arrunta',
        'hizkuntza': source === 'es' ? 'es' : 'eu',
        'formalema': 'lema',
        'konparazioa': 'da',
        'testuhitza': term,
        'kategoria': '',
        'hizkuntza2': source === 'es' ? 'es' : 'eu',
        'formalema2': '',
        'konparazioa2': '',
        'testuhitza2': '',
        'kategoria2': '',
        'osagaietan': 'eu',
        'grafiko_aukerak': '1forma'
      };
    },

  };

}();
