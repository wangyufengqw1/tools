module base {
	export class BaseAlert extends gui.OvBase{
		private _message:string;  //显示的文字
		private _button :number;  //1是只有确定 2有确定和取消
		private _callback: FunctionInfo;
		static OK: number = 1;
        static CANCEL: number = 2;
        static OK_CANCEL: number = 3;
		public constructor(res:string,name:string,message:string,button:number=1,callback:(...args)=>void=null,context:any=null,...args) {
			super(res,name);
			this._message = message;
            this._button  = button;
			if(callback!=null)
			{
				this._callback = gameTool.poolList.getInstance(FunctionInfo);
				this._callback.sleep = false;
                this._callback.fun = callback;
                this._callback.context = context;
                this._callback.args = args;
			}
			if (this.txt) {
                this.txt.text = this._message;
            }
		}

		private btn : fairygui.GButton[]; 
		private bar : fairygui.GProgressBar[];
		private txt : fairygui.GTextField;
		private select : fairygui.Controller;
		protected initView():void
		{
			this.txt = this.getTextField("txt");
			this.select = this._ui.getController("select");
			if (this._button == BaseAlert.OK) {
                this.select.selectedPage = "1";
            }else {
                this.select.selectedPage = "2";
            }
			this.txt.text = this._message;
		}

		protected onClick(e:egret.TouchEvent):void
		{
			switch(e.currentTarget.name)
			{
				case "closeButton":
				case "cannel":
					if (this._callback != null) {
                        this._callback.args = [BaseAlert.CANCEL].concat(this._callback.args);
                        this._callback.call();
                    }
					this.dispose();
					break;
				case "ok1":
				case "ok0":
					if (this._callback != null) {
                        this._callback.args = [BaseAlert.OK].concat(this._callback.args);
                        this._callback.call();
                    }
					this.dispose();
					break;
			}
		}

		public dispose() {
            if (this._callback != null) {
                gameTool.poolList.remove(this._callback);
                this._callback = null;
            }
            super.dispose();
        }
	}


	export class FunctionInfo
	{
		fun : string | ((...args)=>any);
		context:any;
		args:any[];
		sleep:boolean;

		dispose(){
			this.fun = null;
			this.context = null;
			this.args = null;
    	}

		call(){
			if(this.sleep){
				return;
			}
			if(typeof this.fun == "string"){
				this.context[this.fun] = this.args ? this.args[0] : null;
			}else{
				this.fun.apply(this.context , this.args);
			}
		}

		onceCall(){
			this.call();
			gameTool.poolList.remove(this);
			this.dispose();
		}
	}
}