<!-- =========================================================================================
  File Name: UserEdit.vue
  Description: User Edit Page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="page-user-edit">

    <vs-alert color="danger" title="User Not Found" :active.sync="user_not_found">
      <span>User record with id: {{ $route.params.userId }} not found. </span>
      <span>
        <span>Check </span><router-link :to="{name:'users'}" class="text-inherit underline">All Users</router-link>
      </span>
    </vs-alert>

    <vx-card v-if="user_data">

      <div slot="no-body" class="tabs-container px-6 pt-6">

        <vs-tabs v-model="activeTab" class="tab-action-btn-fill-conatiner">
          <vs-tab label="Account" icon-pack="feather" icon="icon-user">
            <div class="tab-text">
              <user-edit-tab-account class="mt-4" :data="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="User Wallets" icon-pack="feather" icon="icon-dollar-sign">
            <div class="tab-text">
              <user-wallets class="mt-4" :data="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="User Bets" icon-pack="feather" icon="icon-check-square">
            <div class="tab-text">
              <user-bets class="mt-4" :data="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="Wallet Logs" icon-pack="feather" icon="icon-database">
            <div class="tab-text">
              <user-wallet-logs class="mt-4" :data="user_data" />
            </div>
          </vs-tab>
          <vs-tab label="User Transactions" icon-pack="feather" icon="icon-credit-card">
            <div class="tab-text">
              <user-transactions class="mt-4" :data="user_data" />
            </div>
          </vs-tab>
        </vs-tabs>

      </div>

    </vx-card>
  </div>
</template>

<script>
import UserEditTabAccount     from "./UserEditTabAccount.vue"
import UserEditTabInformation from "./UserEditTabInformation.vue"
import UserEditTabSocial      from "./UserEditTabSocial.vue"
import UserWallets from "./UserWallets.vue"
import UserBets from "./UserBets.vue"
import UserWalletLogs from "./UserWalletLogs.vue"
import UserTransactions from "./UserTransactions.vue"

// Store Module
import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

export default {
  components: {
    UserEditTabAccount,
    UserEditTabInformation,
    UserEditTabSocial,
    UserWallets,
    UserBets,
    UserWalletLogs,
    UserTransactions
  },
  data() {
    return {
      user_data: null,
      user_not_found: false,

      /*
        This property is created for fetching latest data from API when tab is changed

        Please check it's watcher
      */
      activeTab: 0,
    }
  },
  watch: {
    activeTab() {
      this.fetch_user_data(this.$route.params.userId)
    }
  },
  methods: {
    fetch_user_data(userId) {
      this.$store.dispatch("userManagement/fetchUser", userId)
        .then(r=>r.data)
        .then(res => {
          if(res.status == true)
            this.user_data = res;
          else
            this.user_not_found = true;
        })
        .catch(err => {
          if(err.response.status === 404) {
            this.user_not_found = true
            return
          }
          console.error(err) })
    }
  },
  created() {
    // Register Module UserManagement Module
    if(!moduleUserManagement.isRegistered) {
      this.$store.registerModule('userManagement', moduleUserManagement)
      moduleUserManagement.isRegistered = true
    }
    this.fetch_user_data(this.$route.params.userId)
  }
}

</script>
