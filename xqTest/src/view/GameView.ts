class GameView {
	public constructor(v:fairygui.GComponent) {
		this._ui = v;
		this.initView();
	}

	removeAll():void
	{
		for(let i : number =0;i<32;i++){
			this.item[i].dispose();
		}
	}

	/**
	 * 初始化
	 */
	private initView():void
	{
		this.cell = [];
		this.item = [];
		this.failItem = [];
		api.data.failpoint = [];
		api.data.init();
		this.itemLayer = this._ui.getChild("itemLayer").asCom;
		for(let i : number = 0;i<32;i++){
			this.cell.push(new cell(i));  //格子赋值
			this.sweepChangeCom(this.cell[i],this._ui.getChild("cell"+i).asCom);
			this.cell[i].addEventListener(egret.TouchEvent.TOUCH_TAP,this.cellClick,this);
			this.cell[i].type = 0;        //每一个格子都有一枚棋子
			this.item.push(new item());
			this.item[i].x = this.cell[i].x + (this.cell[i].width - this.item[i].width)/2;
			this.item[i].y = this.cell[i].y + (this.cell[i].height - this.item[i].height)/2;
			this.item[i].isVisible = false;
			this.item[i].touchable = false;
			this.itemLayer.addChild(this.item[i]);
			api.data.itemIndexInCell.push(i);
			if(i<14){
				this.failItem.push(new failItem(this._ui.getChild("failItem"+i).asCom));
				if(i<7){
					this.failItem[i].item_id = i+1;
				}else{
					this.failItem[i].item_id = 7-i-1;
				}
				api.data.failpoint.push(new egret.Point(this.failItem[i].x,this.failItem[i].y))
			}
		//	console.log("棋子编号输出:"+this.itemIndexInCell[i]+";汉字:"+GameEvent.nameStr[this.itemIndexInCell[i]]);
		}
	}


	/******************************************************************后端消息监听******************************************************************************** */
	/**
	 * 打开棋子
	 */
	getOpenCell(data:any):void				
	{
		let str : string = data;
		let arr : number[] = api.data.getDataByOneCellData(str);
		//棋子翻滚 然后出现
		let index : number = api.data.getIndexByChess(arr[0]);
		if(index>-1){
			this.item[index].playRotate(arr[1]);
		}
	}


	/**
	 * 吃掉棋子回调
	 * @param str回调消息 
	 */
	eatCellBack(str:string):void
	{
		api.data.itemMovePlay = true;
		let arr : number[] = api.data.getDataByEatCellBack(str);
		let x   : number   = api.data.itemIndexInCell[arr[0]];
		let y   : number   = api.data.itemIndexInCell[arr[1]];
		if(x == -1 && y == -1){
			console.log("eatCellBack:空空如也");
		}else if(x == -1){
			console.log("eatCellBack:空无一物");
		}else{
			//表现动画
			this.item[x].eatCell(this.cell[arr[1]].x+this.cell[arr[1]].width/2,this.cell[arr[1]].y+this.cell[arr[1]].height/2,this.itemMove,this,arr);
		}		
	}
	/*********************************************************************界面显示更新*************************************************************************/
	/**
	 * 棋盘界面更新
	 */
	updateItem():void
	{
		for(var i : number = 0;i<api.data.cellData.length;i++){
			let arr : number[] = api.data.getDataByCellData(i);       
			let index : number = api.data.getIndexByChess(arr[0]);
			if(index>-1){
				this.item[index].item_id = arr[1];
				this.item[index].isVisible = true;
			}
		}
	}	

	/**
	 * 失败棋子更新
	 */
	updateFailItem():void
	{
		for(var i : number = 0;i<this.failItem.length;i++){
			let arr : number[] = api.data.getDataByFail(this.failItem[i].item_id);
			this.failItem[i].numShow(arr[0]);
			this.failItem[i].isHit(arr[1]==1);
		}
	}

	/**
	 * 棋子移动表现动画
	 */
	private itemMove(arr:number[]):void
	{
		let x   : number   = api.data.itemIndexInCell[arr[0]];
		let y   : number   = api.data.itemIndexInCell[arr[1]];
		if(y == -1){
			//空格 
		}else if(arr[2] == 1){
			//赢了留下
			this.item[y].die();
		}else{
			//输了死亡
			this.item[x].die();
		}
		api.data.setItemByCell(arr[0],arr[1],arr[2]);
		api.data.itemMovePlay = false;
	//	this.updateItem();
	}
	/*********************************************************************棋盘点击判断******************************************************************************/
	/**
	 * 棋盘点击
	 */
	private cellClick(e:egret.TouchEvent):void
	{
		if(!api.data.isClick){
			window.alert("不是我的回合")
			return ;
		}
		let num : number = this.cell.indexOf(e.currentTarget);
		if(num == -1){
			console.log("超过棋盘下标");
			return;
		}

		/**棋盘有两种情况1种是有棋子1种是无棋子**/
		let lastIndex : number = api.data.getIndexByItem(api.data.myChoose);  //选中棋子所在的棋盘下标
		let index : number =  api.data.getIndexByChess(num)   				  //判断该位置是否有棋子
		if(index == -1){    //无棋子
			//无棋子有两种情况  1种是随便点击 2种是有选中的棋子要进行行走
			if(api.data.myChoose==-1){
				return ;
			}else if(this.cellCanClick(num)){  //有选中的棋子进行行走
				this.sendCellBetweenCell(lastIndex,num);
			}else{
				window.alert("请点击有效的区域,取消选中请再次点击该棋子~!");
				console.log("请点击有效的区域,取消选中请再次点击该棋子~!");
			}
		}else{ //有棋子 
			//有棋子有两种情况  1种是无选中 2是有选中
			if(api.data.myChoose==-1){  //没有选中
				//翻开了 点击显示路径
				if(this.item[index].isVisible){
					this.itemClick(index);
				}else{
					//翻开棋子
					this.sendCellOpen(num);
				}
			}else{
				//可行走
				if(this.cellCanClick(num)){
					this.sendCellBetweenCell(lastIndex,num);
				}else{
					//翻开棋子
					this.sendCellOpen(num);
				}
			}
		}
	}


	/**
	 * 通过棋盘下标判断是否可以点击 (选中时会进行棋盘可点击状态的改变判断)
	 */
	private cellCanClick(num:number):boolean
	{
		if(this.cell[num].getSelectIndex() == 1){
			return  true;
		}
		return false;
	}

	/**
	 * 棋子点击
	 */
	private itemClick(num:number):void
	{
		//选择一枚棋子
		if(num>-1){
			if(this.item[num].isVisible && api.data.isMyselfChess(this.item[num].item_id)){
				//如果棋子已经开启了 则通过棋子的身份来判断周围能进行那些操作
				this.roadForCell(num);
				return ;
			}else{
				window.alert("不是自己的棋子不能操作~");
			}
		}else{
			console.log("itemClick:"+"没有棋子 是个空的棋盘位置");		
		}
	}

	/**
	 * 棋子翻开
	 */
	private sendCellOpen(num:number):void
	{
		api.data.myChoose = -1;
		//没翻开 点击翻开棋子
		this.cannelItemSelect();
		this.cannelCellRoad();  //将上一次的显示路径去掉
		//翻开这个棋子 发消息给后端
		api.core.sendCellOpen(num);
	}

	/**
	 * 传入要吃掉的棋子
	 * @param num执行的棋子
	 * @param index被执行的棋子
	 */
	private sendCellBetweenCell(num:number,index:number):void
	{
		api.data.myChoose = -1;
		this.cannelItemSelect(); //取消选中
		this.cannelCellRoad();  //将上一次的显示路径去掉
		//发送吃棋子的消息给后端
		api.core.sendCellEat(num,index);
	}
	/**********************************************************路径显示***********************************************************************/

	/**
	 * 判断棋子的路径
	 * @param num 棋子下标
	 * */	
	private roadForCell(num:number):void
	{
		if(api.data.myChoose == num){  //选中棋子的下标和上一次的一样 则取消选中  可重新选择
			api.data.myChoose = -1;	   //-1表示可重新选择
			this.cannelItemSelect();
			this.cannelCellRoad();     //取消棋子的可点击路径
		}else{
			api.data.myChoose = num;   //当前选择的棋子
			this.showRoadByCell(num);  //显示这个棋子在的位置
			this.item[api.data.myChoose].setSelect(1);
			this.itemLayer.addChildAt(this.item[api.data.myChoose],this.itemLayer.numChildren); //将选中的棋子移到最顶层
		}
	}

	/**
	 * 显示可点击棋子路径
	 * @param num棋子的下标
	 */
	private showRoadByCell(num:number):void
	{
		//根据棋子下标 获取到棋盘位置
		let index :number = api.data.getIndexByItem(num);
		//判断特殊身份 进行特殊行走(炮是可以隔一个打未翻开的  车是可以横冲直撞)
		if(api.data.isGun(this.item[num].item_id)){ //炮
			this.spcialRoadGun(index);			//隔一个判断
		}else if(api.data.isCar(this.item[num].item_id)){ //车
			this.specialRoadForAssault(index,1);
		}else{ //普通走一格
			this.specialRoadForAssault(index,1);
		}
	}

	/**
	 * 显示可点击棋子普通判断 (空白 或者 翻开并且不是自己人)
	 * @param num棋盘下标
	 */
	private cellCanClickPublic(num:number):void
	{
		if(num>-1){  //代表有这个棋盘位置
			let index : number = api.data.getIndexByChess(num);
			if(index == -1){  //无棋子则可走
				this.cell[num].setSelectIndex(1);
			}else{
				if(this.item[index].isVisible && !api.data.isMyselfChess(this.item[index].item_id)){     //翻开并且不是自己人  可点击
					this.cell[num].setSelectIndex(1);
				}else{							//不翻开不点击
					this.cell[num].setSelectIndex(0);
				}
			}
		}	
	}

	/**
	 * 显示可点击棋子特殊判断 炮的逻辑 (翻开不是自己人)  
	 * @param num棋盘下标
	 */
	private cellCanClickSpecial(num:number):void
	{
		if(num>-1){  //代表有这个棋盘位置
			let index : number = api.data.getIndexByChess(num);
			if(index == -1){  //没棋子 不可点击 (正常来说不能进来的 进来了就是有问题输出)
				this.cell[num].setSelectIndex(0);
				console.log("cellCanClickSpecial:"+num);
			}else{
				if(this.item[index].isVisible && !api.data.isMyselfChess(this.item[index].item_id)){     //翻开 并且不是自己人   可点击
					this.cell[num].setSelectIndex(1);
				}else if(!this.item[index].isVisible){  //未翻开 可点击
					this.cell[num].setSelectIndex(1);
				}	
			}
		}	
	}

	/**
	 * 普通行走 填1
	 * @param index 棋盘的位置
	 * @param type  需要判断的次数 默认横冲直撞  (获取到横竖 所有的棋盘位置 并进行判断是否有棋子 有棋子则不能行走(又小到大有棋子则停止))
	 */
	private specialRoadForAssault(index:number,type:number=this.cow):void
	{
		//左右上下4个方向的进行循环判断是否停止
		let isStopCiclr : boolean[] = [false,false,false,false];
		let cellIndex : number = 0;  //棋子下标
		//取棋子的最大高为底线 进行遍历查看
		for(let i : number = 0;i<type;i++){
			if(!isStopCiclr[0]){   //当是左边界线 或者 不是空格子时 停止往左循环
				cellIndex = index-i-1;
				isStopCiclr[0] = api.data.chessHaveItem(cellIndex) || api.data.isLeftLimit(cellIndex); 
				if(!api.data.isLeftLimit(cellIndex)){  //不是左边界限 点击判断
					this.cellCanClickPublic(cellIndex);  //显示可点击棋子
				}
			}
			if(!isStopCiclr[1]){   //当是右边界线 或者 不是空格子时 停止往右循环
				cellIndex = index+i+1;
				isStopCiclr[1] = api.data.chessHaveItem(cellIndex) || api.data.isRightLimit(cellIndex); 
				if(!api.data.isRightLimit(cellIndex)){  //不是右边界限 点击判断
					this.cellCanClickPublic(cellIndex);  //显示可点击棋子
				}
			}
			if(!isStopCiclr[2]){   //当是上边界线 或者 不是空格子时 停止往上循环
				cellIndex = index-4*i-4;
				isStopCiclr[2] = api.data.chessHaveItem(cellIndex) || api.data.isTopLimit(cellIndex); 
				if(!api.data.isTopLimit(cellIndex)){  //不是上边界限 点击判断
					this.cellCanClickPublic(cellIndex);  //显示可点击棋子
				}
			}
			if(!isStopCiclr[3]){   //当是下边界线 或者 不是空格子时 停止往上循环
				cellIndex = index+4*i+4;
				isStopCiclr[3] = api.data.chessHaveItem(cellIndex) || api.data.isLastLimit(cellIndex); 
				if(!api.data.isLastLimit(cellIndex)){  //不是下边界限 点击判断
					this.cellCanClickPublic(cellIndex);  //显示可点击棋子
				}
			}
		}
	}

	/**
	 * 隔山打牛路径 
	 * @param 棋盘位置
	 */
	private spcialRoadGun(index:number):void
	{
		/*判断隔着的位置  各个方向判断有没有两个棋子 取第二个为可点击*/
		//左右上下4个方向的进行循环判断是否停止
		let isStopCiclr : boolean[] = [false,false,false,false];
		let twoChess    : number[]  = [0,0,0,0];   //加到第二个就显示为可点击
		let cellIndex : number = 0;  //棋子下标
		for(let i : number = 0;i<this.low;i++){
			if(!isStopCiclr[0]){   //当是左边界线 或者 不是空格子时 停止往左循环
				cellIndex = index-i-1;
				if(!api.data.isLeftLimit(cellIndex) && api.data.chessHaveItem(cellIndex)){  //不是左边界限 并且有棋子
					twoChess[0]++;        //数量+1
					if(twoChess[0]>=2){   //显示为可点击
						this.cellCanClickSpecial(cellIndex);
					}
				}
				isStopCiclr[0] = twoChess[0]>=2 || api.data.isLeftLimit(cellIndex); 
			}
			if(!isStopCiclr[1]){   //当是右边界线 或者 不是空格子时 停止往右循环
				cellIndex = index+i+1;
				if(!api.data.isRightLimit(cellIndex) && api.data.chessHaveItem(cellIndex)){  //不是右边界限 并且有棋子
					twoChess[1]++;        //数量+1
					if(twoChess[1]>=2){   //显示为可点击
						this.cellCanClickSpecial(cellIndex);
					}
				}
				isStopCiclr[1] = twoChess[1]>=2 || api.data.isRightLimit(cellIndex);
			}
			if(!isStopCiclr[2]){   //当是上边界线 或者 不是空格子时 停止往上循环
				cellIndex = index-4*i-4;
				if(!api.data.isTopLimit(cellIndex) && api.data.chessHaveItem(cellIndex)){  //不是上边界限 并且有棋子
					twoChess[2]++;        //数量+1
					if(twoChess[2]>=2){   //显示为可点击
						this.cellCanClickSpecial(cellIndex);
					}
				}
				isStopCiclr[2] = twoChess[2]>=2 || api.data.isTopLimit(cellIndex); 
			}
			if(!isStopCiclr[3]){   //当是下边界线 或者 不是空格子时 停止往上循环
				cellIndex = index+4*i+4;	
				if(!api.data.isLastLimit(cellIndex) && api.data.chessHaveItem(cellIndex)){  //不是下边界限 并且有棋子
					twoChess[3]++;        //数量+1
					if(twoChess[3]>=2){   //显示为可点击
						this.cellCanClickSpecial(cellIndex);
					}
				}
				isStopCiclr[3] = twoChess[3]>=2 || api.data.isLastLimit(cellIndex); 
			}
		}
	}


	/**
	 * 取消棋盘的可点击路径
	 */
	private cannelCellRoad():void
	{
		for(let i : number = 0;i<this.item.length;i++){
			this.cell[i].setSelectIndex(0);   //取消可点击状态
		}
	}

	/**
	 * 取消棋子的可点击路径
	 */
	private cannelItemSelect():void
	{
		for(let i : number = 0;i<this.item.length;i++){
			this.item[i].setSelect(0);   //取消可点击状态
		}
	}

	/**
	 * 交换位置
	 */
	private sweepChangeCom(a:fairygui.GComponent,b:fairygui.GComponent):void
	{
		a.x = b.x;
		a.y = b.y;
		if(b.parent){
			let index : number = b.parent.getChildIndex(b);
			b.parent.addChildAt(a,index);
			b.parent.removeChild(b);
			b = null;
		}
	}

	private cow : number = 4;	    //棋盘的宽
	private low : number = 8;	    //棋盘的长
	private cell : cell[]; 		    //格子数组
	private item : item[];  	    //界面上的棋子
	private failItem : failItem[];  //失败的棋子
	private itemLayer : fairygui.GComponent;
	private _ui : fairygui.GComponent
}