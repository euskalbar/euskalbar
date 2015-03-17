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

    homePage: "http://test220.irontec.com/labayru-dev/hiztegia/",

    pairs: ['eu-es', 'es-eu'],

    method: 'GET',

    mimeType: "text/html; charset=UTF8",

    getUrl: function (term, source, target) {
      if (source === 'es') {
        return 'http://test220.irontec.com/labayru-dev/hiztegia/bilatu/LH/es/'+term;
      } else {
        return 'http://test220.irontec.com/labayru-dev/hiztegia/bilatu/LH/eu/'+term;
      }
    },

    getParams: function (term, source, target, combinedQuery) {
    	if (combinedQuery) {
    	      return {
    	          'allInfo': true,
    	          'limit': 0
    	      };	
    	} else {
    		return {
    		}
    	}
    },

    scrap: function (term, source, target, data) {
      var output = '';
  	  var startDiv = '<div id="results-block" class="right-frame m-top-8 m-bottom-8">';
          output = data.split(startDiv);
          output = output[1];
        var endDiv = '<button id="load-more"';
          output = output.split(endDiv);
          output = output[0];
        var endDiv2 = '<footer class="visible-xs m-top-4">';
        output = output.split(endDiv2);
        output = output[0];
        
	output = output.replace(
	    /\<span class="explicacionNotaSemantica">([^\<]*)\<\/span>/g,
	    '<em>$1</em>'
	);
	output = output.replace(
		/<span class="nota-equivalencia">([^\<]*)\<\/span\>/gi,
	    '<em>$1</em>'
	);
        return output;
    },

  };

}();
