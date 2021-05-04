const server = require('./server')

const onAppInitListeningAddons = []
const onAppStartListeningAddons = []

const addons = [ // addons
  'IpQuotesRandom'
  // 'IpQuoteStatic'
]

addons.forEach(addonId => {
  const addon = require(`./addons/${addonId}`)
  switch (addon.info.on) {
    case 'app-start-listening':
      onAppStartListeningAddons.push(addon)
      break
    default:
      onAppInitListeningAddons.push(addon)
  }
})

server(
  82, // event emmiter max listeners
  { prefix: 'db/', adapter: 'websql' }, // PouchDb Options
  {
    // cors options
    credentials: true,
    origin: [
      'https://serge-dev.herokuapp.com',
      'https://serge-review-trial-test-*.herokuapp.com',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:6611',
      'http://localhost:8000'
    ]
  },
  './db', // database directory
  './img', // images directory
  '',
  process.env.PORT || 8080, // port
  null, // remote server path
  onAppInitListeningAddons,
  onAppStartListeningAddons
)
