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

euskalbar.dicts.xxmendea = function () {

  return {
    displayName: 'XX. mendekoa',
    description: 'XX. mendeko Euskararen Corpus estatistikoa',

    homePage: 'http://xxmendea.euskaltzaindia.eus/Corpus/aurkezpena.html',

    method: 'GET',

    getUrl: function (opts) {
      return 'http://xxmendea.euskaltzaindia.eus/Corpus/index.jsp';
    },

    getParams: function (opts) {
      var hizkuntza;
      if (opts.source=='eu')
      {
      	hizkuntza='Eu';
      }
      else
     {
      	hizkuntza='ES';
      };
      return {
      	'hasiera': 'true',
      	'aurreratua': 'false',
      	'atala': '',
      	'epea': '0',
      	'euskalkia': '0',
      	'testu_mota': '0',
      	'formalema1': 'lema',
      	'testu_hitza1': opts.term,
      	'non1': '0',
      	'galdera_mota1': '0',
      	'btn_bilatu': 'Bilatu'
      };
    },

  };

}();
