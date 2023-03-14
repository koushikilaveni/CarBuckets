import axios from 'axios'

const base = 'api'
const host = 'http://localhost:8888'
const version = 'v1'
const endpoint = resource => `${host}/${base}/${version}/${resource}`

/**
 * Wrapper for axios.
 * @param {string} action   - Action for axios
 * @param {string} resource - Endpoint to use
 * @param {(* | null)} [payload = null] - Data to post
 * @param {(* | null)} [config = null] - Config Axios
 */
export async function fetch(action, resource, payload = null, config = null) {
  const response = await axios[action](resource, payload, config)
  return response.data
}

export default {
  async getBidOptions() {
    return fetch('get', endpoint('bid/config/options'))
  },
  async getBidConfigs() {
    return fetch('get', endpoint('bid/config/index'))
  },
  async postBidConfigs(data) {
    return fetch('post', endpoint('bid/config/index'), data)
  }
}
