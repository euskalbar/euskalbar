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

euskalbar.dicts.elhuyar = function () {

  var $U = euskalbar.lib.utils;

  return {
    displayName: 'Elhuyar',
    description: 'Elhuyar Hiztegia',

    homePage: "http://hiztegiak.elhuyar.org",

    pairs: ['eu-es', 'eu-fr', 'eu-en',
            'es-eu', 'fr-eu', 'en-eu'],

    method: 'GET',

    mimetype: "text/html; charset=UTF-8",

    getUrl: function (term, source, target) {
      return [
        'http://hiztegiak.elhuyar.org/', source, '_', target, '/', term
      ].join('');
    },

    getParams: function (term, source, target) {
      return {};
    },

    scrap: function (term, source, target, data) {
      if (data.indexOf('Ez da emaitzarik aurkitu') != -1) {
        data = data.substring(data.indexOf('<div class="wrapDef">'),
                              data.indexOf('<div class="column bat">'));
        data = data.replace('/proposamenak/',
                            this.homePage + '/proposamenak/');
        return data;
      } else {
        var domSerializer = Components.classes["@mozilla.org/xmlextras/xmlserializer;1"]
                           .createInstance(Components.interfaces.nsIDOMSerializer);
        var parser = new DOMParser();

        var dataOne = data.substring(data.indexOf('<div class="innerDef">'),
                                     data.indexOf('<div class="innerRelac">'));
        var dataOneDOM = parser.parseFromString(dataOne, "text/html");
        var oneNodes = dataOneDOM.getElementsByTagName('a');
        for (var i in oneNodes) {
          try {
            oneNodes[i].href = [
              this.homePage, '/', target, '_', source, '/',
              oneNodes[i].childNodes[0].innerHTML
            ].join('');
          } catch (e) {
          }
        }
        dataOne = domSerializer.serializeToString(dataOneDOM);

        var dataTwo = data.substring(data.indexOf('<div class="innerRelac">'),
                                 data.indexOf('<div class="column bat">'));
        dataTwo = dataTwo.replace(/<a/g, '<strong');
        dataTwo = dataTwo.replace(/<\/a/g, '</strong');

        var dataThree = data.substring(data.indexOf('<div class="column bat">'),
                                       data.indexOf('<div id="corpusa_edukia">'));
        var dataThreeDOM = parser.parseFromString(dataThree, "text/html");
        var threeNodes = dataThreeDOM.getElementsByTagName('a');
        for (var i in threeNodes) {
          try {
            threeNodes[i].href = [
              this.homePage, '/', source, '_', target, '/',
              threeNodes[i].innerHTML
            ].join('');
          } catch (e) {
          }
        }
        dataThree = domSerializer.serializeToString(dataThreeDOM);

        return dataOne + dataTwo + dataThree;
      }
    }

  };

}();
