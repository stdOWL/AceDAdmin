<template>
  <vx-card no-shadow>

    <vs-input v-for="uw in userwallets" :key="uw.id" class="w-full mb-base" :value="uw.balance" icon-pack="feather" icon="icon-dollar-sign" :label="uw.name" icon-no-border />

  </vx-card>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: ["userwallets"],
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    },
  }
}
</script>
