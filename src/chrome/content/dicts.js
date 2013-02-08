/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2013 Euskalbar Taldea (see AUTHORS file)
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

  var $L = euskalbarLib,
      $ = $L.$;

  return {

    // Fixed list of available dictionaries
    available: [
      'batua',
      'bergara',
      'consumer',
      'corpeus',
      'danobat',
      'ehuskaratuak',
      'elebila',
      'elhuyar',
      'egungo',
      'epaitegiak',
      'ereduzko',
      'eurovoc',
      'euskalterm',
      'goihata',
      'harluxet',
      'hautalan',
      'intza',
      'itzul',
      'klasikoak',
      'labayru',
      'lanbide_heziketa',
      'lexikoaren_behatokia',
      'literatura',
      'lurhe',
      'luret',
      'mokoroa',
      'morris',
      'oeh',
      'opentran',
      'telekomunikazioak',
      'uzei',
      'wikipedia',
      'xuxenweb',
      'zehazki',
      'ztcorpusa',
      'zthiztegia',
    ],

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
      var dict = euskalbar.dicts[dictName];

      euskalbar.openURL(dict.getUrl(term, source, target),
                        dictName,
                        dict.method,
                        dict.getParams(term, source, target));

      // If the dictionary provides it, execute the post-query hook once the
      // page has been loaded
      if (dict.hasOwnProperty('postQuery') && $L.isFunction(dict.postQuery)) {
        var tab = gBrowser
          .getBrowserAtIndex(euskalbar.getTabIndexBySlug(dictName)),
            hook = function (event) {
              tab.removeEventListener("load", hook, true);
              dict.postQuery(term, source, target, event.originalTarget);
            };

        tab.addEventListener("load", hook, true);
      }

      euskalbar.stats.write(dictName);
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
      var dict = euskalbar.dicts[dictName],
          output = '';

      // XXX: should we normalize term for all queries?
      // term = euskalbar.comb.normalize(term);
      $L.ajax({
        url: dict.getUrl(term, source, target),

        type: dict.method,

        data: dict.getParams(term, source, target),

        onSuccess: function (data) {
          var notice = '<div id="oharra"><a href="' + dict.homePage + '">' +
                       dict.displayName + '&nbsp;<sup>&curren;</sup></a></div>';
          $L.cleanLoadHTML(notice, $('o' + dictName, doc));

          output = dict.scrap(term, source, target, data);
        },

        onError: function (status) {
          // TODO: `status` can be used to determine if the request timed out
          output = $L._f("euskalbar.comb.error", [dict.displayName]);
        },

        onComplete: function () {
          $L.cleanLoadHTML(output, $('a' + dictName, doc));
        }
      });

      euskalbar.stats.write(dictName);
    },

  };

}();
