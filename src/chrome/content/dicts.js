/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2014 Euskalbar Taldea (see AUTHORS file)
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

euskalbar.dicts = function () {

  var $L = euskalbar.lib,
      $U = euskalbar.lib.utils,
      $ = $U.$;

  return {

    // Set of available dictionaries
    available: $L.Set([
      'adorez',
      'batua',
      'bergara',
      'berria',
      'bizkaiera',
      'bostmila',
      'consumer',
      'corpeus',
      'danobat',
      'ehuskaratuak',
      'elebila',
      'elhuyar',
      'elhuyar_web_corpusa_eu',
      'elhuyar_web_corpusa_eu_es',
      'elhuyar_web_corpusa_konbinazioak',
      'energia',
      'egungo',
      'egungo_corpusa',
      'epaitegiak',
      'ereduzko',
      'ereduzko_dinamikoa',
      'eurovoc',
      'euskal_klasikoak',
      'euskalterm',
      'goihata',
      'harluxet',
      'hautalan',
      'hikea',
      'hobelex',
      'imemoriak',
      'intza',
      'itzul',
      'jakinbai',
      'klasikoak',
      'labayru',
      'lexikoaren_behatokia',
      'librezale',
      'literatura',
      'lurhe',
      'luret',
      'microsoft',
      'mokoroa',
      'morris',
      'nolaerran',
      'oeh',
      'ostadar',
      'pentsamenduaren_klasikoak',
      'telekomunikazioak',
      'uzei',
      'wikipedia',
      'xuxenweb',
      'zehazki',
      'zientzia_corpusa',
      'ztcorpusa',
      'zthiztegia',
      'zuzenbide_corpusa',
    ]),

    /*
     * Queries the given `dictName` dictionary.
     *
     * Dictionaries need to provide in their public interface at least:
     *  - `url`: A URL to query.
     *  - `method`: HTTP method to use when performing queries ('GET', 'POST')
     *  - `getParams`: Function that returns an object of key-value pairs that
     *     will be passed as the request data. This function will be passed the
     *     `term` that is being queried.
     *
     * Optionally, dictionaries can invoke post-query hooks by providing a
     * `postQuery` function.
     */
    query: function (dictName, term, source, target) {
      var query = {type: "simple"};
      var dict = euskalbar.dicts[dictName];
      euskalbar.app.openURL(dict.getUrl(term, source, target),
                            dictName,
                            dict.method,
                            dict.getParams(term, source, target, query),
                            dict.mimeType || '',
                            dict.referer);

      // If the dictionary provides it, execute the post-query hook once the
      // page has been loaded
      if (dict.hasOwnProperty('postQuery') && $U.isFunction(dict.postQuery)) {
        var tab = gBrowser
          .getBrowserAtIndex(euskalbar.app.getTabIndexBySlug(dictName)),
            hook = function (event) {
              dict.postQuery(term, source, target, event.originalTarget);
              tab.removeEventListener("load", hook, true);
            };

        tab.addEventListener("load", hook, true);
      }

      euskalbar.stats.incr(dictName);
    },


    /*
     * Runs a combined query for the given `dictName` dictionary.
     *
     * Dictionaries need to provide in their public interface at least:
     *  - `url`: A URL to query.
     *  - `method`: HTTP method to use when performing queries ('GET', 'POST')
     *  - `getParams`: Function that returns an object of key-value pairs that
     *     will be passed as the request data. This function will be passed the
     *     `term` that is being queried.
     *  - `scrap`: Function that manipulates the data retrieved via XHR and
     *     returns HTML ready to be injected into the resulting table.
     */
    combinedQuery: function (dictName, term, source, target, doc) {
      var query = {type: "combined"};
      var dict = euskalbar.dicts[dictName],
          output = '';

      $U.ajax({
        url: dict.getUrl(term, source, target),

        type: dict.method,

        mimeType: dict.mimeType || '',

        data: dict.getParams(term, source, target, query),

        onSuccess: function (data) {
          var notice = '<div id="oharra"><a href="' + dict.homePage + '">' +
                       dict.displayName + '&nbsp;<sup>&curren;</sup></a></div>';
          $U.cleanLoadHTML(notice, $('o' + dictName, doc));

          output = dict.scrap(term, source, target, data);
        },

        onError: function (status) {
          // TODO: `status` can be used to determine if the request timed out
          output = $U._f("combined.error.label", [dict.displayName]);
        },

        onComplete: function () {
          $U.cleanLoadHTML(output, $('a' + dictName, doc));
        }
      });

      euskalbar.stats.incr(dictName);
    },

  };

}();
