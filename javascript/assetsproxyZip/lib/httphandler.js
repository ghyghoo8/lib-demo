var http = require('http'),
    Buffer = require('buffer').Buffer

module.exports = function(req, res, map){

    var targetUrl = req.url.replace(map.rule, map.target),
        buffers = [],
        timeout = 10000;
    
    var _timeout = setTimeout(function(){
        render500(res);
    }, timeout)
    
    http.get(targetUrl, function(response) {
        var extraInfo = new Buffer('/* forward to '+targetUrl+' */\r\n', 'binary');
        buffers.push(extraInfo);
        
        response.on('data', function(chunk){
            buffers.push(chunk)
        });
        
        response.on('end', function(){
            clearTimeout(_timeout);
            res.end(Buffer.concat(buffers));
            
            var logInfo = extraInfo.toString();
            console.log('%s'.grey, logInfo.slice(0, logInfo.length - 1));
        });
    }).on('error', function(){
        render500(res);
    });
}

function render500(res){
    res.writeHead(500);
    res.end();
}