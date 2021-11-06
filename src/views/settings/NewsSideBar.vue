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
      <h4 v-if="data.id > 0">Update News</h4>
      <h4 v-else>Add News</h4>

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
        <div role="group" class="form-group">
          <label for="task-title" class="d-block">Title</label>
          <div>
            <input
              id="task-title"
              type="text"
              v-model="data.title"
              placeholder="Task Title"
              class="form-control"
            />
          </div>
        </div>
        <div role="group" class="form-group">
          <label for="task-title" class="d-block">Detail</label>
          <div>
            <quill-editor v-model="data.detail" :options="editorOption" />
          </div>
        </div>
        <div role="group" class="form-group">
          <label for="task-title" class="d-block">Category</label>
          <div>
            <input
              id="task-title"
              type="text"
              v-model="data.category"
              placeholder="Task Title"
              class="form-control"
            />
          </div>
        </div>

        <div role="group" class="form-group">
          <label for="task-title" class="d-block">Label</label>
          <div>
            <input
              id="task-title"
              type="text"
              v-model="data.label"
              placeholder="Task Title"
              class="form-control"
            />
          </div>
        </div>

        <div role="group" class="form-group">
          <label for="task-title" class="d-block">Label Color</label>
          <div>
            <v-status-select
              v-model="data.labelColor"
              :from="order_status_choices"
              :filter="false"
              :find="false"
            ></v-status-select>
          </div>
        </div>

        <div role="group" class="form-group">
          <label for="task-title" class="d-block">DAte</label>
          <div>
            <flat-pickr
              v-model="data.date"
              class="form-control"
              placeholder="Select date"
              name="date"
            >
            </flat-pickr>
          </div>
        </div>
      </div>
    </VuePerfectScrollbar>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button v-if="data.id > 0" class="mr-6" @click="submitData"
        >Update</vs-button
      >
      <vs-button v-else class="mr-6" @click="submitData">Insert</vs-button>

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
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

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
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      },
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
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
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
    submitData() {
      this.$vs.loading();

      axios
        .post("/admin/update_news", {
          id: this.data.id,
          detail: this.data.detail,
          title: this.data.title,
          category: this.data.category,
          label: this.data.label,
          labelColor: this.data.labelColor,
          date: this.data.date,
        })
        .then((d) => d.data)
        .then((response) => {
          this.$vs.loading.close();
          if (response.status === true) {
            this.$vs.notify({
              title: "Done",
              text: "News Updated successfully!",
              color: "success",
              icon: "check_box",
            });
          } else {
            this.$vs.notify({
              title: "Warning",
              text: "News Update Error!!",
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
    flatPickr,
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
