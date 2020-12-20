<template>
  <vx-card title="Revenue">
    <template slot="actions">
      <feather-icon
        icon="SettingsIcon"
        svgClasses="w-6 h-6 text-grey"
      ></feather-icon>
    </template>
    <div slot="no-body" class="p-6 pb-0">
      <div class="flex" v-if="revenueComparisonLine.analyticsData">
        <div class="mr-6">
          <p class="mb-1 font-semibold">This Month</p>
          <p class="text-3xl text-success">
            <sup class="text-base mr-1">$</sup
            >{{
              revenueComparisonLine.analyticsData.thisMonth.toLocaleString()
            }}
          </p>
        </div>
        <div>
          <p class="mb-1 font-semibold">Last Month</p>
          <p class="text-3xl">
            <sup class="text-base mr-1">$</sup
            >{{
              revenueComparisonLine.analyticsData.lastMonth.toLocaleString()
            }}
          </p>
        </div>
      </div>
      <vue-apex-charts
        type="line"
        height="266"
        :options="revenuechartOptions"
        :series="revenueComparisonLine.series"
      />
    </div>
  </vx-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    VueApexCharts,
  },
  data() {
    return {
      revenueComparisonLine: {
        analyticsData: {
          thisMonth: 86589,
          lastMonth: 73683,
        },
        series: [
          {
            name: "AceD",
            data: [45000, 47000, 44800, 47500, 45500, 48000, 46500, 48600],
          },
          {
            name: "ETH",
            data: [16000, 48000, 35500, 46600, 44500, 46500, 45000, 47000],
          },
          {
            name: "mBTC",
            data: [41000, 48000, 45500, 43600, 44500, 46500, 45000, 42000],
          },
          {
            name: "USDC",
            data: [36000, 48000, 42500, 46600, 44500, 46500, 45000, 47000],
          },
        ],
      },
      revenuechartOptions: {
        chart: {
          toolbar: { show: true },
          dropShadow: {
            enabled: true,
            top: 5,
            left: 0,
            blur: 4,
            opacity: 0.1,
          },
        },
        stroke: {
          curve: "smooth",
          dashArray: [0, 8],
          width: [4, 2],
        },
        grid: {
          borderColor: "#e7e7e7",
        },
        legend: {
          show: true,
        },
        colors: ["#F97794", "#b8c2cc"],
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            inverseColors: false,
            gradientToColors: ["#7367F0","#7367F0","#7367F0","#7367F0", "#b8c2cc"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
        },
        markers: {
          size: 0,
          hover: {
            size: 5,
          },
        },
        xaxis: {
          labels: {
            style: {
              cssClass: "text-grey fill-current",
            },
          },
          axisTicks: {
            show: true,
          },
          categories: ["01", "05", "09", "13", "17", "21", "26", "31"],
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          tickAmount: 5,
          labels: {
            style: {
              cssClass: "text-grey fill-current",
            },
            formatter: function (val) {
              return val > 999 ? (val / 1000).toFixed(1) + "k" : val;
            },
          },
        },
        tooltip: {
          x: { show: true },
        },
      },
    };
  },
  props: ["userdata"],
  created() {},
  computed: {},
};
</script>
