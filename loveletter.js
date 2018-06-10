

'use strict';

var dappAddress = "n1uLi9KD6edLbGv31odHriHCkaGDGFqypMu";
var LoveletterShow = function() {

}
LoveletterShow.prototype = {

    init: function() {
        var self = this;
        self.initLoveletterList();
    },
    initLoveletterList:function(){
        var page={"pageSize":paginationObj.page_size,"pageNum":1};
        this.showLoveletterList(page);
        this.showLoveletterSum();
    },
    showLoveletterSum:function(){
        var req_args = [];
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_loveletter_sum",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
    },
    showLoveletterList:function(page){
        var req_args = [];
        req_args.push(page);
        window.postMessage({
            "target": "contentscript",
            "data":{
                "to" : dappAddress,
                "value" : "0",
                "contract" : {
                    "function" : "query_loveletter_by_page",
                    "args" : JSON.stringify(req_args)
                }
            },
            "method": "neb_call"
        }, "*");
    },
    listenWindowMessage: function() {
        var self = this;
        window.addEventListener('message', function(e) {
            // e.detail contains the transferred data
            if(e.data && e.data.data && e.data.data.neb_call) {
                // 收到返回数据
                if(e.data.data.neb_call.result) {
                    // 解析数据
                    var obj = JSON.parse(e.data.data.neb_call.result);
                    if (obj.type == "loveletter_list") {
                        self.parseLoveletterInfo(obj);
                    } else if (obj.type == "loveletter_sum") {
                        self.parseLoveletterSum(obj);
                    } else {
                        console.log("no need attation");
                    }
                    console.log(obj);
                } else {
                    console.log("Get Data From Constract Faield");
                }
            }
        });
    },

    parseLoveletterInfo: function(loveletter_list) {
        if (loveletter_list.data.length == 0) {
            $("#loading_page").hide();
            $("#loveletter_list").hide();
            $("#loveletter_warning").show();
        } else {
            $("#loading_page").hide();
            $("#main_page").show();
            

            $("#loveletter_warning").hide();
            $("#loveletter_list").empty().show();
            // 显示内容
            var loveletters = template(document.getElementById('loveletter_list_t').innerHTML);
            var loveletters_html = loveletters({list: loveletter_list.data});
            $("#loveletter_list").append(loveletters_html);
        }

        //paginationObj.init(loveletter_list.sum);
        //paginationObj.showPagination();  
        
    },
    parseLoveletterSum: function(obj) {
        paginationObj.init(obj.sum);
        paginationObj.showPagination(); 
    },
}

var loveletterObj=new LoveletterShow();

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
    loveletterObj = new LoveletterShow();
    loveletterObj.listenWindowMessage();
    loveletterObj.init();
    
}



function initPage() {
    document.addEventListener("DOMContentLoaded", function() {
        $("#loveletter_warning").hide();
        $("#main_page").hide();
        $("#loading_page").show();
        console.log("web page loaded...");
        setTimeout(checkNebpay,1000);
    });
}

initPage();
  
var SHOW_NUM_PER_PAGE = 12;

var Pagination = function() {
    this.list_index = [];
    this.page_size = SHOW_NUM_PER_PAGE;
    this.showGoInput = true;
    this.showGoButton = true;
};

Pagination.prototype = {
    // 初始化
    init: function(totalNum) {
        this.list_index=[];
        for(var i = 1; i <= totalNum; i++) {
            this.list_index.push(i);
        }
    },

    // 显示分页插件
    showPagination: function() {
        var self = this;
        $('#pagination').pagination({
            dataSource: this.list_index,
            pageSize: this.page_size,
            showGoInput: true,
            showGoButton: true,
            callback: function(data, pagination) {
                var click_page_num = pagination.pageNumber;
                var list_offset = data[0];
                self.onChoosePageEvent(click_page_num, list_offset);
            }
        });
    },

    // 选择页事件
    onChoosePageEvent: function(click_page_num, list_offset) {
        console.log("click_page_num = " + click_page_num + "; list_offset=" + list_offset);
        var page={
            "pageSize":this.page_size,
            "pageNum":click_page_num
        };
        loveletterObj.showLoveletterList(page);
    },
}

var paginationObj = new Pagination();
