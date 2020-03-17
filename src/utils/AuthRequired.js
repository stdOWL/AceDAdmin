export default (to, from, next) => {
  console.log(localStorage.getItem('user'));
  if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {
    // verify with firebase or jwt
    next()
  } else {
    localStorage.removeItem('user')
    next('/login')
  }
}
