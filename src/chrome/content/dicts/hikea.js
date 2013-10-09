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

euskalbar.dicts.hikea = function () {

  return {
    displayName: 'HIKEA',
    description: 'HIKEA EITBren hiztegia',

    homepage: 'http://www.eitb.com',

    pairs: ['eu-es', 'eu-en',
            'es-eu', 'en-eu'],

    method: 'POST',

    getUrl: function (term, source, target) {
      switch (source) {
        case 'eu':
          return 'http://www.eitb.com/eu/get/euskera/hiztegia/'+term+'/vacio/vacio/vacio/vacio/0/0/vacio/vacio/vacio';
          break;
        case 'en':
          return 'http://www.eitb.com/eu/get/euskera/hiztegia/vacio/vacio/'+term+'/vacio/vacio/0/0/vacio/vacio/vacio';
          break;
        case 'es':
          return 'http://www.eitb.com/eu/get/euskera/hiztegia/vacio/'+term+'/vacio/vacio/vacio/0/0/vacio/vacio/vacio';
          break;
      }

    },

   getParams: function (term, source, target) {
       /*var params = {

      };

      if (source === 'es') {
        params['gaztelania'] = term;
      } else {
        params['euskera'] = term;
      }

      return params;*/
    },

  };

}();
