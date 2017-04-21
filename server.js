var http = require('http'),
    url = require('url'),
    fs = require('fs');
var myServer = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;
//    判断请求资源路径
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/html';
        suffix == 'CSS' ? suffixMIME = 'text/css' : (suffix == 'JS' ? suffixMIME = 'text/javascript' : 'text/html');
        var conFile = 'not found',
            status = 404;
        try {
            conFile = fs.readFileSync('.' + pathname, 'utf-8');
            status = 200;
        } catch (e) {

        }
        res.writeHead(status, {'content-type': suffixMIME + ';charset=utf-8;'});
        res.end(conFile);
        return;
    }
    //API
//    先声明统一返回模式
    var result = {code: 1, msg: 'error', data: null},
        dataPath = './json/custom.json',
        customData = fs.readFileSync(dataPath, 'utf-8');
    customData = JSON.parse(customData);
    //1.展示所有客户信息
    if (pathname == '/getAllList') {
        result = {
            code: 0,
            msg: 'success',
            data: customData
        };
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }
    //2.获取指定客户信息
    if (pathname == '/getInfo') {
        var customId = query.id;
        customData.forEach(function (item, index) {
            if (item.id == customId) {
                result = {code: 0, msg: 'success', data: customData[index]};
            }
            return false;
        });
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }
    //3.删除客户信息
    if (pathname == '/removeInfo') {
        customId = query.id;
        customData.forEach(function (item, index) {
            if (customId == item.id) {
                customData.splice(index, 1);
                result = {code: 0, msg: 'success'};
                fs.writeFileSync(dataPath, JSON.stringify(customData), 'utf-8');
            }
            return false;
        });
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }
    //4.增加客户信息，要用request.on();
    if (pathname == '/addInfo') {
        var passData = '';
        req.on('data', function (chunk) {
            passData += chunk;
        });
        req.on('end', function () {
            passData = format(passData);
            passData['id'] = customData.length == 0 ? 1 : parseFloat(customData[customData.length - 1].id) + 1;
            customData.push(passData);
            fs.writeFileSync(dataPath, JSON.stringify(customData), 'utf-8');
            result = {code: 0, msg: 'success'};
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result));
        });
        return;
    }
    //5.修改客户信息
    if (pathname === '/updateInfo') {
        passData = '';
        req.on('data', function (chunk) {
            passData += chunk
        });
        req.on('end', function () {
            passData = format(passData);
            customData.forEach(function (item, index) {
                if (passData.id == item.id) {
                    customData[index] = passData;
                }
            });
            fs.writeFileSync(dataPath, JSON.stringify(customData), 'utf-8');
            result = {code: 0, msg: 'success'};
            res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
            res.end(JSON.stringify(result));
        });
        return;
    }
res.writeHead(404,{'content-type': 'text/plain;charset=utf-8;'});
res.end('request URL is error');
});


myServer.listen(909, function () {
    console.log('909服务监听成功！');
});
//格式化传递的数据为对象格式
function format(str) {
    var reg = /([^#&?=]+)=([^#&?=]+)/gi,
        obj = {};
    str.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}
