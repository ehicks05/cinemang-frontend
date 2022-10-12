import _ from 'lodash';
import { getValidIdRows } from './services/tmdb';
import { DailyFileRow } from './services/tmdb/types';

const processPopularity = (popularity: number, rows: DailyFileRow[]) => {
  const filtered = rows
    .filter((row) => row.popularity >= popularity)
    .sort((o1, o2) => o1.popularity - o2.popularity);
  console.log(
    `movies with popularity >= ${popularity}: ${filtered.length}. sample: ${filtered[0].original_title}`,
  );
};

const calculate = async () => {
  const dailyFileRows = await getValidIdRows();

  _.range(0, 10, 0.1).forEach((popularity) =>
    processPopularity(popularity, dailyFileRows),
  );
};

calculate();

/*

SAMPLE OUTPUT:

movies with popularity >= 0: 743226. sample: La Sorcière et le Martien
movies with popularity >= 0.1: 743187. sample: Der Mann ohne Namen
movies with popularity >= 0.2: 743187. sample: Der Mann ohne Namen
movies with popularity >= 0.30000000000000004: 743187. sample: Der Mann ohne Namen
movies with popularity >= 0.4: 743187. sample: Der Mann ohne Namen
movies with popularity >= 0.5: 743187. sample: Der Mann ohne Namen
movies with popularity >= 0.6: 743187. sample: Der Mann ohne Namen
movies with popularity >= 0.7: 259901. sample: Dil Kabaddi
movies with popularity >= 0.7999999999999999: 248212. sample: Proud
movies with popularity >= 0.8999999999999999: 206407. sample: Drei gegen drei
movies with popularity >= 0.9999999999999999: 188121. sample: Urgences
movies with popularity >= 1.0999999999999999: 174052. sample: Ron White: Behavioral Problems
movies with popularity >= 1.2: 158870. sample: Maria am Wasser
movies with popularity >= 1.3: 148605. sample: A Killing Affair
movies with popularity >= 1.4000000000000001: 119908. sample: Murder Is My Beat
movies with popularity >= 1.5000000000000002: 112046. sample: Dead and Gone
movies with popularity >= 1.6000000000000003: 104797. sample: Buñuel y la mesa del rey Salomón
movies with popularity >= 1.7000000000000004: 99197. sample: Der Arzt von St. Pauli
movies with popularity >= 1.8000000000000005: 92980. sample: Billy Frankenstein
movies with popularity >= 1.9000000000000006: 88106. sample: Prehistoric Women
movies with popularity >= 2.0000000000000004: 82055. sample: Frankenstein 90
movies with popularity >= 2.1000000000000005: 77996. sample: Monster Mash: The Movie
movies with popularity >= 2.2000000000000006: 74441. sample: Slingshot
movies with popularity >= 2.3000000000000007: 71128. sample: Madame und ihre Nichte
movies with popularity >= 2.400000000000001: 68016. sample: Fanny Hill
movies with popularity >= 2.500000000000001: 65241. sample: All Star Comedy Jam
movies with popularity >= 2.600000000000001: 62791. sample: How to Cook Your Life
movies with popularity >= 2.700000000000001: 60318. sample: Miffo
movies with popularity >= 2.800000000000001: 58004. sample: Va a ser que nadie es perfecto
movies with popularity >= 2.9000000000000012: 55901. sample: The Lionshare
movies with popularity >= 3.0000000000000013: 53919. sample: Vicious Lips
movies with popularity >= 3.1000000000000014: 52133. sample: Footrot Flats: The Dog's Tale
movies with popularity >= 3.2000000000000015: 50436. sample: The Ferryman
movies with popularity >= 3.3000000000000016: 48890. sample: Nostradamus, el Genio de las Tinieblas
movies with popularity >= 3.4000000000000017: 47388. sample: Didi - Der Doppelgänger
movies with popularity >= 3.5000000000000018: 45992. sample: Institute Benjamenta, or This Dream People Call Human Life
movies with popularity >= 3.600000000000002: 44716. sample: Live Feed
movies with popularity >= 3.700000000000002: 43487. sample: Film Noir
movies with popularity >= 3.800000000000002: 42316. sample: スカイハイ 劇場版
movies with popularity >= 3.900000000000002: 41157. sample: Blood Dolls
movies with popularity >= 4.000000000000002: 40099. sample: Pollux et le chat bleu
movies with popularity >= 4.100000000000001: 39094. sample: Eye of the Tiger
movies with popularity >= 4.200000000000001: 38091. sample: ルパン三世 sweet lost night ～魔法のランプは悪夢の予感～
movies with popularity >= 4.300000000000001: 37164. sample: Camelot
movies with popularity >= 4.4: 36331. sample: Roman Polanski: Wanted and Desired
movies with popularity >= 4.5: 35500. sample: La Rupture
movies with popularity >= 4.6: 34668. sample: Romantik Komedi
movies with popularity >= 4.699999999999999: 33907. sample: The Legend of Frosty the Snowman
movies with popularity >= 4.799999999999999: 33129. sample: The Horror of Frankenstein
movies with popularity >= 4.899999999999999: 32467. sample: The Little Mermaid: Ariel's Beginning
movies with popularity >= 4.999999999999998: 31796. sample: 韓城攻略
movies with popularity >= 5.099999999999998: 31101. sample: Robinson Crusoe
movies with popularity >= 5.1999999999999975: 30477. sample: Rosso sangue
movies with popularity >= 5.299999999999997: 29870. sample: Pippi Longstocking
movies with popularity >= 5.399999999999997: 29209. sample: The Man Between
movies with popularity >= 5.4999999999999964: 28700. sample: खोसला का घोसला
movies with popularity >= 5.599999999999996: 28160. sample: पा
movies with popularity >= 5.699999999999996: 27644. sample: Fantaghirò 2
movies with popularity >= 5.799999999999995: 27159. sample: Otto - Der Neue Film
movies with popularity >= 5.899999999999995: 26641. sample: The Skulls II
movies with popularity >= 5.999999999999995: 26183. sample: Kaena: La prophétie
movies with popularity >= 6.099999999999994: 25706. sample: I corti
movies with popularity >= 6.199999999999994: 25227. sample: Fort Apache, the Bronx
movies with popularity >= 6.299999999999994: 24796. sample: The Scarlet Empress
movies with popularity >= 6.399999999999993: 24350. sample: Александр Невский
movies with popularity >= 6.499999999999993: 23950. sample: Carry On Abroad
movies with popularity >= 6.5999999999999925: 23547. sample: What's New Pussycat?
movies with popularity >= 6.699999999999992: 23128. sample: Nude per l'assassino
movies with popularity >= 6.799999999999992: 22769. sample: 새드무비
movies with popularity >= 6.8999999999999915: 22363. sample: Niko 2: Lentäjäveljekset
movies with popularity >= 6.999999999999991: 21977. sample: De zaak Alzheimer
movies with popularity >= 7.099999999999991: 21612. sample: Das Wunder von Bern
movies with popularity >= 7.19999999999999: 21249. sample: Bat★21
movies with popularity >= 7.29999999999999: 20896. sample: Essential Killing
movies with popularity >= 7.39999999999999: 20552. sample: The St. Valentine's Day Massacre
movies with popularity >= 7.499999999999989: 20225. sample: Icarus
movies with popularity >= 7.599999999999989: 19894. sample: Touchez pas au grisbi
movies with popularity >= 7.699999999999989: 19546. sample: Lo strano vizio della Signora Wardh
movies with popularity >= 7.799999999999988: 19213. sample: Black Moon Rising
movies with popularity >= 7.899999999999988: 18923. sample: Resolution
movies with popularity >= 7.999999999999988: 18611. sample: Gone
movies with popularity >= 8.099999999999987: 18354. sample: Pumping Iron
movies with popularity >= 8.199999999999987: 18101. sample: 人間の條件　完結篇
movies with popularity >= 8.299999999999986: 17811. sample: Blue Sky
movies with popularity >= 8.399999999999986: 17523. sample: Hobson's Choice
movies with popularity >= 8.499999999999986: 17242. sample: Krabat
movies with popularity >= 8.599999999999985: 16972. sample: 歩いても 歩いても
movies with popularity >= 8.699999999999985: 16707. sample: Undercover Grandpa
movies with popularity >= 8.799999999999985: 16440. sample: जब वी मेट
movies with popularity >= 8.899999999999984: 16221. sample: Katyń
movies with popularity >= 8.999999999999984: 15968. sample: The Two Jakes
movies with popularity >= 9.099999999999984: 15711. sample: The Blue Max
movies with popularity >= 9.199999999999983: 15489. sample: Playing by Heart
movies with popularity >= 9.299999999999983: 15240. sample: Partir
movies with popularity >= 9.399999999999983: 15012. sample: Postal
movies with popularity >= 9.499999999999982: 14813. sample: 皇家師姐IV直擊證人
movies with popularity >= 9.599999999999982: 14603. sample: My Son, My Son, What Have Ye Done
movies with popularity >= 9.699999999999982: 14405. sample: Bokeh
movies with popularity >= 9.799999999999981: 14205. sample: Jack Frost
movies with popularity >= 9.89999999999998: 13991. sample: House Party

*/
