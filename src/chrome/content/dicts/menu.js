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
      { name: 'menu.general.Hauta Lanerako Euskal Hiztegia',
        url: 'http://www.euskara.euskadi.net/r59-sarasola/eu/sarasola/sarasola.apl' },
      { name: 'menu.general.Egungo Euskararen Hiztegia',
        url: 'http://www.ehu.eus/eeh/' }
    ]
  },
  { cat: 'menu.Multilingual',
    dicts: [
      { name: 'menu.multilingual.Bostmila Hiztegia',
        url: 'http://www.bostakbat.org/azkue/index.php?q=3' },
      { name: 'menu.multilingual.Elhuyar Hiztegia',
        url: 'http://hiztegiak.elhuyar.eus' },
      { name: 'menu.multilingual.Labayru Hiztegia',
        url: 'http://hiztegia.labayru.eus' },
      { name: 'menu.multilingual.Zehazki Hiztegia',
        url: 'http://ehu.eus/ehg/cgi/zehazki/bila' },
      { name: 'menu.multilingual.Nola Erran',
        url: 'http://www.nolaerran.org/' },
      { name: 'menu.multilingual.Morris dictionary',
        url: 'http://www1.euskadi.net/morris' },
      { name: 'menu.multilingual.Goihata dictionary',
        url: 'http://www.kotobai.com/' },
      { name: 'menu.multilingual.Hiztegi automatikoak',
        url: 'http://hiztegiautomatikoak.elhuyar.eus' }
    ]
  },
  { cat: 'menu.Synonyms',
    dicts: [
      { name: 'menu.synonyms.Adorez synonyms dictionary',
        url: 'http://www.bostakbat.org/azkue/index.php?q=1' },
      { name: 'menu.synonyms.UZEI synonyms dictionary',
        url: 'http://www.uzei.eus/zerbitzuak-eta-produktuak/produktuen-katalogoa/sinonimoen-hiztegia/' },
    ]
  },
  { cat: 'menu.Terminological',
    dicts: [
      { name: 'menu.terminological.Euskalterm Terminological Bank',
        url: 'http://www.euskara.euskadi.eus/euskalterm/' },
      { name: 'menu.terminological.Encyclopedic dictionary of Science and Technology',
        url: 'http://zthiztegia.elhuyar.eus' },
      { sep: true },
      { name: 'menu.terminological.Automotive',
        url: 'http://www.automotivedictionary.net' },
      { name: 'menu.terminological.BFA Terminological Dictionary',
        url: 'http://apps.bizkaia.net/TK00/servlet/webAgentTK00' },
      { name: 'menu.terminological.Danobat',
        url: 'http://hiztegia.danobatgroup.eus/' },
      { name: 'menu.terminological.Drugs',
        url: 'http://www.drogomedia.com/eu/diccionarios/0-todos/' },
      { name: 'menu.terminological.Energy',
        url: 'http://www.eve.eus/diccionario.aspx' },
      { name: 'menu.terminological.Pharmacy',
        url: 'http://www.feuse.info/hiztegia/index.php' },
      { name: 'menu.terminological.Justice',
        url: 'http://www.justizia.eus/euskara-justizian' },
      { name: 'menu.terminological.Eurovoc Thesaurus',
        url: 'http://www.bizkaia.eus/kultura/eurovoc/index.asp?Tem_Codigo=2861&idioma=EU&dpto_biz=4&codpath_biz=4|292|2861' },
      { name: 'menu.terminological.Gemet',
        url: 'http://www.eionet.europa.eu/gemet/index_html?langcode=eu' },
      { name: 'menu.terminological.Cataloguing',
        url: 'http://joana-albret.iametza.com' },
      { name: 'menu.terminological.Occupational training',
        url: 'http://jakinbai.eus/hiztegia' },
      { name: 'menu.terminological.Parliament',
        url: 'http://parlamento.euskadi.net/pfrm_cm_hiztegie.html' },
      { name: 'menu.terminological.Literature',
        url: 'http://www.euskaltzaindia.eus/index.php?option=com_xslt&lang=eu&layout=lth_list&search=1&view=frontpage%20&Itemid=414' },
      { name: 'menu.terminological.Mendizalea',
        url: 'http://www.ostadar.org/hiztegia/' },
      { name: 'menu.terminological.Microsoft',
        url: 'http://www.microsoft.com/Language/' },
      { name: 'menu.terminological.Telecommunications',
        url: 'http://www.telekomunikaziohiztegia.org' }
    ]
  },
  { cat: 'menu.Phraseology',
    dicts: [
      { name: 'menu.phraseology.Mokoroa',
        url: 'http://www.hiru.com/hirupedia' },
      { name: 'menu.phraseology.Gotzon Garate',
        url: 'http://www.ametza.com/bbk/htdocs/garate.htm' },
      { name: 'menu.phraseology.Intza',
        url: 'http://intza.armiarma.eus/' },
      { name: 'menu.phraseology.Elhuyar Konbinazioak',
        url: 'http://webcorpusak.elhuyar.eus/sarrera_konbinazioak.html' }
    ]
  },
  { cat: 'menu.Encyclopedias',
    dicts: [
    
      { name: 'menu.encyclopedias.Aunamendi',
        url: 'http://www.euskomedia.org/aunamendi?idi=eu&op=1' },
      { name: 'menu.encyclopedias.Harluxet',
        url: 'http://www1.euskadi.net/harluxet/' },
      { name: 'menu.encyclopedias.Lur hiztegi entziklopedikoa',
        url: 'http://www.euskara.euskadi.eus/r59-lursubhd/eu/contenidos/informacion/lursubhd/eu_lursubhd/lursubhd.html' },
      { name: 'menu.encyclopedias.Lur entziklopedia tematikoa',
        url: 'http://www.euskara.euskadi.eus/r59-lursubhe/eu/contenidos/informacion/lursubhe/eu_lursubhe/lursubhe.html' },
      { name: 'menu.encyclopedias.Wikipedia-eu',
        url: 'https://eu.wikipedia.org' }
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
      { name: 'menu.corpus.Basque Corpus',
        url: 'http://xxmendea.euskaltzaindia.eus/Corpus/aurkezpena.html' },
      { name: 'menu.corpus.Lexikoaren Behatokia',
        url: 'http://lexikoarenbehatokia.euskaltzaindia.eus' },
      { name: 'menu.corpus.Ereduzko prosa',
        url: 'http://www.ehu.eus/cgi-bin/ereduzkoa/bilatu09.pl' },
      { name: 'menu.corpus.Ereduzko prosa dinamikoa',
        url: 'http://www.ehu.eus/ehg/epd/' },
      { name: 'menu.corpus.Euskal Klasikoen Corpusa',
        url: 'http://www.ehu.eus/ehg/kc/' },
      { name: 'menu.corpus.Egungo Testuen Corpusa',
        url: 'http://www.ehu.eus/etc/' },
      { name: 'menu.corpus.Hiztegi Batua Euskal Prosan',
        url: 'http://ehu.eus/ehg/' },
      { name: 'menu.corpus.Elhuyar Web Corpus Elebakarra',
        url: 'http://webcorpusak.elhuyar.eus/sarrera_elebakarra.html' },
      { name: 'menu.corpus.CorpEus',
        url: 'http://corpeus.elhuyar.eus/' },
      { name: 'menu.corpus.Klasikoen gordailua',
        url: 'http://klasikoak.armiarma.eus/' },
      { name: 'menu.corpus.Bizkaiera',
        url: 'http://www.bizkaiera.biz/index.php' }
    ]
  },
  { cat: 'menu.MultilingualCorpus',
    dicts: [
      { name: 'menu.corpus.Consumer Corpusa',
        url: 'http://corpus.consumer.es/' },
      { name: 'menu.corpus.Elhuyar Web Corpus Elebiduna',
        url: 'http://webcorpusak.elhuyar.eus/sarrera_paraleloa.html' },
      { name: 'menu.corpus.EHUskaratuak',
        url: 'http://ehuskaratuak.ehu.eus/' },
      { name: 'menu.corpus.IMemoriak',
        url: 'http://www.gipuzkoa.eus/imemoriak/' }
    ]
  },
  { cat: 'menu.SpecializedCorpus',
    dicts: [
      { name: 'menu.corpus.ZT Corpusa',
        url: 'http://www.ztcorpusa.eus/' },
      { name: 'menu.corpus.Pentsamenduaren Klasikoak',
        url: 'http://www.ehu.eus/ehg/pkc/' },
      { name: 'menu.corpus.ZIO',
        url: 'http://www.ehu.eus/ehg/zio/' },
      { name: 'menu.corpus.Zuzenbide corpusa',
        url: 'http://www.ehu.eus/ehg/zuzenbidea/' }
    ]
  },
  { cat: 'menu.Lists',
    dicts: [
      { name: 'menu.lists.Itzul',
        url: 'http://postaria.com/pipermail/itzul/' },
      { name: 'menu.lists.Librezale',
        url: 'http://librezale.eus/pipermail/librezale/' }
    ]
  },
  { cat: 'menu.Spellcheckers',
    dicts: [
      { name: 'menu.spellcheckers.Hobelex',
        url: 'http://www.uzei.eus/online/hobelex/' },
      { name: 'menu.spellcheckers.Xuxen',
        url: 'http://xuxen.eus' }
    ]
  },
  { cat: 'menu.Style',
    dicts: [
      { name: 'menu.style.Berria',
        url: 'http://www.berria.eus/estiloliburua' },
      { name: 'menu.style.Hikea',
        url: 'http://www.eitb.eus/eu/kultura/euskara/kontsultak/' }
    ]
  },
  { cat: 'menu.Search Engines',
    dicts: [
      { name: 'menu.search_engines.Elebila',
        url: 'http://elebila.elhuyar.eus' }
    ]
  },
];
