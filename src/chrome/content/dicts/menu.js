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

euskalbar.dicts.menu = [
  { cat: 'euskalbar.menu.General',
    dicts: [
      { name: 'euskalbar.menu.general.Hiztegi Batua',
        url: 'http://www.euskaltzaindia.net/hiztegibatua' },
      { name: 'euskalbar.menu.general.Orotariko Euskal Hiztegia',
        url: 'http://www.euskaltzaindia.net/oeh' },
      { sep: true },
      { name: 'euskalbar.menu.general.Euskalterm Terminological Bank',
        url: 'http://www.euskara.euskadi.net/euskalterm' },
      { name: 'euskalbar.menu.general.Elhuyar Hiztegia',
        url: 'http://www.elhuyar.org/hizkuntza-zerbitzuak/EU/Hiztegi-kontsulta' },
      { name: 'euskalbar.menu.general.Labayru Hiztegia',
        url: 'http://zerbitzuak.labayru.org/diccionario/hiztegiasarrera.asp' },
      { name: 'euskalbar.menu.general.Zehazki Hiztegia',
        url: 'http://ehu.es/ehg/zehazki/' },
      { name: 'euskalbar.menu.general.BFA Terminological Dictionary',
        url: 'http://aplijava.bizkaia.net/TK00/servlet/webAgentTK00' },
      { sep: true },
      { name: 'euskalbar.menu.general.Morris dictionary',
        url: 'http://www1.euskadi.net/morris/indice_e.htm' },
      { name: 'euskalbar.menu.general.Open-Tran translation database',
        url: 'http://eu.open-tran.eu' },
      { sep: true },
      { name: 'euskalbar.menu.general.Polish - Basque dictionary',
        url: 'http://www.hiztegia.org' },
      { name: 'euskalbar.menu.general.Goihata dictionary',
        url: 'http://www.goihata.com/eu/japoniera-hiztegia/' }
    ]
  },
  { cat: 'euskalbar.menu.Synonyms',
    dicts: [
      /*{ name: 'euskalbar.menu.synonyms.Adorez synonyms dictionary',
        url: 'http://www1.euskadi.net/hizt_sinon/indice_e.htm' },*/
      { name: 'euskalbar.menu.synonyms.UZEI synonyms dictionary',
        url: 'http://www.uzei.com/estatico/sinonimos.asp' },
      { name: 'euskalbar.menu.synonyms.Eurovoc Thesaurus',
        url: 'http://www.bizkaia.net/kultura/eurovoc/index.asp' }
    ]
  },
  { cat: 'euskalbar.menu.Encyclopedias',
    dicts: [
      { name: 'euskalbar.menu.encyclopedias.Auñamendi',
        url: 'http://www.euskomedia.org/euskomedia/SAunamendi?idi=eu&op=1' },
      { name: 'euskalbar.menu.encyclopedias.Wikipedia-eu',
        url: 'https://secure.wikimedia.org/wikipedia/eu/wiki/' },
      { name: 'euskalbar.menu.encyclopedias.Encyclopedic dictionary of Science and Technology',
        url: 'http://zthiztegia.elhuyar.org' }
    ]
  },
  { cat: 'euskalbar.menu.By Subject',
    dicts: [
      { name: 'euskalbar.menu.by_subject.Drugs',
        url: 'http://www.drogomedia.com/eus/diccionario.php' },
      { name: 'euskalbar.menu.by_subject.Energy',
        url: 'http://www.eve.es/energia/index.html' },
      { name: 'euskalbar.menu.by_subject.Industry',
        url: 'http://www.kondia.com/hiztegi/home.htm' },
      { name: 'euskalbar.menu.by_subject.Industry (for immigrants)',
        url: 'http://clientes.incress.com:9080/imh/diccionario_entorno/' },
      { name: 'euskalbar.menu.by_subject.Computing',
        url: 'http://www.eionet.europa.eu/gemet/index_html?langcode=eu' },
      { name: 'euskalbar.menu.by_subject.Justice',
        url: 'http://www.justizia.net/uzei/idazki/lexiko/lexikoa.htm' },
      { name: 'euskalbar.menu.by_subject.Cataloguing',
        url: 'http://joana-albret.iametza.com' },
      { name: 'euskalbar.menu.by_subject.Parliament',
        url: 'http://parlamento.euskadi.net/pfrm_cm_hiztegie.html' },
      { name: 'euskalbar.menu.by_subject.Cooking',
        url: 'http://www.bagera.net/Bageranet/Ziberteka/Gastronomia/Sukaldehiztegia' },
      { name: 'euskalbar.menu.by_subject.Telecommunications',
        url: 'http://www.telekomunikaziohiztegia.org' },
    ]
  },
  { cat: 'euskalbar.menu.Towns',
    dicts: [
      { name: 'euskalbar.menu.towns.Bergara zone dictionary',
        url: 'http://www.bergarakoeuskara.net/hiztegia' },
      { name: 'euskalbar.menu.towns.Eibarko euskeria',
        url: 'http://www.eibarko-euskara.com' }
    ]
  },
  { cat: 'euskalbar.menu.Corpus',
    dicts: [
      { name: 'euskalbar.menu.corpus.Mokoroa',
        url: 'http://hiru.com/hiztegiak/mokoroa' },
      { name: 'euskalbar.menu.corpus.Intza',
        url: 'http://intza.armiarma.com/cgi-bin/bilatu2.pl' },
      { name: 'euskalbar.menu.corpus.Gotzon Garate',
        url: 'http://www.ametza.com/bbk/htdocs/garate.htm' },
      { name: 'euskalbar.menu.corpus.Basque Corpus',
        url: 'http://euskaracorpusa.net' },
      { name: 'euskalbar.menu.corpus.Ereduzko prosa',
        url: 'http://www.ehu.es/euskara-orria/euskara/ereduzkoa/araka.html' },
      { name: 'euskalbar.menu.corpus.Klasikoen gordailua',
        url: 'http://klasikoak.armiarma.com/corpus.htm' },
      { name: 'euskalbar.menu.corpus.ZT Corpusa',
        url: 'http://ztcorpusa.net' },
      { name: 'euskalbar.menu.corpus.Lexikoaren Behatokia',
        url: 'http://lexikoarenbehatokia.euskaltzaindia.net' },
      { name: 'euskalbar.menu.corpus.Consumer Corpusa',
        url: 'http://corpus.consumer.es/corpus/' },
      { name: 'euskalbar.menu.corpus.CorpEus',
        url: 'http://corpeus.org' },
    ]
  },
  { cat: 'euskalbar.menu.Search Engines',
    dicts: [
      { name: 'euskalbar.menu.search_engines.Elebila',
        url: 'http://elebila.eu' }
    ]
  },
];
