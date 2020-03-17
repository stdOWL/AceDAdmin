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
      <div class="vx-col w-full">
        <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="data.userWalletLogs"
        rowSelection="single"
        colResizeDefault="shift"
        :animateRows="true"
        :floatingFilter="true"
        :pagination="true"
        :paginationPageSize="paginationPageSize"
        :suppressPaginationPanel="true"
        >
      </ag-grid-vue>

      <vs-pagination
        :total="totalPages"
        :max="7"
        v-model="currentPage" />

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
import { AgGridVue } from "ag-grid-vue"
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      columnDefs: [
        {
          headerName: '#',
          field: 'id',
          width: 125,
        },
        {
          headerName: 'Wallet',
          field: 'name',
          width: 200,
        },
        {
          headerName: 'Old Balance',
          field: 'old',
          width: 200,
        },
        {
          headerName: 'New Balance',
          field: 'new',
          width: 200,
        },
       {
          headerName: 'Date',
          field: 'date',
          width: 200,
        },

      ],
      gridApi: null,
      gridOptions: {},
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
    }
  },
  components:{
    AgGridVue
  },
  created(){

  },
  computed: {
    paginationPageSize() {
      if(this.gridApi) return this.gridApi.paginationGetPageSize()
      else return 50
    },
    totalPages() {
      if(this.gridApi) return this.gridApi.paginationGetTotalPages()
      else return 0
    },
    currentPage: {
      get() {
        if(this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
        else return 1
      },
      set(val) {
        this.gridApi.paginationGoToPage(val - 1)
      }
    }
  },
  mounted() {
    this.gridApi = this.gridOptions.api
  },
  methods: {

  },
}
</script>
