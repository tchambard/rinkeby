require("ts-node").register({
  files: true,
});

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    dashboard: {},
    loc_development_development: {
      network_id: "*",
      port: 8545,
      host: "localhost"
    }
  },
  compilers: {
    solc: {
      version: "0.8.17"
    }
  },
  db: {
    enabled: false,
    host: "localhost"
  }
};
