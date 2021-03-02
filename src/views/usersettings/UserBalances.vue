<template>
  <vx-card no-shadow>
    <b-modal
      id="modal-amount"
      ref="modal-amount"
      cancel-variant="outline-secondary"
      ok-title="Balance Change"
      cancel-title="Close"
      centered
      @ok="handleOk"
      title="Balance Change"
    >
      <b-form v-if="selectedWallet">
        <b-form-group>
          <label for="amount">{{ selectedWallet.name }} Amount:</label>
          <b-form-input
            id="amount"
            type="text"
            value="0"
            v-model="selectWalletBalance"
            placeholder="Amount"
          />
        </b-form-group>
      </b-form>
    </b-modal>

    <template v-for="uw in userwallets">
      <b-input-group :key="uw.id" :prepend="uw.name" class="mt-3">
        <b-form-input :value="uw.balance"></b-form-input>
        <b-input-group-append>
          <b-button @click="showModal(uw)" variant="outline-success"
            >Change</b-button
          >
        </b-input-group-append>
      </b-input-group>
    </template>
  </vx-card>
</template>

<script>
import axios from "@/axios.js";

export default {
  data() {
    return {
      selectedWallet: 0,
      selectWalletBalance: 0
    };
  },
  methods: {
    handleOk() {
      this.$vs.loading({ text: "Just a sec.", type: "radius" });

      let value = parseFloat(this.selectWalletBalance);
      let op = "increase";
      if (value < 0) {
        op = "decrease";
        value = value * -1.0;
      }
      axios
        .post("/admin/updateBalance", { op, value, id: this.selectedWallet.id })
        .then(r=>r.data)
        .then(response => {
          this.$vs.loading.close();
          if(response.res && response.res.balance)
          this.$vs.notify({
            title: "Done",
            text: "New balance: " + response.res.balance.toString() + " " + response.res.name.toString(),
            color: "success",
            icon: "check_box"
          });

        })
        .catch((e) => {
          this.$vs.notify({
            title: "Error",
            text: e,
            color: "danger",
            icon: "check_box"
          });
          this.$vs.loading.close();
        });
    },
    showModal(w) {
      this.selectedWallet = w;
      this.$refs["modal-amount"].show();
    }
  },
  props: ["userwallets"],
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    }
  }
};
</script>
