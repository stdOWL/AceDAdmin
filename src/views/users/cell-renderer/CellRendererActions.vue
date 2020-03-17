<template>
    <div :style="{'direction': $vs.rtl ? 'rtl' : 'ltr'}">
      <feather-icon icon="Edit3Icon" svgClasses="h-5 w-5 mr-4 hover:text-danger cursor-pointer" @click="editRecord" />
    </div>
</template>

<script>
    export default {
        name: 'CellRendererActions',
        methods: {
          editRecord() {

              this.$router.push("/user-edit/" + this.params.data.username).catch(() => {})

          },



        }
    }
</script>
