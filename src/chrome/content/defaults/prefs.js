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

// Version
pref("extensions.euskalbar.installedVersion", "0.0");
pref("extensions.euskalbar.firstrun", true);

// Dictionaries visibility
pref("extensions.euskalbar.visibleDicts", [
  'euskalterm', 'elhuyar', 'zthiztegia', 'morris', 'goihata',
  'itzul', 'uzei', 'batua', 'oeh'
]);

// Dictionaries searched on pressing "Enter" key
pref('extensions.euskalbar.onkey', ['elhuyar', 'batua', 'oeh']);

// Dictionaries searched on pressing "Enter" + Shift key
pref('extensions.euskalbar.onkey1', ['euskalterm', 'elhuyar', 'morris']);

// Dictionaries searched on pressing "Enter" + Ctrl key
pref('extensions.euskalbar.onkey2', ['batua', 'uzei', 'bostmila']);

// Stats
pref("extensions.euskalbar.stats", {});

// Query timeout
pref("extensions.euskalbar.queryTimeout", 10);

// Tabs prefs
pref("extensions.euskalbar.reuseTabs", true);
pref("extensions.euskalbar.bgTabs", false);

// GUI prefs
pref("extensions.euskalbar.showDictsMenu", true);
pref("extensions.euskalbar.showContextMenu", true);
pref("extensions.euskalbar.focusWindow", false);

// Language selected at startup
pref("extensions.euskalbar.startupLanguage", "es_eu");

// Styles
pref("extensions.euskalbar.skin", "skins/euskalbar.css");
