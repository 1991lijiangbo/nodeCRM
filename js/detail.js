/**
 * Created by Administrator on 2017/2/16.
 */
/*解析url字符串,将问号传参内容解析成对象*/
~(function (pro){
    function queryParameter(){
        var reg=/([^#&?=]+)=([^#&?=]+)/g,
        obj={};
        this.replace(reg,function () {
            obj[arguments[1]]=arguments[2];
        });
        return obj;
    }
    pro.queryParameter=queryParameter;
})(String.prototype);
/*此页面首先判断url地址，有问号传参是修改，没有问号传参就是增加，
* 在提交时判断，初始化时也判断，初始化时如果是修改，还要获取到该用户信息；
* */
var detailRender=(function () {
    var submit=document.getElementById('submit'),
        userName=document.getElementById('userName'),
        customId=null;
    function submitData() {
        if(userName.value.length==0){
            alert('请输入用户名！');
            return;
        }
        if(typeof customId!=='undefined'){
        //    修改
            ajax('/updateInfo',{
                method:'POST',
                data:{
                    name:userName.value,
                    id:customId
                },
                success:function (result) {
                    if(result&&result.code==0){
                        alert('修改成功！');
                        window.location.href='index.html';
                    }else{
                        alert('修改失败！');
                    }
                }
            });
            return;
        }
        ajax('/addInfo',{
            method:'POST',
            data:'name='+userName.value,
            success:function (result) {
                if(result&&result.code==0){
                    alert('添加成功');
                    window.location.href='index.html';
                }else{
                    alert('添加失败');
                }
            }
        })
    }
    return {
        init:function () {
        //    首先解析地址，看是否有问号传参
            var urlObj=window.location.href.queryParameter();
            customId=urlObj.id;
            if(typeof customId!=='undefined'){
            //    没有问号传参，修改，先获取到该用户信息
                ajax('/getInfo',{
                    data:'id='+customId,
                    success:function (result) {
                        if(result&&result.code===0){
                            var data=result.data;
                            userName.value=data.name;
                        }
                    }
                })
            }
        //    点击提交按钮提交数据
            submit.onclick=submitData;
        }
    }
})();
detailRender.init();