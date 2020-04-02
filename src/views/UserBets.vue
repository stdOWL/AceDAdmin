<!-- =========================================================================================
  File Name: DataListListView.vue
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="data-list-list-view" class="data-list-container">
     <userbetssidebar :isSidebarActive="isOddChangeActive" @closeSidebar="isOddChangeActive=!isOddChangeActive"  @statusChangeOdd="statusChangeOdd" :data="selectedOddData" />




    <vs-table v-if="isProductsLoaded" ref="table"
    :sst="true"
    @search="handleSearch"
    @change-page="handleChangePage"
    @sort="handleSort"

    pagination :max-items="itemsPerPage" search :data="products"  @selected="update">


      <template slot="thead">
        <vs-th sort-key="id">ID</vs-th>

        <vs-th sort-key="name">Event</vs-th>
        <vs-th sort-key="username">User</vs-th>
        <vs-th sort-key="type">Type</vs-th>

        <vs-th sort-key="oddMain">Detail</vs-th>


        <vs-th sort-key="oddValue">Odd</vs-th>
        <vs-th sort-key="order_status">Event Status</vs-th>
        <vs-th sort-key="order_status">Event Score</vs-th>

        <vs-th>Action</vs-th>
      </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                <vs-td>
                <p class="product-category">{{ tr.betid }}</p>
              </vs-td>

              <vs-td>
                <p class="product-name font-medium truncate">{{ tr.homeTeam }}-{{ tr.awayTeam }}</p>
              </vs-td>

              <vs-td>
                <p class="product-category">{{ tr.username }}</p>
              </vs-td>
<vs-td>
                <p class="product-category">{{ tr.type }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.oddMain }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.oddValue }}</p>
              </vs-td>

              <vs-td>
                <template v-if="tr.result">
                  <vs-chip v-if="tr.result.time_status == 0" color="warning" class="product-order-status">
                    <template v-if="parseInt(tr.result.time) < (Math.round((new Date()).getTime() / 1000) + 3600)">
                      TIME PASSED!?
                    </template>
                    <template v-else>
                      NOT STARTED
                    </template>

                  </vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 1" color="danger" class="product-order-status">INPLAY</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 2" color="primary" class="product-order-status">TO BE FIXED</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 4" color="primary" class="product-order-status">Postponed</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 5" color="primary" class="product-order-status">Cancelled</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 6" color="primary" class="product-order-status">Walkover</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 7" color="primary" class="product-order-status">Interrupted</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 8" color="primary" class="product-order-status">Abandoned</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 9" color="primary" class="product-order-status">Retired</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 99" color="primary" class="product-order-status">Removed</vs-chip>
                  <vs-chip v-else-if="tr.result.time_status == 3" color="success" class="product-order-status">FINISHED</vs-chip>
                  <vs-chip v-else color="success" class="product-order-status">UNKNOWN STATUS({{ tr.result.time_status }})</vs-chip>

                </template>
                <template v-else>
                  <vs-chip class="product-order-status">NO API INFO</vs-chip>
                </template>



              </vs-td>
                <vs-td>
                  <template v-if="tr.result && tr.result.ss">
                    <p class="product-price">Score:{{ tr.result.ss }}</p>
                  </template>
                  <template v-else>
                    ~
                  </template>


              </vs-td>


              <vs-td class="whitespace-no-wrap">

                <feather-icon icon="SettingsIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2" @click.stop="update(tr)" />
              </vs-td>

            </vs-tr>
          </tbody>
        </template>
    </vs-table>
  </div>
</template>

<script>
import moduleDataList from "@/store/data-list/moduleDataList.js"
import UserBetSidebar from './UserBetSidebar'

export default {
  components: {

    'userbetssidebar':UserBetSidebar
  },
  data() {
    return {
      fields: ['first_name', 'last_name', 'age'],
        items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' }
        ],
      selected: [],
      // products: [],
      itemsPerPage: 10,
      currentPage:1,
      search: "",
      sort:{},
      isMounted: false,
      isOddChangeActive:false,
      // Data Sidebar
      addNewDataSidebar: false,
      selectedOddData: {},
    }
  },
  computed: {

    products() {
      return this.$store.state.dataList.products
    },
    isProductsLoaded(){
      if(this.$store.state.dataList)
        return this.$store.state.dataList.isProductsLoaded;
      return false;
    },
    queriedItems() {
      return this.$refs.table ? this.$refs.table.queriedResults.length : this.products.length
    }
  },
  watch:{
    isProductsLoaded(v){
      console.log("isProductsLoaded",v)
      if(v)
      {
        this.$vs.loading.close()
      }
    }
  },
  methods: {
    handleSearch(searching) {
      this.search = searching;
    },
    handleChangePage(page) {
      this.currentPage = page;
      },
      handleSort(key, active) {
        this.sort = {
          key,active
        }
      },
    getID(vbid){
      var bid = Buffer.from(vbid.toString()).toString('base64');


      return bid;
    },
    statusChangeOdd(o){
      this.$store.dispatch("dataList/removeItem", o.betid).catch(err => { console.error(err) })
      console.log(o);
      this.isOddChangeActive = false;
    },
    Oddselected(o){
      console.log(o);
    },
    update(o){
      this.selectedOddData = o;
      this.isOddChangeActive = true;

    }
  },
  created() {
    if(!moduleDataList.isRegistered) {
      this.$store.registerModule('dataList', moduleDataList)
      moduleDataList.isRegistered = true
    }
    this.$vs.loading({text:"Checking Bets Status!",type:"radius"});
    this.$store.dispatch("dataList/fetchDataListItems",{
        itemsPerPage:this.itemsPerPage,
        currentPage:this.currentPage,
        search:this.search
      })
  },
  mounted() {
    this.isMounted = true;
  }
}
</script>

<style lang="scss">
#data-list-list-view {
  .vs-con-table {

    /*
      Below media-queries is fix for responsiveness of action buttons
      Note: If you change action buttons or layout of this page, Please remove below style
    */
    @media (max-width: 689px) {
      .vs-table--search {
        margin-left: 0;
        max-width: unset;
        width: 100%;

        .vs-table--search-input {
          width: 100%;
        }
      }
    }

    @media (max-width: 461px) {
      .items-per-page-handler {
        display: none;
      }
    }

    @media (max-width: 341px) {
      .data-list-btn-container {
        width: 100%;

        .dd-actions,
        .btn-add-new {
          width: 100%;
          margin-right: 0 !important;
        }
      }
    }

    .product-name {
      max-width: 23rem;
    }

    .vs-table--header {
      display: flex;
      flex-wrap: wrap;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
      > span {
        display: flex;
        flex-grow: 1;
      }

      .vs-table--search{
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          &+i {
            left: 1rem;
          }

          &:focus+i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr{
          box-shadow: 0 4px 20px 0 rgba(0,0,0,.05);
          td{
            padding: 20px;
            &:first-child{
              border-top-left-radius: .5rem;
              border-bottom-left-radius: .5rem;
            }
            &:last-child{
              border-top-right-radius: .5rem;
              border-bottom-right-radius: .5rem;
            }
          }
          td.td-check{
            padding: 20px !important;
          }
      }
    }

    .vs-table--thead{
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text{
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check{
        padding: 0 15px !important;
      }
      tr{
        background: none;
        box-shadow: none;
      }
    }

    .vs-table--pagination {
      justify-content: center;
    }
  }
}
</style>
