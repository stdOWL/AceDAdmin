<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar
    v-if="data"
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>CASINO TX INFO</h4>
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <VuePerfectScrollbar
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <div
          class="img-container w-100 mx-auto flex items-center justify-center"
        >
          {{ data.homeTeam }} - {{ data.awayTeam }}
        </div>
        <div
          class="img-container w-64 mx-auto flex items-center justify-center"
        >
          {{ data.sportName }}
        </div>

        <div class="w-100 pt-2">TX ID: {{ data.txid }}</div>
        <div class="w-100 pt-2">Type: {{ data.type }}</div>
        <div class="w-100 pt-2">
          Amount: {{ data.amount }} {{ data.walletName }}
        </div>
        <div class="w-100 pt-2">
          Left Balance: {{ data.balance }} {{ data.walletName }}
        </div>

        <div class="w-100 pt-2">
          Bet Time:
          {{ $moment(data.createdate).local().format("MM-DD-YYYY HH:mm") }}
        </div>

        <div v-if="data.details" class="pt-5">
          <vs-divider>Details</vs-divider>


          <div class="w-100 pt-2">
            Real Amount: {{ data.details.amount }} {{ data.details.currency }}
          </div>
          <div class="w-100 pt-2">
            Fundist Username: {{ data.details.userid }}
          </div>
          <div class="w-100 pt-2">
            Extra Parameter: {{ data.details.i_extparam }} (AceDBets-WalletID)
          </div>
        </div>
        <div class="pt-5" v-if="data.widgetsupport == 1">
          <vs-divider>Widget</vs-divider>
          <div class="w-100 pt-2">
            <vs-button
              class="mr-6 w-100"
              target="_blank"
              :href="`/matchevents/${data.widgetid}`"
              >Match Events</vs-button
            >
            <vs-button
              class="mr-6 w-100 mt-2"
              target="_blank"
              :href="`https://widgets.sir.sportradar.com/betradar/en/live-match-tracker#layout:(colorTheme:(colors:(away:%23d6d6d6,background:'rgba(0,%2B0,%2B0,%2B0.5)',base:%23fff,home:%23fff,primary:%23fff),formula:solid)),matches:(matchId:${data.widgetid}),sidebar:(selected:sports)`"
              >English Widget</vs-button
            >
          </div>

          <div
            v-if="
              data.radar &&
              data.radar.match &&
              data.radar.match.result.home &&
              data.radar.match.result.away &&
              data.radar.match.result.winner &&
              data.radar.match.result.winner.length > 0
            "
          >
            <vs-divider>Result Score</vs-divider>
            <div class="w-100 pt-2">
              HOME: {{ data.radar.match.result.home }} AWAY:
              {{ data.radar.match.result.away }} WINNER:
              {{ data.radar.match.result.winner }}
            </div>
          </div>

          <div v-if="false && data.radar.events.length > 0">
            <vs-divider>Event Scores by time</vs-divider>
            <vs-table noDataText>
              <template slot="thead">
                <vs-th sort-key="name">Name</vs-th>
                <vs-th sort-key="category">Home Score</vs-th>
                <vs-th sort-key="popularity">Away Score</vs-th>
              </template>
              <tbody>
                <vs-tr v-for="ev in data.radar.events" :key="ev._id">
                  <vs-td>{{ ev }} Quart.</vs-td>
                  <vs-td>{{ ev }}</vs-td>
                  <vs-td>{{ ev }}</vs-td>
                </vs-tr>
              </tbody>
            </vs-table>
          </div>
        </div>

        <div v-if="data.result && data.result.scores" class="pt-5">
          <vs-divider>Event Scores by time</vs-divider>
          <vs-table noDataText>
            <template slot="thead">
              <vs-th sort-key="name">Quarter</vs-th>
              <vs-th sort-key="category">Home Score</vs-th>
              <vs-th sort-key="popularity">Away Score</vs-th>
            </template>
            <tbody>
              <vs-tr v-for="(tr, indextr) in data.result.scores" :key="indextr">
                <vs-td>{{ indextr }} Quart.</vs-td>
                <vs-td>{{ tr.home }}</vs-td>
                <vs-td>{{ tr.away }}</vs-td>
              </vs-tr>
            </tbody>
          </vs-table>
        </div>
        <div v-if="data.result && data.result.events" class="pt-5">
          <vs-divider>Event Actions by time</vs-divider>
          <vs-table noDataText>
            <template slot="thead">
              <vs-th sort-key="category">Action</vs-th>
            </template>
            <tbody>
              <vs-tr v-for="(tr, indextr) in data.result.events" :key="indextr">
                <vs-td>{{ tr.text }}</vs-td>
              </vs-tr>
            </tbody>
          </vs-table>
        </div>
      </div>
    </VuePerfectScrollbar>

  </vs-sidebar>
</template>

<script>
import "@desislavsd/vue-select/dist/vue-select.css";

import VuePerfectScrollbar from "vue-perfect-scrollbar";
import axios from "@/axios.js";
import { vSelect } from "@desislavsd/vue-select";

