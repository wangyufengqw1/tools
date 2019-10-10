
module api{
	export var core : Core
	export class Core {
		//ai 控制中心  (后端逻辑)
		public constructor() {
			this.cntNum = 0;
			this.failCell   = [];
			this.cellEndStr = [];
			this._redChoose = [];
			this.sortInitNum();
			this.RobRedNum = 6;
			this.RobTimesNum = 6;
			this.createTimer();
		}

		private initListArr : number[];               //最开始随机的棋盘数组         1帅2仕3相4车5马6炮7兵  -1--7将-卒  0空白
		private cellEndStr  : String[];               //发给前端的棋盘上的信息
		private failCell    : number[];               //死亡的棋子数组  

		/**
		 * 随机分配位置给棋子
		 */
		private sortInitNum():void{
			this.initListArr = []
			for(let i : number = 0;i<5;i++){
				//5个兵 卒
				if(i<5){
					this.initListArr.push(7);
					this.initListArr.push(-7);
					//2个炮 车 马 相 仕
					this.initListArr.push(i+2);   
					this.initListArr.push(-i-2);
					this.initListArr.push(i+2);
					this.initListArr.push(-i-2);
				}
				if(i<1){ //将帅
					this.initListArr.push(1);
					this.initListArr.push(-1);
				} 
			}
			
			//打乱随机
			this.initListArr = this.randomArr(this.initListArr);
			let arr : number[] = [5,20,13,14];
			for(let x : number = 0;x<4;x++){
				let z : number = this.initListArr[arr[x]];
				this.cellEndStr.push(arr[x].toString()+","+z.toString());
			}
		}

		/**
		 * 获取一个随机数组 
		 */
		private randomArr(v:number[]):number[]
		{
			let n : number = 0;
			let t : number = 0;
			/***随机获取一个下标数组的值和循环中的数组对应的值进行替换***/
			for(let i : number = 0;i<v.length;i++){
				n = Math.floor(Math.random()*v.length);  //随机获取一个数值的下标
				t = v[i];
				v[i] = v[n];
				v[n] = t;
			}
			return v;
		}		


		
		private createTimer():void
		{
			if(this.timer == null){
				this.timer = new egret.Timer(1000);
				this.timer.addEventListener(egret.TimerEvent.TIMER,this.onTimer,this);
			}else{
				this.timer.reset();
			}
			this.timer.start();
		}


		/**************************************************暂代的消息处理******************************************************/
		nameObj : any = {open_Id:"000001112",name:"可爱的小妍妍",icons:"1314520"};  //敌人的消息
		/***
		 * 开始游戏
		 */
		sendStartGame():void
		{
			//发消息给前端
			notification.postNotification(GameEvent.MATCHGAME);  
			//2秒后匹配到
			setTimeout(this.gameStart.bind(this), 2000);
		}

		/**
		 * 发送消息给后端翻开这个棋盘的棋子    棋子位置 (棋盘的下标)
		 * @param num棋盘的下标
		 */
		sendCellOpen(num:number):void
		{
			if(this.haveDataByCellEnd(num)){  //已经翻开了 （包含棋子翻开 空格）
				console.log("sendCellOpen+haveDataByCellEnd");
				return ;
			}
			//获取这个位置的身份
			let z : number = this.initListArr[num];
			this.cellEndStr.push(num.toString()+","+z.toString());
			//发消息给前端
			notification.postNotification(GameEvent.GETOPENCELL,num.toString()+","+z.toString());  
		}

