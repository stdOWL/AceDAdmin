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
    <casinosidebar
      :isSidebarActive="isOddChangeActive"
      @closeSidebar="isOddChangeActive = !isOddChangeActive"
      @statusChangeOdd="statusChangeOdd"
      @showotherlegs="showotherlegs"
      :data="selectedOddData"
    />
    <vx-card
      ref="filterCard"
      title="Filters"
      class="user-list-filters mb-8"
      actionButtons
    >
      <div class="vx-row">
        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">System</label>
          <v-select
            :options="gameSystemOptions"
            :clearable="false"
            v-model="gameSystemFilter"
            class="mb-4 md:mb-0"
          />
        </div>
        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Type</label>
          <v-select
            :options="txTypeOptions"
            :clearable="false"
            v-model="txTypeFilter"
            class="mb-4 md:mb-0"
          />
        </div>
        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Wallet</label>
          <v-select
            :options="walletOptions"
            :clearable="false"
            :searchable="true"
            v-model="walletFilter"
            class="mb-4 md:mb-0"
          />
        </div>
        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">User</label>
          <v-select
            :options="userOptions"
            :clearable="false"
            :searchable="true"
            v-model="userFilter"
            class="mb-4 md:mb-0"
          />
        </div>
      </div>
    </vx-card>

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

        <vs-th sort-key="homeTeam">Game</vs-th>
        <vs-th sort-key="username">User</vs-th>
        <vs-th sort-key="type">Type</vs-th>
        <vs-th sort-key="oddValue">Amount</vs-th>
        <vs-th>Balance</vs-th>

        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="tr.txid" v-for="tr in data">
            <vs-td>
              <p class="product-category">{{ tr.txid }}</p>
            </vs-td>

            <vs-td>
              <p v-if="tr.game" class="product-name font-medium truncate">
                {{ tr.game.MerchantName }} - {{ tr.game.Trans.en }}
              </p>
            </vs-td>

            <vs-td>
              <p class="product-category">
                <a :href="'/user-edit/' + tr.username" target="_blank">{{
                  tr.username
                }}</a>
              </p>
            </vs-td>
            <vs-td>
              <p class="product-category">{{ tr.type }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">
                {{ tr.amount }} {{ tr.walletName }}

                <template v-if="tr.details">
                  ( {{ tr.details.amount }} {{ tr.details.currency }} )
                </template>
              </p>
            </vs-td>
            <vs-td>
              <p class="product-category">
                {{ tr.balance }} {{ tr.walletName }}
              </p>
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
import CasinoTransactionSideBar from "./CasinoTransactionSideBar";
import vSelect from "vue-select";
import axios from "@/axios.js";

export default {
  components: {
    vSelect,
    casinosidebar: CasinoTransactionSideBar,
  },
  data() {
    return {
      settledByOptions: [
        { label: "All", value: "all" },
        { label: "Auto", value: "auto" },
      ],
      settledByFilter: { label: "All", value: "all" },

      gameSystemOptions: [
        { label: "All", value: "all" },
        { label: "EvoSW", value: "998" },
        { label: "VivoGaming", value: "945" },
        { label: "Amatic", value: "989" },
        { label: "PragmaticPlay", value: "960" },
        { label: "Quickspin", value: "969" },
      ],

      gameSystemFilter: { label: "All", value: "all" },

      txTypeOptions: [
        { label: "All", value: "all" },
        { label: "DEBIT", value: "DEBIT" },
        { label: "CREDIT", value: "CREDIT" },
      ],

      txTypeFilter: { label: "All", value: "all" },

      walletOptions: [{ label: "All", value: "all" }],
      walletFilter: { label: "All", value: "all" },
      userOptions: [{ label: "All", value: "all" }],
      userFilter: { label: "All", value: "all" },

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
      selectedOddData: {},
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
    },
  },
  watch: {
    currentPage() {
      this.fetch();
    },
    settledByFilter() {
      this.currentPage = 1;
      this.fetch();
    },
    userFilter() {
      this.currentPage = 1;
      this.fetch();
    },
    txTypeFilter() {
      this.currentPage = 1;
      this.fetch();
    },
    walletFilter() {
      this.currentPage = 1;
      this.fetch();
    },

    gameSystemFilter() {
      this.currentPage = 1;
      this.fetch();
    },

    isProductsLoaded(v) {
      console.log("isProductsLoaded", v);
      if (v) {
        this.$vs.loading.close();
      }
    },
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
    fetchFilters() {
      axios
        .get(`/casinotxsfilters`)
        .then((r) => r.data)
        .then((r) => {
          this.userOptions = this.userOptions.concat(r.filters.betusers);


          this.walletOptions = this.walletOptions.concat(r.filters.wallets);
        });
    },
    fetch() {
      this.$vs.loading({ text: "Checking Bets Status!", type: "radius" });
      this.$store.dispatch("dataList/fetchDataListItemsCasino", {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        search: this.search,
        sortkey: this.sort.key || null,
        sortact: this.sort.active || null,
        all: true,
        filters: {
          settledByFilter: this.settledByFilter,
          userFilter: this.userFilter,
          txTypeFilter: this.txTypeFilter,
          walletFilter: this.walletFilter,
          gameSystemFilter: this.gameSystemFilter,
        },
      });
    },
    handleChangePage(page) {
      this.currentPage = page;
      this.fetch();
    },
    handleSort(key, active) {
      this.sort = {
        key,
        active,
      };
      this.fetch();
    },
    getID(vbid) {
      var bid = Buffer.from(vbid.toString()).toString("base64");

      return bid;
    },
    showotherlegs(o) {
      this.currentPage = 1;
      this.search = o;
      this.fetch();
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
    },
  },

  created() {
    if (!moduleDataList.isRegistered) {
      this.$store.registerModule("dataList", moduleDataList);
      moduleDataList.isRegistered = true;
    }
    this.fetchFilters();
    this.fetch();
  },
  mounted() {
    this.isMounted = true;
  },
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
