<template>
  <tr :id="componentId" class="config-model table-secondary">
    <td
      class="can-toggle font-weight-bold align-middle"
      @click="$emit('toggle-hide', option.year + option.model)"
    >
      {{ option.year }}
    </td>
    <td
      class="can-toggle font-weight-bold align-middle"
      @click="$emit('toggle-hide', option.year + option.model)"
    >
      <div class="d-flex justify-content-between align-items-center">
        {{ option.model }}&nbsp;
        <strong>{{ toggled ? '+' : '–' }}</strong>
      </div>
    </td>
    <td></td>
    <td></td>
    <!--    <td>-->
    <!--      <label>-->
    <!--        <currency-input-->
    <!--            v-bind="{ currency: 'USD', precision: 0, distractionFree: true, valueAsInteger: true }"-->
    <!--            v-model.number="listing_discount"-->
    <!--            class="model-listing-discount-value form-control form-control-sm"-->
    <!--            :placeholder="listing_placeholder"-->
    <!--            :disabled="disabled"/>-->
    <!--      </label>-->
    <!--    </td>-->
    <!--    <td>-->
    <!--      <label>-->
    <!--        <select v-model="listing_discount_type"-->
    <!--                class="model-listing-discount-type form-control form-control-sm p-0" :disabled="disabled" >-->
    <!--          <option v-for="val in discountValuesConst" :value="val" :key="'listing'+val">{{ val }}</option>-->
    <!--        </select>-->
    <!--      </label>-->
    <!--    </td>-->
    <!--    <td></td>-->
    <td>
      <label>
        <currency-input
          v-model.number="bucket_discount"
          v-bind="{
            currency: 'USD',
            precision: 0,
            distractionFree: true,
            valueAsInteger: true
          }"
          class="model-bucket-discount-value form-control form-control-sm"
          :placeholder="bucket_placeholder"
          :disabled="disabled"
        />
        <!-- <input
          v-model.number="bucket_discount"
          v-bind="{
            currency: 'USD',
            precision: 0,
            distractionFree: true,
            valueAsInteger: true
          }"
          class="model-bucket-discount-value form-control form-control-sm"
          :placeholder="bucket_placeholder"
          :disabled="disabled"
        />-->
      </label>
    </td>
    <td>
      <label>
        <select
          v-model="bucket_discount_type"
          class="model-bucket-discount-type form-control form-control-sm p-0"
          :disabled="disabled"
        >
          <option
            v-for="val in discountValuesConst"
            :key="'bucket' + val"
            :value="val"
          >
            {{ val }}
          </option>
        </select>
      </label>
    </td>
    <td></td>
  </tr>
</template>

<script>
  // TODO: If the user select % discount type,
  // the inputs need to change from currency to % input

  // Core
  import { actor, get } from '@/store/modules/dealer/constants'
  import { createNamespacedHelpers } from 'vuex'
  import { exists } from '@/utilities'
  // Components
  // import BidConfigTableTrim from '@/components/dealer/BidConfigTableTrim'

  // Config
  const { mapActions, mapGetters } = createNamespacedHelpers('dealer')

  export default {
    name: 'BidConfigTableModel',
    props: {
      toggled: { type: Boolean, default: false },
      option: { default: [] },
      configurations: { default: [] },
      optionOrConfig: { default: () => ({}) },
      disabled: { type: Boolean, default: false }
    },
    data() {
      return {
        listing_discount_value: null,
        bucket_discount_value: null,
        listing_discount_type_value: '% Off MSRP',
        bucket_discount_type_value: '% Off MSRP'
      }
    },
    inject: ['buildConfigObject', 'computeMinPrice', 'discountValuesConst'],
    computed: {
      ...mapGetters([get.BID_CONFIG_BY_STYLE_ID]),
      componentId() {
        return this.option.year + this.option.model + 'Model'
      },
      listing_placeholder() {
        if (
          !exists(this.configurations) ||
          this.configurations
            .map(config => config.listing_discount.value)
            .every(val => !exists(val))
        )
          return 'Needs Price'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.listing_discount_value = null
        return 'Mixed Values'
      },
      bucket_placeholder() {
        if (
          !exists(this.configurations) ||
          this.configurations
            .map(config => config.bucket_discount.value)
            .every(val => !exists(val))
        )
          return 'Needs Price'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.bucket_discount_value = null
        return 'Mixed Values'
      },
      styles() {
        return this.option.trims.map(trim => trim.style_id)
      },
      listing_discount_type: {
        get: function () {
          return this.getDiscountType('listing_discount')
        },
        set: function (discountType) {
          if (!exists(this.listing_discount)) return
          this.setValue('listing_discount', discountType, this.listing_discount)
        }
      },
      listing_discount: {
        get: function () {
          return this.getDiscount('listing_discount')
        },
        set: function (newValue) {
          this.setValue(
            'listing_discount',
            this.listing_discount_type,
            newValue
          )
        }
      },
      bucket_discount_type: {
        get: function () {
          return this.getDiscountType('bucket_discount')
        },
        set: function (discountType) {
          if (!exists(this.bucket_discount)) return
          this.setValue('bucket_discount', discountType, this.bucket_discount)
        }
      },
      bucket_discount: {
        get: function () {
          return this.getDiscount('bucket_discount')
        },
        set: function (newValue) {
          this.setValue('bucket_discount', this.bucket_discount_type, newValue)
        }
      }
    },
    methods: {
      ...mapActions([actor.UPDATE_BID_CONFIG_BY_STYLE_ID]),
      getDiscountType(name) {
        const hasConfigs = exists(this.configurations)
        const types = this.configurations.map(config => config[name].type)
        const refs = this.configurations.map(config => config[name].ref)
        if (
          hasConfigs &&
          types.every((val, i, arr) => val === arr[0]) &&
          refs.every((val, i, arr) => val === arr[0]) &&
          types[0] !== null &&
          refs[0] !== null &&
          types.length === this.option.trims.length
        )
          return types[0] + ' Off ' + refs[0]
        return this[name + '_type_value']
      },
      getDiscount(name) {
        const hasConfigs = exists(this.configurations)
        const values = this.configurations.map(config => config[name].value)
        const typeRefs = this.configurations.map(
          config => config[name].type + config[name].ref
        )
        if (
          hasConfigs &&
          values.every((val, i, arr) => val === arr[0]) &&
          typeRefs.every((val, i, arr) => val === arr[0]) &&
          values.length === this.option.trims.length
        )
          return values[0]
        return this[name + '_value']
      },
      updateConfig(value) {
        this[actor.UPDATE_BID_CONFIG_BY_STYLE_ID](value)
      },
      findConfiguration(styleId) {
        return this[get.BID_CONFIG_BY_STYLE_ID](styleId)
      },
      setValue(name, type, value) {
        this[name + '_value'] = value
        this[name + '_type_value'] = type
        const newConfigValue = this.buildConfigObject(name, type, value)
        this.$emit('update-config-many', {
          value: newConfigValue,
          styles: this.styles
        })
      }
    }
  }
</script>

<style scoped>
  .can-toggle {
    cursor: pointer;
  }
  select {
    background: rgba(0, 0, 0, 0);
    color: black;
    border: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }
</style>
