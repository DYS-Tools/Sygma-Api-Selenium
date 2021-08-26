module.exports = {
    apps : [{
        name: "armada-gps",
        script: "index.js",
        //args: "start",
        autorestart: true,
        env: {
            NODE_ENV: 'production',
            PORT: 2500
        },
        //exec_mode: 'cluster',
        //instances: 4,
    }]
};
