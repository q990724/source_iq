module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `@import "./src/assets/scss/base";`,
            },
        },
    },
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].title = "Sourcefrom";
            return args;
        })
    },
    publicPath: './',
}
