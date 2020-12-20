/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

export default [
  {
    url: "/",
    name: "Home",
    slug: "home",
    perm: "SHOW_SUMMARY",

    icon: "HomeIcon"
  },
  {
    url: "/userbets",
    name: "Active User Bets",
    slug: "userbets",
    perm: "SHOW_ACTIVEBETS",
    icon: "CheckSquareIcon"
  },
  {
    url: "/userbetsall",
    name: "All User Bets",
    slug: "userbetsall",
    perm: "SHOW_ALLBETS",
    icon: "UserCheckIcon"
  },
  {
    url: "/users",
    name: "Users",
    perm: "SHOW_USERS",
    slug: "users",
    icon: "UsersIcon"
  },
  {
    url: "/sports",
    name: "Sports",
    slug: "sports",
    perm: "SHOW_SPORTS",

    icon: "ZapIcon"
  },
  {
    url: "/services",
    name: "Services",
    slug: "services",
    perm: "SHOW_SERVICES",


    icon: "ActivityIcon"
  },
  {
    name: "Transactions",
    icon: "ArchiveIcon",
    perm: "SHOW_TXS",

    submenu: [
      {
        perm: "SHOW_DEPOSITS",
        url: "/transactions/deposits",
        name: "Deposits",
        slug: "deposits",

        icon: "ArchiveIcon"

      },
      {
        perm: "SHOW_WIDTHRAWS",
        url: "/transactions/withdraws",
        name: "Withdraws",
        slug: "withdraws",

        icon: "ArchiveIcon"
      }
    ]
  }
];
