module base {
	export class SoundManager
	{
		private allSound : egret.Sound[];                      //所有音效的sound
		private allChannel : egret.SoundChannel[] = [];		//所有音效的声道
		private isComplete : boolean[]= [false,false];         //是否加载完成 
		protected soundUrl : string[] = [];
		constructor()
		{
		//	this.soundInit();
		}

		/**
		 * 声音初始化加载
		 */
		soundInit():void
		{
			if(this.allSound==null)
			{
				this.allSound = [];
				for(var i : number = 0;i<this.soundUrl.length;i++)
				{
					this.isComplete[i] = false;
					this.allSound.push(new egret.Sound());
					let url : string = RES.getVirtualUrl(this.soundUrl[i]);
					this.allSound[i].load(url);
					this.allSound[i].addEventListener(egret.Event.COMPLETE,(data:egret.Event)=>
					{	
						this.isComplete[this.allSound.indexOf(data.currentTarget)] = true;
						if(this.allReadly() && i>=this.allSound.length){
							notification.postNotification("ready");
						}
					},this);
				}
			} 
		}

		/**
		 * 清除音效
		*/
		cleanChannel(num:number):void
		{
			if(this.allChannel[num]){
				this.allChannel[num].stop();
				this.allChannel[num] = null;
			}
		}

		/**
		 * 创建音效
		*/
		createChannel(num:number,n:number=0,m:number=0,w:number=1):void
		{
			if(!this.isComplete[num])
			{
				return ;
			}
			this.cleanChannel(num);
			if(!api.GlobalAPI.soundManager._soundFlag)
			{
				return ;
			}
			this.allChannel[num] = this.allSound[num].play(m,w);
			this.allChannel[num].volume = api.GlobalAPI.soundManager.effvolume;
			this.allSound[num]["channel"] = this.allChannel[num];
		}

		/**
		 * 删除所有音效
		*/
		disposeAllSound():void
		{
			if(this.allSound!=null)
			{
				for(var i : number = 0;i<this.allSound.length;i++)
				{
					if(this.allChannel[i]){
						this.allChannel[i].stop();
						this.allChannel[i] = null;
					}
					if(this.allSound[i])
					{
						this.allSound[i] = null;
					}
					this.isComplete[i] = false;
				}
				this.allSound = null;
			} 
		}

		/**
		 * 都准备好了
		*/
		private allReadly():boolean
		{
			for(var i : number = 0;i<this.isComplete.length;i++)
			{
				if(!this.isComplete[i])
				{
					return false;
				}
			}
			return true;
		}
	}
}