// Conexión a MongoDB Atlas + contenido semilla.
//
// Base de datos externa (no un archivo local) desde el arranque: Hostinger no garantiza
// que los archivos que la app escribe en su propio disco sobrevivan a un redeploy, así
// que directamente arrancamos con Atlas (lección aprendida en el proyecto de Celine).
//
// No hay tablas relacionadas entre sí, así que cada "tabla" es una colección de Mongo
// tal cual, sin necesidad de traducir ningún esquema SQL.

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    'Falta la variable de entorno MONGODB_URI (el connection string de MongoDB Atlas). ' +
    'Copiá .env.example a .env y completala antes de arrancar el servidor.'
  );
}

const client = new MongoClient(uri);
let db = null;

function getDb() {
  if (!db) throw new Error('La base de datos todavía no está conectada. Llamá a connect() primero.');
  return db;
}

async function connect() {
  await client.connect();
  db = client.db();
  await ensureIndexes();
  await seedIfEmpty();
  console.log('Conectado a MongoDB Atlas.');
}

async function ensureIndexes() {
  await db.collection('gallery_images').createIndex({ position: 1 });
  await db.collection('social_links').createIndex({ position: 1 });
  await db.collection('contact_messages').createIndex({ created_at: -1 });
}

// --- Contenido semilla (texto real tomado de eventoscandilejas.com.ar) ---
const DEFAULT_CONTENT = {
  site_name: 'Eventos Candilejas',
  site_tagline: 'Organización Integral de Eventos',

  nav_home_label: 'Inicio',
  nav_nosotros_label: 'Quiénes Somos',
  nav_servicios_label: 'Servicios',
  nav_sociales_label: 'Eventos Sociales',
  nav_empresariales_label: 'Eventos Empresariales',
  nav_contacto_label: 'Contacto',

  banner_image: '/img/seed/banner.jpg',
  banner_title: 'Eventos Candilejas',
  banner_subtitle: 'Organización integral de eventos sociales y empresariales, a tu medida.',

  proximo_evento_enabled: '0',
  proximo_evento_label: 'Próximo evento',
  proximo_evento_text: '',
  proximo_evento_media_type: 'image',
  proximo_evento_image: '',
  proximo_evento_video_url: '',
  proximo_evento_vertical: '0',

  nosotros_heading: 'Quiénes Somos',
  nosotros_text: [
    'Somos una empresa dedicada al asesoramiento, elaboración de presupuestos, planificación y realización de eventos empresariales y sociales.',
    'Lo hacemos junto a personas y empresas que nos permiten desarrollar los eventos acordes a cada cliente, y con presupuestos flexibles. Personalizamos el evento haciendo de este un momento de encuentro para compartir y disfrutar.',
    'Orientamos en la elección de cada servicio, ofreciendo en cada uno de ellos diferentes alternativas para satisfacer los requerimientos personales y empresariales, brindando calidad y creatividad.'
  ].join('\n\n'),

  servicios_heading: 'Nuestros Servicios',
  servicios_intro: 'Eventos Candilejas ofrece una variedad de servicios y propuestas para la realización de eventos sociales y empresariales, haciendo de estos momentos únicos, de encuentro, para compartir y disfrutar.',
  servicios_catering_heading: 'Servicios de Catering',
  servicios_catering_text: 'Catering completo · Catering temático · Catering light / dietético · Asados · Pasta / crêpes party · Pizza party · Waffles party · Coffee breaks · Lunch · Recepciones buffet · Picadas / tablas · Finger food · Brunch · Mesa dulce · Candy bar · Aperitivos · Vino de honor · Catering de bebidas · Barras de tragos',
  servicios_espacios_heading: 'Espacios donde brindamos nuestros servicios',
  servicios_espacios_text: 'Salones · Residencias · Hoteles · Boliches · Pubs · Restaurants · Quintas · Estancias · Clubes · Centros de convenciones · Salas para capacitación · Complejos recreativos con actividades de aventura · Espacios particulares, empresas, oficinas, instituciones, casas, SUM, etc.',
  servicios_otros_heading: 'Otros Servicios',
  servicios_otros_text: 'DJ, sonido e iluminación · Foto y video · Animación / entretenimientos · Locución · Shows y promotoras · Ramos y tocados · Make up / maquillaje artístico · Diseñadores de vestidos · Estilista personal · Invitaciones / tarjetería · Ambientación · Cotillón temático · Regalos empresariales / souvenirs / lista de regalos · Merchandising · Transporte · Autos antiguos / remises · Carpas / gazebos · Valet parking · Seguridad · Viajes / luna de miel',

  sociales_heading: 'Eventos Sociales',
  sociales_text: [
    'Celebrar es una necesidad del alma, que no debemos suprimir, simplemente adaptar.',
    'Para quienes están soñando con ese momento mágico de sus vidas, Eventos Candilejas brinda el especial servicio de party planner y wedding planner, acompañando y asesorando en la elección de cada servicio, jerarquizando los gustos.',
    'Realizamos los eventos en nuestros propios espacios y también llevamos los servicios a domicilios particulares, casas, SUM, etc.',
    'Es nuestro compromiso brindar, en cada atención, calidad, cortesía y calidez.'
  ].join('\n\n'),
  sociales_tipos: 'Bautismo · Comunión · Cumpleaños de 15 · Casamientos · Agasajos · Aniversarios · Banquetes · Graduaciones · Homenajes · Despedidas · Bienvenidas · Inauguraciones · Reuniones sociales · Fiestas de egresados · Fiestas temáticas · Fiestas conmemorativas · Fiestas familiares',

  empresariales_heading: 'Eventos Empresariales',
  empresariales_text: [
    'Los eventos jerarquizan a las empresas, otorgándoles una excelente herramienta de comunicación y comercialización.',
    'Nuestro servicio de event planner brinda soluciones, permitiendo facilitar la elección y contratación de los servicios, valorizando el tiempo, respetando los requerimientos y presupuestos.',
    'Realizamos los eventos en nuestros propios espacios y también llevamos los servicios a domicilios comerciales, edificios empresariales, instituciones, etc.',
    'Es nuestro compromiso brindar, en cada atención, calidad, cortesía y calidez.'
  ].join('\n\n'),
  empresariales_tipos: 'Eventos para público interno y externo · Jornadas de capacitación · Talleres corporativos · Agasajos · Despedidas · Bienvenidas · Homenajes · Banquetes · Aniversarios · Inauguraciones · Eventos largos · Entrega de premios · Desayunos de trabajo · Almuerzos empresariales · Fiestas empresariales · Encuentros corporativos · Fiestas de fin de año · Fiestas institucionales · Open house · Actividades motivacionales · Fiestas anuales · Family day · Presentaciones · Actividades culturales, sociales, educativas y deportivas',

  contact_heading: 'Contacto',
  contact_subheading: 'Contanos sobre tu evento y te ayudamos a organizarlo.',
  contact_email: 'eventos@ecandilejas.com.ar',
  contact_phone: '(011) 4932-7622',
  contact_phone_2: '15-6528-7802',

  footer_text: 'Eventos Candilejas',

  pdf_label: '',
  pdf_url: ''
};

