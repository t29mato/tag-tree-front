const environment = process.env.NODE_ENV || 'development'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'user-front',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/vuetify',
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    ['@nuxtjs/dotenv', { filename: `.env.${environment}` }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-basic-auth-module',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  basic: {
    name: process.env.BASIC_AUTH_USERNAME || 'admin',
    pass: process.env.BASIC_AUTH_PASSWORD || 'admin',
    enabled: process.env.BASIC_AUTH_IS_ENABLED === 'true',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:8000',
    headers: {
      common: {
        'Content-Type': 'application/vnd.api+json',
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  router: {
    middleware: ['auth'],
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: false,
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: false,
          // autoFetch: true
        },
        endpoints: {
          login: {
            url: '/api/auth/jwt/create/',
            method: 'post',
          },
          user: false,
        },
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/',
    },
  },
}
