<template>
  <vx-card no-shadow>



    <!-- Info -->
    <vs-input class="w-full mb-base" label-placeholder="Username" v-model="username"></vs-input>

    <vs-input class="w-full" label-placeholder="Email" v-model="email"></vs-input>


    <vs-alert v-if="verified==0" icon-pack="feather" icon="icon-info" class="h-full my-4" color="warning">
      <span>Your account is not verified. <a href="#" class="hover:underline">Resend Confirmation</a></span>
    </vs-alert>


    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end">
      <vs-button class="ml-auto mt-2">Save Changes</vs-button>
      <vs-button class="ml-4 mt-2" type="border" color="warning">Reset</vs-button>
    </div>
  </vx-card>
</template>

<script>
export default {
  data() {
    return {
      username:null,
      name: null,
      email: null,
      verified:0
    }
  },
  props: ["userdata"],
  created() {
    this.username = this.userdata.userInfo.username;
    this.email = this.userdata.userInfo.email;
    this.verified = this.userdata.userInfo.verified;
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    },
  }
}
</script>
