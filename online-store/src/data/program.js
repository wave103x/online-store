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
  'Бетоноломы': "Бетонолом",
  'Коронки, адаптеры': "Система зубьев",
  'Стрелы, рукояти': "Рабочее оборудование",
  'Оси, втулки': "Оси, пальцы втулки",
  'Ходовая часть': "Гусеничная цепь",
}

const descriptions = {
  'Ковши экскаваторные': 'Ковш применяется для разработки котлованов, карьеров в грунтах I-IV категорий и разгрузки сыпучих материалов, плотность до 1600 кг/м3 (песок, суглинок, растительный грунт, щебень).',
  'Бульдозерные отвалы': 'Отвал – ключевой механизм любой бульдозерной машины. Изготовленный из стали повышенной прочности и имеющий изогнутый эргономичный профиль основной рабочий инструмент дает возможность быстро выполнять задачи различной сложности во время строительно-дорожных, коммунальных и других работ.',
  'Бетоноломы': 'Оборудование состоят из двух челюстей и крепится к рукояти экскаватора. В действие приводится гидроцилиндром ковша.',
  'Коронки, адаптеры': 'В наличии и под заказ широкий спектр запасных частей на спецтехнику различных серий и модификаций.',
  'Стрелы, рукояти': 'Стандартное навесное оборудование необходимо для выполнения операций с грунтами средней плотности. ',
  'Оси, втулки': 'Пальцы (оси) для экскаваторов строительного класса (эксплуатационной массой до 75 тонн) производятся из стали 40Х.',
  'Ходовая часть': 'Прямые поставки комплектующих для спецтехники брендов KMF, ITM, USCO более 10 лет и всегда имеет большой ассортимент продукции в наличии на своих складах.',
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
  Бетоноломы: 'betonolom',
  'Коронки, адаптеры': 'koron',
  'Стрелы, рукояти': 'arm',
  'Оси, втулки': 'osi',
  'Ходовая часть': 'hod',
};

const prices = {
  'Ковши экскаваторные': 6,
  'Бульдозерные отвалы': 6,
  Бетоноломы: 6,
  'Коронки, адаптеры': 4,
  'Стрелы, рукояти': 7,
  'Оси, втулки': 4,
  'Ходовая часть': 7,
};

async function write() {
  const res = [];
  for (let i = 1; i < 41; i++) {
    const category = catergories[random(0, 6)];
    const baseVehicle = baseV()
    const id = i;
    const obj = {
      id: id,
      title: title[category] + ' VM ' + baseVehicle[0],
      description: descriptions[category],
      price: price(prices[category]),
      stock: random(0, 12),
      baseVehicle: baseVehicle,
      category: category,
      thumbnail: '../assets/images/products'+ photos[category] + '-th.jpg',
      images: await insertImgs(category)
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
    if (file.name.includes(name) && !file.name.includes('th')) res.push('../assets/images/products' + file.name)
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
  const res = [];
  for (let i = 0; i < random(3, 6); i++) {
    res.push(bases[random(0, 11)]);
  }
  return [...new Set(res)];
}
