/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2016 Euskalbar Taldea (see AUTHORS file)
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

euskalbar.dicts.transvision = function () {

  // Some of the language codes that transvision uses
  // are not equal to the language codes used by euskalbar
  // and need to be changed.
  function adaptLanguageCode(lang_code) {
    switch (lang_code) {
      case 'hi':
        lang_code = 'hi-IN';
        break;
      case 'jp':
        lang_code = 'ja';
        break;
      case 'zh':
        lang_code = 'zh-CN';
        break;
    }
    return lang_code;
  }

  return {
    displayName: 'Transvision',
    description: 'Transvision',

    homePage: 'https://transvision.mozfr.org/',

    pairs: ['eu-ar', 'eu-de', 'eu-en', 'eu-es', 'eu-fr', 'eu-hi', 'eu-jp', 'eu-zh',
            'ar-eu', 'de-eu', 'en-eu', 'es-eu', 'fr-eu', 'hi-eu', 'jp-eu', 'zh-eu'],

    method: 'GET',

    mimeType: "text/html; charset=UTF-8",

    getUrl: function (opts) {
      return 'https://transvision.mozfr.org/';
    },

    getParams: function (opts) {

      opts.source = adaptLanguageCode(opts.source);
      opts.target = adaptLanguageCode(opts.target);

      return {
        'repo': 'global',
        'recherche': opts.term,
        'sourcelocale': opts.source,
        'locale': opts.target
      };
    }

  };

}();
