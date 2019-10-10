class item extends fairygui.GComponent{
	public constructor() {
		super();
		this.intiView();
	}

	private intiView():void
	{
		this.mainView = fairygui.UIPackage.createObject("xq","item").asCom;
		this.width	  = this.mainView.width;
		this.height   = this.mainView.height;
		this.c1       = this.mainView.getController("c1");
		this.select   = this.mainView.getController("select");
		this.txt      = this.mainView.getChild("txt").asTextField;
		this.addChild(this.mainView);
		this.t0       = this.mainView.getTransition("t0");
		this.t0.stop();
	}

	/**
	 * 设置这个棋子的身份
	 */
	set item_id(v:number)
	{
		this.$id = v;
		let x : number = Math.abs(v);
		if(v == 0){    //空白格子
			this.visible = false;
			return ;
		}
		if(v<0){
			this.txt.text = api.Data.blacknameStr[x-1];
		}else{
			this.txt.text = api.Data.rednameStr[x-1];
		}
		
	}	

	/**
	 * 设置这个棋子是否翻开   
	 */
	set isVisible(v:boolean)
	{
		this.$isVisible =v;
		if(!this.isVisible){   //未翻开
			this.c1.setSelectedIndex(0);
			return ;
		}
		if(this.$id>0){
			this.c1.setSelectedIndex(2);  //红色棋子
		}else if(this.$id<0){							
			this.c1.setSelectedIndex(1);  //蓝色棋子
		}
	}

	get item_id():number
	{
		return this.$id;
	}
	get isVisible():boolean
	{
		return this.$isVisible;
	}

	/**
	 * 选中态 改变
	 */
	setSelect(num:number):void
	{
		if(!this.$isVisible && num == 0){  //未翻开没有选中态
			return ;
		}
		this.select.setSelectedIndex(num);
	}

	/**
	 * 播放棋子翻转动画
	 */
	playRotate(v:number):void
	{
		this.t0.play(()=>{
			this.item_id = v;
			this.isVisible = true;
		},this);
	}

	/**
	 * 吃棋子或者是走一格
	 */
	eatCell(x:number,y:number,f:Function,thisArg:any,...arg):void
	{
		egret.Tween.get(this).to({x:x-this.width/2,y:y-this.height/2},500).call(f,thisArg,arg);
	}

	/**
	 * 死亡表现动画
	 */
	die()
	{
		//飞往对应身份的地址
		if(this.$id == undefined){   //身份没有给 则通过死亡的棋子提起最后一个代表最新死亡的棋子
			this.$id = api.data.failData[api.data.failData.length-1];
		}
		let point_id:number = Math.abs(this.$id)-1;
		if(this.$id<0){
			point_id+=7;
		}
		let point:egret.Point = api.data.failpoint[point_id];
		egret.Tween.get(this).to({x:point.x,y:point.y},500).call(()=>{
			this.visible = false;
			notification.postNotification(GameEvent.WEB_FAILPLAYEND);
		},this);
	}

	private mainView 	: fairygui.GComponent;    //棋子的容器
	private c1       	: fairygui.Controller;	  //棋子状态控制器  0未翻开 1蓝 2红	
	private txt      	: fairygui.GTextField;	  //棋子显示身份的文本框
	private $id      	: number;	              //棋子身份id  对应nameStr
	private $isVisible	: boolean;                //棋子是否翻开
	private select      : fairygui.Controller;    //选中态
	private t0          : fairygui.Transition;    //旋转动画
}