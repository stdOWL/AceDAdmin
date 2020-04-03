/*=========================================================================================
  File Name: moduleCalendarMutations.js
  Description: Calendar Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
  ADD_ITEM(state, item) {
    state.products.unshift(item)
  },
  SET_LOAD(state, v) {
    state.isProductsLoaded = v;
    if(!v)
    state.products = [];
  },
  SET_TOTAL(state,v){
    state.totalItems = v;
  },
  SET_PRODUCTS(state, products) {
    state.products = products;
    if(!state.isProductsLoaded)
      state.isProductsLoaded = true;

  },
  // SET_LABELS(state, labels) {
  //   state.eventLabels = labels
  // },
  UPDATE_PRODUCT(state, product) {
      const productIndex = state.products.findIndex((p) => p.id == product.id)
      Object.assign(state.products[productIndex], product)
  },
  REMOVE_ITEM(state, itemId) {
      const ItemIndex = state.products.findIndex((p) => p.betid == itemId)
      state.products.splice(ItemIndex, 1)
  },
}
