<template>
    <div>
        <div class="vx-row">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total User Lost(7 Days)"
                  :chartData="subscribersGained.series"

                  type='area' />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total User Win(7 Days)"
                  :chartData="subscribersGained.series"
                  color='danger'
                  type='area' />
            </div>
             <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total Profit(7 Days)"
                  color='success'
                  :chartData="subscribersGained.series"
                  type='area' />
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
                <statistics-card-line
                  v-if="subscribersGained.analyticsData"
                  icon="DollarSignIcon"
                  :statistic="subscribersGained.analyticsData.subscribers | k_formatter"
                  statisticTitle="Total Deposit(7 Days)"
                  :chartData="subscribersGained.series"
                  color='warning'
                  type='area' />
            </div>
    </div>
    <div class="vx-row">

            <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
                <vx-card title="Hot Wallets">
                    <div v-for="(browser, index) in browserStatistics" :key="browser.id" :class="{'mt-4': index}">
                        <div class="flex justify-between">
                            <div class="flex flex-col">
                                <span class="mb-1">{{ browser.name }}</span>
                                <h4>{{ browser.ratio }}%</h4>
                            </div>
                            <div class="flex flex-col text-right">
                                <span class="flex -mr-1">
                                    <span class="mr-1">{{ browser.comparedResult }}</span>
                                    <feather-icon :icon=" browser.comparedResult < 0 ? 'ArrowDownIcon' : 'ArrowUpIcon'" :svgClasses="[browser.comparedResult < 0 ? 'text-danger' : 'text-success'  ,'stroke-current h-4 w-4 mb-1 mr-1']"></feather-icon>
                                </span>
                                <span class="text-grey">{{ browser.time | time(true) }}</span>
                            </div>
                        </div>
                        <vs-progress :percent="browser.ratio"></vs-progress>
                    </div>



                </vx-card>
            </div>
    </div>
     </div>
</template>

<script>
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'

export default {
  components:{
    StatisticsCardLine
  },
  data(){
    return {
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
