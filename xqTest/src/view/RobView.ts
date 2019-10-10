class RobView {
	public constructor(v:fairygui.GComponent) {
		this._ui = v;
		this.initView();
		this.initEvent();
	}

	private initView():void
	{
		this.btn = [];
		for(let i : number = 0;i<2;i++){
			this.btn.push(this._ui.getChild("btn"+i).asButton);
		}
		this.c1 = this._ui.getController("c1");
		this.txt = this._ui.getChild("txt").asTextField;
		
	}

	private initEvent():void
	{
		for(let i : number = 0;i<2;i++){
			this.btn[i].addEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
		}
	}

	private click(e:egret.TouchEvent):void
	{
		let num : number = this.btn.indexOf(e.currentTarget);
		if(num>-1){
			if(this.c1.selectedIndex == 0){
				//抢红
				api.core.sendRedChoose(num);
			}else if(this.c1.selectedIndex == 1){
				//是否加倍
				api.core.sendTimesChoose(num);
			}
		}
	}

	/**
	 * 打开抢红
	 */
	openRobView(num:number):void{
		this.c1.setSelectedIndex(num);
		if(num == 2){
			//什么都不显示
			return ;
		}
		egret.Tween.resumeTweens(this);
		egret.Tween.removeTweens(this);
		this.numTxt = 5;
		this.tween = egret.Tween.get(this).to({numTxt:0},5000).call(()=>{
			this.c1.setSelectedIndex(2);
		},this);
	}

	dispose():void
	{
		for(let i : number = 0;i<2;i++){
			this.btn[i].removeEventListener(egret.TouchEvent.TOUCH_TAP,this.click,this);
		}
	}

	set numTxt(v:number)
	{
		this._numT = v;
		this.txt.text = Math.floor(v).toString();	
	}

	get numTxt():number
	{
		return this._numT;
	}

	private _numT : number;
	private c1    : fairygui.Controller;
	private _ui   : fairygui.GComponent;
	private btn   : fairygui.GButton[];
	private txt   : fairygui.GTextField;
	private tween : egret.Tween;
}


