<template>
  <div>
    <div class="px-4 py-3 mb-5">
      <div class="row align-items-center justify-content-between">
        <h4 class="text-muted font-weight-normal m-0">Bid Configuration</h4>
        <action-button
          :disabled="actionButtonDisabled"
          :submitting="submitting"
          class="btn-success submit-button px-5"
          @click="submit"
        >
          Save
        </action-button>
      </div>
    </div>
    <transition-group name="fade">
      <div
        v-for="(error, index) in bidConfig.errors"
        :key="error + index"
        class="bid-config-error alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        <strong>{{ error.type }}!</strong>
        {{ error.message }}
      </div>
    </transition-group>
    <bid-config-table :disabled="submitting"></bid-config-table>
  </div>
</template>

<script>
  // Core
  import { actor } from '@/store/modules/dealer/constants'
  import { createNamespacedHelpers } from 'vuex'
  import { exists } from '@/utilities'

  // Components
  import BidConfigTable from '@/components/dealer/BidConfigTable'
  import ActionButton from '@/components/ActionButton'

  // Config
  const { mapActions, mapState } = createNamespacedHelpers('dealer')

  export default {
    name: 'DealershipPricingView',
    components: { ActionButton, BidConfigTable },
    data: () => ({
      submitting: false,
      value: 0
    }),
    methods: {
      ...mapActions([
        actor.GET_BID_OPTIONS,
        actor.GET_BID_CONFIGS,
        actor.POST_BID_CONFIGS,
        actor.VALIDATE_BID_CONFIG
      ]),
      onUnload(event) {
        // the method that will be used for both add and remove event
        // eslint-disable-next-line no-param-reassign
        event.returnValue = true
      },
      async submit() {
        this.submitting = true
        this[actor.VALIDATE_BID_CONFIG]()
        if (this.bidConfig.valid) {
          await this[actor.POST_BID_CONFIGS]()
          // On submit, remove the beforeunload event listener?
          window.removeEventListener('beforeunload', this.onUnload)
        }
        this.submitting = false
      }
    },
    computed: {
      ...mapState(['bidConfig']),
      actionButtonDisabled() {
        return !exists(this.bidConfig.configurations.updated)
      },
      // In order for a submit to be valid, each config object must have a non-null regular discount value and non-null bucket discount value
      invalidConfigs() {
        return this.bidConfig.configurations.updated.filter(
          configObj =>
            configObj.bucket_discount.value === null ||
            configObj.bucket_discount.length === 0 ||
            configObj.bucket_discount.value < 0 ||
            configObj.listing_discount.value === null ||
            configObj.listing_discount.value < 0 ||
            configObj.bucket_discount.value.length === 0
        )
      },
      missingListingDiscounts() {
        return this.invalidConfigs
          .map(configObj => configObj.listing_discount.value)
          .filter(x => x === null).length
      },
      missingBucketDiscounts() {
        return this.invalidConfigs
          .map(configObj => configObj.bucket_discount.value)
          .filter(x => x === null).length
      },
      missingListingDiscountMessage() {
        if (this.missingListingDiscounts > 0) {
          return 'Listing Discount must have a minimum value of $0'
        } else {
          return null
        }
      },
      missingBucketDiscountMessage() {
        if (this.missingBucketDiscounts > 0) {
          return 'Bucket Discount must have a minimum value of $0'
        } else {
          return null
        }
      }
    },
    mounted() {
      this[actor.GET_BID_OPTIONS]()
      this[actor.GET_BID_CONFIGS]()
    }
  }
</script>

<style scoped>
  .Illustration {
    max-width: 29.335rem;
  }
</style>
