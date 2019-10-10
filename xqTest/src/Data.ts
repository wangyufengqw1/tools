module api{
	export var data : Data
	export class Data {
		public constructor() {
		}

		static rednameStr  : string[]  = ["帅","仕","相","车","马","炮","兵"];
		static blacknameStr: string[]  = ["将","士","象","車","馬","跑","卒"];
		static gunIndex : number[] = [6,-6];		//炮的id下标数组
		static carIndex : number[] = [4,-4];		//车的id下标数组			
		static maxNum   : number   = 32;			//棋盘总的棋子


		itemIndexInCell : number[];  				//棋子下标在棋盘的数组中
		myChoose    	: number;					//我选择的棋盘下标
		myColor         : number;                   //我的颜色
		cellData        : string[];                 //来自后端的棋盘消息
		itemMovePlay    : boolean;                  //棋子动画
		failData        : number[];                 //失败棋子数组
		failpoint       : egret.Point[];            //失败棋子位置数组
		skyLayer        : fairygui.GComponent;      //天空城
		isClick         : boolean;                  //是否到了我的回合

		init():void
		{
			this.myColor   = 1;
			this.myChoose  = -1;
			this.itemIndexInCell = [];
		}


		/****************************************************************** */

		/**
		 * 获取棋盘棋子下标
		 */
		getIndexByChess(num:number):number
		{
			return this.itemIndexInCell[num];
		}

		/**
		 * 根据棋子位置判断棋盘下标
		 */
		getIndexByItem(num:number):number
		{
			return this.itemIndexInCell.indexOf(num);
		}

		/**
		 * 通过cellData的信息获取到 对应格子的信息 0格子下标 1格子当前信息
		 */
		getDataByCellData(num:number):number[]
		{
			let arr : number[] = this.getDataByOneCellData(this.cellData[num]);
			return arr;
		}

		/**
		 * 解析一条数据
		 */
		getDataByOneCellData(str:string):number[]
		{
			let arr : number[] = [];
			let brr : string[] = str.split(",");
			arr[0] = Number(brr[0]);
			arr[1] = Number(brr[1]);
			return arr;
		}

		/**
		 * 获取信息通过吃掉棋子回调
		 */
		getDataByEatCellBack(str:string):number[]
		{
			let arr : number[] = [];
			let brr : string[] = str.split(",");
			arr[0] = Number(brr[0]);   //棋盘的位置
			arr[1] = Number(brr[1]);	
			arr[2] = Number(brr[2]);   //输赢
			return arr;
		}

		/**
		 * 获取信息通过失败棋子数组
		 */
		getDataByFail(v:number):number[]
		{
			let n : number = 0;
			let m : number =-1;
			for(let i : number =0;i<this.failData.length;i++){
				if(this.failData[i] == v){
					n++;
				}
			}
			if(this.failData[this.failData.length-1] == v){
				m = 1;
			}
			return [n,m];
		}
		/****************************************************************** */

		/**
		 * 是否是炮
		 * @param num 身份id
		 */
		isGun(num:number):boolean
		{
			if(Data.gunIndex.indexOf(num)>-1){
				return  true;
			}
			return false;
		}


		/**
		 * 是否是车
		 * @param num 身份id
		 */
		isCar(num:number):boolean
		{
			if(Data.carIndex.indexOf(num)>-1){
				return true;
			}
			return false;
		}


		/**
		 * 判断是否是自己的棋子
		 * @param num 棋子下标
		 */
		isMyselfChess(num:number):boolean
		{
			if(this.myColor*num>0){
				return true;
			}
			return false;
		}


		
		/**
		 * 该棋盘是否有棋子
		 * @param num 棋盘下标
		 */
		chessHaveItem(num:number):boolean
		{
			if(this.itemIndexInCell[num] == -1){
				return false;
			}
			return true;
		}

		/**
		 * 设置棋子下标 通过棋盘
		 * @param num主动方棋盘下标
		 * @param index被动方棋盘下标
		 * @param z输赢
		 */
		setItemByCell(num:number,index:number,z:number):void
		{
			if(z == 1){  //赢了被动方被主动方替代
				this.itemIndexInCell[index] = this.itemIndexInCell[num];
			}
			this.itemIndexInCell[num] = -1;  //不管是什么主动方都为-1
		}
		/********************************************************************** */

		/**
		 * 是否是左边界限
		 * @param num 棋盘下标
		 */
		isLeftLimit(num:number):boolean
		{
			if(num%4==3){
				return true;
			}
			return false;
		}

		/**
		 * 是否是右边界限
		 * @param num 棋盘下标
		 */
		isRightLimit(num:number):boolean
		{
			if(num%4==0){
				return true;
			}
			return false;
		}

		/**
		 * 是否是上边界限
		 * @param num 棋盘下标
		 */
		isTopLimit(num:number):boolean
		{
			if(num<0){
				return true;
			}
			return false;
		}

		/**
		 * 是否是下边界限
		 * @param num 棋盘下标
		 */
		isLastLimit(num:number):boolean
		{
			if(num>=32){
				return true;
			}
			return false;
		}


		/****************************************************暂代的数据*************************************************** */

		nameObj : any = {open_Id:"000001111",name:"暂代的自己",icons:"300000"};
	}
}	