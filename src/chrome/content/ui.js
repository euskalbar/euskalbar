/*
 * Euskalbar - A Firefox extension for helping in Basque translations.
 * Copyright (C) 2006-2015 Euskalbar Taldea (see AUTHORS file)
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
      this.initLanguages();
      this.initToolbarDicts();
      this.initDictsMenu();
      this.initContextMenu();

      euskalbar.prefs.addListener(function (prefName) {
        switch (prefName) {
          case 'showDictsMenu':
            euskalbar.ui.toggleDictsMenu();
            break;
          case 'showContextMenu':
            euskalbar.ui.showContextMenu();
            break;
          case 'visibleDicts':
            euskalbar.dicts.available.each(function (dictName) {
              euskalbar.ui.setButtonVisibility(dictName);
            });
            break;
        }
      });
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
      var addedPairs = [],
          menuPopup = $('euskalbar-language-popup'),
          allSources = Object.keys(euskalbar.app.pairs).sort(),
          sources = allSources.splice(allSources.indexOf('eu'), 1),
          i, source, target;

      var appendToMenu = function (source, target) {
        var menuItem = document.createElement('menuitem');
        menuItem.setAttribute('id', 'euskalbar-language-' +
                                    source + '_' + target);
        menuItem.setAttribute('label', source.toUpperCase() + ' ‣ ' +
                                       target.toUpperCase());
        menuItem.setAttribute('oncommand',
                              'euskalbar.app.setLang("' +
                                source + '", "' + target + '");' +
                                'event.stopPropagation();');
        menuPopup.appendChild(menuItem);

        // Keep track of already-added pairs
        addedPairs.push(source + '-' + target);
      };

      sources.forEach(function (source, i) {
        var targets = Object.keys(euskalbar.app.pairs[source]).sort();
        targets.forEach(function (target) {
          var pair = source + '-' + target,
              reversePair = target + '-' + source;

          if (addedPairs.indexOf(pair) === -1 && pair !== 'eu-eu') {
            var menuSeparator = document.createElement('menuseparator');
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


    /*
     * Generates toolbar buttons for the available dictionaries
     */
    initToolbarDicts: function () {
      var toolbar = $('euskalbar-dicts-general'),
          euPairs = euskalbar.app.pairs.eu.eu,
          nonEuDicts,
          toolbarSeparator;

      var appendToToolbar = function (dictName) {
        var dict = euskalbar.dicts[dictName];
        var toolbarButton = document.createElement('toolbarbutton');
        toolbarButton.setAttribute('id', 'euskalbar-' + dictName);
        toolbarButton.setAttribute('label', dict.displayName);
        toolbarButton.setAttribute('tooltiptext', dict.description ||
                                                  dict.displayName);
        toolbarButton.setAttribute('collapsed', false);
        toolbarButton.setAttribute('persist', 'collapsed');
        toolbarButton.setAttribute('oncommand',
                                   'euskalbar.app.runQuery(event);');
        toolbar.appendChild(toolbarButton);

        euskalbar.ui.setButtonVisibility(dictName);
      };

      nonEuDicts = euskalbar.dicts.available.difference(euPairs);
      nonEuDicts.each(function (dictName) {
        appendToToolbar(dictName);
      });

      toolbarSeparator = document.createElement('toolbarseparator'),
      toolbar.appendChild(toolbarSeparator);

      euskalbar.app.pairs.eu.eu.each(function (dictName) {
        appendToToolbar(dictName);
      });
    },


    /*
     * Generates the context drop-down menu
     */
    initContextMenu: function () {
      var contextMenu = $('euskalbar-context-menupopup'),
          addedPairs = {},
          contextCategories = {},
          source, target;

      var appendToMenu = function (menu, dictName, source, target) {
        var dict = euskalbar.dicts[dictName],
            menuItem = document.createElement('menuitem');

        menuItem.setAttribute('id', 'euskalbar-' + dictName + '-' +
                                    source + '_' + target + '-context');
        menuItem.setAttribute('label', dict.displayName);
        if (dict.description !== undefined) {
          menuItem.setAttribute('tooltiptext', dict.description);
        }
        menuItem.setAttribute('oncommand',
                              'euskalbar.app.runQuery(event)');

        menu.appendChild(menuItem);
      };

      var newPairMenu = function (source, target) {
        var menu = document.createElement('menu'),
            menuPopup = document.createElement('menupopup');

        euskalbar.app.pairs[source][target].each(function (dictName) {
          var dict = euskalbar.dicts[dictName];

          if (dict.hasOwnProperty('contextCategory')) {
            var categoryList = contextCategories[dict.contextCategory] || [];
            categoryList.push(dictName);
            contextCategories[dict.contextCategory] = categoryList;

            return false;
          }

          appendToMenu(menuPopup, dictName, source, target);
        });

        var label = source.toUpperCase();
        if (source !== 'eu' || target !== 'eu') {
          label = label  + ' ‣ ' + target.toUpperCase();
        }
        menu.setAttribute('label', label);
        menu.appendChild(menuPopup);

        contextMenu.appendChild(menu);

        addedPairs[[source, '_', target].join('')] = true;
      };

      var newCategoryMenu = function (category) {
        var menu = document.createElement('menu'),
            menuPopup = document.createElement('menupopup');

        contextCategories[category].forEach(function (dictName) {
          // HACKISH: using 'fake' as source and target languages
          appendToMenu(menuPopup, dictName, 'fake', 'fake');
        });

        var label = $U._(category);
        menu.setAttribute('label', label);
        menu.appendChild(menuPopup);

        contextMenu.appendChild(menu);
      };

      var newRootCategoryMenu = function (category) {
        contextCategories.root.forEach(function (dictName) {
          // HACKISH: using 'fake' as source and target languages
          appendToMenu(contextMenu, dictName, 'fake', 'fake');
        });
      };

      // Add Basque-only dictionaries first
      newPairMenu('eu', 'eu');

      // Add any remaining language pairs as submenus, and extract those
      // that need to be categorized to treat them separately
      for (source in euskalbar.app.pairs) {
        for (target in euskalbar.app.pairs[source]) {
          var pair = [source, '_', target].join('');
          if (!(pair in addedPairs)) {
            var menuSeparator = document.createElement('menuseparator');
            contextMenu.appendChild(menuSeparator);

            newPairMenu(source, target);

            if (target in euskalbar.app.pairs &&
                source in euskalbar.app.pairs[target]) {
              newPairMenu(target, source);
            }
          }
        }
      }

      // Add all categorized dictionaries
      for (var category in contextCategories) {
        var menuSeparator = document.createElement('menuseparator');
        contextMenu.appendChild(menuSeparator);

        if (category === 'root') {
          newRootCategoryMenu(category);
        } else {
          newCategoryMenu(category);
        }
      }

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


    // Shows/hides dictionaries menu
    toggleDictsMenu: function () {
      var menuEntry = $('euskalbar-menu'),
          appmenuEntry = $("appmenu_euskalbar"),
          appmenuSpacer = $("euskalbar-appmenu-spacer");

      if (!euskalbar.prefs.showDictsMenu) {
        menuEntry.setAttribute('hidden', true);
        appmenuEntry.setAttribute('hidden', true);
        appmenuSpacer.setAttribute('hidden', true);
      } else {
        menuEntry.removeAttribute('hidden');
        appmenuEntry.removeAttribute('hidden');
        appmenuSpacer.removeAttribute('hidden');
      }
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
      if (curSet.indexOf(euskalbarButtonId) === -1) {
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


    /* Toggles toolbar button visibility */
    setButtonVisibility: function (dictName) {
      try {
        var btn = $('euskalbar-' + dictName),
            isVisible = euskalbar.prefs.visibleDicts.indexOf(dictName) !== -1;

        btn.collapsed = !isVisible;
      } catch (e) {
        $U.log("Error while toggling button visibility: " + name);
      }
    },


    displayToolbar: function () {
      $("euskalbar-toolbar").collapsed = false;
    },


    // Shows/hides context menu
    showContextMenu: function () {
      var sep = $('euskalbar-context-menuseparator'),
          button = $('euskalbar-context-menu');
      if (!euskalbar.prefs.showContextMenu) {
        sep.setAttribute('hidden', true);
        button.setAttribute('hidden', true);
      } else {
        sep.removeAttribute('hidden');
        button.removeAttribute('hidden');
      }
    },


    /* Returns the selected text from the current focused window */
    selectionText: function () {
      var focusedWindow = document.commandDispatcher.focusedWindow;
      var winWrapper = new XPCNativeWrapper(focusedWindow, 'getSelection()');
      return winWrapper.getSelection().toString();
    },


    /* Displays the preferences window */
    options: function () {
      var dialogURL = "chrome://euskalbar/content/prefs.xul",
          sharedObj = {
            dicts: euskalbar.dicts,
            prefs: euskalbar.prefs,
            langsMenu: $('euskalbar-language-popup')
          };
      Services.ww.openWindow(null, dialogURL, "_blank",
                             "chrome,toolbar,centerscreen,resizable,dialog=no",
                             {wrappedJSObject: sharedObj});
    },


    displayStats: function () {
      if (window.arguments && window.arguments.length) {
        var sharedObj = window.arguments[0].wrappedJSObject;
        euskalbar.dicts = sharedObj.dicts;
        euskalbar.prefs = sharedObj.prefs;
      }

      var treechildren = $('stats-tree-children'),
          item, row, nameCell, countCell, dict, dictName;

      // Remove old data
      while (treechildren.firstChild) {
        treechildren.removeChild(treechildren.firstChild);
      }

      // Populate tree with stats data
      for (dictName in euskalbar.prefs.stats) {
        dict = euskalbar.dicts[dictName];
        if (dict === undefined) {
          continue;
        }

        item = document.createElement("treeitem");
        treechildren.appendChild(item);

        row = document.createElement("treerow");
        item.appendChild(row);

        nameCell = document.createElement("treecell");
        nameCell.setAttribute('label', dict.description || dict.displayName);
        row.appendChild(nameCell);

        countCell = document.createElement("treecell");
        countCell.setAttribute('label', euskalbar.prefs.stats[dictName]);
        row.appendChild(countCell);
      }
    },


    /* Displays the dictionary usage statistics */
    stats: function () {
      var dialogURL = "chrome://euskalbar/content/stats.xul",
          sharedObj = {
            dicts: euskalbar.dicts,
            prefs: euskalbar.prefs
          },
          statsWindow;
      statsWindow = Services.ww.openWindow(
        null, dialogURL, "euskalbar-stats",
        "chrome,toolbar,centerscreen,resizable,dialog=no",
        {wrappedJSObject: sharedObj}
      );
      statsWindow.focus();
    },


    /* Display the online help */
    help: function () {
      var locale = $U.langCode(euskalbar.ui.locale);

      if (euskalbar.ui.acceptedLocales.indexOf(locale) === -1) {
        locale = 'en';
      }

      euskalbar.app.reuseOldTab(euskalbar.app.helpBaseURL + locale,
                                'euskalbarhelp');
    },

  };

}();
