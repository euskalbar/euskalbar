/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2012 Euskalbar Taldea (see AUTHORS file)
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

  euskalbar.stats = {

    /* Copies euskalbar.sqlite file to the user profile */
    createStatsFile: function () {
      //First copy euskalbar.sqlite
      var profileDir = euskalbar.profileURI;
      try {
        var statsFileURL = "chrome://euskalbar/content/euskalbar.sqlite";
        var statsFile = euskalbarLib.FileIO.getLocalSystemURI(statsFileURL)
                              .QueryInterface(Ci.nsIFileURL).file;
        statsFile.copyTo(profileDir, "euskalbar.sqlite");
      } catch (e) {
        console.log(e);
      }
      //Then remove the deprecated statistics folder (just this time)
      profileDir.append("euskalbar");

      if (profileDir.exists()) {
        profileDir.remove(true);
      }

    },


    // Write statistics in euskalbar.sqlite
    writeStats: function (dict) {
      let file = FileUtils.getFile("ProfD", ["euskalbar.sqlite"]);
      let euskalbarConn = Services.storage.openDatabase(file);
      if (dict == '') {
        var value = 0;
        var statement = euskalbarConn.createStatement("UPDATE stats SET count= :value");
        statement.params.value = value;
        statement.executeAsync();
        //Invalidate to refresh data <- FIXME
        var t = euskalbarLib.$("stats-tree");
        var boxobject = t.boxObject;
        boxobject.QueryInterface(Components.interfaces.nsITreeBoxObject);
        boxobject.invalidate();

      } else {
        var valuest = euskalbarConn.createStatement("SELECT count FROM stats WHERE id= :dict");
        valuest.params.dict = dict;
        while (valuest.executeStep()) {
          var value = valuest.row.count;
        }
        valuest.reset();
        value = value + 1;
        var statement = euskalbarConn.createStatement("UPDATE stats SET count= :value WHERE id= :dict");
        statement.params.dict = dict;
        statement.params.value = value;
        statement.executeAsync();
      }
    },

  };
