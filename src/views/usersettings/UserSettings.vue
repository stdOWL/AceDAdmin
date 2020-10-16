<template>
  <vs-tabs
    :position="isSmallerScreen ? 'top' : 'left'"
    class="tabs-shadow-none"
    id="profile-tabs"
    :key="isSmallerScreen"
  >
    <!-- GENERAL -->
    <vs-tab
      icon-pack="feather"
      icon="icon-user"
      :label="!isSmallerScreen ? 'General' : ''"
    >
      <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-general v-if="user_data" :userdata="user_data" />
      </div>
    </vs-tab>
    <vs-tab
      icon-pack="feather"
      icon="icon-lock"
      :label="!isSmallerScreen ? 'Change Password' : ''"
    >
      <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-change-password />
      </div>
    </vs-tab>
    <vs-tab
      icon-pack="feather"
      icon="icon-lock"
      :label="!isSmallerScreen ? 'User Bets' : ''"
    >
      <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
        <user-bets v-if="user_data" :bets="user_data.userBets" />
      </div>
    </vs-tab>
    <vs-tab
      icon-pack="feather"
      icon="icon-info"
      :label="!isSmallerScreen ? 'Info' : ''"
    >
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-info />
      </div>
    </vs-tab>
    <vs-tab
      icon-pack="feather"
      icon="icon-github"
      :label="!isSmallerScreen ? 'Social Links' : ''"
    >
      <div class="tab-social-links md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-social-links />
      </div>
    </vs-tab>
    <vs-tab
      icon-pack="feather"
      icon="icon-link-2"
      :label="!isSmallerScreen ? 'Connections' : ''"
    >
      <div class="tab-text md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-connections />
      </div>
    </vs-tab>
    <vs-tab
      icon-pack="feather"
      icon="icon-bell"
      :label="!isSmallerScreen ? 'Notifications' : ''"
    >
      <div class="tab-text md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-notifications />
      </div>
    </vs-tab>
  </vs-tabs>
</template>

<script>

import UserSettingsGeneral from "./UserSettingsGeneral.vue";
import UserSettingsChangePassword from "./UserSettingsChangePassword.vue";
import UserSettingsInfo from "./UserSettingsInfo.vue";
import UserSettingsSocialLinks from "./UserSettingsSocialLinks.vue";
import UserSettingsConnections from "./UserSettingsConnections.vue";
import UserSettingsNotifications from "./UserSettingsNotifications.vue";
import UserBets from "./UserBets.vue";

import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'


export default {
  components: {
    UserSettingsGeneral,
    UserSettingsChangePassword,
    UserSettingsInfo,
    UserSettingsSocialLinks,
    UserSettingsConnections,
    UserSettingsNotifications,
    UserBets
  },
  methods: {
    fetch_user_data(userId) {
      this.$store
        .dispatch("userManagement/fetchUser", userId)
        .then((r) => r.data)
        .then((res) => {
          if (res.status == true) this.user_data = res;
          else this.user_not_found = true;
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.user_not_found = true;
            return;
          }
          console.error(err);
        });
    },
  },
  created() {
    if(!moduleUserManagement.isRegistered) {
      this.$store.registerModule('userManagement', moduleUserManagement)
      moduleUserManagement.isRegistered = true
    }
    this.fetch_user_data(this.$route.params.userId);
  },
  data() {
    return {
      user_not_found:false,
      user_data:null
    };
  },
  computed: {
    isSmallerScreen() {
      return this.$store.state.windowWidth < 768;
    },
  },
};
</script>

<style lang="scss">
#profile-tabs {
  .vs-tabs--content {
    padding: 0;
  }
}
</style>
