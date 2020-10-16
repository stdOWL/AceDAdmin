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
    <userbetssidebar
      :isSidebarActive="isOddChangeActive"
      @closeSidebar="isOddChangeActive=!isOddChangeActive"
      @statusChangeOdd="statusChangeOdd"
      :data="selectedOddData"
    />

    <vs-table
      ref="table"
      :sst="true"
      @search="handleSearch"
      @change-page="handleChangePage"
      @sort="handleSort"
      :total="totalItems"
      :max-items="itemsPerPage"
      search
      :data="products"
      @selected="update"
    >
      <template slot="thead">
        <vs-th sort-key="betid">ID</vs-th>

        <vs-th sort-key="homeTeam">Type</vs-th>
        <vs-th sort-key="username">User</vs-th>
        <vs-th sort-key="oddMain">Status</vs-th>
        <vs-th sort-key="oddMain">TX</vs-th>
        <vs-th sort-key="oddMain">Adress</vs-th>
        <vs-th sort-key="oddMain">Amount</vs-th>
        <vs-th sort-key="oddValue">Time</vs-th>

        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-category">{{ tr.id }}</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">{{ tr.type }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">
                <a :href="'/user-edit/'+tr.username" target="_blank">{{ tr.username }}</a>
              </p>
            </vs-td>
            <vs-td>
              <vs-chip v-if="tr.status == 0" color="primary" class="product-order-status">PROCESSING</vs-chip>
              <vs-chip
                v-else-if="tr.status == 1"
                color="success"
                class="product-order-status"
              >CONFIRMED</vs-chip>
              <vs-chip
                v-else-if="tr.status == 2"
                color="warning"
                class="product-order-status"
              >REQUEST SENT</vs-chip>
              <vs-chip
                v-else-if="tr.status == 3"
                color="danger"
                class="product-order-status"
              >CANCELLED</vs-chip>
            </vs-td>
            <vs-td>
              <p class="product-name" v-if="tr.txid">
                <a
                  v-if="tr.chaintype == 'WEB3'"
                  target="_blank"
                  :href="'http://etherscan.io/tx/' + tr.txid"
                >{{ tr.txid.substring(0,15) }}..</a>
                <a
                  v-else-if="tr.walletType == 'BTC'"
                  target="_blank"
                  :href="'https://www.blockchain.com/btc/tx/' + tr.txid"
                >{{ tr.txid.substring(0,15) }}..</a>
                 <a
                  v-else-if="tr.walletType == 'DOGE'"
                  target="_blank"
                  :href="'https://dogechain.info/tx/' + tr.txid"
                >{{ tr.txid.substring(0,15) }}..</a>
                 <a
                  v-else-if="tr.walletType == 'LTC'"
                  target="_blank"
                  :href="'https://blockchair.com/litecoin/transaction/' + tr.txid"
                >{{ tr.txid.substring(0,15) }}..</a>



              </p>
            </vs-td>
            <vs-td>
              <p class="product-name">{{ tr.address }}</p>
            </vs-td>
            <vs-td>
              <p class="product-category">{{ tr.amount }} {{ tr.name }}</p>
            </vs-td>
            <vs-td>
              <p
                class="product-category"
              >{{ $moment.utc(tr.time * 1000).local().format("MM-DD-YYYY hh:mm") }}</p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="SettingsIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="update(tr)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <div>
      <vs-pagination :total="totalItems" v-model="currentPage"></vs-pagination>
    </div>
  </div>
</template>

<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
import TransactionsSideBar from "./TransactionsSideBar";

export default {
  components: {
    userbetssidebar: TransactionsSideBar
  },
  data() {
    return {
      selected: [],
      timeoutInterval: null,
      // products: [],
      itemsPerPage: 10,
      currentPage: 1,
      search: "",
      sort: {},
      isMounted: false,
      isOddChangeActive: false,
      // Data Sidebar
      addNewDataSidebar: false,
      selectedOddData: {}
    };
  },
  computed: {
    totalItems() {
      console.log(this.$store.state.dataList.totalItems);
      return this.$store.state.dataList.totalItems;
    },
    products() {
      return this.$store.state.dataList.products;
    },
    isProductsLoaded() {
      if (this.$store.state.dataList)
        return this.$store.state.dataList.isProductsLoaded;
      return false;
    },
    queriedItems() {
      return this.$refs.table
        ? this.$refs.table.queriedResults.length
        : this.products.length;
    }
  },
  watch: {
    currentPage() {
      this.fetch();
    },
    $route() {
      this.fetch();
    },
    isProductsLoaded(v) {
      console.log("isProductsLoaded", v);
      if (v) {
        this.$vs.loading.close();
      }
    }
  },
  methods: {
    handleSearch(searching) {
      this.search = searching;
      if (this.timeoutInterval) {
        clearInterval(this.timeoutInterval);
      }

      this.timeoutInterval = setTimeout(() => {
        this.fetch();
        this.timeoutInterval = null;
      }, 1000);

      //      this.fetch();
    },
    fetch() {
      this.$vs.loading({ text: "Loading!", type: "radius" });
      this.$store.dispatch("dataList/fetchTransactionItems", {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        search: this.search,
        sortkey: this.sort.key || null,
        sortact: this.sort.active || null,
        type: this.$route.params.txtype,
        all: true
      });
    },
    handleChangePage(page) {
      this.currentPage = page;
      this.fetch();
    },
    handleSort(key, active) {
      this.sort = {
        key,
        active
      };
      this.fetch();
    },
    getID(vbid) {
      var bid = Buffer.from(vbid.toString()).toString("base64");

      return bid;
    },
    statusChangeOdd(o) {
      console.log(o);
      this.fetch();
      this.isOddChangeActive = false;
    },
    Oddselected(o) {
      console.log(o);
    },
    update(o) {
      this.selectedOddData = o;
      this.isOddChangeActive = true;
    }
  },

  created() {
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    this.fetch();
  },
  mounted() {
    this.isMounted = true;
  }
};
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

      .vs-table--search {
        padding-top: 0;

        .vs-table--search-input {
          padding: 0.9rem 2.5rem;
          font-size: 1rem;

          & + i {
            left: 1rem;
          }

          &:focus + i {
            left: 1rem;
          }
        }
      }
    }

    .vs-table {
      border-collapse: separate;
      border-spacing: 0 1.3rem;
      padding: 0 1rem;

      tr {
        box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
        td {
          padding: 20px;
          &:first-child {
            border-top-left-radius: 0.5rem;
            border-bottom-left-radius: 0.5rem;
          }
          &:last-child {
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
        }
        td.td-check {
          padding: 20px !important;
        }
      }
    }

    .vs-table--thead {
      th {
        padding-top: 0;
        padding-bottom: 0;

        .vs-table-text {
          text-transform: uppercase;
          font-weight: 600;
        }
      }
      th.td-check {
        padding: 0 15px !important;
      }
      tr {
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
