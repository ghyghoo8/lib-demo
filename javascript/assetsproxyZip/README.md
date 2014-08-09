简介
-------
assetsproxy是一个简单好用的assets本地开发和调试工具。它能把线上assets文件映射到本地、或者映射到其他线上路径，方便开发和调试代码，支持的映射方式有单文件映射、目录映射、combo映射（自动）。assetsproxy还提供了路由转发的功能，用以解决本地多个服务需要同时占用80端口的问题。

安装
-------

####安装assetsproxy####
	sudo npm install -g assetsproxy

####启动####
在任意目录下建立配置文件config.js，配置模板：

    module.exports = {
        mapRules: [{
            rule: "apps/tmallsell",
            target: "F:/wwwroot/tmallsell/assets"
        }],
		//端口路由
        hostRouter: {
            "detail.daily.tmall.net": "127.0.0.1:8080"
        }
    }

然后在该目录下执行：

    sudo assetsproxy ./config.js


USAGE
-------

    Usage: sudo assetsproxy [options] <config file...>

    Options:
      -h, --help         帮助
      -p, --port [port]  设置监听端口(默认80).

    #绑定host：
    127.0.0.1 assetsproxy
    127.0.0.1 assets.daily.taobao.net
    127.0.0.1 a.tbcdn.cn


####路由转发####
在assetsproxy监听的80端口进行路由转发的配置，可以解决多个服务需要同时使用80端口的问题。具体使用方法请参考FAQ.

FAQ
-------

####如何解决本地环境多个服务器程序（例如Apache、脚手架）需要同时使用80端口的情况？####

有两种方式：

#####方式一（推荐）：#####

设置其他程序监听其他端口，同时在config.js中配置路由转发规则，把匹配的请求转发到其他服务使用的端口，以Apache为例，先让其监听8080端口，然后配置hostRouter：

    hostRouter: {
        "localhost": "127.0.0.1:8080",
		"127.0.0.1": "127.0.0.1:8080",
		"local.tmall.net": "127.0.0.1:8080" //本地demo服务器
    }

#####方式二：#####

设置assetsproxy监听其他端口，让监听80端口的程序转发到assetsproxy的端口。  
例如让assetsproxy启动时监听8888端口：

	sudo assetsproxy config.js -p 8888

同时设置apache的转发规则（需载入mod_proxy模块）：

    <VirtualHost *:80>
    ServerName a.tbcdn.cn
    ServerAlias assets.daily.taobao.net
    ProxyRequests off
    ProxyPreserveHost on
    ProxyPass / http://127.0.0.1:8888/
    ProxyPassReverse / http://127.0.0.1:8888/
    </VirtualHost>


