<template>
  <div class="table-responsive position-relative bg-white rounded">
    <table class="table table-bordered table-hover fixed table-sm">
      <thead>
        <tr class="bg-primary">
          <th colspan="4" class="px-3 text-white font-weight-normal">
            Vehicle
          </th>
          <!--<th colspan="3" class="px-3 text-white font-weight-normal">Advertised Price</th>-->
          <th colspan="3" class="px-3 text-white font-weight-normal">
            Buckets Price
          </th>
        </tr>
        <tr class="config-titles">
          <th @click="sortBy('year')">
            <div
              class="d-flex align-items-center justify-content-between text-center"
            >
              Year
              {{ displayArrow('year') }}
            </div>
          </th>
          <th @click="sortBy('model')">
            <div
              class="d-flex align-items-center justify-content-between text-center"
            >
              &nbsp;Model
              {{ displayArrow('model') }}
            </div>
          </th>
          <th class="text-center">MSRP</th>
          <th class="text-center">Invoice</th>
          <!--<th class="text-center">Discount</th>-->
          <!--<th class="text-center">Discount&nbsp;Type</th>-->
          <!--<th class="text-center">MAAP</th>-->
          <th class="text-center">Discount</th>
          <th class="text-center">Discount&nbsp;Type</th>
          <th class="text-center">Final Price</th>
        </tr>
      </thead>
      <bid-config-table-loader v-if="!hasOptions" :cols="10" />
      <tbody is="transition-group" name="fade" class="bid-config-table">
        <template v-for="option in sortedOptions">
          <bid-config-table-model
            :key="option.year + option.model"
            :option="option"
            :configurations="getConfigurations(option)"
            :toggled="modelHidden(option.year + option.model)"
            :disabled="disabled"
            @toggle-hide="toggle"
            @update-config-many="updateConfigMany"
          />
          <bid-config-table-trim
            v-for="trim in option.trims"
            v-show="!modelHidden(option.year + option.model)"
            :key="option.model + trim.style_id"
            :trim="trim"
            :configuration="findConfiguration(trim.style_id)"
            :data-model="option.year + option.model"
            :disabled="disabled"
            @update-config="updateConfig"
          />
        </template>
      </tbody>
    </table>
  </div>
</template>
<script>
  // Core
  import { actor, get } from '@/store/modules/dealer/constants'
  import { createNamespacedHelpers } from 'vuex'
  import _without from 'lodash/without'
  import _concat from 'lodash/concat'
  import _currency from 'currency.js'
  import { exists } from '@/utilities'

  // Components
  import BidConfigTableModel from '@/components/dealer/BidConfigTableModel'
  import BidConfigTableTrim from '@/components/dealer/BidConfigTableTrim'
  import BidConfigTableLoader from '@/components/dealer/BidConfigTableLoader'

  // Config
  const { mapState, mapActions, mapGetters } = createNamespacedHelpers('dealer')

  export default {
    name: 'BidConfigTable',
    components: {
      BidConfigTableLoader,
      BidConfigTableModel,
      BidConfigTableTrim
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      sortDir: 'asc',
      sortKey: 'year',
      hiddenModels: []
    }),
    computed: {
      ...mapState(['bidConfig']),
      ...mapGetters([get.BID_CONFIG_BY_STYLE_ID]),
      options() {
        return this.bidConfig.options
      },
      sortedOptions() {
        return this.sortOptions(this.sortKey, this.sortDir)
      },
      hasOptions() {
        return exists(this.sortedOptions)
      }
    },
    provide: function () {
      return {
        discountValuesConst: {
          PERCENT_INVOICE: '% Off Invoice',
          DOLLARS_INVOICE: '$ Off Invoice',
          PERCENT_MSRP: '% Off MSRP',
          DOLLARS_MSRP: '$ Off MSRP'
        },
        buildConfigObject(name, varType = null, value = null) {
          const type = (varType || this[name + '_type']).split(' ')[0]
          const ref = (varType || this[name + '_type']).split(' ')[2]
          return { [name]: { type, ref, value } }
        },
        computeMinPrice(name, invoice, msrp) {
          switch (this[name + '_type']) {
            case '% Off MSRP':
              return _currency(msrp - this[name] * msrp * (1 / 100), {
                precision: 0
              }).format(true)
            case '% Off Invoice':
              return _currency(invoice - this[name] * invoice * (1 / 100), {
                precision: 0
              }).format(true)
            case '$ Off MSRP':
              return _currency(msrp - this[name], { precision: 0 }).format(true)
            case '$ Off Invoice':
              return _currency(invoice - this[name], { precision: 0 }).format(
                true
              )
            default:
              return _currency(msrp - this[name] * msrp * (1 / 100), {
                precision: 0
              }).format(true)
          }
        },
        disabled: this.disabled
      }
    },
    methods: {
      ...mapActions([
        actor.UPDATE_BID_CONFIG_BY_STYLE_ID,
        actor.UPDATE_BID_CONFIG_BY_STYLES,
        actor.VALIDATE_BID_CONFIG
      ]),
      updateConfig(value) {
        this[actor.UPDATE_BID_CONFIG_BY_STYLE_ID](value)
        if (!this.bidConfig.valid && exists(this.bidConfig.errors)) {
          // Triggers Validations on update if invalid
          this[actor.VALIDATE_BID_CONFIG]()
        }
      },
      findConfiguration(styleId) {
        return this[get.BID_CONFIG_BY_STYLE_ID](styleId)
      },
      toggle(modelName) {
        if (this.modelHidden(modelName)) {
          this.hiddenModels = _without(this.hiddenModels, modelName)
          return
        }
        this.hiddenModels = _concat(this.hiddenModels, modelName)
      },
      modelHidden(modelName) {
        return this.hiddenModels.includes(modelName)
      },
      updateConfigMany(values) {
        this[actor.UPDATE_BID_CONFIG_BY_STYLES](values)
      },
      getConfigurations(option) {
        return option.trims
          .map(trim => this.findConfiguration(trim.style_id))
          .filter(config => config !== undefined)
      },
      sortBy(colName) {
        if (colName === this.sortKey) {
          this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
        }
        this.sortKey = colName
      },
      displayArrow(column) {
        const columnIsSortKey = column === this.sortKey
        const sortDirIsDesc = this.sortDir === 'desc'

        if (columnIsSortKey) return sortDirIsDesc ? '⬇' : '⬆'
        return 'sort'
      },
      sortOptions(key, dir) {
        return this.options.concat().sort((a, b) => {
          let modifier = 1
          if (dir === 'desc') modifier = -1
          if (a[key] < b[key]) return -1 * modifier
          if (a[key] > b[key]) return modifier
          return 0
        })
      }
    }
  }
</script>
<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .sortable {
    cursor: pointer;
  }

  /*table.fixed {*/
  /*  height: 1128px;*/
  /*  display: -moz-groupbox;*/
  /*}*/
</style>
