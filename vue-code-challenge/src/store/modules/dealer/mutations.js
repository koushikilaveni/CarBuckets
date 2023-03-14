import { mutator } from './constants'
import { findIndex } from 'lodash/array'

export default {
  [mutator.SET_ERRORS_FOR](state, { view, errors }) {
    state.meta[view].errors = errors
  },
  [mutator.RESET_ERRORS_FOR](state, view) {
    state.meta[view].errors = []
  },
  [mutator.SET_LOADING_FOR](state, { view, status }) {
    state.meta[view].loading = status
  },
  [mutator.SET_UPDATED_BID_CONFIGS](state, bidConfigs) {
    state.bidConfig.configurations.updated = bidConfigs
  },
  [mutator.SET_CURRENT_BID_CONFIGS](state, bidConfigs) {
    state.bidConfig.configurations.current = [...bidConfigs]
  },
  [mutator.SET_BID_CONFIG_OPTIONS](state, options) {
    state.bidConfig.options = options
  },
  [mutator.SET_BID_CONFIG_ERRORS](state, errors = []) {
    state.bidConfig.errors = [...state.bidConfig.errors, ...errors]
  },
  [mutator.CLEAR_BID_CONFIG_ERRORS](state) {
    state.bidConfig.errors = []
  },
  [mutator.SET_BID_CONFIG_VALIDITY](state, validity) {
    state.bidConfig.valid = validity
  },
  [mutator.SET_DEALS](state, deals) {
    state.deals = deals
  },
  [mutator.SET_LEADS](state, leads) {
    state.leads = leads
  },
  [mutator.UPDATE_LEAD](state, lead) {
    state.leads = [lead, ...state.leads.filter(item => item.id !== lead.id)]
  },
  [mutator.REMOVE_LEAD](state, id) {
    const index = state.leads.findIndex(l => l.id === id)
    state.leads = state.leads.splice(index, 1)
  },
  [mutator.SET_CREDIT_TIERS](state, creditTiers) {
    state.creditTiers = creditTiers
  },
  [mutator.SET_DEALERSHIPS](state, dealerships) {
    state.dealerships = dealerships
  },
  [mutator.UPDATE_DEALERSHIP](state, { id, dealership }) {
    const index = findIndex(state.dealerships, ['id', id])
    state.dealerships[index] = dealership
  },
  [mutator.SET_BIDS](state, bids) {
    state.bids = bids
  },
  [mutator.UPDATE_BID](state, bid) {
    state.bids = [...state.bids.filter(item => item.id !== bid.id), bid]
  },
  // eslint-disable-next-line camelcase
  [mutator.UPDATE_BID_TEMP_OFFERS](state, { id, temp_offers }) {
    const index = findIndex(state.bids, ['id', id])
    const bid = { ...state.bids[index], temp_offers }
    state.bids = [...state.bids.filter(item => item.id !== id), bid]
  },
  [mutator.SET_OPTIONS](state, options) {
    state.options = options
  }
}
