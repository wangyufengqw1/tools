module base {
	export class BaseRuleView extends gui.OvBase{
		public constructor(res:string,name:string) {
			super(res,name);
		}

		dispose():void
		{
			super.dispose();
		}

		open(...arg)
		{

		}

		private btn : fairygui.GButton[]; 
		private bar : fairygui.GProgressBar[];
		private c1  : fairygui.Controller;
		private c2  : fairygui.Controller;
		initView():void
		{
			super.initView();
			this.bar = [];
			this.btn = [];
			for(var i : number = 0;i<6;i++)
			{
				this.btn.push(this.getButton("btn"+i));
				if(i<2){
					this.bar.push(this._ui.getChild("myPress"+i) as fairygui.GProgressBar);
					this.bar[i].max = 100;
				}
			}
			this.btnShow(0,api.GlobalAPI.soundManager.volume);
			this.btnShow(1,api.GlobalAPI.soundManager.effvolume);
			this.c1 = this._ui.getController("c1");
			this.c2 = this._ui.getController("c2");
			if(api.GlobalAPI.soundManager._musicFlag){
				this.c1.setSelectedIndex(0);
			}else{
				this.c1.setSelectedIndex(1);
				this.btnShow(0,0);
			}
			if(api.GlobalAPI.soundManager._soundFlag)
			{
				this.c2.setSelectedIndex(0);
			}else{
				this.c2.setSelectedIndex(1);
				this.btnShow(1,0);
			}
		}

		/**
		 * 根据按钮显示声音大小
		 */
		private btnShow(index:number,volume:number):void
		{
			if(index == 0){
				api.GlobalAPI.soundManager.volume = volume;
			}else if(index == 1){
				api.GlobalAPI.soundManager.effvolume = volume;
			}
			this.bar[index].value = volume * 100;
			this.btn[index+4].x     = volume * this.bar[index].width + this.bar[index].x  - this._buttonList[4+index].width/2;
		}

		protected initEvent():void
		{
			this.btn[4].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
			this.btn[4].addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
			this.btn[5].addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
			this.btn[5].addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
			this.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
		}

		private mouseDown(e: egret.TouchEvent):void
		{
			this.curNum = this.btn.indexOf(e.currentTarget);
			this._touchStatus = true;
			if(this.curNum>-1){
				this._distance.x = e.stageX - this.btn[this.curNum].x;
				this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
			}
		}

		private mouseMove(e: egret.TouchEvent):void
		{
			if(this._touchStatus){
				if(e.stageX<=this.bar[0].x){
					this.btn[this.curNum].x = this.bar[0].x - this.btn[this.curNum].width/2;                             
				}else if(e.stageX>=this.bar[0].x + this.bar[0].width - this.btn[this.curNum].width/2){
					this.btn[this.curNum].x = this.bar[0].x + this.bar[0].width - this.btn[this.curNum].width/2;
				}else{
					this.btn[this.curNum].x = e.stageX - this.btn[this.curNum].width/2;
				}
				var valueX : number = Math.floor(this.btn[this.curNum].x - this.bar[1].x + this.btn[this.curNum].width/2);
				if(valueX<=this.btn[this.curNum].width/2){
					valueX = 0;
				}else if(valueX>=this.bar[0].width){
					valueX = this.bar[0].width;
				}
				if(this.curNum == 4){
					api.GlobalAPI.soundManager.volume = valueX/this.bar[0].width ;
					this.bar[0].value = api.GlobalAPI.soundManager.volume * 100 ;
				//	api.GlobalAPI.soundManager.resumeBGM();
					if(api.GlobalAPI.soundManager.volume>0){
						this.c1.setSelectedIndex(0);
					}else{
						this.c1.setSelectedIndex(1);
					}
				}else{
					api.GlobalAPI.soundManager.effvolume =  valueX/this.bar[1].width ;
					this.bar[1].value = api.GlobalAPI.soundManager.effvolume * 100 ;
					if(api.GlobalAPI.soundManager.effvolume>0){
						this.c2.setSelectedIndex(0);
					}else{
						this.c2.setSelectedIndex(1);
					}
				}
			}
		}

		private mouseUp(e: egret.TouchEvent):void
		{
			this._touchStatus = false;
			this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
		}

		private curNum       : number;
		private _touchStatus : boolean;
		private _distance:egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差

		protected onClick(e: egret.TouchEvent):void
		{
			// api.GlobalAPI.soundManager.changeSound(true);
			api.GlobalAPI.soundManager.playEffect("click_mp3",api.GlobalAPI.soundManager.effvolume);
			switch(e.currentTarget.name)
			{
				case "closeButton":
					this.dispose();
					break;	
			}

			var num : number = this.btn.indexOf(e.currentTarget);
			if(num>-1)
			{
				if(num<4){
					if(num == 0){
						this.c1.setSelectedIndex(0);
					}else if(num == 1){
						this.c2.setSelectedIndex(0);
						api.GlobalAPI.soundManager.changeSound(true);
					}else if(num == 2){
						this.c1.setSelectedIndex(1);
						this.btnShow(0,0);
					}else if(num == 3){
						this.c2.setSelectedIndex(1);
						this.btnShow(1,0);
					}
				}
			}
		}
	}	
}