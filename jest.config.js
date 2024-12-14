//tämä konfiguraatio on tarpeen koska projekti käyttää SWC transpilaattoria eikä babelia
module.exports = {
    transform: {
      '^.+\\.js$': '@swc/jest',
    },
    
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironment: 'jsdom',
  };