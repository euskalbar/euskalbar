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

euskalbar.settings = function () {

  var $U = euskalbar.lib.utils,
      $ = $U.$;

  return {
    init: function () {
      if (window.arguments && window.arguments.length) {
        var sharedObj = window.arguments[0].wrappedJSObject;
        euskalbar.dicts = sharedObj.dicts;
        euskalbar.prefs = sharedObj.prefs;
        var langsMenu = sharedObj.langsMenu.cloneNode(true);

        this.initLangs(langsMenu);
        this.initDicts();
      }
    },


    /*
     * Inits the language popup menu
     */
    initLangs: function (langsMenu) {
      var menulist = $('prefs-startup-language'),
          nodes = langsMenu.childNodes,
          node, pair, selectedEl;

      for (var i=0; i<nodes.length; i++) {
        node = nodes[i];

        if (node.tagName === 'menuitem') {
          pair = node.id.replace('euskalbar-language-', '');
          node.removeAttribute('oncommand');
          node.setAttribute('value', pair);

          if (euskalbar.prefs.startupLanguage === pair) {
            selectedEl = node;
          }
        }
      }

      menulist.appendChild(langsMenu);
      menulist.selectedItem = selectedEl;
    },


    /*
     * Inits the dict listboxes
     */
    initDicts: function () {
      var insertDictTo = function (listbox, dictName, prefName) {
        var dict = euskalbar.dicts[dictName],
            isVisible = euskalbar.prefs[prefName].indexOf(dictName) !== -1,
            listitem = document.createElement('listitem');

        listitem.setAttribute('id', 'prefs-dictionaries-' + dictName);
        listitem.setAttribute('dictname', dictName);
        listitem.setAttribute('type', 'checkbox');
        listitem.setAttribute('label', dict.description || dict.displayName);
        listitem.setAttribute('checked', isVisible);
        listitem.setAttribute('oncommand',
          'euskalbar.settings.saveDictVisibility(event.target,' +
                                                 '"' + prefName + '");'
        );
        listbox.appendChild(listitem);
      };

      var visibleDicts = $('prefs-dictionaries-visible'),
          enterDicts = $('prefs-keys-onkey'),
          ctrlEnterDicts = $('prefs-keys-onkey1'),
          shiftEnterDicts = $('prefs-keys-onkey2');

      euskalbar.dicts.available.each(function (dictName) {
        insertDictTo(visibleDicts, dictName, 'visibleDicts');
        insertDictTo(enterDicts, dictName, 'onkey');

        // Don't add dictionaries that don't support scrapping
        if (euskalbar.dicts[dictName].hasOwnProperty('scrap')) {
          insertDictTo(ctrlEnterDicts, dictName, 'onkey1');
          insertDictTo(shiftEnterDicts, dictName, 'onkey2');
        }
      });
    },


    saveDictVisibility: function (listitem, prefName) {
      var parts = listitem.id.split('-'),
          dictName = parts[parts.length-1],
          newVisibleDicts = euskalbar.prefs[prefName].slice(0),
          i = newVisibleDicts.indexOf(dictName);

      if (i === -1) {
        newVisibleDicts.push(dictName);
        newVisibleDicts.sort();
      } else {
        newVisibleDicts.splice(i, 1);
      }
      euskalbar.prefs[prefName] = newVisibleDicts;
    }

  };

}();
