import v1 from '@/api/v1'
import { actor, get, mutator } from './constants'
import { errorHandler, exists } from '@/utilities'

export default {
  async [actor.GET_BID_CONFIGS]({ commit }) {
    try {
      const configs = await v1.getBidConfigs()
      console.dir(configs)
      commit(mutator.SET_CURRENT_BID_CONFIGS, configs)
    } catch (e) {
      errorHandler(e)
    }
  },
  async [actor.GET_BID_OPTIONS]({ commit }) {
    try {
      const options = await v1.getBidOptions()
      commit(mutator.SET_BID_CONFIG_OPTIONS, options)
    } catch (e) {
      errorHandler(e)
    }
  },
  async [actor.POST_BID_CONFIGS]({ commit, dispatch, state }) {
    const updated = state.bidConfig.configurations.updated
    try {
      commit(mutator.CLEAR_BID_CONFIG_ERRORS)
      updated.map(async config => {
        await v1.postBidConfigs(config)
      })
      dispatch(actor.GET_BID_CONFIGS)
    } catch (e) {
      commit(mutator.SET_BID_CONFIG_ERRORS, [
        { type: 'Network Error', message: e.message }
      ])
      errorHandler(e)
    }
  },
  [actor.VALIDATE_BID_CONFIG]({ commit, state }) {
    // Clear old errors
    commit(mutator.CLEAR_BID_CONFIG_ERRORS)
    // Updated config objects which have a bucket discount value of null, or empty string
    const invalidConfigs = state.bidConfig.configurations.updated.filter(
      configObj => {
        return (
          !exists(configObj.bucket_discount.value) ||
          !exists(configObj.listing_discount.value)
        )
      }
    )
    // let missingListingDiscounts = invalidConfigs.map(configObj => configObj.listing_discount.value).filter(x => null === x || '' === x).length
    const missingBucketDiscounts = invalidConfigs
      .map(configObj => configObj.bucket_discount.value)
      .filter(x => x === null || x === '').length

    const errors = []
    // if (0 < missingListingDiscounts) {
    //   let missingListingDiscountError = 'Listing Discount must have a minimum value of $0'
    //   errors.push(missingListingDiscountError)
    // }
    if (missingBucketDiscounts > 0) {
      const missingBucketDiscountError =
        'Bucket Discount must have a minimum value of $0'
      errors.push(missingBucketDiscountError)
    }
    if (errors.length > 0) {
      errors.forEach(function (error) {
        commit(mutator.SET_BID_CONFIG_ERRORS, [
          { type: 'Missing Inputs', message: error }
        ])
      })
      commit(mutator.SET_BID_CONFIG_VALIDITY, false)
    } else {
      commit(mutator.SET_BID_CONFIG_VALIDITY, true)
    }
  },
  [actor.UPDATE_BID_CONFIG_BY_STYLES]({ dispatch }, values) {
    for (const styleID of values.styles) {
      dispatch(actor.UPDATE_BID_CONFIG_BY_STYLE_ID, {
        style_id: styleID,
        ...values.value
      })
    }
  },
  [actor.UPDATE_BID_CONFIG_BY_STYLE_ID](
    { commit, getters, state, dispatch },
    values
  ) {
    // Find by config by style id
    // Config is undefined when updating a value in a config object which was not initially in current
    const config = getters[get.BID_CONFIG_BY_STYLE_ID](values.style_id)

    // Create new object
    const newConfig = {
      ...{
        id: null,
        style_id: null,
        listing_discount: { ref: null, type: null, value: null },
        bucket_discount: { ref: null, type: null, value: null }
      },
      ...config,
      ...values,
      ...{
        id: Date.now()
      }
    }

    const updatedConfigIndex = state.bidConfig.configurations.updated.indexOf(
      config
    )

    if (updatedConfigIndex === -1) {
      commit(mutator.SET_UPDATED_BID_CONFIGS, [
        ...state.bidConfig.configurations.updated,
        newConfig
      ])
    } else {
      commit(
        mutator.SET_UPDATED_BID_CONFIGS,
        state.bidConfig.configurations.updated
          .filter((e, i) => i !== updatedConfigIndex)
          .concat(newConfig)
      )
    }

    dispatch(actor.CLEAR_NULL_BID_CONFIGS)
  },
  [actor.CLEAR_NULL_BID_CONFIGS]({ state, commit }) {
    const updatedBidConfigs = state.bidConfig.configurations.updated

    const bidConfigsNoNullDiscounts = updatedBidConfigs.filter(configObj => {
      return (
        exists(configObj.bucket_discount.value) ||
        exists(configObj.listing_discount.value)
      )
    })

    commit(mutator.SET_UPDATED_BID_CONFIGS, [...bidConfigsNoNullDiscounts])
  },

  [actor.HANDLE_ERROR](context, error) {
    errorHandler(error)
  }
}