// Fotos reales del sitio actual de Eventos Candilejas, cargadas a pedido de Hugo para
// que la demo no se vea vacía ("sin fotos no dice nada") - se van a reemplazar por fotos
// propias del cliente más adelante.
const DEFAULT_GALLERY = [
  { url: '/img/seed/galeria-1.jpg', alt_text: 'Brindis en un evento' },
  { url: '/img/seed/galeria-2.jpg', alt_text: 'Encuentro social' },
  { url: '/img/seed/galeria-3-empresariales.jpg', alt_text: 'Evento empresarial' },
  { url: '/img/seed/galeria-4-servicios.jpg', alt_text: 'Servicio de catering' },
  { url: '/img/seed/galeria-5-sociales.jpg', alt_text: 'Evento social' }
];

const DEFAULT_SOCIAL = [];

async function seedIfEmpty() {
  const contentDoc = await db.collection('content').findOne({ _id: 'main' });
  if (!contentDoc) {
    await db.collection('content').insertOne({ _id: 'main', ...DEFAULT_CONTENT });
  } else {
    const missing = {};
    for (const [key, value] of Object.entries(DEFAULT_CONTENT)) {
      if (!(key in contentDoc)) missing[key] = value;
    }
    if (Object.keys(missing).length > 0) {
      await db.collection('content').updateOne({ _id: 'main' }, { $set: missing });
    }
  }

  const galleryCount = await db.collection('gallery_images').countDocuments();
  if (galleryCount === 0) {
    await db.collection('gallery_images').insertMany(
      DEFAULT_GALLERY.map((item, i) => ({ ...item, position: i }))
    );
  }

  const socialCount = await db.collection('social_links').countDocuments();
  if (socialCount === 0 && DEFAULT_SOCIAL.length > 0) {
    await db.collection('social_links').insertMany(
      DEFAULT_SOCIAL.map((item, i) => ({ ...item, visible: true, position: i }))
    );
  }

  const adminDoc = await db.collection('admin_user').findOne({ _id: 'admin' });
  if (!adminDoc) {
    const password = process.env.ADMIN_PASSWORD || 'cambiar-esta-clave';
    const hash = bcrypt.hashSync(password, 10);
    await db.collection('admin_user').insertOne({ _id: 'admin', password_hash: hash });
    if (!process.env.ADMIN_PASSWORD) {
      console.warn(
        '[aviso] No hay ADMIN_PASSWORD en .env: se creó el usuario admin con la clave por defecto ' +
        '"cambiar-esta-clave". Copiá .env.example a .env y definí una clave propia antes de publicar el sitio.'
      );
    }
  }
}

module.exports = { connect, getDb, ObjectId };
