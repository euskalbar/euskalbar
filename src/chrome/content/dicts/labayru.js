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

euskalbar.dicts.labayru = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Labayru',
    description: 'Labayru Hiztegia',

    homePage: 'http://hiztegia.labayru.eus',

    pairs: ['eu-es', 'es-eu'],

    method: 'GET',

    mimeType: "text/html; charset=UTF8",

    getUrl: function (term, source, target) {
      if (source === 'es') {
        return 'http://hiztegia.labayru.eus/bilatu/LH/es/'+term;
      } else {
        return 'http://hiztegia.labayru.eus/bilatu/LH/eu/'+term;
      }
    },

    getParams: function (term, source, target, query) {
      if (query.type == 'combined') {
        return {
          'allInfo': true,
          'limit': 0
        };
      }

      return {};
    },

    scrap: function (term, source, target, data) {
      var output = '';
      var startSpan = '<span class="euskalbar-start"></span>';
      output = data.split(startSpan);
      output = output[1];
      var endSpan = '<span class="euskalbar-end"></span>';
      output = output.split(endSpan);
      output = output[0];
      output = output.replace(
              /<span class=["']significado["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      output = output.replace(
              /<span class=["']equivalencia-word["']>([^\<]*)\<\/span\>/gi,
              '<strong>$1</strong>'
      );
      output = output.replace(
              /<span class=["']explicacionNotaSemantica["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      output = output.replace(
              /<span class=["']nota-equivalencia["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      output = output.replace(
              /(<div class=["']blockEjemplos["']>)/gi,
              '<br>$1'
      );
      output = output.replace(
              /<span class=["']ejemploFirst["']>([^\<]*)\<\/span\>/gi,
              '<em>$1</em>'
      );
      return output;
    },
  };

}();
