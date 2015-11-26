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

euskalbar.dicts.automatikoak = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Automatikoak',
    description: 'Elhuyarren Automatikoki Sortutako Hiztegiak',

    homePage: "http://hiztegiautomatikoak.elhuyar.eus",

    pairs: ['eu-de', 'eu-zh', 'eu-hi', 'eu-sw', 'eu-ar', 'eu-oc',
            'de-eu', 'zh-eu', 'hi-eu', 'sw-eu', 'ar-eu', 'oc-eu'],

    method: 'POST',

    getUrl: function (opts) {
      return [
        'http://hiztegiautomatikoak.elhuyar.eus/bilaketa/eu'
      ].join('');
    },

    getParams: function (opts) {
      var mota;
      if (opts.source=='eu' && opts.target=='de')
      {
          mota='1';
      }
      else if (opts.source=='eu' && opts.target=='zh')
      {
          mota='2';
      }
      else if (opts.source=='eu' && opts.target=='hi')
      {
          mota='3';
      }
      else if (opts.source=='eu' && opts.target=='sw')
      {
          mota='4';
      }
      else if (opts.source=='eu' && opts.target=='ar')
      {
          mota='5';
      }
      else if (opts.source=='eu' && opts.target=='oc')
      {
          mota='11';
      }
      else if (opts.source=='de' && opts.target=='eu')
      {
          mota='6';
      }
      else if (opts.source=='zh' && opts.target=='eu')
      {
          mota='7';
      }
      else if (opts.source=='hi' && opts.target=='eu')
      {
          mota='8';
      }
      else if (opts.source=='sw' && opts.target=='eu')
      {
          mota='9';
      }
      else if (opts.source=='ar' && opts.target=='eu')
      {
          mota='10';
      }
      else if (opts.source=='oc' && opts.target=='eu')
      {
          mota='12';
      };
      return {
      	'search_type': mota,
        'search_text': opts.term,
        'search': 'Bilatu'
      };
    }

  };

}();
