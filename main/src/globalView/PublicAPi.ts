class PublicAPi{
	public constructor() {
        this.gameEvebt = {};
        this.regedEvebt = {};
        this.initEvent();
	}

    /**
     * 全局监听的消息
     */
	private initEvent():void
	{
        
        this.regedEvebt[GameEvent.kickout] = this.kickoutF.bind(this);
  //      this.regedEvebt[GameEvent.xiantao] = this.xiantao.bind(this);
        this.regedEvebt[GameEvent.diaoxian] = this.diaoxian.bind(this);
        this.regedEvebt[GameEvent.istanchuang] = this.isTanChuang.bind(this);
        this.eventInit();
	}


    /**
     *  弹窗显示
     */
    private isTanChuang(str:string):void
    {
        this.openStr = str;
        notification.postNotification(GameEvent.istanchuang);  //发送弹窗推送
    }

    /**
     * 后端掉线询问
     */
    private diaoxian():void
    {
       api.GlobalAPI.webSocket.request(GameEvent.Getdiaoxianjiance,{});
    }

    // /**
    //  * 仙桃  全服仙桃推送
    //  */
    // private xiantao(str:string):void
	// {
    //     let item  = gameTool.poolList.getInstance(TipShowForAll,gameTool.stage.width,gameTool.stage.height/10,str);
    //     gui.addGComponentToStage(item,define.WindowType.TIP_LAYER);
	// }

    /**
     * 掉线通知
     */
    private kickoutF(data:any):void
	{
        if(data == "账户已失效，请重新连接"){
            api.GlobalAPI.publicApi.isOnlie = 4;
            this.eventRemove();
            api.createAlert(data,1,(type:number)=>
            {
                gui.removeAllView();
            });
        }else if(data == "网络已断，请重新连接")
        {
            api.GlobalAPI.publicApi.isOnlie = 3;
            api.createAlert(data,3);
        }
        
	}

    private regedEvebt:{[k: string]: (msg: any) => void};

	 /**
	 * 后端消息接听初始化
	 */
	private  eventInit():void
    {
        if(this.regedEvebt!=null)
        {
            for(var o in this.regedEvebt)
            {
                api.GlobalAPI.webSocket.on(o,this.regedEvebt[o]);
            }
        }
    }

	/**
	 * 消息移除
	 */
    private eventRemove():void
    {
        if(this.regedEvebt!=null)
        {
            for(var o in this.regedEvebt)
            {
               api.GlobalAPI.webSocket.off(o,this.regedEvebt[o]);
            }
        }
    }

   private gameEvebt:any;       //游戏中的消息累计、
    /**
     * 添加后端消息监控
     */
    addGameEvebt(name:string,k:string,_fun:Function,arg:any):void
    {
        if(this.gameEvebt[name] == null){
            this.gameEvebt[name] = [];
        }
        this.gameEvebt[name][k] = _fun.bind(arg);
    }

    /**
     * 游戏初始化
     */
    gameEvebtInit(name:string)
    {
        if(this.gameEvebt[name]!=null)
        {
            for(var o in this.gameEvebt[name])
            {
                api.GlobalAPI.webSocket.on(o,this.gameEvebt[name][o]);
            }
        }
    }

    /**
     * 移除游戏中的消息
     */
    removeGameEvbt(name:string):void
    {
        if(this.gameEvebt[name]!=null)
        {
            for(var o in this.gameEvebt[name])
            {
               api.GlobalAPI.webSocket.off(o,this.gameEvebt[name][o]);
            }
        }
    }

    private allRemoveEvbt():void
    {
        for(var name in this.gameEvebt)
        {
            for(var o in this.gameEvebt[name])
            {
               api.GlobalAPI.webSocket.off(o,this.gameEvebt[name][o]);
            }
        }
    }

    dispose():void
    {
        this.allRemoveEvbt();
        this.eventRemove();
        this.regedEvebt = null;
        this.gameEvebt  = null;
    }

    /**
     * 替换名字
     */
    changeName(str:string):string
    {
        let name : string = "";
        let len  : number = str.length;
        for(var i : number = 0;i<len;i++){
            if(i == Math.floor(len/2-1) || i == Math.floor(len/2) || i== Math.floor(len/2+1)){
                name+="*";
            }else{
                name+=str.charAt(i);
            }
        }
        return name;
    }

     /**
     * 替换名字
     */
    changeMoney(num:number):string
    {
        let atr : string = "";
        let str  : string = num.toString();
        for(var x : number = 0;x<str.length;x++){
            atr+=str.charAt(x);
            if((str.length-x)%3==1 && x!=str.length-1){
                atr+=",";
            }
        }
        return atr;
    }

    /**
     * 交换位置 a是需要的 b是替换的
     */
    sweepChangeCom(a:fairygui.GComponent,b:fairygui.GComponent):void
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

    /**
     * 登录界面继续游戏
     */
    contineGame(data:any):void
    {
         switch(data["which"])
        {
            case 1:     //红包
                api.GlobalAPI.moduleManager.openModule("redProject");
           //     changeBackground(1,1);
				gameTool.stage.setContentSize(1920,1080);
				gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
                break;
            case 4:     //扫雷
          //      changeBackground(1,1);
				gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
				gameTool.stage.setContentSize(1920,1080);
                api.GlobalAPI.moduleManager.openModule("sweepGame");
                break;     
            case 5:     //大圣
          //      changeBackground(3,1);
                api.GlobalAPI.moduleManager.openModule("gzHero");
                break; 
            case 6:     //飞刀
           //     changeBackground(4,1);
                api.GlobalAPI.moduleManager.openModule("feidao");
                break;                                
        } 
    }

    /**
     * 播放该物件下的所有动画  
     */
    playAllMc(value:fairygui.GComponent,callBack:CallBackVo = null):void
    {
        var callBackBoolean : boolean  = false;          //只用其中一个动画来回调
        for(var i : number = 0;i<value.numChildren;i++){
            var sp : any = value.getChildAt(i);
            if(sp instanceof fairygui.GComponent){
                if((sp as fairygui.GComponent).getTransition("t0")){
                    if(!callBackBoolean && callBack!=null){   //动画回调
                        callBackBoolean = true;
                        (sp as fairygui.GComponent).getTransition("t0").play(()=>{
                            callBack.apply();
                        },this);
                    }else{
                        (sp as fairygui.GComponent).getTransition("t0").play();
                    }
                }
            }
        }
    }

    /**
     * 播放动画
     */
    playMc(value:fairygui.GComponent,callBack:CallBackVo = null):void
    {
        if(value.getTransition("t0"))
        {
            if(callBack!=null){   //动画回调
                value.getTransition("t0").play(()=>{
                    callBack.apply();
                },this);
            }else{
                value.getTransition("t0").play();
            }
        }
    }

    comebackDoor():void
    {
        if(isPc()){
            gui.addScene(PcDoorView);    
        }else{
            gui.addScene(DoorView);
        }
    }

     /**
     * 公告显示
     */
    doorTipShow(str:string):string
    {
        let restr: string = "<font color='#E5522E'>[公告]</font> 恭喜"; 
        let strs : string[] = str.split("-"); 
        restr+="<font color='#F7C538'>"+this.changeName(strs[1])+"</font>"+"在";
        restr+="<font color='#E5522E'>"+strs[0]+strs[2]+"</font>";
        // for(let i : number = 0;i<strs.length-1;i++){
        //     restr+=strs[i];
        // }
        //如果最后一个字符串为""; 则获取皮肤
        if(strs[strs.length-1] == ""){
            restr+="<font color='#F7C538'>获取皮肤</font>"; 
        }else{
            restr+="获得<font color='#F7C538'>"+strs[strs.length-1]+"金币</font>";
        }
        return restr;
    }


    /**
     * 将玩家的信息排在第一位
     */
    firstMyInfomation(value : any):any
    {
        if(value && value.length>0){
				var t : any;
				for(var i : number = 0;i<value.length;i++)
				{
					if(value[i]["open_id"] == api.GlobalAPI.userData.getOpenId())
					{
						t = value[i];
						value[i] = value[0];
						value[0] = t;
					}
				}
			}
			return value;
    }

    soundFirst:boolean;
    isOnlie:number;     //1网络有链接 2没有网络 3没有网络提示框已弹 4
    isRelease:boolean; 
    openModule:string;  //打开模块的模块名s
    openStr   :string;  //字符串

    /************************************************这个是热门区域*********************************************************/
    myId    : number[] = [0,1,3,2,6,4,5,99];                                      
    nameArr : string[] = ["幸运福袋","欢乐钓鱼","大圣偷桃","扫雷","暗棋争霸","飞刀挑战","闯三关","敬请期待"];
    mcArr   : number[] = [0,1,3,2,4,1,1,4];    //mc对应的颜色  
    pNum    : string[];
}