//需要手动配置 版本号！！！这尼玛是要重启的
module.exports = {
    mapRules: [
        // tm/sell-category
        {
            rule:'tm/sell-category/1.1.4/',
            target: "/Users/ghy/github/gitlab/sell-category/build"
        },
        // tm/sell-goods
        {
            rule:'tm/sell-goods/1.1.5/',
            target: "/Users/ghy/github/gitlab/sell-goods/build"
        },
        // tm/sell-audit
        {
            rule:'tm/sell-audit/1.0.5/',
            target: "/Users/ghy/github/gitlab/sell-audit/build"
        },
        // tm/sell-product
        {
            rule:'tm/sell-product/1.1.13/',
            target: "/Users/ghy/github/gitlab/sell-product/build"
        },
        // tm/sell-publish
        {
            rule:'tm/sell-publish/1.2.1/',
            target: "/Users/ghy/github/gitlab/sell-publish/build"//grunt
        },
        // tm/x2-base
        {
            rule:'tm/x2-base/1.0.3/',
            target: "/Users/ghy/github/gitlab/x2-base/build"
        },
        // tm/mcs-activity
        {
            rule:'tm/mcs-activity/1.1.2/',
            target: "/Users/ghy/github/gitlab/mcs-activity/build"
        },
        // tm/voc-tousu
        {
            rule:'tm/voc-tousu/1.0.2/',
            target: "/Users/ghy/github/gitlab/voc-tousu/build"
        },
        //  tm/mcs-baoming
        {
            rule:'tm/mcs-baoming/1.0.8/',
            target: "/Users/ghy/github/gitlab/mcs-baoming/build"
        },
        //tm/mcs-meow
        {
            rule:'tm/mcs-meow/1.2.7/',
            target: "/Users/ghy/github/gitlab/mcs-meow/build"
        },
        // tm/seller-x2-nova
        {
            rule:'tm/seller-x2-nova/1.1.5/',
            target: "/Users/ghy/github/gitlab/seller-x2-nova/build"
        },
        // tm/seller-sellergrow
        {
            rule:'tm/seller-sellergrow/1.1.11/',
            target: "/Users/ghy/github/gitlab/seller-sellergrow/build"
        },
        {
            rule:'tm/seller-sellergrow/1.1.12/',
            target: "/Users/ghy/github/gitlab/seller-sellergrow/build"
        },
        //wuliu-inventory
        {
            rule:'tm/wuliu-inventory/1.0.4/',
            target: "/Users/ghy/github/gitlab/wuliu-inventory/build"
        },
        //spuevolution
        {
            rule:'tm/spuevolution/1.0.0/',
            target: "/Users/ghy/github/gitlab/spuevolution/build"
        },
        //mui/floatbar
        {
            rule:'mui/floatbar/1.0.0/index.js',
            target: "/Users/ghy/github/gitlab/mui/floatbar/build/index.js"
        }
    ],
    hostRouter: {
        "local.lovestory.net": "127.0.0.1:8080"
        ,"local.lovestory11.net":"127.0.0.1:8080"
        ,"local.love.net":"127.0.0.1:8080"
        ,"local.sell.net":"127.0.0.1:8080"
        ,"localhost": "127.0.0.1:8080"
        ,"127.0.0.1": "127.0.0.1:8080"
    }
}