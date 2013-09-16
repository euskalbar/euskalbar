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

euskalbar.ui = function () {

  var $U = euskalbar.lib.utils,
      $ = $U.$;

  return {

    /* Euskalbar UI initialization */
    init: function () {
      // Toggle toolbar buttons' visibility
      euskalbar.dicts.available.each(function (dictName) {
        euskalbar.ui.toggleButtons('euskalbar-' + dictName,
                                   dictName + '.visible');
      });

      this.initLanguages();
      this.initDictsMenu();
    },

    acceptedLocales: ['eu', 'en', 'es', 'fr', 'ja'],

    get locale() {
      try {
        var locale = Services.prefs
                             .getComplexValue("general.useragent.locale",
                                              Ci.nsIPrefLocalizedString).data;
      } catch (e) {
        locale = "en-US";
      }

      return locale;
    },


    /*
     * Generates the selectable drop-down with all the available language pairs
     */
    initLanguages: function () {
      var i,
          source, target, targets,
          pair, reversePair,
          menuItem, menuSeparator,
          addedPairs = [],
          menuPopup = $('euskalbar-language-popup'),
          allSources = Object.keys(euskalbar.app.pairs).sort(),
          sources = allSources.splice(allSources.indexOf('eu'), 1);

      var appendToMenu = function (source, target) {
        menuItem = document.createElement('menuitem');
        menuItem.setAttribute('id', 'euskalbar-language-' +
                                    source + '_' + target);
        menuItem.setAttribute('label', source.toUpperCase() + ' ‣ ' +
                                       target.toUpperCase());
        menuItem.setAttribute('oncommand',
                              'euskalbar.app.switchTo("' +
                                source + '", "' + target + '");' +
                                'event.stopPropagation();');
        menuPopup.appendChild(menuItem);

        // Keep track of already-added pairs
        addedPairs.push(source + '-' + target);
      };

      sources.forEach(function (source, i) {
        targets = Object.keys(euskalbar.app.pairs[source]).sort();
        targets.forEach(function (target) {
          pair = source + '-' + target;
          reversePair = target + '-' + source;
          if (addedPairs.indexOf(pair) === -1 && pair !== 'eu-eu') {
            menuSeparator = document.createElement('menuseparator'),
            menuPopup.appendChild(menuSeparator);

            appendToMenu(source, target);

            // Check the reverse pair
            if (euskalbar.app.pairs.hasOwnProperty(target) &&
                euskalbar.app.pairs[target].hasOwnProperty(source) &&
                addedPairs.indexOf(reversePair) === -1) {
              appendToMenu(target, source);
            }
          }
        });
      });
    },


    initDictsMenu: function () {
      var dictsMenu = this.createDictsMenu();

      this.initMenu("euskalbar-menu", dictsMenu);
      this.initMenu("appmenu_euskalbar", dictsMenu);
    },


    /* Dynamically creates the dictionaries menu based on the data
     * available in euskalbar.dicts.menu
     *
     * TODO: allow nested categories by making this a recursive function
     * TODO: first try to load the dictionaries' JSON remotely
     */
    createDictsMenu: function () {
      var items = euskalbar.dicts.menu;
      var menuPopup = document.createElement("menupopup");

      for (var i=0; i<items.length; i++) {
        var menu = document.createElement("menu");
        menu.setAttribute("label", $U._(items[i].cat));
        menu.setAttribute("id", "euskalbar-menu-" + $U.slugify(items[i].cat));

        var submenu = document.createElement("menupopup");
        submenu.setAttribute("id",
                             "euskalbar-menuPopup-" + $U.slugify(items[i].cat));

        var dicts = items[i].dicts;
        for (var j=0; j<dicts.length; j++) {
          var dict = dicts[j];

          if (dict.hasOwnProperty("sep")) {
            var item = document.createElement("menuseparator");
          } else {
            var item = document.createElement("menuitem");
            item.setAttribute("label", $U._(dict.name));
            item.setAttribute("oncommand",
                              "euskalbar.app.openURL('" + dict.url + "', '" +
                                                 $U.slugify(dict.name) + "')");
          }

          submenu.appendChild(item);
        }

        menu.appendChild(submenu);
        menuPopup.appendChild(menu);
      }

      return menuPopup;
    },


    /* Initializes a menu with id 'parentMenuId' by recursively cloning
     * the 'popupMenu' DOM node */
    initMenu: function (parentMenuId, popupMenu) {
      var parentMenu = $(parentMenuId);

      if (!parentMenu) {
        return;
      }

      parentMenu.appendChild(popupMenu.cloneNode(true));
    },


    /* Appends the Euskalbar button to the navigation bar */
    appendButtonToToolbar: function () {
      // Get the current navigation bar button set (a string of button IDs) and append
      // the ID of the Euskalbar button into it
      var euskalbarButtonId = "euskalbar-button";
      var navBarId = "nav-bar";
      var navBar = $(navBarId);

      var currentSet = navBar.currentSet;

      // Append only if the button is not already there
      var curSet = currentSet.split(",");
      if (curSet.indexOf(euskalbarButtonId) == -1) {
        var set = curSet.concat(euskalbarButtonId).join(",");

        navBar.currentSet = set;
        navBar.setAttribute("currentset", set);
        document.persist(navBarId, "currentset");

        try {
          BrowserToolboxCustomizeDone(true);
        } catch (e) {
        }
      }

      // In case it's hidden, show the navigation bar
      navBar.setAttribute("collapsed", false);
      document.persist(navBarId, "collapsed");
    },

    /* Toggles buttons visibility */
    toggleButtons: function (name, apref) {
      try {
        var btn = $(name),
            state = euskalbar.app.prefs.getBoolPref(apref);

        btn.collapsed = !state;
      } catch (e) {
        $U.log("Error while toggling button visibility: " + name);
      }
    },


    displayToolbar: function () {
      $("euskalbar-toolbar").collapsed = false;
    },


    /* Returns the selected text from the current focused window */
    selectionText: function () {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection().toString();
    },


    /* Displays the preferences window */
    options: function () {
      var dialogURL = "chrome://euskalbar/content/prefs.xul";
      var prefwindow = window.openDialog(dialogURL, "", "chrome,modal,close");
    },


    /* Displays the dictionary usage statistics */
    stats: function () {
      var t = gBrowser.addTab("chrome://euskalbar/content/stats.xul");
      gBrowser.selectedTab = t;
    },


    /* Displays the online help */
    help: function () {
      var locale = $U.langCode(euskalbar.ui.locale);

      if (euskalbar.ui.acceptedLocales.indexOf(locale) == -1) {
        var locale = 'en';
      }

      euskalbar.app.reuseOldTab(euskalbar.app.helpBaseURL + locale,
                                'euskalbarhelp');
    },


  };

}();
