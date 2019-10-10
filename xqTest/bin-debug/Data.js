var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var api;
(function (api) {
    var Data = (function () {
        function Data() {
            /****************************************************暂代的数据*************************************************** */
            this.nameObj = { open_Id: "000001111", name: "暂代的自己", icons: "300000" };
        }
        Data.prototype.init = function () {
            this.myColor = 1;
            this.myChoose = -1;
            this.itemIndexInCell = [];
        };
        /****************************************************************** */
        /**
         * 获取棋盘棋子下标
         */
        Data.prototype.getIndexByChess = function (num) {
            return this.itemIndexInCell[num];
        };
        /**
         * 根据棋子位置判断棋盘下标
         */
        Data.prototype.getIndexByItem = function (num) {
            return this.itemIndexInCell.indexOf(num);
        };
        /**
         * 通过cellData的信息获取到 对应格子的信息 0格子下标 1格子当前信息
         */
        Data.prototype.getDataByCellData = function (num) {
            var arr = this.getDataByOneCellData(this.cellData[num]);
            return arr;
        };
        /**
         * 解析一条数据
         */
        Data.prototype.getDataByOneCellData = function (str) {
            var arr = [];
            var brr = str.split(",");
            arr[0] = Number(brr[0]);
            arr[1] = Number(brr[1]);
            return arr;
        };
        /**
         * 获取信息通过吃掉棋子回调
         */
        Data.prototype.getDataByEatCellBack = function (str) {
            var arr = [];
            var brr = str.split(",");
            arr[0] = Number(brr[0]); //棋盘的位置
            arr[1] = Number(brr[1]);
            arr[2] = Number(brr[2]); //输赢
            return arr;
        };
        /**
         * 获取信息通过失败棋子数组
         */
        Data.prototype.getDataByFail = function (v) {
            var n = 0;
            var m = -1;
            for (var i = 0; i < this.failData.length; i++) {
                if (this.failData[i] == v) {
                    n++;
                }
            }
            if (this.failData[this.failData.length - 1] == v) {
                m = 1;
            }
            return [n, m];
        };
        /****************************************************************** */
        /**
         * 是否是炮
         * @param num 身份id
         */
        Data.prototype.isGun = function (num) {
            if (Data.gunIndex.indexOf(num) > -1) {
                return true;
            }
            return false;
        };
        /**
         * 是否是车
         * @param num 身份id
         */
        Data.prototype.isCar = function (num) {
            if (Data.carIndex.indexOf(num) > -1) {
                return true;
            }
            return false;
        };
        /**
         * 判断是否是自己的棋子
         * @param num 棋子下标
         */
        Data.prototype.isMyselfChess = function (num) {
            if (this.myColor * num > 0) {
                return true;
            }
            return false;
        };
        /**
         * 该棋盘是否有棋子
         * @param num 棋盘下标
         */
        Data.prototype.chessHaveItem = function (num) {
            if (this.itemIndexInCell[num] == -1) {
                return false;
            }
            return true;
        };
        /**
         * 设置棋子下标 通过棋盘
         * @param num主动方棋盘下标
         * @param index被动方棋盘下标
         * @param z输赢
         */
        Data.prototype.setItemByCell = function (num, index, z) {
            if (z == 1) {
                this.itemIndexInCell[index] = this.itemIndexInCell[num];
            }
            this.itemIndexInCell[num] = -1; //不管是什么主动方都为-1
        };
        /********************************************************************** */
        /**
         * 是否是左边界限
         * @param num 棋盘下标
         */
        Data.prototype.isLeftLimit = function (num) {
            if (num % 4 == 3) {
                return true;
            }
            return false;
        };
        /**
         * 是否是右边界限
         * @param num 棋盘下标
         */
        Data.prototype.isRightLimit = function (num) {
            if (num % 4 == 0) {
                return true;
            }
            return false;
        };
        /**
         * 是否是上边界限
         * @param num 棋盘下标
         */
        Data.prototype.isTopLimit = function (num) {
            if (num < 0) {
                return true;
            }
            return false;
        };
        /**
         * 是否是下边界限
         * @param num 棋盘下标
         */
        Data.prototype.isLastLimit = function (num) {
            if (num >= 32) {
                return true;
            }
            return false;
        };
        Data.rednameStr = ["帅", "仕", "相", "车", "马", "炮", "兵"];
        Data.blacknameStr = ["将", "士", "象", "車", "馬", "跑", "卒"];
        Data.gunIndex = [6, -6]; //炮的id下标数组
        Data.carIndex = [4, -4]; //车的id下标数组			
        Data.maxNum = 32; //棋盘总的棋子
        return Data;
    }());
    api.Data = Data;
    __reflect(Data.prototype, "api.Data");
})(api || (api = {}));
//# sourceMappingURL=Data.js.map