		/**
		 * 吃棋子
		 * @param num主动方
		 * @param index被动方
		 */
		sendCellEat(num:number,index:number):void
		{
			let str:string = "";
			//判断主动方是不是炮
			if(this.initListArr[num] == 6 || this.initListArr[num] == -6)
			{
				//是炮则必胜 
				str=num.toString()+","+index.toString()+",1";
				//将死亡的棋子放入到死亡的数组中
				this.failCell.push(this.initListArr[index]);
				//主动方变为空格 被动方变成主动方的身份
				this.initListArrChange(num,index,0,this.initListArr[num]);
			}else{
				//空格子对空格子
				if(this.initListArr[num] == 0 &&  this.initListArr[index] == 0){
					console.log("sendCellEat:空空如也");
				}else if(this.initListArr[num] == 0){
					console.log("sendCellEat:空无一物");
				}else if(this.initListArr[index] == 0){
					str=num.toString()+","+index.toString()+",1";
					//主动方变为空格 被动方变成主动方的身份
					this.initListArrChange(num,index,0,this.initListArr[num]);
				}else if(this.initListArr[num]*this.initListArr[index]>0){
					console.log("sendCellEat:本是同根生相煎何太急");
				}else{
					if(this.cellBattleCell(num,index)){
						str=num.toString()+","+index.toString()+",1";
						//将死亡的棋子放入到死亡的数组中
						this.failCell.push(this.initListArr[index]);
						//主动方变为空格 被动方变成主动方的身份
						this.initListArrChange(num,index,0,this.initListArr[num]);
					}else{
						str=num.toString()+","+index.toString()+",0";
						//将死亡的棋子放入到死亡的数组中
						this.failCell.push(this.initListArr[num]);
						//主动方变为空格 被动方还是被动
						this.initListArrChange(num,index,0,this.initListArr[index]);
					}
				}
			}
			//发消息给前端
			notification.postNotification(GameEvent.EATCELLBACK,str);  
			notification.postNotification(GameEvent.FAILCELLSEND,this.failCell);  
		}


		/**
		 * 抢红选择
		 */
		sendRedChoose(num:number):void
		{
			this._redChoose[0] = num;
			this.RobRedNum = 6;
			//执行下一个倍数选择   
			this.nextChoose(); 
		}

		sendTimesChoose(num:number):void
		{
			this._isTimes = num == 1;
			this.RobTimesNum = 6;
			this.timesChooseFun();
		}
		/**********************************************************方法逻辑*************************************************************** */
		/**
		 * 将initListArr的数组值进行变化
		 * @param num 主动方的棋盘下标
		 * @param index 被动方的棋盘下标
		 * @param num_id 主动方棋盘下标的身份id
		 * @param item_id 被动方棋盘下标身份id
		 */
		private initListArrChange(num:number,index:number,num_id:number,index_id:number):void
		{
			this.initListArr[num] = num_id;
			this.initListArr[index] = index_id;
			if(this.haveDataByCellEnd(num)){
				this.cellEndChange(num,num_id);
			}else{
				this.cellEndStr.push(num.toString()+","+num_id.toString());
			}
			if(this.haveDataByCellEnd(index)){
				this.cellEndChange(index,index_id);
			}else{
				this.cellEndStr.push(index.toString()+","+index_id.toString());
			}
		}

		/**
		 * cellEnd改变位置
		 */
		private cellEndChange(num:number,num_id:number):void
		{
			for(let i:number=0;i<this.cellEndStr.length;i++)
			{
				let brr : string[] = this.cellEndStr[i].split(",");
				if(Number(brr[0]) == num){
					this.cellEndStr[i] = num.toString()+","+num_id.toString();
					return ;
				}
			}
		}

		/**
		 * cellEnd中是否有该棋盘的信息  通过x,y
		 */
		private haveDataByCellEnd(x:number):boolean
		{
			if(this.cellEndStr == null || this.cellEndStr.length == 0){   //没有点开任何棋盘上的任意一点
				return false;
			}
			for(let i:number=0;i<this.cellEndStr.length;i++)
			{
				let brr : string[] = this.cellEndStr[i].split(",");
				if(Number(brr[0]) == x){
					return  true;
				}
			}
			return false;
		}

		/**
		 * 棋子之间比大小 （杜绝了吃自己的操作 只能吃不同颜色的）
		 */
		private cellBattleCell(num:number,index:number):boolean
		{
			let x : number = Math.abs(this.initListArr[num]);  //成为正数  
			let y : number = Math.abs(this.initListArr[index]);  //成为正数  
			//兵只能吃兵 将 其他的都死
			if(x == 7){
				if(y == 1 || y == 7){
					return true;
				}
				return false;
			}
			//将其他都能吃兵就死
			if(x == 1){
				if(y == 7){
					return false;
				}
				return  true;
			}
			//其他的由小到大
			if(x<=y){
				return true;
			}
			return false;
		}

