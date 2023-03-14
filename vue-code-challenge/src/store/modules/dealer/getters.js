import { get } from './constants'

export default {
  [get.BID_CONFIG_BY_STYLE_ID]: (state, getters) => styleID => {
    return (
      getters[get.UPDATED_BID_CONFIG_BY_STYLE_ID](styleID) ||
      getters[get.CURRENT_BID_CONFIG_BY_STYLE_ID](styleID)
    )
  },
  [get.CURRENT_BID_CONFIG_BY_STYLE_ID]: state => styleID => {
    return state.bidConfig.configurations.current.find(
      configuration => configuration.style_id === styleID
    )
  },
  [get.UPDATED_BID_CONFIG_BY_STYLE_ID]: state => styleID => {
    return state.bidConfig.configurations.updated.find(
      configuration => configuration.style_id === styleID
    )
  },
  [get.LEAD_BY_ID]: state => id => {
    return state.leads.find(lead => lead.id === id)
  }
}