export default {
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  watch: {
    isSidebarActive(val) {
      if (!val) return;
      this.betStatus = this.data.status;
    },
  },
  data() {
    return {
      events: [],
      betStatus: "Standby",
      dataId: null,
      dataName: "",
      dataCategory: null,
      dataImg: null,
      dataOrder_status: "pending",
      dataPrice: 0,

      category_choices: [
        { text: "Audio", value: "audio" },
        { text: "Computers", value: "computers" },
        { text: "Fitness", value: "fitness" },
        { text: "Appliance", value: "appliance" },
      ],
      order_status_choices: [
        "STANDBY",
        "CANCELLED",
        "WIN",
        "LOSE",
        "PUSH",
        "HALFPUSH",
      ],
      /* order_status_choices: [
        {text:'Standby',value:'STANDBY'},
        {text:'Cancelled',value:'CANCELLED'},
        {text:'Won',value:'WIN'},
        {text:'Lost',value:'LOSE'},
        {text:'Push',value:'PUSH'},

      ],*/
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar");
          // this.$validator.reset()
          // this.initValues()
        }
      },
    },
    isFormValid() {
      return (
        !this.errors.any() &&
        this.dataName &&
        this.dataCategory &&
        this.dataPrice > 0
      );
    },
  },
  mounted() {},
  methods: {
    showotherlegs(id) {
      this.$emit("showotherlegs", id);
    },
    acedbetid(id) {
      return `[AceDBet:${Buffer.from(id.toString()).toString("base64")}]`;
    },

    getWinnerTeam() {
      if (!this.data.result || !this.data.result.ss) return "n/a";
      var s = this.data.result.ss.split("-");
      var homeScore = parseInt(s[0]);
      var awayScore = parseInt(s[1]);
      if (homeScore == awayScore) return "Draw";
      else if (homeScore > awayScore) return this.data.homeTeam + "(Home)";
      else if (homeScore < awayScore) return this.data.awayTeam + "(Away)";
    },
    initValues() {
      if (this.data.id) return;
      this.dataId = null;
      this.dataName = "";
      this.dataCategory = null;
      this.dataOrder_status = "pending";
      this.dataPrice = 0;
      this.dataImg = null;
    },
    submitData() {
      if (this.data.status == this.betStatus) return;

      if (this.data.status !== "STANDBY") {
        if (this.data.type !== "SINGLE") {
          this.$vs.dialog({
            color: "danger",
            title: `Confirm`,
            text:
              "This is a multiple bet that you want to change status, its not stable for now, so lets talk about that at discord my love.",
          });
          return;
        }

        this.$vs.dialog({
          type: "confirm",
          color: "danger",
          title: `Confirm`,
          text:
            "Are you really want to change status " +
            this.data.status +
            " to " +
            this.betStatus +
            "? This may affect client's balance. Did you check client's balance?",
          accept: this.undoBetStatus,
        });
      } else {
        this.submitDataAPI();
      }
    },
    undoBetStatus() {
      this.$vs.loading();

      axios
        .post("/undobet", {
          type: this.data.type,
          betid: this.data.betid,
          oldstatus: this.data.status,
          istatus: this.betStatus,
        })
        .then((d) => d.data)
        .then((response) => {
          this.$vs.loading.close();
          if (response.res > 0) {
            this.$vs.notify({
              title: "Done",
              text: "Updated successfully!",
              color: "success",
              icon: "check_box",
            });
            this.$emit("statusChangeOdd", this.data);
          } else {
            this.$vs.notify({
              title: "Warning",
              text: "We cant change odd status!",
              color: "warning",
              icon: "check_box",
            });
          }
        })
        .catch((e) => {
          this.$vs.notify({
            title: "Error",
            text: e,
            color: "danger",
            icon: "check_box",
          });
          this.$vs.loading.close();
        });
    },
    submitDataAPI() {
      this.$vs.loading();

      axios
        .post("/resultbet", {
          type: this.data.type,
          betid: this.data.betid,
          istatus: this.betStatus,
        })
        .then((d) => d.data)
        .then((response) => {
          this.$vs.loading.close();
          if (response.res > 0) {
            this.$vs.notify({
              title: "Done",
              text: "Updated successfully!",
              color: "success",
              icon: "check_box",
            });
            this.$emit("statusChangeOdd", this.data);
          } else {
            this.$vs.notify({
              title: "Warning",
              text: "We cant change odd status!",
              color: "warning",
              icon: "check_box",
            });
          }
        })
        .catch((e) => {
          this.$vs.notify({
            title: "Error",
            text: e,
            color: "danger",
            icon: "check_box",
          });
          this.$vs.loading.close();
        });

      //

      //
    },
  },
  components: {
    "v-status-select": vSelect,
    VuePerfectScrollbar,
  },
};
</script>
<style>
.con-vs-dialog {
  z-index: 99999999 !important;
}
</style>
<style lang="scss" scoped>
.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);
}
.product-order-status2 {
  float: none;
}
</style>
