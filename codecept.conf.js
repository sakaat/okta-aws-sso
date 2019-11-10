exports.config = {
    tests: "./*_test.js",
    helpers: {
        Puppeteer: {
            url: "http://localhost",
            show: false,
        },
    },
};
