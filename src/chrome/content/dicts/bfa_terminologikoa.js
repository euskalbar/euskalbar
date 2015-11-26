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

euskalbar.dicts.bfa_terminologikoa = function () {

  return {
    displayName: 'BFA Term.',
    description: 'BFA Hiztegi Terminologikoa',

    homePage: 'http://apps.bizkaia.net/TK00/index.jsp?Idioma=e',

    pairs: ['eu-es',
            'es-eu'],

    method: 'POST',

    getUrl: function (opts) {
      return 'http://apps.bizkaia.net/TK00/index.jsp?Idioma=e';
    },

    getParams: function (opts) {
      return null;
    },
    
    postQuery: function (opts) {
      var mota;
      if (opts.source=='eu' && opts.target=='es')
      {
          mota=0;
      }
      else if (opts.source=='es' && opts.target=='eu')
      {
          mota=1;
      };
	  opts.doc.getElementById('termino').value = opts.term;
	  opts.doc.getElementById('idioma').selectedIndex = mota;
	  opts.doc.getElementsByClassName('boton_input')[0].click();
    },

  };

}();
