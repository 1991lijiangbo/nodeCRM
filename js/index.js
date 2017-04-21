/**
 * Created by Administrator on 2017/2/16.
 */
/*请求数据绑定*/
var indexRender=(function () {
    var content=document.getElementsByClassName('content')[0];
    function bindData(data) {
        var str='';
        for(var i=0;i<data.length;i++){
            str+='<li>';
            str+='<span>'+data[i].id+'</span>';
            str+='<span>'+data[i].name+'</span>';
            str+='<span class="editor">';
            str+='<a href="detail.html?id='+data[i].id+'">修改</a>';
            str+='<a href="javascript:;" data-id="'+data[i].id+'">删除</a>';
            str+='</span>';
            str+='</li>';
        }
        content.innerHTML=str;
    }
    function deleteData() {
        content.onclick=function (event) {
            event=event||window.event;
            var target=event.target||event.srcElement;
            if(target.tagName.toUpperCase()=='A'&&target.innerHTML=='删除'){
                var customId=target.getAttribute('data-id'),
                    flag=confirm('您确定删除编号为['+customId+']的用户信息吗？');
                if(flag){
                    ajax('/removeInfo',{
                        data:'id='+customId,
                        success:function (result) {
                            if(result&&result.code==0){
                                alert('删除成功');
                                content.removeChild(target.parentNode.parentNode);
                            }else{
                                alert('删除失败');
                            }
                        }
                    })
                }
            }
        }
    }
    return {
        init:function () {
            /*请求数据*/
            ajax('/getAllList',{
                success:function (result) {
                    if(result&&result.code==0){
                        var data=result.data;
                        bindData(data);
                        deleteData();
                    }
                }
            })
        }
    }
})();
indexRender.init();