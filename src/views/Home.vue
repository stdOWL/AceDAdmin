<template>
    <div>
          <vs-tabs alignment="right">
                <vs-tab label="ACED">
                     <div class="vx-row">
            
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :hideChart="true"
                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total User Lost"
                   />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                                    :hideChart="true"

                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total User Win"
                  color='danger'
                   />
            </div>
             <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                                    :hideChart="true"

                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total Profit"
                  color='success'
                   />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :hideChart="true"

                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total Deposit"
                  color='warning'
                   />
            </div>
    </div>
                </vs-tab>
                <vs-tab label="BTC">
                    <div class="vx-row">
            
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :hideChart="true"
                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total User Lost"
                   />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                                    :hideChart="true"

                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total User Win"
                  color='danger'
                   />
            </div>
             <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                                    :hideChart="true"

                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total Profit"
                  color='success'
                   />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :hideChart="true"

                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total Deposit"
                  color='warning'
                   />
            </div>
    </div>
                </vs-tab>
                
            </vs-tabs>
       
    <div class="vx-row">

            <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
                <vx-card title="Hot Wallets">
                    <div v-for="(wallet, index) in hotWallets" :key="wallet.id" :class="{'mt-4': index}">
                        <div class="flex justify-between">
                            <div class="flex flex-col">
                                <span class="mb-1">{{ wallet.name }}</span>
                                <h4>{{ 0 }}%</h4>
                            </div>
                            <div class="flex flex-col text-right">
                                <span class="flex -mr-1">
                                    <span class="mr-1">{{ wallet.balance }} {{ wallet.name }}</span>
                                </span>
                            </div>
                        </div>
                        <vs-progress :percent="0"></vs-progress>
                    </div>



                </vx-card>
            </div>
    </div>
     </div>
</template>

<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import axios from '@/axios.js';
export default {
  components:{
    StatisticsCardLine
  },
  created(){
    axios.get(`/summary`).then(r=>r.data).then(r=>{
      this.hotWallets = r.hotWallets
    });
  },
  data(){
    return {
          hotWallets:[],
      subscribersGained:{
        series: [{
          name: '$',
          data: [28, 40, 36, 52, 38, 60, 55]
        }],
        analyticsData: {
          subscribers: 92600
        }
      }
    }
  }
}
</script>

<style>

</style>
