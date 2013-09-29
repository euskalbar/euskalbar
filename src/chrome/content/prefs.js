/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2013 Euskalbar Taldea (see AUTHORS file)
 *
 * Based on code from Adblock Plus build tools, which is
 * Copyright (C) 2006-2013 Eyeo GmbH
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

Components.utils.import("resource://gre/modules/AddonManager.jsm");
Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");


if (!euskalbar) var euskalbar = {};

euskalbar.prefs = function () {

  const Cc = Components.classes;
  const Ci = Components.interfaces;
  const Cu = Components.utils;

  var branchName = 'extensions.euskalbar.',
      branch = Services.prefs.getBranch(branchName),
      addonId = 'euskalbar@interneteuskadi.org',
      addonRoot = undefined;

  AddonManager.getAddonByID(addonId, function (addon) {
    addonRoot = addon.getResourceURI().spec;
  });

  /* Type getters/setters */
  var typeMap = {
        boolean: [getBoolPref, setBoolPref],
        number: [getIntPref, setIntPref],
        string: [getCharPref, setCharPref],
        object: [getJSONPref, setJSONPref]
      };

  function getIntPref(branch, pref) {
    return branch.getIntPref(pref);
  }
  function setIntPref(branch, pref, newValue) {
    branch.setIntPref(pref, newValue);
  }

  function getBoolPref(branch, pref) {
    return branch.getBoolPref(pref);
  }
  function setBoolPref(branch, pref, newValue) {
    branch.setBoolPref(pref, newValue);
  }

  function getCharPref(branch, pref) {
    return branch.getComplexValue(pref, Ci.nsISupportsString).data;
  }
  function setCharPref(branch, pref, newValue) {
    let str = Cc["@mozilla.org/supports-string;1"]
                .createInstance(Ci.nsISupportsString);
    str.data = newValue;
    branch.setComplexValue(pref, Ci.nsISupportsString, str);
  }

  function getJSONPref(branch, pref) {
    return JSON.parse(getCharPref(branch, pref));
  }
  function setJSONPref(branch, pref, newValue) {
    setCharPref(branch, pref, JSON.stringify(newValue));
  }


  /* Event listeners */

  var ignorePrefChanges = false;

  var listeners = [];

  function triggerListeners(name) {
    for (let i=0; i<listeners.length; i++) {
      try {
        listeners[i](name);
      } catch (e) {
        Cu.reportError(e);
      }
    }
  }

  /* Defines preference names as properties in the current object with the
   * corresponding getter/setter functions attached.
   */
  function defineProperty(name, defaultValue, readFunc, writeFunc) {
    var value = defaultValue;

    euskalbar.prefs['_update_' + name] = function () {
      try {
        value = readFunc(branch, name);
        triggerListeners(name);
      }
      catch(e) {
        Cu.reportError(e);
      }
    };

    euskalbar.prefs.__defineGetter__(name, function () {
      return value;
    });
    euskalbar.prefs.__defineSetter__(name, function (newValue) {
      if (value == newValue) {
        return value;
      }

      try {
        ignorePrefChanges = true;
        writeFunc(branch, name, newValue);
        value = newValue;
        triggerListeners(name);
      } catch (e) {
        Cu.reportError(e);
      } finally {
        ignorePrefChanges = false;
      }

      return value;
    });

    euskalbar.prefs['_update_' + name]();
  };

  return {

    init: function () {
      var defaultBranch = Services.prefs.getDefaultBranch(branchName);

      let scope = {
        pref: function (pref, value) {
          if (pref.substr(0, branchName.length) != branchName) {
            Cu.reportError(new Error("Ignoring default preference " + pref +
                                     ", wrong branch."));
            return;
          }
          pref = pref.substr(branchName.length);

          let [getter, setter] = typeMap[typeof value];
          setter(defaultBranch, pref, value);
          defineProperty(pref, false, getter, setter);
        }
      };
      Services.scriptloader.loadSubScript(addonRoot + 'defaults/prefs.js',
                                          scope);

      // Register to receive notifications of preference changes
      try {
        branch.QueryInterface(Ci.nsIPrefBranch2)
          .addObserver("", euskalbar.prefs, true);
      }
      catch (e) {
        Cu.reportError(e);
      }
    },

    shutdown: function () {
      branch.removeObserver("", euskalbar.prefs)
    },

    addListener: function (listener) {
      if (listeners.indexOf(listener) < 0) {
        listeners.push(listener);
      }
    },

    removeListener: function (listener) {
      let index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    },

    observe: function (subject, topic, data) {
      if (ignorePrefChanges || topic != "nsPref:changed") {
        return;
      }

      if ("_update_" + data in this) {
        this["_update_" + data]();
      }
    },

    QueryInterface: XPCOMUtils.generateQI([Ci.nsISupportsWeakReference,
                                           Ci.nsIObserver])

  };

}();
