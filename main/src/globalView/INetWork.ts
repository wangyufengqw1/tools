module api {
	export interface INetWork {
		login(parm?:any);        //登录
		connectServer(host:string,callback:(msg:any)=>void,param?:any);       //连接服务器
		notify(event:string,param:any);                                       //向其他服务器发送监控信息，无需回包
		request(op:string,param?:any,calllback?:(msg:any)=>void,err?:(event:string,code:number,msg:string)=>void); //向服务器发送信息必定回包
		on(op:string,callback:(msg:any)=>void,err?:(event:string,code:number,msg:string)=>void); //监听消息
		off(op:string,callback?:(msg:any)=>void);       //移除消息        
		connected(host:string,port:number):boolean;     //是否连接服务器 
		requestLost():void;                             //请求保存
		close():void;                                   //断开服务器 
	}

	class Request
	{
		public id : number;
		public event : string;
		public param : any;
		public callback:(msg:any)=>void;
		public errcb : (head:any,code:number,msg:string)=>void;
		public sendTime : number;

		public Request()
		{

		}
	}

	enum MessageType
	{
		None,     //开白定义
		Response, //对request的反馈,无需回包
		Request,  //向其他服务器请求,必定回包
		Notify    //向其他服务器发送监控信息,无需回包
	}

	export class Network implements INetWork
	{
		private webSocket : egret.WebSocket;   //前后端交互用webSocket
		private host      : string;            //服务器的host   
		private port      : number;            //端口号
		private callbacks = {};                //注册的消息
		private requests  : {[k:string]:Request} = {}; //装消息的数组 k值得出
		private losts     = [];                //保持请求的消息
		private showMessage : boolean = true;  //debug下发送打印
		private loginparam  : any;             //登陆回调带的参数
		private loginCallback:Function;        //登陆回调的函数
		private reconnect   : number = -1;     //在指定的延迟（以毫秒为单位）后运行指定的函数。 用于清除 
		private timer = null;                  //用于清除
		private handledMsg  : Array<string> = [];
		private requestid : number = egret.getTimer()%20000;

		/**
		 * 登陆 
		 */
		public login(p:{openId:string}):void
		{
			let openId = p;
			GlobalAPI.webSocket.request(GameEvent.Login,{open_id:openId},(data)=>
			{
				if(data["msg"] == "登陆成功" || data["msg"] == "游戏已结束"){
					//账号登录成功、进入游戏
			//		api.GlobalAPI.soundManager.changeMusic(true);
					gui.addScene(DoorView);
				}else if(data["msg"] == "游戏未开始"){

				}else if(data["msg"] == "游戏界面")
				{
					
				}
			},(event:string,code:number,msg:string)=>
			{
				console.error("无法连接游戏服务器,请确认网络连接无异常.[code:%s,msg:%s]",code,msg);
			});
		}

		/**
		 * 连接服务器
		 */
		connectServer(host:string,callback:(msg:any)=>void,param?:any)
		{
			let ip = host.substr(0,host.indexOf(":"));
			let port = parseInt(host.substr(host.indexOf(":")+1,host.length));
			this.loginCallback = callback;
			if(this.connect(ip,port)){  //该地址是否连接
				callback && callback(param);
				this.loginCallback = null;
			}
			if(this.timer!=null){
				this.timer = egret.setInterval(this.timeCheck,this,1000);
			}
		}

		notify(event:string,param:any){
			event = event.toLocaleLowerCase();
			let head = {
				messageType : MessageType.Notify,
				event : event,
				sequence :0
			}
			if(!this.host && this.port)
			{
				return;
			}
			if(!this.webSocket || !this.webSocket.connected)
			{
				this.losts.push({head:head,param:param});
				this.connect(this.host,this.port);
				return;
			}
			if(DEBUG){
				if(this.showMessage){
					console.log('[send]: %s:%s', event, JSON.stringify(param));
				}				
			}
			this.write(head,param);
		}

		request(op:string,param?:any,calllback?:(msg:any)=>void,err?:(event:string,code:number,msg:string)=>void){
			op = op.toLocaleLowerCase();
			//发送消息
			let req : Request = new Request();
			req.id = this.requestid++;
			req.event = op;
			req.param = param || {};
			req.callback = calllback;
			req.errcb    = err;
			this.requests[req.id] = req;     //记录请求
			//调整requestid
			if(this.requestid>=30000){
				this.requestid = 1;
			}

			let head = 
			{
				messageType : MessageType.Request,
				event : op,
				sequence : req.id
			}

			if(!this.webSocket || !this.webSocket.connected)
			{
				this.losts.push({head:head,param:param});
				this.connect(this.host,this.port);
				return;
			}

			if(DEBUG)
			{
				if(this.showMessage)
				{
					console.log('[send]: %s:%s',op,JSON.stringify(param));
				}
			}

			this.write(head,param);
			req.sendTime = egret.getTimer()/1000;
			//timeUtils.time.timestamp();    //记录发送消息给后端的时间点
		};
		
		/**
		 * 添加消息监听
		 */
		on(op:string,callback:(msg:any)=>void,err?:(event:string,code:number,msg:string)=>void){
			op = op.toLocaleLowerCase();
			//发起对event的监听
			let list : any[] = this.callbacks[op] || (this.callbacks[op] = []);
			if(err)
			{
				callback['errcb'] = err;
			}

			if(list.indexOf(callback) == -1){
				list.push(callback);				
			}
		};

		/**
		 * 移除消息监听
		 */
		off(op:string,callback?:(msg:any)=>void){
			op = op.toLocaleLowerCase();
			//取消对event的监听
			let list = this.callbacks[op];
			if(!list){
				return;
			}
			if(!callback)
			{
				this.callbacks[op] = [];
				return;
			}
			for(let i = list.length-1;i>=0;i--)
			{
				if(list[i] === callback){
					list.splice(i,1);
				}
			}
		};

		/**
		 * 是否连接服务器
		 */
		connected(host:string,port:number):boolean{
			return this.webSocket && this.webSocket.connected;
		};

		requestLost():void{
			this.losts.forEach((req) =>
			{
				if(DEBUG)
				{
					if(this.showMessage)
					{
						console.log('[send]: %s:[%s]', req.head.event, JSON.stringify(req.param));
					}
				}
				this.write(req.head, req.param);
			});
			this.losts = [];
		};

		close():void{
			this.webSocket && this.webSocket.close();
		};

		private connect(host: string, port: number)
		{
			if(this.webSocket && this.webSocket.connected && this.host == host && this.port == port)
			{
				//有webSocket 有连接服务器 host 端口号一致
				return  true;
			}
			if(GlobalAPI.localData.get("ShowDebugMessage") == "ON")
			{
				//是否显示debug的消息
				this.showMessage = true;
			}
			this.host = host;
			this.port = port;
			if(!this.webSocket)
			{
				//创建webSocket对象
				this.webSocket = new egret.WebSocket();
				//设置数据格式为二进制,默认认为字符串
				this.webSocket.type = egret.WebSocket.TYPE_BINARY;
				//添加收到数据侦听,收到数据会调用此方法
				this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA,this.onReceiveMessage,this);
				//添加链接打开侦听,连接成功会调用此方法
				this.webSocket.addEventListener(egret.Event.CONNECT,this.onSocketOpen,this);
				//添加链接关闭侦听,手动关闭或者服务器关闭连接会调用此方法
				this.webSocket.addEventListener(egret.Event.CLOSE,this.onClosed,this);
				//添加异常侦听，出现异常会调用此方法
				this.webSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
			}try
			{
				this.webSocket.close();
				let hostList = host.split(".");
				let isHttps  = false;
				for(let k in hostList)
				{
					if(!Number(hostList[k]))
					{	
						isHttps = true;
						break;
					}
				}
				if(!isHttps)
				{
					egret.setTimeout(this.webSocket.connect, this.webSocket, 0, host, port);
				}else{
					egret.setTimeout(this.webSocket.connectByUrl, this.webSocket, 0, 'wss://' + host);
				}
			}catch(error)
			{
				this.onError(error);
			}
		}

		private onReceiveMessage():void
		{
			//创建 ByteArray 对象
			let byte : egret.ByteArray = new egret.ByteArray();
			//读取数据
			this.webSocket.readBytes(byte);
			
			let head = 
			{
				messageType:0,
				srcType    :0,
				srcId      :0,
				descType   :0,
				descId     :0,
				event      :"",
				sequence   :0,
				errcode    :0,
			}

			head.messageType = byte.readByte();
			head.srcType     = byte.readByte();
			head.srcId       = (byte.readInt() << 32) + byte.readInt();
			head.descType    = byte.readByte();
			head.descId      = (byte.readInt() << 32) + byte.readInt();
			head.event       = byte.readUTF().toLocaleLowerCase();
			head.sequence    = byte.readShort();
			head.errcode     = byte.readShort();
			let msghash = head.event + '@' + head.sequence;
			if(head.messageType == MessageType.Response && this.handledMsg.indexOf(msghash)>-1){
				//消息处理过
				return ;
			}
			let body = head.errcode!=0?byte.readUTF : JSON.parse(byte.readUTF());
			if(DEBUG)
			{
				if(this.showMessage)
				{
					console.log('[receive]: %s:%s', head.event, JSON.stringify(body));
				}
			}

			let list = this.callbacks[head.event];
			if(list)
			{
				for(let i = 0;i<list.length;i++)
				{
					let fn = list[i];
					if(!fn)
					{
						continue;
					}
					if(head.errcode)
					{
						let errcb = fn['errcb'] || this.defaultErrCb;
						errcb(head.event, head.errcode, body);
					}else
					{
						fn(body);
					}
				}
			}

			let req : Request = null;
			if(head.sequence!=0 && (req = this.requests[head.sequence]))
			{
				delete this.requests[head.sequence];
				if(head.errcode)
				{
					let errcb0 = req.errcb || this.defaultErrCb;
					errcb0(head.event,head.errcode,body);
				}else
				{
					if(req.callback){
						req.callback(body);
					}
				}
			}

			if (!list && !req) {
				console.error('未监听服务端[%s]消息', head.event);
			}

			if (head.messageType == MessageType.Response) {
				this.handledMsg.unshift(msghash);
				if (this.handledMsg.length > 30) {
					this.handledMsg.pop();
				}
			}
		}

		private timeCheck():void
		{
			let now = egret.getTimer()/1000;
			//timeUtils.time.timestamp();     //1970 到现在的获取时间戳
			for(let key in this.requests)
			{
				var req = this.requests[key];
				if(req.sendTime < now - 15000){ // 过了15秒重新请求
					req.sendTime = now;
					let head = {
						messageType : MessageType.Request,
						event: req.event,
						sequence: req.id
					}
					if(!this.webSocket || this.webSocket.connected)
					{  
						//没有webSocket 或者 没有连接服务器 记录 请求数据重新连接
						this.losts.push({'head': head, 'param': req.param});
						this.connect(this.host, this.port);
						return;
					}
					console.log('消息重发：%s, %s', req.event, req.id);
					this.write(head, req.param);
				}
			}
		}

		private write(head: { messageType: number, event: string, sequence: number },message: any)
		{
			//创建 ByteArray 对象
			let byte: egret.ByteArray = new egret.ByteArray();
			byte.writeByte(head.messageType);//消息类型
			byte.writeShort(head.sequence);//消息序列号
			byte.writeUTF(head.event);//数据类型
			byte.writeUTF(JSON.stringify(message));//消息体
			byte.position = 0;
			//发送数据
			this.webSocket.writeBytes(byte, 0, byte.bytesAvailable);
		}

		private onSocketOpen():void
		{
			if(DEBUG){
				console.log("The connection is successful, : " + this.host + ":" + this.port);
			}
			if (this.loginCallback) {
				this.loginCallback(this.loginparam);
				this.loginCallback = null;
			} else {
				this.login(this.loginparam);
			}
		}

		private onClosed():void
		{
			this.webSocket.close();
		}

		private onError(error):void
		{
			if (this.reconnect != -1) {
				return;
			}
			api.createAlert('网络连接失败3秒后重试',1);
			//在指定的延迟（以毫秒为单位）后运行指定的函数。 用于清除
			this.reconnect = egret.setTimeout(() => {
				this.connect(this.host, this.port);
				this.reconnect = -1;
			}, this, 3000);
		}
		
		private defaultErrCb(event: string, code: number, msg: string) {
			console.log("消息[%s]处理失败, 错误码:%s, 附加消息:%s", event, code, msg);
		}
	}
}