		/**
		 * 游戏开始
		 */
		private gameStart():void
		{
			this.whoChoose = Math.floor(Math.random()*2);
			notification.postNotification(GameEvent.GAMESTART,{name:this.nameObj});  
			//发消息给前端
			notification.postNotification(GameEvent.SYNCHRO,this.cellEndStr);  
			notification.postNotification(GameEvent.REDCHOOSE,this.whoChoose);
			this.RobRedNum = 0;
			if(this.whoChoose == 0){   //电脑
				this.AIRedChoose();
			}
		}

		/**
		 * 下一个选择选择
		 */
		private nextChoose():void
		{
			//是电脑 并且没有抢红
			if(this.whoChoose == 0 && this._redChoose.indexOf(1) == -1){
				if(this.cntNum>=1){ 
					//发布抢红结果 然后进入加倍
					notification.postNotification(GameEvent.REDRESULT,1);  
					//电脑加倍
					notification.postNotification(GameEvent.TIMESCHOOSE,0);
					this.whoChoose = 0;
					this.RobTimesNum = 0;
				}else{
					//玩家抢红
					this.cntNum++; 
					this.whoChoose = 1;
					notification.postNotification(GameEvent.REDCHOOSE,1);
					this.RobRedNum = 0;
				}
				  
			}else if(this.whoChoose == 1 && this._redChoose.indexOf(1) == -1){
				//是玩家 并且没有抢红
				if(this.cntNum>=1){//次数大于1则都抢过了
					//发布抢红结果 然后进入加倍
					notification.postNotification(GameEvent.REDRESULT,0);
					//玩家加倍  
					notification.postNotification(GameEvent.TIMESCHOOSE,1);
					this.whoChoose = 1;
					this.RobTimesNum = 0;
				}else{
					//电脑抢红
					this.cntNum++; 
					this.whoChoose = 0;
					notification.postNotification(GameEvent.REDCHOOSE,0);
					this.AIRedChoose();
					this.RobRedNum = 0;
				}
			}else if(this._redChoose[0] == 1){
				//玩家抢红 则电脑加倍
				notification.postNotification(GameEvent.REDRESULT,1);
				notification.postNotification(GameEvent.TIMESCHOOSE,0);
				this.whoChoose = 0;
				this.RobTimesNum = 0;
			}else if(this._redChoose[1] == 1){
				//电脑抢红 则玩家加倍
				notification.postNotification(GameEvent.REDRESULT,0);
				notification.postNotification(GameEvent.TIMESCHOOSE,1);
				this.whoChoose = 1;
				this.RobTimesNum = 0;
			}
		}

		/**
		 * 加倍选方法
		 */
		private timesChooseFun():void
		{
			if(this.whoChoose == 0){
				//电脑加倍 则随机
				this.AITimesChoose();
			}
			notification.postNotification(GameEvent.TIMESRESULT,{who:this.whoChoose,times:this._isTimes?1:0});
		}


		/**
		 * 电脑Ai抢红
		 */
		private AIRedChoose():void
		{
			let red : number = Math.floor(Math.random()*2);
			this._redChoose[1] = red;
		}

		/**
		 * 电脑Ai抢红
		 */
		private AITimesChoose():void
		{
			let red : number = Math.floor(Math.random()*2);
			this._isTimes = red == 1;
		}


		/**
		 * 计时器
		 */
		private onTimer(e:egret.TimerEvent):void
		{
			if(this.RobRedNum == 5){   //5秒时间到了
				this.nextChoose();
			}
			if(this.RobTimesNum == 5){
				this.timesChooseFun();
			}

			this.RobRedNum++;
			this.RobTimesNum++;
		}

		private _redChoose:number[];    //抢红选择
		private _isTimes  :boolean;     //是否加倍选择
		private whoChoose   : number;   //0是电脑 1是玩家
		private cntNum      : number;   //选择的次数
		private RobRedNum    : number;  //是否抢红
		private RobTimesNum  : number;	//是否加倍
		private timer        : egret.Timer;
	}
}