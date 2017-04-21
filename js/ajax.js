/**
 * Created by Administrator on 2017/2/16.
 */
~(function () {
    /*check:检测数据类型
    * 参1：val,要检测的数据值
    * 参2，type，检测是否为这个类型
    * 返回布尔值
    * */
    function check(val,type) {
        var curType=Object.prototype.toString.call(val);
        type='[object '+type+']';
        return curType.toUpperCase()===type.toUpperCase();
    }

    //format:把对象转化为xxx=xx&xxx=xx形式的字符串
    /*参数obj:要转化的对象
    * 返回拼接完的字符串
    * */
    function format(obj) {
        var res='';
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                res+=key+'='+obj[key]+'&';
            }
        }
        res=res.substring(0,res.length-1);
        return res;
    }

    function ajax(url,option) {
        var _default={
            url:null,
            method:'get',
            data:null,
            dataType:'json',
            async:true,
            cache:true,
            success:null
        };
        if(typeof url=='string'){
            _default.url=url;
        }else if(check(url,'object')){
            option=url;
            url=undefined;
        }
        for(var key in option){
            if(option.hasOwnProperty(key)){
                if(key=='type'){
                    _default.method=option.type;
                    continue;
                }
                _default[key]=option[key];
            }
        }
        //DATA参数处理
        /*1.验证当前url是否有问号
         * 2.分不同的请求和传递的内容的不同，做不同的处理：
         * GET:
         *字符串：直接拼接在URL末尾
         * 对象：把对象先转化为xxx=xx&xxx=xx的形式，拼接在末尾
         * POST：
         * 对象：需要转为xxx=xx的字符串，然后整体都放在主体重传递给服务即可，
         * 不是对象：给什么就给服务器传递什么
         * */
        var isMark=false;
        _default.url.indexOf('?')>=0?isMark=true:null;
        var chart='?';
        isMark?chart='&':null;
        if(_default.data){
            check(_default.data,'object')?_default.data=format(_default.data):null;
        //        判断请求方式
            if(/^(GET|DELETE|HEAD)$/i.test(_default.method)){
                _default.url+=chart+_default.data;
                _default.data=null;
                isMark=true;
                chart='&';
            }

        }

        //CACHE参数处理
        /*如果是GET系列的请求，并且cache设置成false，需要在url的末尾追加随机数清除缓存
        * */
        if(/^(GET|DELETE|HEAD)$/i.test(_default.method)&&_default.cache==false){
            _default.url+=chart+'_='+Math.random();
        }
    //    发送ajax请求
        var xhr=new XMLHttpRequest;
        xhr.open(_default.method,_default.url,_default.async);
        xhr.onreadystatechange=function () {
            if(xhr.status==200&&xhr.readyState==4){
                var result=xhr.responseText;
                switch (_default.dataType.toUpperCase()){
                    case 'JSON':
                        result='JSON' in window?JSON.parse(result):eval('('+result+')');
                        break;
                    case 'XML':
                        result=xhr.responseXML;
                        break
                }
                _default.success&&_default.success.call(xhr,result);
            }
        };
        xhr.send(_default.data);
    }
    window.ajax=ajax;
})();