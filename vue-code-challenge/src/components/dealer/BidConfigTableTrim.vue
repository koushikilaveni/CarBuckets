<template>
  <tr>
    <td></td>
    <td class="align-middle">{{ this.trim.name }}</td>
    <td class="align-middle">{{ this.msrp_display }}</td>
    <td class="align-middle">{{ this.invoice_display }}</td>
    <!--    <td>-->
    <!--      <label>-->
    <!--        <currency-input-->
    <!--            v-bind="{ currency: 'USD', precision: 0, distractionFree: true, valueAsInteger: true }"-->
    <!--            v-model.number="listing_discount"-->
    <!--            class="trim-listing-discount-value form-control form-control-sm"-->
    <!--            placeholder="Needs Price"-->
    <!--            :disabled="disabled"/>-->
    <!--      </label>-->
    <!--    </td>-->
    <!--    <td>-->
    <!--      <label>-->
    <!--        <select v-model="listing_discount_type"-->
    <!--                class="trim-listing-discount-type form-control form-control-sm p-0" :disabled="disabled">-->
    <!--          <option v-for="val in discountValuesConst" :value="val" :key="'listing'+val">{{ val }}</option>-->
    <!--        </select>-->
    <!--      </label>-->
    <!--    </td>-->
    <!--    <td class="trim-listing-discount-min-price align-middle"> {{ min_listing_price }}</td>-->
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
          class="trim-bucket-discount-value form-control form-control-sm"
          placeholder="Needs Price"
          :disabled="disabled"
        />
      </label>
    </td>
    <td>
      <label>
        <select
          v-model="bucket_discount_type"
          class="trim-bucket-discount-type form-control form-control-sm p-0"
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
    <td class="trim-bucket-discount-min-price align-middle">
      {{ min_bucket_price }}
    </td>
  </tr>
</template>
<script>
  import { exists } from '@/utilities'
  import _currency from 'currency.js'

  export default {
    name: 'BidConfigTableTrim',
    props: {
      trim: Object,
      configuration: Object,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    inject: ['buildConfigObject', 'computeMinPrice', 'discountValuesConst'],
    computed: {
      msrp_display() {
        return _currency(this.trim.msrp, { precision: 0 }).format(true)
      },
      invoice_display() {
        return _currency(this.trim.invoice, { precision: 0 }).format(true)
      },
      listing_discount_type: {
        get: function () {
          return this.getDiscountType('listing_discount')
        },
        set: function (discountType) {
          this.setValue('listing_discount', discountType, this.listing_discount)
        }
      },
      listing_discount: {
        get: function () {
          return this.getDiscount('listing_discount')
        },
        set: function (newValue) {
          this.setValue('listing_discount', null, newValue)
        }
      },
      bucket_discount_type: {
        get: function () {
          return this.getDiscountType('bucket_discount')
        },
        set: function (discountType) {
          this.setValue('bucket_discount', discountType, this.bucket_discount)
        }
      },
      bucket_discount: {
        get: function () {
          return this.getDiscount('bucket_discount')
        },
        set: function (newValue) {
          this.setValue('bucket_discount', null, newValue)
        }
      },
      min_listing_price() {
        return this.computeMinPrice(
          'listing_discount',
          this.trim.invoice,
          this.trim.msrp
        )
      },
      min_bucket_price() {
        return this.computeMinPrice(
          'bucket_discount',
          this.trim.invoice,
          this.trim.msrp
        )
      }
    },
    created() {}, // ['trim', 'configuration'],
    methods: {
      getDiscountType(name) {
        const hasValue =
          this.configuration &&
          this.configuration[name] &&
          this.configuration[name].type
        if (!hasValue) return '% Off MSRP'
        return (
          this.configuration[name].type + ' Off ' + this.configuration[name].ref
        )
      },
      getDiscount(name) {
        if (!exists(this.configuration)) return null
        return this.configuration[name].value
      },
      setValue(name, type, value) {
        const newConfigValue = this.buildConfigObject(name, type, value)
        this.$emit('update-config', {
          ...newConfigValue,
          style_id: this.trim.style_id
        })
      }
    }
  }
</script>
<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
</style>
