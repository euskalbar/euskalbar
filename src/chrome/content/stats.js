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

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

if (!euskalbar) var euskalbar = {};

euskalbar.stats = function () {

  var $U = euskalbar.lib.utils,
      $ = $U.$;

  return {

    /* Initializes the stats file and copies it to the user profile directory */
    init: function (options) {
      options = options || {clear: false};
      var statsObj = $U.extend({}, euskalbar.prefs.stats);

      euskalbar.dicts.available.each(function (dictName) {
        if (options.clear || !statsObj.hasOwnProperty(dictName)) {
          statsObj[dictName] = 0;
        }
      });

      euskalbar.prefs.stats = statsObj;
    },


    /* Migrates stats from the old SQLite-based backend to
     * preference-based counters*/
    migrate: function () {
      let statsFilename = 'euskalbar.sqlite',
          file = FileUtils.getFile("ProfD", [statsFilename]),
          conn = Services.storage.openDatabase(file);

      var statsObj = {},
          namesMap = {
            'bostakbat': 'adorez',
            'hauta': 'hautalan',
            'lanbide': 'jakinbai',
            'lb': 'lexikoaren_behatokia',
            'lth': 'literatura',
            'telekom': 'telekomunikazioak'
          };

      var query = 'SELECT id, count FROM stats',
          statement = conn.createStatement(query);

      // Using synchronous query since we need to have the data before
      // continuing forward
      while (statement.executeStep()) {
        let id = statement.row.id,
            count = statement.row.count;

        if (id !== null) {
          // Update with mapping name if available
          id = namesMap[id] || id;
          statsObj[id] = count;
        }
      }

      conn.close();

      euskalbar.prefs.stats = statsObj;

      // Remove the obsolete DB file from the user's profile directory
      try {
        file.remove(false);
      } catch (e) {
        $U.log("Failed to remove DB file: " + e.message);
      }
    },


    // Increments the number of performed queries for `dictName`
    incr: function (dictName) {
      var statsObj = $U.extend({}, euskalbar.prefs.stats);
      statsObj[dictName] += 1;
      euskalbar.prefs.stats = statsObj;
    },


    // Clears statistics
    clear: function () {
      this.init({clear: true});
      euskalbar.ui.displayStats();
    },

  };

}();
