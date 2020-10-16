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




    <vs-table  ref="table"
     :data="items"  @selected="update">


      <template slot="thead">
        <vs-th sort-key="betid">ID</vs-th>

        <vs-th sort-key="homeTeam">Name</vs-th>
        <vs-th sort-key="username">Live Events</vs-th>
        <vs-th sort-key="type">Upcoming Events</vs-th>

        <vs-th>Action</vs-th>
      </template>

        <template slot-scope="{data}">
          <tbody>
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" >
                <vs-td>
                <p class="product-category">{{ tr.id }}</p>
              </vs-td>

              <vs-td>
                <p class="product-name font-medium truncate">{{ tr.name }}</p>
              </vs-td>

<vs-td>
                <p class="product-category">{{ tr.liveEvents }}</p>
              </vs-td>
              <vs-td>
                <p class="product-category">{{ tr.upcomingEvents }}</p>
              </vs-td>







              <vs-td class="whitespace-no-wrap">

                <feather-icon icon="RefreshCwIcon" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2" @click.stop="update(tr)" />
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
import axios from "@/axios.js"

export default {
  components: {

    'userbetssidebar':UserBetSidebar
  },
  data() {
    return {
      selected: [],
      timeoutInterval:null,
      items:[],
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
    totalItems() {
      console.log(this.$store.state.dataList.totalItems);
      return this.$store.state.dataList.totalItems
    },
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
    currentPage(){
      this.fetch();

    },
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
      if( this.timeoutInterval ){
        clearInterval(this.timeoutInterval);
      }

      this.timeoutInterval = setTimeout(()=>{
        this.fetch();
        this.timeoutInterval = null;
      },1000);

//      this.fetch();
    },
    fetch(){
      this.$vs.loading({text:"Loading!",type:"radius"});


      axios.get("/adminsports")
        .then((response) => {
          this.items = response.data.sports;
          this.$vs.loading.close()
        });


    },
    handleChangePage(page) {
      this.currentPage = page;
      this.fetch();

      },
      handleSort(key, active) {
        this.sort = {
          key,active
        }
        this.fetch();
      },
    getID(vbid){
      var bid = Buffer.from(vbid.toString()).toString('base64');


      return bid;
    },
    statusChangeOdd(o){
      console.log(o);
      this.fetch();
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
    this.fetch();
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
