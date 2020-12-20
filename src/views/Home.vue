<template>
  <div :key="forceRender">
    <vs-dropdown vs-trigger-click class="cursor-pointer putright">
      <small class="flex cursor-pointer">
        <span>{{ summaryTimeFilterstr }}</span>
        <feather-icon
          icon="ChevronDownIcon"
          svgClasses="h-4 w-4"
          class="ml-1"
        />
      </small>
      <vs-dropdown-menu class="w-32">
        <vs-dropdown-item @click="timeFilter('total')">Total</vs-dropdown-item>
        <vs-dropdown-item @click="timeFilter('24hours')"
          >Last 24 Hours</vs-dropdown-item
        >
        <vs-dropdown-item @click="timeFilter('7days')"
          >Last 7 Days</vs-dropdown-item
        >
        <vs-dropdown-item @click="timeFilter('30days')"
          >Last 30 Days</vs-dropdown-item
        >
      </vs-dropdown-menu>
    </vs-dropdown>
    <vs-tabs alignment="right" v-if="TransactionsAndDeposits.length > 0">
      <vs-tab
        v-for="tdw in TransactionsAndDeposits"
        :key="tdw.name"
        :label="tdw.name"
      >
        <div class="vx-row">
          <div
            class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/5 xl:w-1/5 mb-base"
          >
            <statistics-card-line
              v-if="subscribersGained.analyticsData"
              icon="DollarSignIcon"
              :hideChart="true"
              :statistic="getTotalLose(tdw) | d_formatter"
              statisticTitle="Total User Lost"
            />
          </div>
          <div
            class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/5 xl:w-1/5 mb-base"
          >
            <statistics-card-line
              v-if="subscribersGained.analyticsData"
              icon="DollarSignIcon"
              :hideChart="true"
              :statistic="getTotalWin(tdw) | d_formatter"
              statisticTitle="Total User Win"
              color="danger"
            />
          </div>
          <div
            class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/5 xl:w-1/5 mb-base"
          >
            <statistics-card-line
              v-if="subscribersGained.analyticsData"
              icon="AwardIcon"
              :hideChart="true"
              :statistic="(getTotalLose(tdw) - getTotalWin(tdw)) | d_formatter"
              statisticTitle="Total Profit"
              color="success"
            />
          </div>
          <div
            class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/5 xl:w-1/5 mb-base"
          >
            <statistics-card-line
              v-if="subscribersGained.analyticsData"
              icon="ChevronsDownIcon"
              :hideChart="true"
              :statistic="getTotalDeposit(tdw) | d_formatter"
              statisticTitle="Total Deposit"
              color="warning"
            />
          </div>
          <div
            class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/5 xl:w-1/5 mb-base"
          >
            <statistics-card-line
              v-if="subscribersGained.analyticsData"
              icon="ChevronsUpIcon"
              :hideChart="true"
              :statistic="getTotalWithdraw(tdw) | d_formatter"
              statisticTitle="Total Withdraw"
            />
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full mt-base">
            <vue-apex-charts
              type="line"
              height="266"
              :options="revenuechartOptions"
              :series="revenueComparisonLine.series"
            />
          </div>
        </div>
      </vs-tab>
    </vs-tabs>

    <div class="vx-row" v-if="loaded">
      <div
        class="vx-col w-full md:w-1/4 lg:w-1/4 xl:w-1/4 mb-base"
        v-if="hotWallets.length > 0"
      >
        <vx-card title="Hot Wallets">
          <div
            v-for="(wallet, index) in hotWallets"
            :key="wallet.id"
            :class="{ 'mt-4': index }"
          >
            <div class="flex justify-between">
              <div class="flex flex-col text-right">
                <span class="flex -mr-1">
                  <span class="mr-1"
                    >{{ wallet.balance }} {{ wallet.name }}</span
                  >
                </span>
              </div>
            </div>
          </div>
        </vx-card>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="UserIcon"
          :hideChart="true"
          :statistic="onlineUsers.length"
          statisticTitle="Online Users"
        />
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="BookmarkIcon"
          :hideChart="true"
          :statistic="totalBetsCount"
          statisticTitle="Total Betslip"
          color="warning"
        />
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="ThumbsUpIcon"
          :hideChart="true"
          :statistic="newUsersCount"
          statisticTitle="24h New Users"
          color="success"
        />
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import axios from "@/axios.js";
export default {
  computed: {
    summaryTimeFilterstr: function () {
      if (this.summaryTimeFilter == "total") return "All Time";
      if (this.summaryTimeFilter == "7days") return "7 Days";
      if (this.summaryTimeFilter == "30days") return "30 Days";
      if (this.summaryTimeFilter == "24hours") return "24 Hours";
    },
  },
  components: {
    VueApexCharts,
    StatisticsCardLine,
  },
  created() {
    let user = this.$store.state.AppActiveUser;
    if (user) {
      if (
        user.role != "ADMIN" &&
        user.permissions.includes("SHOW_SUMMARY") == false
      ) {
        if (user.permissions.includes("SHOW_ACTIVEBETS"))
          this.$router.push("/userbets");
      }
    }
  },
  mounted() {
    this.loadsummary();
  },
  methods: {
    loadsummary() {
      axios
        .get(`/summary?f=` + this.summaryTimeFilter)
        .then((r) => r.data)
        .then((r) => {
          this.loaded = true;
          this.hotWallets = r.hotWallets;
          this.onlineUsers = r.onlineUsers;
          this.TransactionsAndDeposits = r.TransactionsAndDeposits;
          this.newUsersCount = r.newUsersCount;
          this.totalBetsCount = r.totalBetsCount;
          this.forceRender += 1;
        });
    },
    timeFilter(filter) {
      this.summaryTimeFilter = filter;
      this.loadsummary();
    },
    getTotalDeposit(tdw) {
      if (!tdw.transactions) return 0;
      let totalDeposit = 0.0;
      tdw.transactions.forEach((p) => {
        if (p.type == "DEPOSIT") {
          totalDeposit += parseFloat(p.total);
        }
      });

      return totalDeposit;
    },
    getTotalWithdraw(tdw) {
      if (!tdw.transactions) return 0;
      let totalDeposit = 0.0;
      tdw.transactions.forEach((p) => {
        if (p.type == "WITHDRAW") {
          totalDeposit += parseFloat(p.total);
        }
      });

      return totalDeposit;
    },

    getTotalWin(tdw) {
      if (!tdw.profits) return 0;

      let totalWin = 0.0;
      tdw.profits.forEach((p) => {
        if (p.status == "WIN") {
          totalWin += parseFloat(p.totalWinAmount);
        }
      });

      return totalWin;
    },
    getTotalLose(tdw) {
      if (!tdw.profits) return 0;

      let totalLose = 0.0;
      tdw.profits.forEach((p) => {
        if (p.status == "LOSE") {
          totalLose += parseFloat(p.totalLose);
        }
      });

      return totalLose;
    },
  },
  data() {
    return {
      revenueComparisonLine: {
        analyticsData: {
          thisMonth: 86589,
          lastMonth: 73683,
        },
        series: [
          {
            name: "AceD",
            data: [45000, 47000, 44800, 47500, 45500, 48000, 46500, 48600],
          },
          {
            name: "ETH",
            data: [16000, 48000, 35500, 46600, 44500, 46500, 45000, 47000],
          },
          {
            name: "mBTC",
            data: [41000, 48000, 45500, 43600, 44500, 46500, 45000, 42000],
          },
          {
            name: "USDC",
            data: [36000, 48000, 42500, 46600, 44500, 46500, 45000, 47000],
          },
        ],
      },
      revenuechartOptions: {
        chart: {
          toolbar: { show: true },
          dropShadow: {
            enabled: true,
            top: 5,
            left: 0,
            blur: 4,
            opacity: 0.1,
          },
        },
        stroke: {
          curve: "smooth",
          dashArray: [0, 8],
          width: [4, 2],
        },
        grid: {
          borderColor: "#e7e7e7",
        },
        legend: {
          show: true,
        },
        colors: ["#F97794", "#b8c2cc"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            inverseColors: false,
            gradientToColors: [
              "#7367F0",
              "#7367F0",
              "#7367F0",
              "#7367F0",
              "#b8c2cc",
            ],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
        },
        markers: {
          size: 0,
          hover: {
            size: 5,
          },
        },
        xaxis: {
          labels: {
            style: {
              cssClass: "text-grey fill-current",
            },
          },
          axisTicks: {
            show: true,
          },
          categories: ["01", "05", "09", "13", "17", "21", "26", "31"],
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          tickAmount: 5,
          labels: {
            style: {
              cssClass: "text-grey fill-current",
            },
            formatter: function (val) {
              return val > 999 ? (val / 1000).toFixed(1) + "k" : val;
            },
          },
        },
        tooltip: {
          x: { show: true },
        },
      },
      summaryTimeFilter: "total",
      hotWallets: [],
      onlineUsers: [],
      newUsersCount: 0,
      totalBetsCount: 0,
      loaded: false,
      forceRender: 0,
      TransactionsAndDeposits: [],
      subscribersGained: {
        series: [
          {
            name: "$",
            data: [28, 40, 36, 52, 38, 60, 55],
          },
        ],
        analyticsData: {
          subscribers: 92600,
        },
      },
    };
  },
};
</script>

<style>
</style>
