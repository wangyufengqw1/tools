module base {
	export class MoneyBase extends fairygui.GComponent
	{
		dispose():void
		{
			super.dispose();
		}

		constructor(type:string,name:string,left:number=1)
		{
			super();
			this._$name  = name;
			this._type   = type;
			this._isLeft = left;
			this.setPivot(0.5,0.5);
		}

		protected _type:string;
		protected _$name:string;
		protected _isLeft:number;       //0左 1中  2右
		/**
		 * 回收
		 */
		retrieve():void
		{	
			//舞台移除
			this.parent && this.parent.removeChild(this);
			notification.removeNotificationByObject(this);
		}

		cleanAll():void
		{
			let len : number = this.numChildren;
			for(let i : number = len-1;i>=0;i--)
			{
				let obj  = this.getChildAt(i);
				if(obj.parent)
				{
					obj.parent.removeChild(obj);
					obj = null;
				}
			}
		}
	}	


	/**
	 * 倒计时
	 */
	export class pulicMoney extends MoneyBase
	{
		private _money : number = 0;
		private getMoney():number
		{
			return this._money;
		}

		setNum(str:string):void
		{
			this.cleanAll();
			let a : fairygui.GImage;
			for(let i : number = 0;i<str.length;i++)
			{
				a =fairygui.UIPackage.createObject(this._$name ,this._type+"_"+str.charAt(i)).asImage; 
				console.log(str.charAt(i));
				a.x = 35 * i;
				this.addChild(a);
			}
			this.width = str.length*35;
			this.height = a.height;
			if(this._isLeft == 1){
				this.x = (this.parent.width - this.width)/2;
			}else if(this._isLeft == 0)
			{
				this.x = 0;
			}else{
				this.x = this.parent.width - this.width;
			}
			this.y = (this.parent.height - this.height)/2;
		}

		private list : fairygui.GImage[];
	}
}