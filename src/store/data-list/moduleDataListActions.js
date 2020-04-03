/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js"

export default {
  fetchDataListItems({ commit }, payload) {
    commit('SET_LOAD', false);
    return new Promise((resolve, reject) => {
      axios.get("/userbets",{params:payload})
        .then((response) => {



          commit('SET_TOTAL', response.data.total)
          commit('SET_PRODUCTS', response.data.bets)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  fetchDataListItemsAll({ commit }, payload) {
    commit('SET_LOAD', false);

    return new Promise((resolve, reject) => {
      axios.get("/userbetsall",{params:payload})
        .then((response) => {



          commit('SET_TOTAL', response.data.total)
          commit('SET_PRODUCTS', response.data.bets)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
  removeItem({ commit }, itemId) {
    commit('REMOVE_ITEM', itemId)
  },
  // eventDragged({ commit }, payload) {
  //   return new Promise((resolve, reject) => {
  //     axios.post(`/api/apps/calendar/event/dragged/${payload.event.id}`, {payload: payload})
  //       .then((response) => {

  //         // Convert Date String to Date Object
  //         let event = response.data
  //         event.startDate = new Date(event.startDate)
  //         event.endDate = new Date(event.endDate)

  //         commit('UPDATE_EVENT', event)
  //         resolve(response)
  //       })
  //       .catch((error) => { reject(error) })
  //   })
  // },
}
