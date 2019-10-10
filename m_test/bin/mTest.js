var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var module_mTest;
(function (module_mTest) {
    var Core = (function () {
        function Core() {
        }
        return Core;
    }());
    module_mTest.Core = Core;
    __reflect(Core.prototype, "module_mTest.Core");
})(module_mTest || (module_mTest = {}));
var module_mTest;
(function (module_mTest) {
    var Data = (function () {
        function Data() {
        }
        return Data;
    }());
    module_mTest.Data = Data;
    __reflect(Data.prototype, "module_mTest.Data");
})(module_mTest || (module_mTest = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var m_test;
(function (m_test) {
    var LoadingUI = (function (_super) {
        __extends(LoadingUI, _super);
        function LoadingUI() {
            var _this = _super.call(this) || this;
            _this.createView();
            return _this;
        }
        LoadingUI.prototype.createView = function () {
            this.textField = new egret.TextField();
            this.addChild(this.textField);
            this.textField.y = 300;
            this.textField.width = 480;
            this.textField.height = 100;
            this.textField.textAlign = "center";
        };
        LoadingUI.prototype.onProgress = function (current, total, any) {
            this.textField.text = "Loading..." + current + "/" + total + "name:" + any.name;
        };
        return LoadingUI;
    }(egret.Sprite));
    m_test.LoadingUI = LoadingUI;
    __reflect(LoadingUI.prototype, "m_test.LoadingUI", ["RES.PromiseTaskReporter"]);
})(m_test || (m_test = {}));
var module_mTest;
(function (module_mTest) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            return _super.call(this) || this;
        }
        Main.prototype.open = function () {
            this.createGameScene();
        };
        /**
         * 创建游戏场景
         * Create a game scene
         */
        Main.prototype.createGameScene = function () {
            fairygui.UIConfig.defaultFont = "宋体"; //设置字体
            // this.stage.addChild(fairygui.GRoot.inst.displayObject);  //fairygui需要加入到舞台上 
            // this.stage.setContentSize(1080,1920);
            // this.stage.frameRate = 60;
            //gameTool.init(this);
            this.startGame();
        };
        Main.prototype.startGame = function () {
            // var url = window.document.location.href.toString();
            // let ip: string = "192.168.2.101";
            // if(url.indexOf("47.244.208.140")>-1){
            // 	ip = "47.52.32.227";
            // }
            // let port: number = 9994;
            // api.GlobalAPI.webSocket.connectServer(ip + ":" + port, () => {
            // });
            gameTool.stage.setContentSize(1920, 1080);
            gui.addScene(module_mTest.DoorView);
        };
        return Main;
    }(base.BaseModule));
    module_mTest.Main = Main;
    __reflect(Main.prototype, "module_mTest.Main");
})(module_mTest || (module_mTest = {}));
var module_mTest;
(function (module_mTest) {
    var DoorView = (function (_super) {
        __extends(DoorView, _super);
        function DoorView() {
            return _super.call(this, "feidao", "doorView") || this;
        }
        DoorView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        //private _list : fairygui.GList;
        DoorView.prototype.open = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
        };
        return DoorView;
    }(gui.OvBase));
    module_mTest.DoorView = DoorView;
    __reflect(DoorView.prototype, "module_mTest.DoorView");
})(module_mTest || (module_mTest = {}));
