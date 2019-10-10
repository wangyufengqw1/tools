module items {
	export class ShowTip{
		constructor()
		{
			this.mainView = fairygui.UIPackage.createObject("xq","showTip").asCom;
			this.txt = this.mainView.getChild("txt").asTextField;

		}

		initData(type:number,str:string,x:number,y:number):void
		{
			this.txt.text = str;
			egret.Tween.resumeTweens(this);
			if(this.tween){
				this.tween = null;
			}
			if(type == 1){
				this.txt.x = this.mainView.width - this.txt.width;
				this.mainView.x = 0;
				this.tween = egret.Tween.get(this.mainView).to({x:1080-this.mainView.width},1000).to({x:1080-this.mainView.width},1000).call(()=>{
					this.remove();
				},this);
			}else{
				this.txt.x = 0;
				this.mainView.x = 1080;
				this.tween = egret.Tween.get(this.mainView).to({x:x},1000).to({x:x},1000).call(()=>{
					this.remove();
				},this);
			}
			this.mainView.y = y;
			api.data.skyLayer.addChild(this.mainView);
		}


		private remove():void
		{
			gameTool.poolList.remove(this);
		}

		retrieve():void
		{	
			if(this.mainView){
				if(this.mainView.parent){
					this.mainView.parent.removeChild(this.mainView);
				}
			}	
		}


		private mainView : fairygui.GComponent;
		private txt      : fairygui.GTextField;
		private tween    : egret.Tween;
	}
}