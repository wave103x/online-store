const fs = require('fs/promises');
const path = require('path');

const bases = [
  'Caterpillar',
  'Komatsu',
  'Hyundai',
  'Hitachi',
  'Doosan',
  'Volvo',
  'John Deere',
  'Liebherr',
  'JCB',
  'Кранэкс',
  'Case',
  'Doosan',
];

const title = {
  'Ковши экскаваторные': 'Ковш',
  'Бульдозерные отвалы': 'Отвал',
  'Бетоноломы': 'Бетонолом',
  'Коронки, адаптеры': 'Система зубьев',
  'Стрелы, рукояти': 'Рабочее оборудование',
  'Оси, втулки': 'Оси, пальцы втулки',
  'Ходовая часть': 'Гусеничная цепь',
};

const descriptions = {
  'Ковши экскаваторные':
    'Ковш применяется для разработки котлованов, карьеров в грунтах I-IV категорий и разгрузки сыпучих материалов, плотность до 1600 кг/м3 (песок, суглинок, растительный грунт, щебень).',
  'Бульдозерные отвалы':
    'Отвал – ключевой механизм любой бульдозерной машины. Изготовленный из стали повышенной прочности и имеющий изогнутый эргономичный профиль основной рабочий инструмент дает возможность быстро выполнять задачи различной сложности во время строительно-дорожных, коммунальных и других работ.',
  'Бетоноломы':
    'Оборудование состоят из двух челюстей и крепится к рукояти экскаватора. В действие приводится гидроцилиндром ковша.',
  'Коронки, адаптеры':
    'В наличии и под заказ широкий спектр запасных частей на спецтехнику различных серий и модификаций.',
  'Стрелы, рукояти':
    'Стандартное навесное оборудование необходимо для выполнения операций с грунтами средней плотности. ',
  'Оси, втулки':
    'Пальцы (оси) для экскаваторов строительного класса (эксплуатационной массой до 75 тонн) производятся из стали 40Х.',
  'Ходовая часть':
    'Прямые поставки комплектующих для спецтехники брендов KMF, ITM, USCO более 10 лет и всегда имеет большой ассортимент продукции в наличии на своих складах.',
};

const catergories = [
  'Ковши экскаваторные',
  'Бульдозерные отвалы',
  'Бетоноломы',
  'Коронки, адаптеры',
  'Стрелы, рукояти',
  'Оси, втулки',
  'Ходовая часть',
];

const photos = {
  'Ковши экскаваторные': 'kovsh',
  'Бульдозерные отвалы': 'otval',
  'Бетоноломы': 'betonolom',
  'Коронки, адаптеры': 'koron',
  'Стрелы, рукояти': 'arm',
  'Оси, втулки': 'osi',
  'Ходовая часть': 'hod',
};

const prices = {
  'Ковши экскаваторные': 6,
  'Бульдозерные отвалы': 6,
  'Бетоноломы': 6,
  'Коронки, адаптеры': 4,
  'Стрелы, рукояти': 7,
  'Оси, втулки': 4,
  'Ходовая часть': 7,
};

const imgs = {
  'arm-th.jpg': 'https://i.imgur.com/VCrzjYe.jpg',
  'arm1.jpg': 'https://i.imgur.com/hQkjGEx.jpg',
  'arm2.jpg': 'https://i.imgur.com/P2HvbTG.jpg',
  'arm3.jpg': 'https://i.imgur.com/AamO4HT.jpg',
  'betonolom-th.jpg': 'https://i.imgur.com/JX1zGof.jpg',
  'betonolom1.jpg': 'https://i.imgur.com/DlD18R7.jpg',
  'betonolom2.jpg': 'https://i.imgur.com/s5uE8G9.jpg',
  'betonolom3.jpg': 'https://i.imgur.com/jgE3ELW.jpg',
  'hod-th.jpg': 'https://i.imgur.com/ewuCfwC.jpg',
  'hod1.jpg': 'https://i.imgur.com/wcVOdDS.jpg',
  'hod2.jpg': 'https://i.imgur.com/Ujg8Uee.jpg',
  'koron-th.jpg': 'https://i.imgur.com/i92H2II.jpg',
  'koron1.jpg': 'https://i.imgur.com/iNi15LT.png',
  'koron2.jpg': 'https://i.imgur.com/Fu6vQuO.jpg',
  'kovsh-th.jpg': 'https://i.imgur.com/TAHhLzs.jpg',
  'kovsh1.jpg': 'https://i.imgur.com/ZqT5tBa.jpg',
  'kovsh2.jpg': 'https://i.imgur.com/wrHKJlY.jpg',
  'kovsh3.jpg': 'https://i.imgur.com/sVC1Nv9.jpg',
  'kovsh4.jpg': 'https://i.imgur.com/P3lwyYJ.jpg',
  'kovsh5.jpg': 'https://i.imgur.com/p03QHwR.jpg',
  'osi-th.jpg': 'https://i.imgur.com/cyO8AIx.jpg',
  'osi1.jpg': 'https://i.imgur.com/4kb2ISw.jpg',
  'osi2.jpg': 'https://i.imgur.com/rVutm8s.jpg',
  'otval-th.jpg': 'https://i.imgur.com/U0zfprB.jpg',
  'otval1.jpg': 'https://i.imgur.com/6Qf1pem.jpg',
  'otval2.jpg': 'https://i.imgur.com/qsOF72u.jpg',
};

async function write() {
  const res = [];
  for (let i = 1; i < 41; i++) {
    const category = catergories[random(0, 6)];
    const baseVehicle = baseV();
    const id = i;
    const thumbName = photos[category] + '-th.jpg';
    const obj = {
      id: id,
      title: title[category] + ' VM ' + baseVehicle[0],
      description: descriptions[category],
      price: price(prices[category]),
      stock: random(0, 12),
      baseVehicle: baseVehicle,
      category: category,
      thumbnail: imgs[thumbName],
      images: await insertImgs(category),
    };
    res.push(obj);
  }
  fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(res));
}
write();


async function insertImgs(category) {
  const res = [];
  const name = photos[category];
  const files = await fs.readdir(path.join(__dirname, '../assets/images/products'), { withFileTypes: true });
  for (let file of files) {
    if (file.name.includes(name) && !file.name.includes('th')) res.push(imgs[file.name]);
  }
  return res;
}

function price(digits) {
  let num = 10;
  digits > 2 ? (num = 100) : (num = 10);
  return Math.trunc(Math.abs(Math.random() - 1) * 100) * 10 ** (digits - 2);
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function baseV() {
  // const res = [];
  // for (let i = 0; i < random(3, 6); i++) {
  //   res.push(bases[random(0, 11)]);
  // }
  // return [...new Set(res)];
  return bases[random(0,11)]
}
