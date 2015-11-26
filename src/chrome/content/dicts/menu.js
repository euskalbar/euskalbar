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

if (!euskalbar) var euskalbar = {};

if (!euskalbar.dicts) euskalbar.dicts = {};

euskalbar.dicts.menu = [
  { cat: 'menu.General',
    dicts: [
      { name: 'menu.general.Hiztegi Batua',
        url: 'http://www.euskaltzaindia.eus/hiztegibatua' },
      { name: 'menu.general.Orotariko Euskal Hiztegia',
        url: 'http://www.euskaltzaindia.eus/oeh' },
      { sep: true },
      { name: 'menu.general.Euskalterm Terminological Bank',
        url: 'http://www.euskara.euskadi.eus/euskalterm/' },
      { name: 'menu.general.Elhuyar Hiztegia',
        url: 'http://hiztegiak.elhuyar.eus' },
      { name: 'menu.general.Bostmila Hiztegia',
        url: 'http://www.bostakbat.org/azkue/index.php?q=3' },
      { name: 'menu.general.Labayru Hiztegia',
        url: 'http://hiztegia.labayru.eus' },
      { name: 'menu.general.Zehazki Hiztegia',
        url: 'http://ehu.eus/ehg/cgi/zehazki/bila' },
      { name: 'menu.general.Egungo Euskararen Hiztegia',
        url: 'http://www.ehu.eus/eeh/' },
      { name: 'menu.general.Hiztegi Batua Euskal Prosan',
        url: 'http://ehu.eus/ehg/' },
      { name: 'menu.general.Hauta Lanerako Euskal Hiztegia',
        url: 'http://www.euskara.euskadi.net/r59-sarasola/eu/sarasola/sarasola.apl' },
      { name: 'menu.general.BFA Terminological Dictionary',
        url: 'http://apps.bizkaia.net/TK00/servlet/webAgentTK00' },
      { sep: true },
      { name: 'menu.general.Morris dictionary',
        url: 'http://www1.euskadi.net/morris' },
      { sep: true },
      { name: 'menu.general.Goihata dictionary',
        url: 'http://www.kotobai.com/' }
    ]
  },
  { cat: 'menu.Synonyms',
    dicts: [
      { name: 'menu.synonyms.UZEI synonyms dictionary',
        url: 'http://www.uzei.eus/zerbitzuak-eta-produktuak/produktuen-katalogoa/sinonimoen-hiztegia/' },
      { name: 'menu.synonyms.Adorez synonyms dictionary',
        url: 'http://www.bostakbat.org/azkue/index.php?q=1' },
      { name: 'menu.synonyms.Eurovoc Thesaurus',
        url: 'http://www.bizkaia.eus/kultura/eurovoc/index.asp?Tem_Codigo=2861&idioma=EU&dpto_biz=4&codpath_biz=4|292|2861' }
    ]
  },
  { cat: 'menu.Encyclopedias',
    dicts: [
      { name: 'menu.encyclopedias.Lur hiztegi entziklopedikoa',
        url: 'http://www.euskara.euskadi.eus/r59-lursubhd/eu/contenidos/informacion/lursubhd/eu_lursubhd/lursubhd.html' },
      { name: 'menu.encyclopedias.Lur entziklopedia tematikoa',
        url: 'http://www.euskara.euskadi.eus/r59-lursubhe/eu/contenidos/informacion/lursubhe/eu_lursubhe/lursubhe.html' },
      { name: 'menu.encyclopedias.Auñamendi',
        url: 'http://www.euskomedia.org/aunamendi?idi=eu&op=1' },
      { name: 'menu.encyclopedias.Wikipedia-eu',
        url: 'https://eu.wikipedia.org' },
      { name: 'menu.encyclopedias.Encyclopedic dictionary of Science and Technology',
        url: 'http://zthiztegia.elhuyar.eus' }
    ]
  },
  { cat: 'menu.By Subject',
    dicts: [
      { name: 'menu.by_subject.Drugs',
        url: 'http://www.drogomedia.com/eu/diccionarios/0-todos/' },
      { name: 'menu.by_subject.Energy',
        url: 'http://www.eve.eus/diccionario.aspx' },
      { name: 'menu.by_subject.Computing',
        url: 'http://www.eionet.europa.eu/gemet/index_html?langcode=eu' },
      { name: 'menu.by_subject.Justice',
        url: 'http://www.justizia.eus/euskara-justizian' },
      { name: 'menu.by_subject.Cataloguing',
        url: 'http://joana-albret.iametza.com' },
      { name: 'menu.by_subject.Occupational training',
        url: 'http://jakinbai.eus/hiztegia' },
      { name: 'menu.by_subject.Literature',
        url: 'http://www.euskaltzaindia.eus/index.php?option=com_xslt&lang=eu&layout=lth_list&search=1&view=frontpage%20&Itemid=414' },
      { name: 'menu.by_subject.Parliament',
        url: 'http://parlamento.euskadi.net/pfrm_cm_hiztegie.html' },
      { name: 'menu.by_subject.Telecommunications',
        url: 'http://www.telekomunikaziohiztegia.org' },
    ]
  },
  { cat: 'menu.Towns',
    dicts: [
      { name: 'menu.towns.Bergara zone dictionary',
        url: 'http://www.bergarakoeuskara.eus/hiztegia/' },
      { name: 'menu.towns.Eibarko euskeria',
        url: 'http://www.eibarko-euskara.com' }
    ]
  },
  { cat: 'menu.Corpus',
    dicts: [
      { name: 'menu.corpus.Mokoroa',
        url: 'http://www.hiru.com/hirupedia' },
      { name: 'menu.corpus.Intza',
        url: 'http://intza.armiarma.eus/' },
      { name: 'menu.corpus.Gotzon Garate',
        url: 'http://www.ametza.com/bbk/htdocs/garate.htm' },
      { name: 'menu.corpus.Basque Corpus',
        url: 'http://xxmendea.euskaltzaindia.eus/Corpus/aurkezpena.html' },
      { name: 'menu.corpus.Ereduzko prosa',
        url: 'http://www.ehu.eus/cgi-bin/ereduzkoa/bilatu09.pl' },
      { name: 'menu.corpus.Klasikoen gordailua',
        url: 'http://klasikoak.armiarma.eus/' },
      { name: 'menu.corpus.ZT Corpusa',
        url: 'http://www.ztcorpusa.eus/' },
      { name: 'menu.corpus.Lexikoaren Behatokia',
        url: 'http://lexikoarenbehatokia.euskaltzaindia.eus' },
      { name: 'menu.corpus.Consumer Corpusa',
        url: 'http://corpus.consumer.es/' },
      { name: 'menu.corpus.CorpEus',
        url: 'http://corpeus.elhuyar.eus/' },
      { name: 'menu.corpus.EHUskaratuak',
        url: 'http://ehuskaratuak.ehu.eus/' },
      { name: 'menu.corpus.IMemoriak',
        url: 'http://www.gipuzkoa.eus/imemoriak/' },
    ]
  },
  { cat: 'menu.Search Engines',
    dicts: [
      { name: 'menu.search_engines.Elebila',
        url: 'http://elebila.elhuyar.eus' }
    ]
  },
];
