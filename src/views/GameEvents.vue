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
    <vx-card
      ref="filterCard"
      title="Filters"
      class="user-list-filters mb-8"
      actionButtons
    >
      <div class="vx-row">
        <div class="vx-col md:w-1/6 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Sports</label>
          <v-select
            :options="sportsOptions"
            :clearable="false"
            v-model="sportsFilter"
            class="mb-4 md:mb-0"
          />
        </div>
        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Leagues</label>
          <v-select
            :options="leaguesOptions"
            :clearable="false"
            v-model="leaguesFilter"
            class="mb-4 md:mb-0"
          />
        </div>
        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Event Time</label>

          <v-select
            :options="eventTimeOptions"
            :clearable="false"
            v-model="eventTimeFilter"
            class="mb-4 md:mb-0"
          />
        </div>

        <div class="vx-col md:w-1/5 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Stream Filter</label>
          <div class="custom-control custom-checkbox">
            <input
              type="checkbox"
              class="custom-control-input"
              v-model="showOnlyMissingWidgetID"
              id="__BVID__5793"
            /><label class="custom-control-label" for="__BVID__5793">
              Only missing widgetid
            </label>
          </div>
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
    >
      <template slot="thead">
        <vs-th sort-key="betid">ID</vs-th>
        <vs-th sort-key="homeTeam">Sport</vs-th>
        <vs-th sort-key="homeTeam">League</vs-th>
        <vs-th sort-key="homeTeam">Home</vs-th>
        <vs-th sort-key="username">Away</vs-th>
        <vs-th sort-key="type">Widget ID</vs-th>
        <vs-th>Save</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-category">{{ tr.id }}</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.sport_name }}
              </p>
            </vs-td>
            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.region_name }} - {{ tr.competition_name }}
              </p>
            </vs-td>
            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.team1_name }}
              </p>
            </vs-td>
            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.team2_name }}
              </p>
            </vs-td>
            <vs-td>
              <p class="product-name font-medium truncate">
                <input
                  type="text"
                  :value="tr.betradar_id"
                  @input="changeBetradar(tr.id, $event.target.value)"
                  class="input-search vs-table--search-input"
                />
              </p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="SaveIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="update(tr)"
              />
              <a
                :href="`https://acedbets.io/sports/event/${tr.slug}`"
                title="Open event page"
                target="_blank"
                ><feather-icon
                  icon="Navigation2Icon"
                  svgClasses="w-5 h-5 hover:text-danger stroke-current"
                  class="ml-2"
              /></a>
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
import UserBetSidebar from "./UserBetSidebar";
import vSelect from "vue-select";
import axios from "@/axios.js";

export default {
  components: {
    vSelect,
    userbetssidebar: UserBetSidebar,
  },
  data() {
    return {
      showOnlyMissingWidgetID:false,
      sportsOptions: [{ label: "All", value: "all" }],
      sportsFilter: { label: "All", value: "all" },

      leaguesOptions: [{ label: "All", value: "all" }],

      leaguesFilter: { label: "All", value: "all" },

      eventTimeOptions: [
        { label: "All", value: "all" },
        { label: "SOON(4 HOURS)", value: "SOON" },
        { label: "INPLAY", value: "INPLAY" },
        { label: "24 HOURS", value: "24HOURS" },
        { label: "FUTURE", value: "FUTURE" },
      ],

      eventTimeFilter: { label: "All", value: "all" },

      walletOptions: [{ label: "All", value: "all" }],
      walletFilter: { label: "All", value: "all" },
      userOptions: [{ label: "All", value: "all" }],
      userFilter: { label: "All", value: "all" },
      betradar_ids: {},

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


    showOnlyMissingWidgetID() {
      this.currentPage = 1;
      this.fetch();
    },
    eventTimeFilter() {
      this.currentPage = 1;
      this.fetch();
    },
    leaguesFilter() {
      this.currentPage = 1;
      this.fetch();
    },

    sportsFilter() {
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
    changeBetradar(eventid, betradar_id) {
      this.betradar_ids[eventid] = betradar_id;
    },
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
        .get(`/admin/eventfilters`)
        .then((r) => r.data)
        .then((r) => {
          this.leaguesOptions = this.leaguesOptions.concat(r.filters.leagues);

          this.sportsOptions = this.sportsOptions.concat(r.filters.sports);
        });
    },
    fetch() {
      this.$vs.loading({ text: "Checking Bets Status!", type: "radius" });
      this.$store.dispatch("dataList/fetchDataListItemsGames", {
        itemsPerPage: this.itemsPerPage,
        currentPage: this.currentPage,
        search: this.search,
        sortkey: this.sort.key || null,
        sortact: this.sort.active || null,
        all: true,
        filters: {
          showOnlyMissingWidgetID:this.showOnlyMissingWidgetID,
          sportsFilter: this.sportsFilter,
          leaguesFilter: this.leaguesFilter,
          eventTimeFilter: this.eventTimeFilter,
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
      //this.selectedOddData = o;
      //this.isOddChangeActive = true;
      //this.betradar_ids[o.id]
      axios
        .post(`/admin/updatestream`, {
          game_id: o.id,
          betradar_id: this.betradar_ids[o.id] ? this.betradar_ids[o.id] : null,
          twitch_id: null,
          hltv_id: null,
        })
        .then((r) => r.data)
        .then((r) => {
          if (r.status == true) {
            this.$vs.notify({
              title: "Done",
              text: "Event Stream Updated successfully!",
              color: "success",
              icon: "check_box",
            });
          }
        });
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
