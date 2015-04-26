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

euskalbar.dicts.energia = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Energia',
    description: 'EEEren Energia Hiztegia',

    homePage: 'http://www.eve.es/diccionario.aspx',

    pairs: ['eu-es', 'eu-en', 'eu-fr',
            'es-eu', 'en-eu', 'fr-eu'],

    method: 'GET',

    getUrl: function (opts) {
      return (
        'http://www.eve.es/Aula-didactica/Hiztegia.aspx?terminoEstado=' + opts.term +
        '&idiomaEstado=' + opts.source +
        '&arloaEstado=edozein&fuzzyEstado=True&busquedaTerminoEstado=True' +
        '&tipoBusqueda=terminoak&term=' + opts.term + '#tabs-1'
      );
    },

    getParams: function (opts) {
      return {};
    },

    postQuery: function (opts) {
      var link = opts.doc.getElementById("p_lt_Contenido_ContenidoPlaceHolder_ContenidoPlaceHolder_lt_zoneMain_EveElhuyarHiztegia_rpTerminos_ctl00_hlTermino");
      if (link)
      {
        link.click();
      };
    },

  };

}();
