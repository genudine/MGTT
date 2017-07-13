const Service = require('./Service')
const superagent = require('superagent')
const { Map } = require('immutable')

const ENDPOINT = `http://census.daybreakgames.com/s:${process.env.SERVICE_ID}/get/ps2:v2/character/?character_id=`

class CharacterService extends Service {
  async byID () {
    
  }
}

module.exports = CharacterService
