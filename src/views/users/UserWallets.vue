<!-- =========================================================================================
  File Name: UserEditTabSocial.vue
  Description: User Edit Social Tab content
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="user-edit-tab-info">
    <div class="vx-row">

      <!-- Col 1 -->
      <div class="vx-col w-full md:w-1/2">
        <div v-for="wal in data.userWallets" :key="wal.id">
          <vs-input
          class="w-full"
          icon-pack="feather"
          icon="icon-twitter"
          label="Address"
          v-model="wal.address"
          icon-no-border
          name="Address" />
          <vs-input
          class="w-full"
          icon-pack="feather"
          icon="icon-twitter"
          label="Balance"
          v-model="wal.balance"
          icon-no-border
          name="Balance" />
        </div>

      </div>

      <!-- Col 2 -->

    </div>

    <!-- Save & Reset Button -->
    <div v-if="false" class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button class="ml-auto mt-2" @click="save_changes" :disabled="!validateForm">Save Changes</vs-button>
          <vs-button class="ml-4 mt-2" type="border" color="warning" @click="reset_data">Reset</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {

    }
  },
  created(){
    console.log(this.data);
  },
  computed: {

  },
  methods: {

  },
}
</script>
