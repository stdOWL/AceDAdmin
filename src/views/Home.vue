<template>
  <div>
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
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import axios from "@/axios.js";
export default {
  components: {
    StatisticsCardLine,
  },
  created() {
    axios
      .get(`/summary`)
      .then((r) => r.data)
      .then((r) => {
        this.loaded = true;
        this.hotWallets = r.hotWallets;
        this.onlineUsers = r.onlineUsers;
        this.TransactionsAndDeposits = r.TransactionsAndDeposits;
        this.newUsersCount = r.newUsersCount;
        this.totalBetsCount = r.totalBetsCount;
      });
  },
  methods: {
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
      hotWallets: [],
      onlineUsers: [],
      newUsersCount: 0,
      totalBetsCount: 0,
      loaded:false,
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
