class SoundManagers {
	/**
	 * 背景音乐音量
	 */
	volume : number = 0.2;
	effvolume : number = 0.2; 
	private _lastMusic = "resource/sounds/bgmusic.mp3";
	private _soundChannel : egret.SoundChannel;
	private _sound : egret.Sound;

	public constructor(stage:egret.Stage)
	{
		stage.addEventListener(egret.Event.DEACTIVATE,this.onBlur,this);
		stage.addEventListener(egret.Event.ACTIVATE,this.onFocus,this);
	}

	/********************************音效*********************************** */
	_soundFlag : boolean = false;
	public changeSound(p_flag:boolean):void
	{
		if(this._soundFlag!=p_flag)
		{
			this._soundFlag = p_flag;
		}
	}

	/**
	 * 播放特效音乐
	 */
	playEffect(res,volume?:number):void
	{
		if(!this._soundFlag)
		{
			return;	
		}
		RES.getResAsync(res,function()
		{
			var effect:egret.Sound = RES.getRes(res);
			effect.type = egret.Sound.EFFECT;
			var channel = effect.play(0,1);
			channel.volume = volume?volume:this.effvolume;
		},this);
	} 	

	playEffectBuYrl(p_url:string,p_loop?:number,p_volume?:number):egret.Sound
	{
		if(!this._soundFlag)
		{
			return;
		}
		var effect : egret.Sound = new egret.Sound();
		effect.load(p_url);
		effect.addEventListener(egret.Event.COMPLETE,()=>
		{
			var channel = effect.play(0,p_loop?p_loop:0);
			channel.volume = p_volume?p_volume:this.effvolume;
			effect["channel"] = channel;
		},this);
		return effect;
	}


	/*****************************音乐*******************************/
	_musicFlag : boolean = false;      //背景音乐是否播放
	public changeMusic(p_flag: boolean,str:string):void
	{
		if(this._musicFlag!=p_flag)
		{
			this._musicFlag = p_flag;
			if(this._musicFlag){    //可播放
				if(this.isInPlay){
					this.playRedBGM(true,str);
				}else{
					this.playBGM(str);
				}
			}else
			{	
				this.pauseBGM();
			}
		}
	}

	/**
	 * 游戏界面音乐 
	 */
	private isInPlay : boolean = false;
	public playRedBGM(notRec:boolean = false,str:string):void
	{

		this.playBGM(str);
		this.isInPlay = true;
	}
	

	/**
	 * 播放音乐
	 */
	playBGM(name: string, notRec:boolean = false):void
	{
		if(!notRec)
		{
			this.preBGM = this._lastMusic;  //记录上一次的音乐
		}
		this._lastMusic = name;             //这次的音乐赋值
		if(!this._musicFlag){               //是否可以播放
            return;
        }
		if (this.isPause && this.pauseMusic == name) { //是否暂停 和 是否暂停音乐与要播放的音乐一致
            this.resumeBGM();
            return;
        }
		this.disposeSound();               //释放音乐资源
		RES.getResByUrl(this._lastMusic,(p_sound)=>
		{
			this._sound = p_sound;
			this._sound.type = egret.Sound.MUSIC;
			if(this._soundChannel)
			{
				this._soundChannel.stop();
			}
			this._soundChannel = this._sound.play(0,-1);
			this._soundChannel.volume = this.volume*0.2;
		},this,"sound");	
	}

	/**
     * 暂停背景音乐
     */
	private isPause:boolean;
    private pauseMusic:string;
	pauseBGM():void
	{	
		if(this._soundChannel && !this._soundChannel["isStopped"])
		{
			this._soundChannel.volume = 0;
            this.pauseMusic = this._lastMusic;
            this.isPause = true;
		}
	}

	/**
	 * 继续播放音乐
	 */
	resumeBGM():void
	{
		if(this._musicFlag){
			if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = this.volume*0.2;
                this.isPause = false;
            }
		}
	}
	/*************************************************************************/

	private onBlur() {
        this.pauseBGM();  //暂停背景音乐
    }

    private onFocus() { 
        this.resumeBGM(); //继续背景音乐
    }

	/**
     * 播放上一条BGM
     */
    public preBGM:string;
	playPreBGM():void
	{
		this.playBGM(this.preBGM);
		this.isInPlay = false;
	}

	/**
     * 重置BGM
     */
    public resetBGM():void{
        this.playBGM(this._lastMusic);
        this.isInPlay = false;
    }

	/**
	 * 音乐加载
	 */
	private soundLoaded():void
	{
		if(!this._musicFlag){
			return;
		}
		this._sound = RES.getRes(this._lastMusic);
		this._sound.type = egret.Sound.MUSIC;
		this._soundChannel = this._sound.play(0, -1);
        this._soundChannel.volume = this.volume;
	}

	/**
	 * 释放音乐资源
	 */
	private disposeSound():void
	{
		if(this._soundChannel){
			this._soundChannel.stop();
			this._soundChannel = null;
		}
		if(this._sound)
		{
			this._sound.removeEventListener(egret.Event.COMPLETE, this.soundLoaded, this);
		}
	}


	/********************************************删除音乐*************************************************/
		private  allSound : egret.Sound[];                      //所有音效的sound
		private  allChannel : egret.SoundChannel[] = [];		//所有音效的声道
		private  isComplete : boolean[]= [false,false];         //是否加载完成 
		/**
		 * 声音初始化加载
		 */
		soundInit():void
		{
			if(this.allSound==null)
			{
				this.allSound = [];
				var arr : string[] = 
				['resource/sounds/shootApp_1.mp3','resource/sounds/shootApp_2.mp3',
				 'resource/sounds/shootApp_3.mp3','resource/sounds/shootBla_1.mp3',
				 'resource/sounds/shootBla_2.mp3','resource/sounds/shootBla_3.mp3',
				 'resource/sounds/shoot_1.mp3','resource/sounds/shoot_2.mp3',
				 'resource/sounds/shoot_3.mp3','resource/sounds/shoot_4.mp3',
				 'resource/sounds/ps_1.mp3','resource/sounds/ps_2.wav',
				 'resource/sounds/ps_3.mp3','resource/sounds/ps_4.mp3'];
				for(var i : number = 0;i<arr.length;i++)
				{
					this.isComplete[i] = false;
					this.allSound.push(new egret.Sound());
					this.allSound[i].load(arr[i]);
					this.allSound[i].addEventListener(egret.Event.COMPLETE,(data:egret.Event)=>
					{	
						this.isComplete[this.allSound.indexOf(data.currentTarget)] = true;
						if(this.allReadly() && i>=arr.length){
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
		createChannel(num:number,n:number,m:number=0,w:number=1):void
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
			this.allChannel[num].volume = n;
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
		allReadly():boolean
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