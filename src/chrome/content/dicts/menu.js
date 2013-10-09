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

if (!euskalbar.dicts) euskalbar.dicts = {};

euskalbar.dicts.menu = [
  { cat: 'menu.General',
    dicts: [
      { name: 'menu.general.Hiztegi Batua',
        url: 'http://www.euskaltzaindia.net/hiztegibatua' },
      { name: 'menu.general.Orotariko Euskal Hiztegia',
        url: 'http://www.euskaltzaindia.net/oeh' },
      { sep: true },
      { name: 'menu.general.Euskalterm Terminological Bank',
        url: 'http://www.euskara.euskadi.net/euskalterm' },
      { name: 'menu.general.Elhuyar Hiztegia',
        url: 'http://hiztegiak.elhuyar.org/' },
      { name: 'menu.general.Bostmila Hiztegia',
        url: 'http://www.bostakbat.org/azkue/index.php?q=3' },
      { name: 'menu.general.Labayru Hiztegia',
        url: 'http://hiztegia.labayru.net' },
      { name: 'menu.general.Zehazki Hiztegia',
        url: 'http://ehu.es/ehg/zehazki/' },
      { name: 'menu.general.Egungo Euskararen Hiztegia',
        url: 'http://www.ehu.es/eeh/' },
      { name: 'menu.general.Hiztegi Batua Euskal Prosan',
        url: 'http://ehu.es/ehg/' },
      { name: 'menu.general.Hauta Lanerako Euskal Hiztegia',
        url: 'http://www.euskara.euskadi.net/r59-15172x/eu/sarasola/sarasola.apl' },
      { name: 'menu.general.BFA Terminological Dictionary',
        url: 'http://aplijava.bizkaia.net/TK00/servlet/webAgentTK00' },
      { sep: true },
      { name: 'menu.general.Morris dictionary',
        url: 'http://www1.euskadi.net/morris/indice_e.htm' },
      { name: 'menu.general.Open-Tran translation database',
        url: 'http://eu.open-tran.eu' },
      { sep: true },
      { name: 'menu.general.Polish - Basque dictionary',
        url: 'http://www.hiztegia.org' },
      { name: 'menu.general.Goihata dictionary',
        url: 'http://www.goihata.com/eu/japoniera-hiztegia/' }
    ]
  },
  { cat: 'menu.Synonyms',
    dicts: [
      { name: 'menu.synonyms.UZEI synonyms dictionary',
        url: 'http://sh.uzei.com' },
      { name: 'menu.synonyms.Adorez synonyms dictionary',
        url: 'http://www.bostakbat.org/azkue/index.php?q=1' },
      { name: 'menu.synonyms.Eurovoc Thesaurus',
        url: 'http://www.bizkaia.net/kultura/eurovoc/index.asp' }
    ]
  },
  { cat: 'menu.Encyclopedias',
    dicts: [
      { name: 'menu.encyclopedias.Lur hiztegi entziklopedikoa',
        url: 'http://www.euskara.euskadi.net/r59-lursubhd/eu/contenidos/informacion/lursubhd/eu_lursubhd/lursubhd.html' },
      { name: 'menu.encyclopedias.Lur entziklopedia tematikoa',
        url: 'http://www.euskara.euskadi.net/r59-lursubhe/eu/contenidos/informacion/lursubhe/eu_lursubhe/lursubhe.html' },
      { name: 'menu.encyclopedias.Auñamendi',
        url: 'http://www.euskomedia.org/euskomedia/SAunamendi?idi=eu&op=1' },
      { name: 'menu.encyclopedias.Wikipedia-eu',
        url: 'https://secure.wikimedia.org/wikipedia/eu/wiki/' },
      { name: 'menu.encyclopedias.Encyclopedic dictionary of Science and Technology',
        url: 'http://zthiztegia.elhuyar.org' }
    ]
  },
  { cat: 'menu.By Subject',
    dicts: [
      { name: 'menu.by_subject.Drugs',
        url: 'http://www.drogomedia.com/eus/diccionario.php' },
      { name: 'menu.by_subject.Energy',
        url: 'http://www.eve.es/energia/index.html' },
      { name: 'menu.by_subject.Industry',
        url: 'http://www.kondia.com/hiztegi/home.htm' },
      { name: 'menu.by_subject.Industry (for immigrants)',
        url: 'http://clientes.incress.com:9080/imh/diccionario_entorno/' },
      { name: 'menu.by_subject.Computing',
        url: 'http://www.eionet.europa.eu/gemet/index_html?langcode=eu' },
      { name: 'menu.by_subject.Justice',
        url: 'http://www.justizia.net/euskara-justizian?cjterm=&bjterm=Bilatu&idiomaBusq=EU' },
      { name: 'menu.by_subject.Cataloguing',
        url: 'http://joana-albret.iametza.com' },
      { name: 'menu.by_subject.Occupational training',
        url: 'http://www.jakinbai.com/lanbideki/hiztegia' },
      { name: 'menu.by_subject.Literature',
        url: 'http://www.euskaltzaindia.net/index.php?option=com_xslt&Itemid=414&lang=eu&layout=lth_list&search=1&view=frontpage+' },
      { name: 'menu.by_subject.Parliament',
        url: 'http://parlamento.euskadi.net/pfrm_cm_hiztegie.html' },
      { name: 'menu.by_subject.Cooking',
        url: 'http://www.bagera.net/Bageranet/Ziberteka/Gastronomia/Sukaldehiztegia' },
      { name: 'menu.by_subject.Telecommunications',
        url: 'http://www.telekomunikaziohiztegia.org' },
    ]
  },
  { cat: 'menu.Towns',
    dicts: [
      { name: 'menu.towns.Bergara zone dictionary',
        url: 'http://www.bergarakoeuskara.net/hiztegia' },
      { name: 'menu.towns.Eibarko euskeria',
        url: 'http://www.eibarko-euskara.com' }
    ]
  },
  { cat: 'menu.Corpus',
    dicts: [
      { name: 'menu.corpus.Mokoroa',
        url: 'http://hiru.com/hiztegiak/mokoroa' },
      { name: 'menu.corpus.Intza',
        url: 'http://intza.armiarma.com/cgi-bin/bilatu2.pl' },
      { name: 'menu.corpus.Gotzon Garate',
        url: 'http://www.ametza.com/bbk/htdocs/garate.htm' },
      { name: 'menu.corpus.Basque Corpus',
        url: 'http://euskaracorpusa.net' },
      { name: 'menu.corpus.Ereduzko prosa',
        url: 'http://www.ehu.es/euskara-orria/euskara/ereduzkoa/araka.html' },
      { name: 'menu.corpus.Klasikoen gordailua',
        url: 'http://klasikoak.armiarma.com/corpus.htm' },
      { name: 'menu.corpus.ZT Corpusa',
        url: 'http://ztcorpusa.net' },
      { name: 'menu.corpus.Lexikoaren Behatokia',
        url: 'http://lexikoarenbehatokia.euskaltzaindia.net' },
      { name: 'menu.corpus.Consumer Corpusa',
        url: 'http://corpus.consumer.es/corpus/' },
      { name: 'menu.corpus.CorpEus',
        url: 'http://corpeus.org' },
      { name: 'menu.corpus.EHUskaratuak',
        url: 'http://ehuskaratuak.ehu.es' },
      { name: 'menu.corpus.IMemoriak',
        url: 'http://www.gipuzkoa.net/imemoriak/' },
    ]
  },
  { cat: 'menu.Search Engines',
    dicts: [
      { name: 'menu.search_engines.Elebila',
        url: 'http://elebila.eu' }
    ]
  },
];
