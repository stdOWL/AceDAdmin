<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">

          <div class="vx-row no-gutter justify-center items-center">

            <div class="vx-col hidden lg:block lg:w-1/2">
              <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8 login-tabs-container">

                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Login</h4>
                </div>

                <div>
                  <vs-input
                      name="email"
                      icon-no-border
                      icon="icon icon-user"
                      icon-pack="feather"
                      label-placeholder="Email"
                      v-model="email"
                      class="w-full"/>

                  <vs-input
                      type="password"
                      name="password"
                      icon-no-border
                      icon="icon icon-lock"
                      icon-pack="feather"
                      label-placeholder="Password"
                      v-model="password"
                      class="w-full mt-6" />

<vs-input
  v-if="tfaRequired"
                      name="tfacode"
                      icon-no-border
                      icon="icon icon-user"
                      icon-pack="feather"
                      label-placeholder="2FA Code"
                      v-model="tfacode"
                      class="w-full"/>
                  <div class="flex flex-wrap justify-between my-5">
                  </div>
                  <vs-button class="float-right" @click="login">Login</vs-button>



                </div>

              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import axios from "@/axios.js"

export default{
  data() {
    return {
      tfaRequired:false,
      tfacode:"",
      email: "",
      password: "",
      checkbox_remember_me: false,
    }
  },
  methods:{
    login(){
      var ep = "/dauth";
      if(this.tfaRequired && this.tfacode) {
        ep = "/dtfaauth";
        if(this.tfacode.length != 6)
          return;
      }

      axios.post(ep, {email:this.email, password: this.password, tfacode: this.tfacode})
        .then( d => d.data )
        .then((response) => {

          if(response.status == false){
            this.$vs.notify({
              title: 'Login',
              text: response.message,
              color: 'danger'
            })
          }else{

            if(response.tfaRequired == true) {
              this.$vs.notify({
                title: '2FA',
                text: "Please enter 2FA Code!",
                color: 'warning'
              })
              this.tfaRequired = true;
              return;
            }


            const item = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              username: response.username,
              email: response.email
            }
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.accessToken;
            localStorage.setItem('user', JSON.stringify(item))
            //UPDATE_CURRENT_USER
            this.$store.dispatch("UPDATE_CURRENT_USER",item).catch(err => { console.error(err) })
            this.$router.push("/");
          }
        });
    }
  }
}
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook { background-color: #1551b1 }
    .bg-twitter { background-color: #00aaff }
    .bg-google { background-color: #4285F4 }
    .bg-github { background-color: #333 }
  }
}
</style>
