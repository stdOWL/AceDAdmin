<!-- =========================================================================================
    File Name: FormWizardNumberTab.vue
    Description: Form wizard with numbers in tabs
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <vx-card title="Missing Transaction Tool" code-toggler>
    <p>Please put only transaction id you get from user.</p>

    <div class="mt-5">
      <form-wizard
        color="rgba(var(--vs-primary), 1)"
        :title="null"
        :subtitle="null"
        finishButtonText="Submit"
        @on-complete="formSubmitted"
        @on-loading="setLoading"
        @on-error="handleErrorMessage"
      >
        <tab-content title="TX ID" class="mb-5" :before-change="validateTx">
          <!-- tab 1 content -->
          <div class="vx-row">
            <div class="vx-col md:w-1/2 w-full mt-5">
              <vs-input label="Transaction ID" v-model="txid" class="w-full" />
            </div>

            <div class="vx-col md:w-1/2 w-full mt-5">
              <vs-select
                v-model="chain"
                class="w-full select-large"
                label="Chain"
              >
                <vs-select-item
                  :key="index"
                  :value="item.value"
                  :text="item.text"
                  v-for="(item, index) in chainOptions"
                  class="w-full"
                />
              </vs-select>
            </div>
          </div>
        </tab-content>

        <!-- tab 2 content -->
        <tab-content title="Verify" class="mb-5">
          <div class="vx-row">
            <vs-table v-if="result" noDataText class="w-full">
              <vs-tr>
                <vs-td> Deposit Address </vs-td>
                <vs-td>
                  {{ result.address }}
                </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Deposit Amount </vs-td>
                <vs-td> {{ result.amount }} {{ result.walletName }} </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Username </vs-td>
                <vs-td> {{ result.username }} - {{ result.email }} </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Confirmation </vs-td>
                <vs-td>
                  {{ result.confirmations }}
                </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Transaction </vs-td>
                <vs-td>
                  {{ result.txid }}
                </vs-td>
              </vs-tr>
            </vs-table>
          </div>

          <div class="vx-row">
            <vs-table v-if="result" noDataText class="w-full">
              <template slot="thead">
                <vs-th>Test Name</vs-th>
                <vs-th>Result</vs-th>
                <vs-th></vs-th>
              </template>

              <vs-tr>
                <vs-td> Transaction Info Accessed </vs-td>
                <vs-td>
                  <div
                    v-if="result.tests.transaction_received"
                    class="badge badge-pill badge-glow badge-success mr-1 mb-1"
                  >
                    Passed
                  </div>
                  <div
                    v-else
                    class="badge badge-pill badge-glow badge-danger mr-1 mb-1"
                  >
                    Failed
                  </div>
                </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Transaction Did Not Processed Before </vs-td>
                <vs-td>
                  <div
                    v-if="result.tests.transaction_ok"
                    class="badge badge-pill badge-glow badge-success mr-1 mb-1"
                  >
                    Passed
                  </div>
                  <div
                    v-else
                    class="badge badge-pill badge-glow badge-danger mr-1 mb-1"
                  >
                    Failed
                  </div>
                </vs-td>

                <vs-td>
                  <code v-if="!result.tests.transaction_ok">
                    This transaction already processed.
                  </code>
                </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Greater than minimum deposit </vs-td>
                <vs-td>
                  <div
                    v-if="result.tests.min_deposit"
                    class="badge badge-pill badge-glow badge-success mr-1 mb-1"
                  >
                    Passed
                  </div>
                  <div
                    v-else
                    class="badge badge-pill badge-glow badge-danger mr-1 mb-1"
                  >
                    Failed
                  </div>
                </vs-td>

                <vs-td>
                  <code v-if="!result.tests.min_deposit">
                    Minimum deposit for this wallet is {{ result.minDeposit }}
                  </code>
                </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Find associated user </vs-td>
                <vs-td>
                  <div
                    v-if="result.tests.user_found"
                    class="badge badge-pill badge-glow badge-success mr-1 mb-1"
                  >
                    Passed
                  </div>
                  <div
                    v-else
                    class="badge badge-pill badge-glow badge-danger mr-1 mb-1"
                  >
                    Failed
                  </div>
                </vs-td>
                <vs-td>
                  <code v-if="!result.tests.user_found">
                    Could not find a user, deposit address might be wrong!.
                  </code>
                </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Enough Confirmation </vs-td>
                <vs-td>
                  <div
                    v-if="result.tests.enough_confirm"
                    class="badge badge-pill badge-glow badge-success mr-1 mb-1"
                  >
                    Passed
                  </div>
                  <div
                    v-else
                    class="badge badge-pill badge-glow badge-danger mr-1 mb-1"
                  >
                    Failed
                  </div>
                </vs-td>
                <vs-td> </vs-td>
              </vs-tr>
              <vs-tr>
                <vs-td> Database Inserted </vs-td>
                <vs-td>
                  <div
                    v-if="result.tests.inserted"
                    class="badge badge-pill badge-glow badge-success mr-1 mb-1"
                  >
                    Passed
                  </div>
                  <div
                    v-else
                    class="badge badge-pill badge-glow badge-danger mr-1 mb-1"
                  >
                    Failed
                  </div>
                </vs-td>
                <vs-td>
                  <code v-if="!result.tests.inserted">
                    Due to failed tests, we did not processed the transaction.
                  </code>
                  <code v-else>
                    We processed the transaction successfully!
                  </code>
                </vs-td>
              </vs-tr>
            </vs-table>
          </div>
        </tab-content>
      </form-wizard>
    </div>
  </vx-card>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import axios from "@/axios.js";

export default {
  data() {
    return {
      loadingWizard: false,
      txid: "",
      chain: "",
      chainOptions: [
        { text: "Bitcoin", value: "BTC" },
        { text: "Doge", value: "DOGE" },
        { text: "Litecoin", value: "LTC" },
        { text: "Ethereum", value: "ethereum" },
        { text: "Binance Smart Chain", value: "bsc" }
      ],
      result: null,
      email: "",
      city: "new-york",
      proposalTitle: "",
      jobTitle: "",
      textarea: "",
      eventName: "",
      eventLocation: "san-francisco",
      status: "plannning",

      statusOptions: [
        { text: "Plannning", value: "plannning" },
        { text: "In Progress", value: "in progress" },
        { text: "Finished", value: "finished" }
      ],
      LocationOptions: [
        { text: "New York", value: "new-york" },
        { text: "Chicago", value: "chicago" },
        { text: "San Francisco", value: "san-francisco" },
        { text: "Boston", value: "boston" }
      ]
    };
  },
  methods: {

    mounted() {
    },
    setLoading: function(value) {
      if (value) this.$vs.loading();
      else this.$vs.loading.close();
      this.loadingWizard = value;
    },
    validateTx() {
      return new Promise((resolve, reject) => {
        axios
          .post("/tools/txchecktool", {
            chain: this.chain,
            txid: this.txid
          })
          .then(d => d.data)
          .then(response => {
            if (!response) reject("Connection error");
            if (response.status) {
              this.result = response.result;
              resolve(true);
            } else {
              reject(response.message);
            }
          })
          .catch(e => {
            reject(e);
          });

        //resolve(true);
      });
    },
    formSubmitted() {
      alert("Form submitted!");
    },
    handleErrorMessage: function(errorMsg) {
      if (errorMsg)
        this.$vs.dialog({
          color: "danger",
          title: `Error`,
          text: errorMsg
        });
    }
  },
  components: {
    FormWizard,
    TabContent
  }
};
</script>
