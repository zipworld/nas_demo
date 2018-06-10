

'use strict';

var dappAddress = "n1aUrhmoqLE9Z5Vr38wDoeURExWVE37Qz9i";

var InputLoveletter = function() {

}
InputLoveletter.prototype = {

    init: function() {
        var self = this;
        $("#submit").click(function() {
            self.commitLoveletter();
        });
    },

    commitLoveletter: function() {
        $("#loveletter_input_warning").hide().empty();
        var loveletter_uploadUser = $("#loveletter_uploadUser").val();
        var loveletter_name = $("#loveletter_name").val();
        var loveletter_description = $("#loveletter_description").val();
        var warning_note = "";
        if(loveletter_uploadUser == "") {
            warning_note = "上传者ID不能为空";
            $("#loveletter_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#loveletter_input_warning").show();
            // 弹框
            return;
        }
        if(loveletter_name == "") {
            warning_note = "电影名称不能为空";
            $("#loveletter_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#loveletter_input_warning").show();
            // 弹框
            return;
        }
        if(loveletter_description == "") {
            warning_note = "电影简介不能为空";
            $("#loveletter_input_warning").html("<strong>注意: </strong>" + warning_note);
            $("#loveletter_input_warning").show();
            // 弹框
            return;
        }
            
        // 提交
        var func = "add_loveletter_to_list";
        var req_arg_item = {
            "name": loveletter_name,
            "description": loveletter_description,
        };
        var req_args = [];
        req_args.push(req_arg_item);

        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : func,
                    "args" : JSON.stringify(req_args),
                }
            },
            "method": "neb_sendTransaction"
        }, "*");
    },

    listenWindowMessage: function() {
        var self = this;
        window.addEventListener('message', function(e) {
            // e.detail contains the transferred data
            if(e.data && e.data.data && e.data.data.neb_sendTransaction) {
                // 收到返回数据
                if(e.data.data.neb_sendTransaction.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_sendTransaction.result);
                    console.log(obj);
                    if(obj.success==true){
                        window.location.href="loveletter.html"; 
                    }else{
                        alert(obj.message);
                    }
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },
}

var inputLoveletterObj;

function checkNebpay() {
    console.log("check nebpay")
    try{
        var NebPay = require("nebpay");
    }catch(e){
        //alert ("Extension wallet is not installed, please install it first.")
        console.log("no nebpay");
        $("#noExtension").removeClass("hide")
    }

    // 环境ok，拉取数据
    inputLoveletterObj = new InputLoveletter();
    inputLoveletterObj.init();
    inputLoveletterObj.listenWindowMessage();
}



function initPage() {

    document.addEventListener("DOMContentLoaded", function() {
        console.log("web page loaded...");
        $("#loveletter_input_warning").hide();

        
        setTimeout(checkNebpay,1000);
    });
}

initPage();
    
