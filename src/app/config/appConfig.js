// @flow weak

export const appConfig = {
  // dev mode to mock async data for instance
  DEV_MODE: true,
  // When you need some kind "console spam" to debug
  DEBUG_ENABLED: true,
  // fake delay to mock async
  FAKE_ASYNC_DELAY: 1000,


  APP_NAME: 'PMS',

  // connection status text references
  CONNECTION_STATUS: {
    online: 'online',
    disconnected: 'disconnected'
  },
  // eaningGraph config
  earningGraph: {
    data: {
      API: 'api/earnigGraphData'
    }
  },
  teamMates:{
    data: {
      API: 'api/teamMates'
    }
  },

  // userInfos config
  userInfos: {
    data: {
      API: 'api/userInfos'
    }
  },
  plantInfos: {
    data: {
      API: 'plant/read/all'
    }
  },
  HELLO_WORD: 'Hello'

};
