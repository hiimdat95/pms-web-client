export const navigation = {
  brand:      'reactDirectorAdmin',
  leftLinks:  [],
  rightLinks: [
    {
      label:      'Home',
      link:       '/',
      view:       'home',
      isRouteBtn: true
    },
    {
      label:      'About',
      link:       '/about',
      view:       'about',
      isRouteBtn: true
    }
  ],
  sideMenu: [
    // group menu #1
    {
      id: 1,
      group: 'Dashboard  ',
      menus: [
        {
          name: 'Dashboard preview',
          linkTo: '/',
          faIconName: 'fa-eye'
        }
      ]
    },
    // group menu #2
    {
      id: 2,
      group: 'SimpleTables',
      menus: [
        {
          name: 'Simple tables preview',
          linkTo: '/simpleTables',
          faIconName: 'fa-eye'
        }
      ]
    }
  ]
};
