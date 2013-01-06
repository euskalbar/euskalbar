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

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

euskalbar.stats = {

  filename: 'euskalbar.sqlite',

  /* Initializes the stats file and copies it to the user profile directory */
  init: function () {
    // First copy euskalbar.sqlite
    var profileDir = euskalbar.profileURI;
    try {
      var statsFileURL = "chrome://euskalbar/content/euskalbar.sqlite";
      var statsFile = euskalbarLib.FileIO.getLocalSystemURI(statsFileURL)
                                  .QueryInterface(Ci.nsIFileURL).file;
      statsFile.copyTo(profileDir, this.filename);
    } catch (e) {
      console.log(e);
    }

    // Then remove the deprecated statistics folder (just this time)
    profileDir.append("euskalbar");

    if (profileDir.exists()) {
      profileDir.remove(true);
    }

  },


  // Write statistics in euskalbar.sqlite
  write: function (dict) {
    let file = FileUtils.getFile("ProfD", [this.filename]);
    let euskalbarConn = Services.storage.openDatabase(file);

    var query = "UPDATE stats SET count=count + 1 WHERE id=:dict",
        statement = euskalbarConn.createStatement(query);

    statement.params.dict = dict;
    statement.executeAsync();
    euskalbarConn.asyncClose();
  },


  // Clears statistics
  clear: function () {
    let file = FileUtils.getFile("ProfD", [this.filename]);
    let euskalbarConn = Services.storage.openDatabase(file);

    var query = "UPDATE stats SET count=0",
        statement = euskalbarConn.createStatement(query);

    statement.executeAsync();
    euskalbarConn.asyncClose();

    // Refresh stats view
    euskalbarLib.$('stats-tree').builder.rebuild();
  },

};
