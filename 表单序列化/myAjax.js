/**
 * Created by jne on 2017/8/21.
 */
(function (window) {
    /*暴漏一个空的对象*/
    var myajax = {};

    window.myajax = myajax;


/*有两个方法一个是get post 两个方法看里面函数传的到底是什么*/
 myajax.get = function(){
     var arglength = arguments.length;

     var URL,json,callback;
     /*如果用户传进两个参数进来myajax.get("1.php",http://www.baidu.com?name=huhao&sex=14)*/
     if(arglength == 2 && typeof arguments[0] == "string" && typeof arguments[1] == "function"){

         /*先要判断有两个参数的时候*/
         /*得到两个参数*/
         URL = arguments[0];
         callback = arguments[1];

         /*拿到参数发送ajax请求*/
         myajax._doajax("get",URL,null,null,callback)




     }else if(arglength == 3 && typeof arguments[0] == "string" && typeof arguments[1] == "object"&& typeof arguments[2] == "function"){


         URL = arguments[0];
         json = arguments[1];
         callback = arguments[2]
         myajax._doajax("get",URL,json,null,callback)
     }else {
        throw new Error("get方法参数错误")
     }

 }

    /*如果是post请求的*/

    myajax.post = function(){

        /*得到参数的个数*/
        var arglength = arguments.length;


        var URL,json,callback;
        if(arglength == 3 && typeof arguments[0] == "string" && typeof arguments[1] == "object"&& typeof arguments[2] == "function"){

            /*得到参数*/

            URL = arguments[0];
            json = arguments[1];
            callback = arguments[2]

            myajax._doajax("post",URL,json,null,callback)


        }else{
            /*抛出这个错误*/
            throw new Error("post方法错误")
        }



    }


    myajax.postAllFrom = function(URL,fromId,callback){

        var params = myajax._formserialize(fromId);
        console.log(params)
        myajax._doajax("post",URL,null,params,callback)


    }



    
    
    myajax._doajax = function (method,URL,json,params,callback) {
        /*做一下兼容*/
        if(XMLHttpRequest){
            var xhr = new XMLHttpRequest();
        }else {
            var xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                    callback(null,xhr.responseText);
                    
                }else{
                    callback("文件没有找到",xhr.status,null)
                }
            }
        }


        if(method == "get"){
            if(json){
                var combineChar = URL.indexOf("?") == -1 ? "?" : "&";
                URL += combineChar + myajax.JSONtoURLparams(json);

            }
            /*增加随机数防止缓存*/
            var combineChar = URL.indexOf("?") == -1 ? "?" : "&";
            URL+= combineChar + Math.random().toString().substr(2)
            console.log(URL)
            
            xhr.open("get",URL,true);
            xhr.send(null);
        }else if(method == "post"){
            xhr.open("post",URL,true)
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded utf8")
            if(json){
                xhr.send(myajax.JSONtoURLparams(json));
                
            }else if(params){
                xhr.send(params);
            }
        }


        
        
    }



    myajax.JSONtoURLparams = function (json) {
        var arrParts = [];
        for(k in json){
            arrParts.push(k + "=" + encodeURIComponent(json[k]) )
        }

        return arrParts.join("&")


    }
    
    
    /*表单序列化*/
    myajax._formserialize = function (formId) {
        var oForm = document.getElementById(formId);
        var oBtn = document.getElementById("btn");
        /*获得所有表单控件*/
        var fields = oForm.elements;
        var fieldLength = fields.length;
        //console.log(fields)
        /*遍历得到的控件*/
        var partsArray = new Array();
        for(var i = 0 ; i < fieldLength; i ++ ){
            var field = fields[i];
            var k = field.name;
            var v = "";
            /*根据什么的样的控件来决定value*/
            switch (field.type){
                case "button":
                case "submit":
                case "reset":
                    break;
                case "select-one":
                    var options = field.options;
                    var optionsLength = options.length
                    for(var j = 0 ; j < optionsLength; j++){
                        if(options[j].selected){
                            v = options[j].value;
                            partsArray.push(k + "="+ v)


                        }

                    }
                    break;
                case "radio":
                case "checkbox":
                    if(!field.checked){
                        break;
                    }
                case "text":
                default:
                    v = field.value;
                    partsArray.push(k + "=" +v)
                    break;




            }
            

        }
        return partsArray.join("&")

        
        
    }






















})(window)