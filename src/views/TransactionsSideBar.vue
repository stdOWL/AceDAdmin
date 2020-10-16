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
      <h4>UPDATE TRANSACTION</h4>
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

        <v-status-select
          v-if="betStatus"
          as="name::id"
          v-model="betStatus"
          :from="order_status_choices"
          :filter="false"
          :find="false"
        ></v-status-select>
        <div class="w-100 pt-2">Type: {{ data.type }}</div>
        <div class="w-100 pt-2">
          Username:<a :href="'/user-edit/' + data.username" target="_blank">{{
            data.username
          }}</a>
        </div>

        <div v-if="data.type == 'WITHDRAW'" class="w-100 pt-2">
          TX ID:
          <vs-input class="w-full" v-model="txid" name="txid" />
        </div>
        <div v-if="data.txid" class="w-100 pt-2">
          TX ID:
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

        </div>

        <div class="w-100 pt-2">
          Address:
          <vs-input class="w-full" :value="data.address" name="address" />
        </div>

        <div class="w-100 pt-2">Amount: {{ data.amount }} {{ data.name }}</div>

        <div class="w-100 pt-2">
          Date:
          {{
            $moment
              .utc(data.time * 1000)
              .local()
              .format("MM-DD-YY hh:mm")
          }}
        </div>
        <div class="w-100 pt-2">
          <vs-chip
            v-if="data.status == 0"
            color="primary"
            class="product-order-status2"
            >PROCESSING</vs-chip
          >
          <vs-chip
            v-else-if="data.status == 1"
            color="success"
            class="product-order-status2"
            >CONFIRMED(VERIFIED)</vs-chip
          >
          <vs-chip
            v-else-if="data.status == 2"
            color="warning"
            class="product-order-status2"
            >REQUEST SENT</vs-chip
          >
          <vs-chip
            v-else-if="data.status == 3"
            color="danger"
            class="product-order-status2"
            >CANCELLED</vs-chip
          >
        </div>
      </div>
    </VuePerfectScrollbar>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData">Submit</vs-button>
      <vs-button
        type="border"
        color="danger"
        @click="isSidebarActiveLocal = false"
        >Cancel</vs-button
      >
    </div>
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
      this.betStatus = this.order_status_choices.find(
        (s) => s.id == this.data.status
      );
      this.txid = this.data.txid;
    },
  },
  data() {
    return {
      betStatus: null,
      dataId: null,
      txid: null,
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
        { name: "PROCESSING", id: 0 },
        { name: "CONFIRMED(VERIFIED)", id: 1 },
        { name: "REQUEST SENT", id: 2 },
        { name: "CANCELLED", id: 3 },
      ],
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
      if (!this.betStatus || this.data.status == this.betStatus.id) return;

      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure to update the transaction?",
        accept: this.submitDataAPI,
      });
    },

    submitDataAPI() {
      this.$vs.loading();

      axios
        .post("/updateusertx", {
          userid: this.data.userid,
          oldstatus: this.data.status,
          status: this.betStatus.id,
          id: this.data.id,
          txid: this.txid,
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
              text: "Error!" + response.messages,
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
