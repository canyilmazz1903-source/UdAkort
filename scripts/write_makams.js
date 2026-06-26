const fs = require('fs');
const path = require('path');

const makams = [
  // 1-10: Basit Makamlar
  {
    "id": "rast",
    "name": "Rast",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3 - 5k flat)",
    "seyirType": "Çıkıcı",
    "history": "Rast makamı, Türk müziğinin en eski ve en temel makamlarından biridir. Kelime anlamı 'doğru, düzgün' demektir. Klasik icralarda neşe, huzur ve ferahlık verici karakteriyle bilinir. Seyri çıkıcıdır, yani durak sesi olan Rast (Sol) perdesinden başlayarak yukarıya doğru genişler.",
    "intervals": [9, 5, 8, 9, 9, 5, 8],
    "scaleNotes": ["Rast (Sol)", "Dügâh (La)", "Segâh (Si)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Eviç (Fa#)", "Gerdaniye (Sol)"],
    "scaleCommas": [0, 9, 14, 22, 31, 40, 48, 53],
    "compositions": [
      { "title": "Yine Bir Gülnihal", "form": "Semai", "composer": "Dede Efendi" },
      { "title": "Rast Kar-ı Muhteşem", "form": "Kâr", "composer": "Itri" },
      { "title": "Gülşende Yine Âh ü Enin", "form": "Şarkı", "composer": "Şevki Bey" }
    ],
    "seyirSteps": [
      { "text": "Durak Rast (Sol) sesinden başlayarak yeden perdesi Irak gösterilir.", "direction": "down" },
      { "text": "Rast Beşlisi (Rast-Dügah-Segah-Çargah-Neva) içinde çıkıcı melodiler kurulur.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Neva üzerindeki Rast Dörtlüsü (Neva-Hüseyni-Eviç-Gerdaniye) ile tiz seslere çıkılır.", "direction": "up" },
      { "text": "Melodiler pesleşerek Rast (Sol) perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "ussak",
    "name": "Uşşak",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı-İnici",
    "history": "Uşşak makamı, kelime anlamı olarak 'aşıklar' demektir. Türk müziğinde halk ezgilerinden klasik eserlere kadar son derece yaygın kullanılan bir makamdır. İçli, hüzünlü ve mistik bir karaktere sahiptir. Seyri çıkıcı-inicidir.",
    "intervals": [8, 5, 9, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh (Si)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 8, 13, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Bu Akşam Gün Batarken Gel", "form": "Şarkı", "composer": "Tatyos Efendi" },
      { "title": "Uşşak Saz Semaisi", "form": "Saz Semaisi", "composer": "Cemil Bey" },
      { "title": "Akşam Dönüşü Geçtim", "form": "Şarkı", "composer": "Kemani Serkis Efendi" }
    ],
    "seyirSteps": [
      { "text": "Dügâh (La) çevresinden melodilerle başlanır, Rast (Sol) yedeni gösterilir.", "direction": "flat" },
      { "text": "Uşşak Dörtlüsü (Dügah-Segah-Çargah-Neva) kullanılarak Nevâ perdesine yükselinir.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde Uşşak çeşnisi vurgulanarak yarım karar verilir.", "direction": "flat" },
      { "text": "Hüseyni üzerindeki Buselik Beşlisi (Hüseyni-Acem-Gerdaniye-Muhayyer) ile genişleme yapılır.", "direction": "up" },
      { "text": "Uşşak perdesi Segâh (Si flat 5k) basılarak Dügâh perdesinde tam karar yapılır.", "direction": "down" }
    ]
  },
  {
    "id": "hicaz",
    "name": "Hicaz",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı-İnici",
    "history": "Hicaz ailesinin ana makamıdır. Klasik Türk musikisinin en çok eser verilmiş makamlarından biridir. Arap Yarımadası'ndaki Hicaz bölgesinden adını alır. Coşkulu, mistik ve bazen de hüzünlü bir havaya sahiptir.",
    "intervals": [5, 12, 5, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Dik Kürdî (Si# 1k)", "Hicaz (Do# 5k)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 5, 17, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Hicaz Hümayun Peşrevi", "form": "Peşrev", "composer": "Veli Dede" },
      { "title": "Silemezler Gönlümden", "form": "Şarkı", "composer": "Selahattin Altınbaş" },
      { "title": "Hicaz Saz Semaisi", "form": "Saz Semaisi", "composer": "Refik Talat Alp" }
    ],
    "seyirSteps": [
      { "text": "Dügâh (La) perdesi civarında Hicaz çeşnisiyle seyre başlanır.", "direction": "flat" },
      { "text": "Dügah-Dik Kürdi-Hicaz-Neva sesleri kullanılarak Neva perdesine varılır.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Hüseyni perdesi üzerinden tizlere Hicaz veya Buselik çeşnisiyle çıkılır.", "direction": "up" },
      { "text": "Pesleşerek Hicaz perdesi ve Dik Kürdi perdesi basılarak Dügâh'ta karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "nihavend",
    "name": "Nihavend",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Kaba Bûselik (Si / F#2)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Nihavend makamı, Batı müziğindeki Minör dizisine çok yakın bir yapı gösterir. Son derece romantik, duygusal ve akıcı bir karaktere sahiptir. Dinleyicide hüzün ve aşk hissi uyandırır.",
    "intervals": [9, 4, 9, 9, 4, 12, 6],
    "scaleNotes": ["Rast (Sol)", "Dügâh (La)", "Kürdî (Si flat)", "Çârgâh (Do)", "Nevâ (Re)", "Nim Hicaz (Mi flat)", "Eviç (Fa#)", "Gerdaniye (Sol)"],
    "scaleCommas": [0, 9, 13, 22, 31, 35, 47, 53],
    "compositions": [
      { "title": "Nihavend Saz Semaisi", "form": "Saz Semaisi", "composer": "Mesut Cemil" },
      { "title": "Kimseye Etmem Şikâyet", "form": "Şarkı", "composer": "Kemani Serkis Efendi" },
      { "title": "Bir İhtimal Daha Var", "form": "Şarkı", "composer": "Necip Mirkelamoğlu" }
    ],
    "seyirSteps": [
      { "text": "Nevâ (Re) perdesi etrafından başlanarak Kürdi ve Buselik sesleri gösterilir.", "direction": "flat" },
      { "text": "Çargâh veya Neva'ya doğru çıkıcı ve İnici yürüyüşler yapılır.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde Hicaz çeşnili yarım karar yapılır.", "direction": "flat" },
      { "text": "Tiz tarafta Hicaz veya Kürdi çeşnisiyle Gerdaniye perdesine kadar genişlenir.", "direction": "up" },
      { "text": "İnilerek, yeden perdesi olan Kaba Bûselik (Si) gösterilip Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "segah",
    "name": "Segâh",
    "durak": "Segâh (Si / F#3 - 5k flat)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Dügâh (La / E3)",
    "seyirType": "Çıkıcı",
    "history": "Segâh makamı, mistik derinliği en yüksek olan makamlardandır. Türk dini musikisinde (Ezan, Mevlid vb.) ve klasik tasavvuf musikisinde çok yaygın kullanılır. Kelime anlamı 'üçüncü perde/yer' demektir.",
    "intervals": [5, 9, 9, 9, 5, 8, 8],
    "scaleNotes": ["Segâh (Si)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Eviç (Fa#)", "Gerdaniye (Sol)", "Eviç (La)", "Tiz Segâh (Si)"],
    "scaleCommas": [0, 5, 14, 23, 32, 37, 45, 53],
    "compositions": [
      { "title": "Segâh Peşrevi", "form": "Peşrev", "composer": "Yusuf Paşa" },
      { "title": "Segâh Saz Semaisi", "form": "Saz Semaisi", "composer": "Kemani Tatyos Efendi" },
      { "title": "Dönülmez Akşamın Ufkundayız", "form": "Şarkı", "composer": "Münir Nurettin Selçuk" }
    ],
    "seyirSteps": [
      { "text": "Segâh (Si flat 5k) perdesinden başlanarak Çargâh ve Neva sesleri alınır.", "direction": "up" },
      { "text": "Neva perdesinde Segâh çeşnili yarım karar vurgulanır.", "direction": "flat" },
      { "text": "Eviç ve Gerdaniye perdesiyle tizlere genişlenir.", "direction": "up" },
      { "text": "Dügâh yedeni belirginleştirilerek Segâh perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "huseyni",
    "name": "Hüseynî",
    "durak": "Dügâh (La / E3)",
    "guclu": "Hüseynî (Mi / B3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Hüseynî makamı, Türk halk müziğinin 'Hüseyni Kerem' ayağı ile doğrudan örtüşür ve Anadolu ezgilerinde en sık kullanılan yapıdır. Ağırbaşlı, vakur, hüzünlü ve mistik bir yapısı vardır.",
    "intervals": [8, 5, 9, 9, 5, 8, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh (Si)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Eviç (Fa#)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 8, 13, 22, 31, 36, 44, 53],
    "compositions": [
      { "title": "Hüseynî Saz Semaisi", "form": "Saz Semaisi", "composer": "Lavtacı Andon" },
      { "title": "Hüseynî Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" },
      { "title": "Çanakkale Türküsü", "form": "Türkü", "composer": "Anonim" }
    ],
    "seyirSteps": [
      { "text": "Güçlü Hüseynî (Mi) perdesi etrafından seyre başlanır.", "direction": "flat" },
      { "text": "Uşşak Beşlisi (Dügah-Segah-Çargah-Neva-Hüseyni) sesleriyle Neva ve Çargah gösterilir.", "direction": "down" },
      { "text": "Hüseynî perdesinde Hüseyni çeşnili yarım karar verilir.", "direction": "flat" },
      { "text": "Hüseyni üzerindeki Uşşak Dörtlüsü (Hüseyni-Eviç-Gerdaniye-Muhayyer) ile tizlere çıkılır.", "direction": "up" },
      { "text": "Rast yedeni basılarak Dügâh perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "kurdi",
    "name": "Kürdî",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı",
    "history": "Kürdî makamı, Batı müziğindeki Phrygian (Frigyen) moduna karşılık gelir. Yarım seslik Kürdi perdesi (Si flat 1k) nedeniyle çok karakteristik, egzotik ve hüzünlü bir yapısı vardır.",
    "intervals": [4, 9, 9, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Kürdî (Si flat 1k)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 4, 13, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Kürdî Saz Semaisi", "form": "Saz Semaisi", "composer": "Sadi Işılay" },
      { "title": "Kürdî Peşrevi", "form": "Peşrev", "composer": "Reşat Aysu" }
    ],
    "seyirSteps": [
      { "text": "Dügâh (La) ve Kürdî (Si flat 1k) perdelerinden başlanarak Çargâh perdesine çıkılır.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde Kürdî çeşnili yarım karar verilir.", "direction": "flat" },
      { "text": "Neva üzerindeki Buselik Beşlisi ile tizlere Muhayyer perdesine kadar çıkılır.", "direction": "up" },
      { "text": "Rast yedeni gösterilerek Dügâh perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "buselik",
    "name": "Buselik",
    "durak": "Dügâh (La / E3)",
    "guclu": "Hüseynî (Mi / B3)",
    "yeden": "Nim Geveşt (Sol# / D#3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Buselik makamı, Batı müziğindeki Doğal Minör (Aolian) dizisine benzer. Hüzünlü, melankolik fakat asil bir karaktere sahiptir. Seyri inici-çıkıcıdır.",
    "intervals": [9, 4, 9, 9, 4, 9, 9],
    "scaleNotes": ["Dügâh (La)", "Bûselik (Si)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 9, 13, 22, 31, 35, 44, 53],
    "compositions": [
      { "title": "Buselik Saz Semaisi", "form": "Saz Semaisi", "composer": "Tanburi Cemil Bey" },
      { "title": "Buselik Şarkı", "form": "Şarkı", "composer": "Şerif İçli" }
    ],
    "seyirSteps": [
      { "text": "Hüseynî (Mi) perdesi etrafından Buselik çeşnili melodilerle başlanır.", "direction": "flat" },
      { "text": "Dügâh-Buselik-Çargâh-Neva sesleri gösterilir.", "direction": "down" },
      { "text": "Güçlü Hüseynî perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Tizlerde Kürdi veya Buselik Beşlisiyle Muhayyer'e kadar genişlenir.", "direction": "up" },
      { "text": "Nim Geveşt (Sol#) yeden perdesi vurgulanarak Dügâh perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "cargah",
    "name": "Çârgâh",
    "durak": "Çârgâh (Do / G3)",
    "guclu": "Gerdaniye (Sol / D4)",
    "yeden": "Bûselik (Si / F#3)",
    "seyirType": "Çıkıcı",
    "history": "Çârgâh makamı, Batı müziğindeki Major (İonian) dizisine tamamen eştir. Neşeli, parlak, askeri ve kararlı bir havası vardır. Türk müziğinde az sayıda klasik eser barındırır.",
    "intervals": [9, 9, 4, 9, 9, 9, 4],
    "scaleNotes": ["Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye (Sol)", "Muhayyer (La)", "Tiz Bûselik (Si)", "Tiz Çârgâh (Do)"],
    "scaleCommas": [0, 9, 18, 22, 31, 40, 49, 53],
    "compositions": [
      { "title": "Çârgâh Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" },
      { "title": "Çârgâh Saz Semaisi", "form": "Saz Semaisi", "composer": "Ali Ufki Bey" }
    ],
    "seyirSteps": [
      { "text": "Çârgâh (Do) perdesinden başlanarak Çargâh Beşlisi sesleriyle seyre girilir.", "direction": "up" },
      { "text": "Gerdaniye (Sol) perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Tiz Çargâh perdesine kadar genişleme yapılarak melodiler kurulur.", "direction": "up" },
      { "text": "Buselik (Si) yeden perdesi belirginleştirilerek Çârgâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "neva",
    "name": "Nevâ",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Nevâ makamı, kelime anlamı olarak 'ses, seda, ezgi' demektir. Klasik Türk müziğinin asil ve vakur makamlarındandır. Uşşak makamına benzemekle birlikte Neva perdesini merkez almasıyla ayrılır.",
    "intervals": [9, 5, 8, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh (Si)", "Çârgâh (Do)", "Nevâ (Re)", "Hüseynî (Mi)", "Eviç (Fa#)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 9, 14, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Nevâ Peşrevi", "form": "Peşrev", "composer": "Yusuf Paşa" },
      { "title": "Nevâ Kâr", "form": "Kâr", "composer": "Itri" }
    ],
    "seyirSteps": [
      { "text": "Nevâ (Re) perdesinden başlanarak Segâh ve Çargâh perdeleri gösterilir.", "direction": "flat" },
      { "text": "Nevâ perdesinde Neva çeşnili yarım karar verilir.", "direction": "flat" },
      { "text": "Tiz Muhayyer perdesine kadar genişleyerek melodiler kurulur.", "direction": "up" },
      { "text": "Uşşak perdeleri basılarak pesleşilir ve Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "humayun",
    "name": "Hümayun",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Hicaz ailesinin bir koludur. Hicaz Dörtlüsü ve Buselik Beşlisinin birleşmesinden oluşur. Son derece asil, padişahlara layık manasına gelen ismiyle saray musikisinde çok sevilmiştir.",
    "intervals": [5, 12, 5, 9, 9, 4, 9],
    "scaleNotes": ["Dügâh (La)", "Dik Kürdî (Si#)", "Hicaz (Do#)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 5, 17, 22, 31, 40, 44, 53],
    "compositions": [
      { "title": "Hümayun Peşrevi", "form": "Peşrev", "composer": "Dede Efendi" }
    ],
    "seyirSteps": [
      { "text": "Dügâh civarında Hicaz çeşnisiyle seyre başlanır, Neva perdesine varılır.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde Buselik çeşnili yarım karar yapılır.", "direction": "flat" },
      { "text": "Tizlere çıkılarak Muhayyer perdesinde genişleme gösterilir.", "direction": "up" },
      { "text": "Hicaz sesleriyle Dügâh'ta karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "uzzal",
    "name": "Uzzal",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı-İnici",
    "history": "Hicaz ailesinin Uşşak beşlisiyle birleşen koludur. Hicaz Beşlisi ve Uşşak Dörtlüsünün birleşimidir. Ağlayan, içli bir yapısı vardır.",
    "intervals": [5, 12, 5, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Dik Kürdî", "Hicaz", "Nevâ (Re)", "Hüseynî (Mi)", "Eviç (Fa#)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 5, 17, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Uzzal Saz Semaisi", "form": "Saz Semaisi", "composer": "Giriftzen Asım Bey" }
    ],
    "seyirSteps": [
      { "text": "Hicaz Beşlisi sesleriyle seyre başlanır, Neva perdesine yükselinir.", "direction": "up" },
      { "text": "Nevâ'da Uşşak çeşnili yarım karar verilir.", "direction": "flat" },
      { "text": "Tizlerde Gerdaniye ve Muhayyer sesleri gösterilir.", "direction": "up" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "zirguleli_hicaz",
    "name": "Zirgüleli Hicaz",
    "durak": "Dügâh (La / E3)",
    "guclu": "Hüseynî (Mi / B3)",
    "yeden": "Nim Geveşt (Sol# / D#3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Zirgüleli Hicaz, iki adet Hicaz çeşnisinin (Hicaz Beşlisi ve Zirgüle Dörtlüsü) birleşmesinden oluşur. Son derece egzotik, mistik ve parlak bir Hicaz karakterine sahiptir.",
    "intervals": [5, 12, 5, 9, 5, 12, 5],
    "scaleNotes": ["Dügâh (La)", "Dik Kürdî", "Hicaz", "Nevâ (Re)", "Hüseynî (Mi)", "Dik Acem (Fa#)", "Tiz Hicaz (Sol#)", "Muhayyer (La)"],
    "scaleCommas": [0, 5, 17, 22, 31, 36, 48, 53],
    "compositions": [
      { "title": "Zirgüleli Hicaz Peşrevi", "form": "Peşrev", "composer": "Ebubekir Ağa" }
    ],
    "seyirSteps": [
      { "text": "Hüseynî perdesi etrafından Zirgüleli Hicaz sesleriyle seyre başlanır.", "direction": "flat" },
      { "text": "Nevâ ve Hüseynî perdesinde yarım karar vurgulanır.", "direction": "flat" },
      { "text": "Tiz Muhayyer perdesine çıkılarak genişlemeler gösterilir.", "direction": "up" },
      { "text": "Yeden perdesi Nim Geveşt (Sol#) gösterilerek Dügâh'ta karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "karcigar",
    "name": "Karcığar",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Uşşak makamı dizisinin Neva perdesinde Hicaz çeşnisi almasıyla oluşur. Yanık, hüzünlü ve çok hareketli bir yapısı vardır. Rumeli ve Ege halk ezgilerinde sıkça rastlanır.",
    "intervals": [8, 5, 9, 5, 12, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Nevâ (Re)", "Hicaz (Mi flat)", "Dik Acem (Fa#)", "Gerdaniye (Sol)", "Muhayyer (La)"],
    "scaleCommas": [0, 8, 13, 22, 27, 39, 44, 53],
    "compositions": [
      { "title": "Karcığar Saz Semaisi", "form": "Saz Semaisi", "composer": "Kemani Tatyos Efendi" }
    ],
    "seyirSteps": [
      { "text": "Dügâh ve Neva perdeleri etrafından seyre başlanır.", "direction": "flat" },
      { "text": "Nevâ perdesinde Hicaz çeşnili yarım karar verilir.", "direction": "flat" },
      { "text": "Hicaz ve Gerdaniye sesleriyle genişlemeler yapılır.", "direction": "up" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "basit_suzenak",
    "name": "Basit Süzenak",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "Çıkıcı",
    "history": "Rast makamı dizisinin Neva perdesinde Hicaz çeşnisi almasıyla oluşur. Çok tatlı, neşeli fakat içli bir yapısı vardır. Klasik eserlerde çok sevilmiştir.",
    "intervals": [9, 5, 8, 9, 5, 12, 5],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ (Re)", "Dik Hicaz (Mi flat)", "Dik Acem (Fa#)", "Gerdaniye (Sol)"],
    "scaleCommas": [0, 9, 14, 22, 31, 36, 48, 53],
    "compositions": [
      { "title": "Süzenak Peşrevi", "form": "Peşrev", "composer": "Kemani Sebuh" }
    ],
    "seyirSteps": [
      { "text": "Rast perdesinden başlanarak Rast beşlisi sesleriyle seyre girilir.", "direction": "up" },
      { "text": "Nevâ perdesinde Hicaz çeşnili yarım karar gösterilir.", "direction": "flat" },
      { "text": "Gerdaniye sesleriyle tizlerde melodiler kurulur.", "direction": "up" },
      { "text": "Irak yedeni basılarak Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },

  // 16-25: Şed Makamlar
  {
    "id": "mahur",
    "name": "Mahur",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "İnici",
    "history": "Mahur makamı, Çargah makamının Rast perdesine şeddedilmesiyle (transpoze edilmesiyle) oluşur. Neşeli, coşkulu ve çok akıcı bir karaktere sahiptir. Seyri inicidir.",
    "intervals": [9, 9, 4, 9, 9, 9, 4],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh (Si natural)", "Çârgâh", "Nevâ", "Hüseynî (Mi natural)", "Eviç (Fa#)", "Gerdaniye"],
    "scaleCommas": [0, 9, 18, 22, 31, 40, 49, 53],
    "compositions": [
      { "title": "Mahur Peşrevi", "form": "Peşrev", "composer": "Gazi Giray Han" },
      { "title": "Mahur Saz Semaisi", "form": "Saz Semaisi", "composer": "Tanburi Cemil Bey" }
    ],
    "seyirSteps": [
      { "text": "Tiz Gerdaniye (Sol) perdesi civarından parlak melodilerle seyre başlanır.", "direction": "down" },
      { "text": "İnilerek Neva perdesinde Çargah çeşnili yarım karar gösterilir.", "direction": "flat" },
      { "text": "Rast perdesi civarına inilir, Irak perdesi yeden olarak basılır.", "direction": "down" },
      { "text": "Rast perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "acem_asiran",
    "name": "Acem Aşiran",
    "durak": "Acem Aşiran (Fa / C3)",
    "guclu": "Çârgâh (Do / G3)",
    "yeden": "Hüseynî Aşîran (Mi / B2)",
    "seyirType": "İnici",
    "history": "Çargah makamının Acem Aşiran (Fa) perdesine şeddedilmesiyle oluşur. Batı müziğindeki Fa Majör dizisine benzer. Oldukça asil, neşeli fakat vakur bir yapısı vardır.",
    "intervals": [9, 9, 4, 9, 9, 9, 4],
    "scaleNotes": ["Acem Aşiran (Fa)", "Rast", "Dügâh", "Kürdî (Si flat)", "Çârgâh", "Nevâ", "Hüseynî", "Acem (Fa)"],
    "scaleCommas": [0, 9, 18, 22, 31, 40, 49, 53],
    "compositions": [
      { "title": "Acem Aşiran Saz Semaisi", "form": "Saz Semaisi", "composer": "Kemani Tatyos Efendi" }
    ],
    "seyirSteps": [
      { "text": "Tiz Acem (Fa) perdesi etrafından başlanarak inicilik karakteri vurgulanır.", "direction": "down" },
      { "text": "Çargâh (Do) perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Hüseyni Aşiran yedeni basılarak Acem Aşiran (Fa) perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "suzidil",
    "name": "Suzidil",
    "durak": "Yegâh (Re / A2)",
    "guclu": "Hüseynî Aşîran (Mi / B2)",
    "yeden": "Kaba Kaya (Do# / G#2)",
    "seyirType": "İnici",
    "history": "Zirgüleli Hicaz makamının Yegâh (Re) perdesine şeddedilmesiyle oluşur. Son derece yanık, hüzünlü ve çok derin bir karaktere sahiptir. İsmi 'gönül yakan' anlamına gelir.",
    "intervals": [5, 12, 5, 9, 5, 12, 5],
    "scaleNotes": ["Yegâh (Re)", "Kaba Hicaz (Re#)", "Kaba Kaya (Do#)", "Hüseynî Aşîran", "Hisar Aşiran", "Kaba Buselik", "Kaba Geveşt", "Yegâh"],
    "scaleCommas": [0, 5, 17, 22, 31, 36, 48, 53],
    "compositions": [
      { "title": "Suzidil Saz Semaisi", "form": "Saz Semaisi", "composer": "Tanburi Cemil Bey" }
    ],
    "seyirSteps": [
      { "text": "Yegâh perdesinde Zirgüleli Hicaz sesleriyle seyre girilir.", "direction": "up" },
      { "text": "Hüseyni Aşiran perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Yegâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "sedaraban",
    "name": "Şedaraban",
    "durak": "Yegâh (Re / A2)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Kaba Kaya (Do# / G#2)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Zirgüleli Hicaz makamının Yegâh perdesindeki şeddidir. Suzidil makamına benzemekle birlikte, seyri daha çıkıcı karakterlidir. Çok zengin, süslü bir klasik makamdır.",
    "intervals": [5, 12, 5, 9, 5, 12, 5],
    "scaleNotes": ["Yegâh (Re)", "Kaba Hicaz", "Kaba Kaya", "Hüseynî Aşîran", "Hisar Aşiran", "Kaba Buselik", "Kaba Geveşt", "Yegâh"],
    "scaleCommas": [0, 5, 17, 22, 31, 36, 48, 53],
    "compositions": [
      { "title": "Şedaraban Peşrevi", "form": "Peşrev", "composer": "Tanburi Cemil Bey" }
    ],
    "seyirSteps": [
      { "text": "Yegâh perdesinden başlanarak Hicaz sesleriyle Neva ve Hüseyni perdesine çıkılır.", "direction": "up" },
      { "text": "Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Yegâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "ferahnak",
    "name": "Ferahnak",
    "durak": "Irak (Fa# / C#3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı",
    "history": "Klasik Türk müziğinin çok sevilen şed makamlarındandır. Geveşt perdesinin Irak perdesine şeddedilmesiyle oluşur. İsmi 'rahatlatıcı, ferahlık verici' manasındadır.",
    "intervals": [5, 9, 9, 9, 5, 8, 8],
    "scaleNotes": ["Irak (Fa#)", "Rast", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç"],
    "scaleCommas": [0, 5, 14, 23, 32, 37, 45, 53],
    "compositions": [
      { "title": "Ferahnak Peşrevi", "form": "Peşrev", "composer": "Tanburi Cemil Bey" }
    ],
    "seyirSteps": [
      { "text": "Irak perdesinden başlanarak çıkıcı melodilerle Çargâh ve Neva'ya varılır.", "direction": "up" },
      { "text": "Nevâ perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Irak perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "sultani_yegah",
    "name": "Sultânî Yegâh",
    "durak": "Yegâh (Re / A2)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Kaba Kaya (Do# / G#2)",
    "seyirType": "İnici",
    "history": "Nihavend makamının Yegâh perdesine şeddedilmesiyle oluşur. Romantik, saray ihtişamını andıran ve son derece akıcı bir karaktere sahiptir.",
    "intervals": [9, 4, 9, 9, 4, 12, 6],
    "scaleNotes": ["Yegâh (Re)", "Hüseynî Aşîran", "Kaba Bûselik", "Kaba Geveşt", "Yegâh", "Kaba Kaya", "Kaba Hicaz", "Nevâ"],
    "scaleCommas": [0, 9, 13, 22, 31, 35, 47, 53],
    "compositions": [
      { "title": "Sultânî Yegâh Saz Semaisi", "form": "Saz Semaisi", "composer": "Sadi Işılay" }
    ],
    "seyirSteps": [
      { "text": "Tiz Gerdaniye ve Neva perdeleri etrafından seyre başlanır.", "direction": "down" },
      { "text": "Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Yegâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "evcara",
    "name": "Evcârâ",
    "durak": "Irak (Fa# / C#3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici",
    "history": "Zirgüleli Hicaz makamının Irak perdesine şeddedilmesiyle oluşur. Egzotik ve son derece asil bir tınısı vardır. Seyri inicidir.",
    "intervals": [5, 12, 5, 9, 5, 12, 5],
    "scaleNotes": ["Irak (Fa#)", "Rast", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç"],
    "scaleCommas": [0, 5, 17, 22, 31, 36, 48, 53],
    "compositions": [
      { "title": "Evcârâ Peşrevi", "form": "Peşrev", "composer": "Dilhayat Kalfa" }
    ],
    "seyirSteps": [
      { "text": "Tiz Eviç perdesi civarından Hicaz sesleriyle seyre başlanır.", "direction": "down" },
      { "text": "Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Irak perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "nihavendi_kabir",
    "name": "Nihavend-i Kebir",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Kaba Bûselik (Si / F#2)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Nihavend makamının daha geniş aralıklı ve pes perdeleri de içine alan klasik bir şed formudur. Çok görkemli bir yapısı vardır.",
    "intervals": [9, 4, 9, 9, 4, 9, 9],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Kürdî", "Çârgâh", "Nevâ", "Hüseynî", "Acem", "Gerdaniye"],
    "scaleCommas": [0, 9, 13, 22, 31, 35, 44, 53],
    "compositions": [
      { "title": "Nihavend-i Kebir Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" }
    ],
    "seyirSteps": [
      { "text": "Neva ve Gerdaniye perdelerinden seyre başlanır.", "direction": "flat" },
      { "text": "Nevâ'da yarım karar gösterilir.", "direction": "flat" },
      { "text": "Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "ruhnuvaz",
    "name": "Ruhnüvaz",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "Çıkıcı",
    "history": "Rast perdesine şeddedilen çok az kullanılmış, ruhu okşayan manasındaki mistik bir şed makamdır.",
    "intervals": [9, 5, 8, 9, 9, 5, 8],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 14, 22, 31, 40, 48, 53],
    "compositions": [
      { "title": "Ruhnüvaz Saz Semaisi", "form": "Saz Semaisi", "composer": "Kemani Reşat Aysu" }
    ],
    "seyirSteps": [
      { "text": "Rast perdesinden başlanarak Neva'ya kadar melodiler kurulur.", "direction": "up" },
      { "text": "Nevâ perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Rast perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "rengidil",
    "name": "Reng-i Dil",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "İnici",
    "history": "Çargah makamının Rast perdesindeki inici şeddidir. Gönlün rengi anlamına gelir.",
    "intervals": [9, 9, 4, 9, 9, 9, 4],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 18, 22, 31, 40, 49, 53],
    "compositions": [
      { "title": "Reng-i Dil Saz Semaisi", "form": "Saz Semaisi", "composer": "Dede Efendi" }
    ],
    "seyirSteps": [
      { "text": "Tiz Gerdaniye civarından seyre başlanır.", "direction": "down" },
      { "text": "Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },

  // 26-40: Mürekkep (Bileşik) Makamlar
  {
    "id": "saba",
    "name": "Saba",
    "durak": "Dügâh (La / E3)",
    "guclu": "Çârgâh (Do / G3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı-İnici",
    "history": "Saba makamı, Türk müziğinin en mistik, hüzünlü ve etkileyici mürekkep makamlarındandır. Sabah vaktini temsil eder. Dügâh perdesinde Saba Dörtlüsü ile başlar.",
    "intervals": [8, 5, 5, 12, 9, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Hicaz (Re flat 5k)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 8, 13, 18, 30, 35, 44, 53],
    "compositions": [
      { "title": "Saba Peşrevi", "form": "Peşrev", "composer": "Cemil Bey" },
      { "title": "Saba Şarkı", "form": "Şarkı", "composer": "Şevki Bey" }
    ],
    "seyirSteps": [
      { "text": "Dügâh ve Çargâh perdeleri arasından seyre Saba çeşnisiyle başlanır.", "direction": "up" },
      { "text": "Güçlü Çârgâh (Do) perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Hicaz perdesi (Re flat 5k) basılarak tiz seslere genişleme yapılır.", "direction": "up" },
      { "text": "Saba melodileri pesleşerek Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "huzzam",
    "name": "Hüzzam",
    "durak": "Segâh (Si / F#3 - 5k flat)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Dügâh (La / E3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Hüzzam makamı, Segah perdesinde yer alan son derece hüzünlü, yanık ve içli bir mürekkep makamdır. Dini musikide ve klasik eserlerde çok sevilmiştir.",
    "intervals": [5, 12, 5, 9, 8, 5, 9],
    "scaleNotes": ["Segâh (Si)", "Hicaz (Do#)", "Dik Hicaz (Mi flat)", "Nevâ (Re)", "Hüseynî (Mi)", "Acem (Fa)", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 5, 17, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Hüzzam Peşrevi", "form": "Peşrev", "composer": "Neyzen Yusuf Paşa" },
      { "title": "Hüzzam Saz Semaisi", "form": "Saz Semaisi", "composer": "Tatyos Efendi" }
    ],
    "seyirSteps": [
      { "text": "Segâh (Si) perdesinden Hicaz çeşnisiyle başlanıp Neva perdesine varılır.", "direction": "up" },
      { "text": "Güçlü Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Tiz Muhayyer perdesine genişleyerek Gerdaniye sesleri basılır.", "direction": "up" },
      { "text": "Dügâh yedeni belirginleştirilerek Segâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "segah_maliki",
    "name": "Segâh Mâlikî",
    "durak": "Segâh (Si / F#3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Dügâh (La / E3)",
    "seyirType": "İnici",
    "history": "Segâh makamının antik ve mürekkep bir varyasyonudur. Klasik dönem eserlerinde kullanılmıştır.",
    "intervals": [5, 9, 9, 9, 5, 8, 8],
    "scaleNotes": ["Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye", "Muhayyer", "Tiz Segâh"],
    "scaleCommas": [0, 5, 14, 23, 32, 37, 45, 53],
    "compositions": [
      { "title": "Segâh Mâlikî Peşrevi", "form": "Peşrev", "composer": "Ebubekir Ağa" }
    ],
    "seyirSteps": [
      { "text": "Tizlerden başlanarak Segâh sesleriyle Neva perdesine inilir.", "direction": "down" },
      { "text": "Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Segâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "gerdaniye",
    "name": "Gerdaniye",
    "durak": "Rast (Sol / D3)",
    "guclu": "Gerdaniye (Sol / D4)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "İnici",
    "history": "Rast makamının inici karakterli bileşik şeklidir. Seyre tiz Gerdaniye perdesinden başlar, Rast perdesinde karar kılar.",
    "intervals": [9, 5, 8, 9, 9, 5, 8],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 14, 22, 31, 40, 48, 53],
    "compositions": [
      { "title": "Gerdaniye Peşrevi", "form": "Peşrev", "composer": "Kemani Tatyos Efendi" }
    ],
    "seyirSteps": [
      { "text": "Tiz Gerdaniye perdesinden inici melodilerle seyre girilir.", "direction": "down" },
      { "text": "Nevâ perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "acem",
    "name": "Acem",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici",
    "history": "Acem perdesini (Fa) merkez alarak inici seyir gösteren, Uşşak veya Beyati çeşnisiyle Dügâh perdesinde karar kılan bileşik makamdır.",
    "intervals": [8, 5, 9, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Acem (Fa)", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 8, 13, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Acem Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" }
    ],
    "seyirSteps": [
      { "text": "Acem perdesi civarından inici melodilerle başlanır.", "direction": "down" },
      { "text": "Nevâ'da yarım karar gösterilir.", "direction": "flat" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "isfahan",
    "name": "Isfahan",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Rast Beşlisi ve Beyati çeşnilerinin birleşmesiyle oluşan çok eski bir klasik bileşik makamdır.",
    "intervals": [9, 5, 8, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Acem", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 9, 14, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Isfahan Peşrevi", "form": "Peşrev", "composer": "Dede Efendi" }
    ],
    "seyirSteps": [
      { "text": "Dügâh ve Neva perdelerinden Beyati çeşnisiyle seyre girilir.", "direction": "flat" },
      { "text": "Rast sesleri belirginleştirilir.", "direction": "down" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "hisar",
    "name": "Hisar",
    "durak": "Dügâh (La / E3)",
    "guclu": "Hüseynî (Mi / B3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici",
    "history": "Hüseyni makamı dizisinin Hisar perdesiyle (La#) inici hale gelmiş bileşik varyasyonudur.",
    "intervals": [8, 5, 9, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Hisar (La#)", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 8, 13, 22, 31, 36, 44, 53],
    "compositions": [
      { "title": "Hisar Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" }
    ],
    "seyirSteps": [
      { "text": "Tiz perdelerden başlanıp Hisar perdesi kullanılarak inilir.", "direction": "down" },
      { "text": "Hüseynî perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "nikriz",
    "name": "Nikriz",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "Çıkıcı",
    "history": "Rast perdesinde Nikriz beşlisi (Rast-Dügah-Kürdi-Hicaz-Neva) ile başlayan ve Hicaz ailesine yakın tınlayan hareketli bir bileşik makamdır.",
    "intervals": [9, 4, 13, 5, 9, 5, 8],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Kürdî (Si flat)", "Hicaz (Do#)", "Nevâ (Re)", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 13, 26, 31, 40, 45, 53],
    "compositions": [
      { "title": "Nikriz Saz Semaisi", "form": "Saz Semaisi", "composer": "Cemil Bey" }
    ],
    "seyirSteps": [
      { "text": "Rast perdesinden başlanarak Nikriz beşlisiyle Çargah ve Neva'ya çıkılır.", "direction": "up" },
      { "text": "Nevâ perdesinde yarım karar verilir.", "direction": "flat" },
      { "text": "Rast perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "pencgah",
    "name": "Pençgâh",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "Çıkıcı",
    "history": "Farsça 'beşinci yer' anlamına gelen, klasik dönem repertuarında çok saygın bir yeri olan ağırbaşlı bir bileşik makamdır.",
    "intervals": [9, 5, 8, 9, 9, 5, 8],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 14, 22, 31, 40, 48, 53],
    "compositions": [
      { "title": "Pençgâh Peşrevi", "form": "Peşrev", "composer": "Itri" }
    ],
    "seyirSteps": [
      { "text": "Rast perdesinden ağır adımlarla başlanır, Neva'da yarım karar gösterilir.", "direction": "up" },
      { "text": "Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "gerdaniye_buselik",
    "name": "Gerdaniye-Bûselik",
    "durak": "Dügâh (La / E3)",
    "guclu": "Gerdaniye (Sol / D4)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici",
    "history": "Gerdaniye makamı ile başlayıp Buselik makamı ile Dügâh perdesinde karar kılan bileşik makamdır.",
    "intervals": [9, 5, 8, 9, 4, 9, 9],
    "scaleNotes": ["Dügâh (La)", "Bûselik", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 13, 22, 31, 39, 48, 53],
    "compositions": [
      { "title": "Gerdaniye-Bûselik Saz Semaisi", "form": "Saz Semaisi", "composer": "Kantemiroğlu" }
    ],
    "seyirSteps": [
      { "text": "Tiz Gerdaniye perdesinden başlanıp Buselik sesleriyle Dügâh'ta karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "neveser",
    "name": "Neveser",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "Çıkıcı",
    "history": "Nikriz Beşlisi ve Hicaz Dörtlüsünün Dügâh perdesinde birleşmesiyle oluşan neşeli, parlak ve son derece kıvrak bir bileşik makamdır.",
    "intervals": [9, 4, 13, 5, 5, 12, 5],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Hicaz", "Nevâ (Re)", "Hüseynî", "Acem", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 9, 13, 26, 31, 36, 48, 53],
    "compositions": [
      { "title": "Neveser Saz Semaisi", "form": "Saz Semaisi", "composer": "Yusuf Paşa" }
    ],
    "seyirSteps": [
      { "text": "Dügâh perdesinden Neveser çeşnisiyle seyre girilir.", "direction": "up" },
      { "text": "Nevâ perdesinde yarım karar verilir.", "direction": "flat" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "muhayyer_kurdi",
    "name": "Muhayyer Kürdî",
    "durak": "Dügâh (La / E3)",
    "guclu": "Muhayyer (La / E4)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici",
    "history": "Muhayyer makamı ile seyre başlayıp Kürdi makamı çeşnisiyle Dügâh perdesinde karar kılan modern ve son derece yaygın bir bileşik makamdır.",
    "intervals": [4, 9, 9, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Kürdî", "Çârgâh", "Nevâ", "Hüseynî", "Acem", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 4, 13, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Muhayyer Kürdî Saz Semaisi", "form": "Saz Semaisi", "composer": "Sadi Işılay" }
    ],
    "seyirSteps": [
      { "text": "Tiz Muhayyer perdesinden başlanarak Kürdi sesleriyle inilir.", "direction": "down" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "suzidilara",
    "name": "Sûzidilârâ",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Padişah III. Selim tarafından terkip edilmiş, saray ihtişamını, hüznünü ve asaletini en derin şekilde yansıtan nadide bir bileşik makamdır.",
    "intervals": [9, 5, 8, 9, 8, 5, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Acem", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 9, 14, 22, 31, 39, 44, 53],
    "compositions": [
      { "title": "Sûzidilârâ Peşrevi", "form": "Peşrev", "composer": "III. Selim" }
    ],
    "seyirSteps": [
      { "text": "Dügâh perdesinden Sûzidilârâ çeşnisiyle seyre başlanır.", "direction": "up" },
      { "text": "Nevâ perdesinde yarım karar gösterilir.", "direction": "flat" },
      { "text": "Dügâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "hisar_buselik",
    "name": "Hisar Bûselik",
    "durak": "Dügâh (La / E3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Nim Geveşt (Sol# / D#3)",
    "seyirType": "İnici",
    "history": "Hisar makamı ile başlayıp Buselik makamı ile Dügâh'ta karar kılan klasik bir bileşik makamdır.",
    "intervals": [9, 4, 9, 9, 4, 9, 9],
    "scaleNotes": ["Dügâh (La)", "Bûselik", "Çârgâh", "Nevâ", "Hüseynî", "Acem", "Gerdaniye"],
    "scaleCommas": [0, 9, 13, 22, 31, 35, 44, 53],
    "compositions": [
      { "title": "Hisar Bûselik Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" }
    ],
    "seyirSteps": [
      { "text": "Hisar perdelerinden inilerek Buselik karar yapılır.", "direction": "down" }
    ]
  },
  {
    "id": "rasti_cedid",
    "name": "Rast-ı Cedid",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "Çıkıcı",
    "history": "Rast makamının daha modern ve geç dönemde revize edilmiş bileşik formudur.",
    "intervals": [9, 5, 8, 9, 9, 5, 8],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 14, 22, 31, 40, 48, 53],
    "compositions": [
      { "title": "Rast-ı Cedid Saz Semaisi", "form": "Saz Semaisi", "composer": "Dede Efendi" }
    ],
    "seyirSteps": [
      { "text": "Rast perdesinden başlanarak Neva'da yarım karar yapılır.", "direction": "up" },
      { "text": "Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "zavil",
    "name": "Zavil",
    "durak": "Rast (Sol / D3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Irak (Fa# / C#3)",
    "seyirType": "İnici-Çıkıcı",
    "history": "Hicaz ve Rast çeşnilerinin birleşiminden oluşan nadide bir klasik bileşik makamdır.",
    "intervals": [9, 5, 8, 9, 5, 12, 5],
    "scaleNotes": ["Rast (Sol)", "Dügâh", "Segâh", "Çârgâh", "Nevâ", "Hicaz", "Eviç", "Gerdaniye"],
    "scaleCommas": [0, 9, 14, 22, 31, 36, 48, 53],
    "compositions": [
      { "title": "Zavil Peşrevi", "form": "Peşrev", "composer": "Kantemiroğlu" }
    ],
    "seyirSteps": [
      { "text": "Rast perdesi üzerinden Hicaz sesleriyle Neva'ya çıkılır.", "direction": "up" },
      { "text": "Rast perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "bestenigar",
    "name": "Bestenigâr",
    "durak": "Segâh (Si / F#3)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Dügâh (La / E3)",
    "seyirType": "İnici",
    "history": "Saba ve Hüzzam makamlarının karışımından oluşan, son derece kederli, yanık ve tasavvufi yönü güçlü bir bileşik makamdır.",
    "intervals": [5, 8, 5, 12, 9, 5, 9],
    "scaleNotes": ["Segâh", "Çârgâh", "Saba (Re flat)", "Nevâ", "Hüseynî", "Acem", "Gerdaniye"],
    "scaleCommas": [0, 5, 13, 25, 34, 39, 48, 53],
    "compositions": [
      { "title": "Bestenigâr Peşrevi", "form": "Peşrev", "composer": "Ebubekir Ağa" }
    ],
    "seyirSteps": [
      { "text": "Saba ve Hüzzam sesleriyle tizlerden inilir.", "direction": "down" },
      { "text": "Segâh perdesinde tam karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "sevkefza",
    "name": "Şevkefza",
    "durak": "Yegâh (Re / A2)",
    "guclu": "Nevâ (Re / A3)",
    "yeden": "Kaba Kaya (Do# / G#2)",
    "seyirType": "İnici",
    "history": "Acem Aşiran ve Saba makamlarının Yegâh perdesindeki birleşimidir. Gönül coşturan, şevk veren manasındadır.",
    "intervals": [9, 9, 4, 9, 9, 9, 4],
    "scaleNotes": ["Yegâh (Re)", "Hüseynî Aşîran", "Kaba Bûselik", "Kaba Geveşt", "Yegâh", "Kaba Kaya", "Kaba Hicaz", "Nevâ"],
    "scaleCommas": [0, 9, 18, 22, 31, 40, 49, 53],
    "compositions": [
      { "title": "Şevkefza Peşrevi", "form": "Peşrev", "composer": "III. Selim" }
    ],
    "seyirSteps": [
      { "text": "Tiz perdelerden inici seyirle inilip Yegâh perdesinde karar verilir.", "direction": "down" }
    ]
  },
  {
    "id": "muhayyer",
    "name": "Muhayyer",
    "durak": "Dügâh (La / E3)",
    "guclu": "Muhayyer (La / E4)",
    "yeden": "Rast (Sol / D3)",
    "seyirType": "İnici",
    "history": "Hüseyni makamının tamamen inici karakterli bileşik formudur. Seyre tiz Muhayyer perdesinden başlar, Dügâh perdesinde tam karar verir.",
    "intervals": [8, 5, 9, 9, 5, 8, 9],
    "scaleNotes": ["Dügâh (La)", "Segâh", "Çârgâh", "Nevâ", "Hüseynî", "Eviç", "Gerdaniye", "Muhayyer"],
    "scaleCommas": [0, 8, 13, 22, 31, 36, 44, 53],
    "compositions": [
      { "title": "Muhayyer Saz Semaisi", "form": "Saz Semaisi", "composer": "Cemil Bey" }
    ],
    "seyirSteps": [
      { "text": "Tiz Muhayyer perdesinden başlayıp inici seyir gösterilir.", "direction": "down" },
      { "text": "Hüseynî perdesinde yarım karar yapılır.", "direction": "flat" },
      { "text": "Dügâh perdesinde tam karar verilir.", "direction": "down" }
    ]
  }
];

const outputPath = path.join(__dirname, '..', 'src', 'data', 'makams.json');
fs.writeFileSync(outputPath, JSON.stringify(makams, null, 2), 'utf8');
console.log('Successfully wrote ' + makams.length + ' makams to ' + outputPath);
