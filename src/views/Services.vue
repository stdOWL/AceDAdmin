<template>
  <div id="data-list-list-view" class="data-list-container">
    <vs-table ref="table" :data="items" @selected="update">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Instances</vs-th>
        <vs-th>CPU</vs-th>
        <vs-th>RAM</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{ data }">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-category">{{ tr.name }}({{ tr.ip }})</p>
            </vs-td>

            <vs-td>
              <p class="product-name font-medium truncate">
                {{ tr.instanceCount }}
              </p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.cpu }}%</p>
            </vs-td>
            <vs-td>
              <p class="product-category">{{ parseInt(tr.ram) }} MB</p>
            </vs-td>
            <vs-td>
              <p class="product-category">{{ tr.status }}</p>
            </vs-td>
            <vs-td class="whitespace-no-wrap">
              <vs-button
                size="small"
                icon-pack="feather"
                icon="play"
                icon-after
                @click="updateStatus(tr,'RESET')"
              >
                Reset
              </vs-button>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>

<script>
import moduleDataList from "@/store/data-list/moduleDataList.js";
import UserBetSidebar from "./UserBetSidebar";
import axios from "@/axios.js";

export default {
  components: {
    userbetssidebar: UserBetSidebar,
  },
  data() {
    return {
      selected: [],
      timeoutInterval: null,
      items: [],
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
    isProductsLoaded(v) {
      console.log("isProductsLoaded", v);
      if (v) {
        this.$vs.loading.close();
      }
    },
  },
  methods: {
    updateStatus(instance, command) {
      axios
        .post("/service/command", {
          secret:
            "6KqkSREmqM9QRuF2YyRQX8rQSXx5kQLssSyBsHeLTdz2fK5X9AEPSYD3eZDYFfPU",
          id: instance._id,
          command,
        })
        .then(() => {
          //   this.$vs.loading.close();
        });
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
    fetch() {
      axios.get("/services").then((response) => {
        this.items = this.handleResponse(response.data.services);
        //   this.$vs.loading.close();
      });
    },
    handleResponse(services) {
      let a = [];
      services.forEach((service) => {
        var cpu = 0.0,
          ram = 0;
        var status = "",
          statuses = [];
        for (let i in service.instances) {
          let instance = service.instances[i];
          cpu = cpu + instance.monit.cpu;
          ram = ram + instance.monit.memory;
          statuses.push(instance.status);
        }
        var ss = [...new Set(statuses)];
        status = ss.join();
        cpu = parseFloat(cpu).toFixed(2);
        ram = ram / 1000000;
        a.push({
          name: service.name,
          ip: service.ip,
          _id: service._id,
          command: service.command,
          instanceCount: service.instances.length,
          cpu,
          ram,
          instances: service.instances,
          status,
        });
      });
      return a;
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
    // this.$vs.loading({ text: "Loading!", type: "radius" });
    this.fetch();
    setInterval(() => {
      this.fetch();
    }, 3000);
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
