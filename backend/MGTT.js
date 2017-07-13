const log = new (require('./logger'))('World')
const Sequelize = require('sequelize')
const fetchModels = require('./models')
const fetchApis = require('./api')

class MGTT {
  constructor (router, io, app) {
    this.router = router
    this.io = io
    this.ctx = app.context || {}

    this.ctx.io = io
    this.__app = app

    if (log.debugOn) log.warn('debug mode is on')

    this.__initialized = this._mountServices()
  }

  async awaitServices () {
    await this.__initialized
  }

  async _mountServices () {
    const sequelize = new Sequelize(process.env.DB_URL, { logging: log.sql.bind(log, log) })
    this.ctx.sql = sequelize
    this.M = fetchModels(sequelize)
    this.ctx.M = this.M
    await sequelize.sync()

    this.ctx.redis = new (require('ioredis'))({
      port: process.env.REDIS_PORT || '6379',
      host: process.env.REDIS_HOST || 'localhost',
      parser: 'hiredis',
      dropBufferSupport: true,
      enableReadyCheck: true,
      enableOfflineQueue: true
    })

    this.ctx.stats = new (require('./services/stats'))(this.ctx)
  }

  async mountRoutes () {
    fetchApis(this.router)
    this.__app.use(this.router.middleware())
  }
}

module.exports = MGTT
