var http = require('http'),
    _ = require('underscore'),
    colors = require('colors'),
    httpProxy = require('http-proxy'),
    proxy = new httpProxy.RoutingProxy(),
    localHanlder = require('./localhandler'),
    httpHanlder = require('./httphandler'),
    defaultRouter = {
        "assets.daily.taobao.net": "10.235.136.37",
        "a.tbcdn.cn": "115.238.23.251",
        "l.tbcdn.cn": "122.225.111.240",
        "g.tbcdn.cn": "10.235.136.37",
        "g.assets.daily.taobao.net": "10.235.136.37"
    },
    //forwardList = /\.ico|\.jpg|\.jpeg|\.gif|\.png/,
    forwardList=/\.ico/,
    srv

function testSingleRule(url, rule){
    return (_.isRegExp(rule) && rule.exec(url)) || ~url.indexOf(rule);
}

function testRules(url, rules){
    for(var i = rules.length-1; i > -1; i--){
        if(testSingleRule(url, rules[i].rule)) return i;
    }
    return -1;
}

function isHttpType(map){
    return map.match(/http(?:s?):\/\//) ? true : false;
}

module.exports = {
    run: function(port, file){
        port = port || 80;
        
        console.info('assetsproxy is starting up...'.rainbow);
        
        srv = http.createServer(function (req, res) {
            var config = require(file),
                host = req.headers.host,
                hostRouter = _.clone(defaultRouter)

            _.extend(hostRouter, config.hostRouter);
            
            if(hostRouter && hostRouter[host]){
                var url = req.url, 
                    mapRules = config.mapRules, i;

                    // console.log('host reg:'+host);

                if(!forwardList.exec(url) &&  ~(i = testRules(req.url, config.mapRules))){
                    console.log('[%s] request %s', req.connection.remoteAddress, url);
                    var map = mapRules[i];
                    isHttpType(map.target) ? 
                        httpHanlder(req, res, map) : localHanlder(req, res, map)
                }else{
                    var target = hostRouter[host].split(':');
                    proxy.proxyRequest(req, res, {
                        host: target[0] || "127.0.0.1",
                        port: target[1] || 80
                    });
                }
            }else{
                res.end('Please add this domain router in the config file first.');
            }
        });
        srv.listen(port);

        console.log('assetsproxy is running on port %s.'.cyan, port);
    },
    stop: function(){
        srv.stop();
    }
}