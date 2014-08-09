var fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    colors = require('colors'),
    Buffer = require('buffer').Buffer

function isComboUrl(url){
    return ~url.indexOf('??')
}

function render404(res, file){
    res.writeHead(404);
    res.end(file + ' no found!')
}

module.exports = function(req, res, map){
    if(isComboUrl(req.url)){
        var t = req.url.split('??'),
            comboBase = t[0],
            fileurls = t[1].split('?')[0].split(','),
            buffers = [];
        
        for(var i = 0; i < fileurls.length; i++){
            fileurls[i] = comboBase + fileurls[i];
            
            
            var filepath = fileurls[i].split(map.rule)[1];
            if(filepath){
                var fullpath = path.join(map.target, filepath);
                try{
                    buffers.push(new Buffer(fs.readFileSync(fullpath, 'binary'), 'binary'));
                    buffers.push(new Buffer('\r\n', 'binary'));
                    fileurls[i] = fullpath;
                }catch(e){
                    render404(res, fullpath)
                }
            }
        }
        
        var extraInfo = new Buffer('/* local combo files:\r\n'+ fileurls.join(',\r\n') + ' */\r\n', 'binary'),
            content = Buffer.concat(buffers);
            
        res.writeHead(200, {
            'Content-Type': mime.lookup(fileurls[0])
        });
        
        res.end(Buffer.concat([extraInfo, content]), 'binary');
        
        var logInfo = extraInfo.toString();
        console.log('%s'.grey, logInfo.slice(0, logInfo.length - 1));
    }else{

        var fileurl = req.url.split('?')[0],
            filepath = fileurl.split(map.rule)[1],
            fullpath = path.join(map.target, filepath)

        console.log(map.rule, fileurl.split(map.rule));
        try{

            var extraInfo =new Buffer('', 'binary'),
                content = new Buffer(fs.readFileSync(fullpath, 'binary'), 'binary');

            if(/\.js|\.css/.test(fullpath)){
                extraInfo = new Buffer('/* local file : '+ fullpath + ' */\r\n', 'binary');
            }

            res.writeHead(200, {
                'Content-Type': mime.lookup(fullpath)
            });

            res.end(Buffer.concat([extraInfo, content]), 'binary');
            
            var logInfo = extraInfo.toString();
            console.log('%s'.grey, logInfo.slice(0, logInfo.length - 1));
        }catch(e){
            render404(res, fullpath)
        }
    }
}