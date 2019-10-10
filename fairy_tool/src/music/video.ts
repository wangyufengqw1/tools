/**
 * Created by lxz on 2017/12/18.
 */
module video {
    import singleton = gameTool.singleton;
    export class Music {
        // private _ac = new AudioContext();
        private _ac;
        // analyser为analysernode，具有频率的数据，用于创建数据可视化
        private _analyser;
        // gain为gainNode，音频的声音处理模块
        private _gainnode;
        private _audio: HTMLVideoElement;
        private _processor: ScriptProcessorNode;
        private _startTime: number;
        private _endTime: number;
        private _totalTime: number;
        private _loaded: FunctionInfo;
        private _complete: FunctionInfo;
        private _running: boolean;
        private _loop: boolean;

        public constructor() {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this._ac =  new window["AudioContext"]();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._audio = document.createElement("video");
            this._audio.setAttribute("id", "__music__");
            this._audio.setAttribute("style", 'visibility:hidden');
            this._audio.setAttribute("webkit-playsinline", 'true');
            this._audio.setAttribute("playsinline", 'true');
            this._audio.controls = false;
            this._audio.autoplay = false;
            // this._audio.setAttribute("type", "audio/mpeg");
            this._audio.crossOrigin = "anonymous";
            document.head.appendChild(this._audio);

            this._analyser = this._ac.createAnalyser();
            this._gainnode = this._ac.createGain();
            this._gainnode.gain.value = 1;

            //如果arg是audio的dom对象，则转为相应的源
            let source: MediaElementAudioSourceNode = this._ac.createMediaElementSource(this._audio);
            // //连接analyserNode
            // source.connect(this._analyser);
            //
            // //再连接到gainNode
            // this._analyser.connect(this._gainnode);
            //
            // //最终输出到音频播放器
            // this._gainnode.connect(this._ac.destination);
            /* 创建一个1024长度的缓冲区 `bufferSize` */
            this._processor = this._ac.createScriptProcessor(1024);
            /* 将 this._processor 和 _audio 连接 */
            this._processor.connect(this._ac.destination);
            /* 将 this._processor 和 _analyser 连接 */
            this._analyser.connect(this._processor);




            /* 定义一个 Uint8Array 字节流去接收分析后的数据*/
            //出来的数组为8bit整型数组，即值为0~256，整个数组长度为1024，即会有1024个频率，只需要取部分进行显示
            // let bufferLength = this._analyser.frequencyBinCount;
            // let data = new Uint8Array(bufferLength);
            /* 连接到 _analyser. */
            source.connect(this._analyser);
            source.connect(this._ac.destination);

            this._processor.onaudioprocess = () => {
                /* 产生频率数据 */
                //将音频节点的数据拷贝到Uin8Array中
                //this._analyser.getByteFrequencyData(data);
                if (this._endTime == 0 || !this._running) {
                    return;
                }
                if (this._audio.currentTime >= this._endTime) {
                    if (this._loop) {
                        this.play(this._startTime, this._endTime);
                    } else {
                        this.pause();
                    }
                    if (this._complete.fun) {
                        this._complete.call();
                    }
                }
            };

            this._audio.addEventListener("loadeddata", () => {
                    this._totalTime = this._audio.duration;
                    if (this._endTime == 0) {
                        this._endTime = this._totalTime;
                    }
                    this._loaded.args = [this._totalTime];
                    if (this._loaded.fun) {
                        this._loaded.call();
                    }
                }
            );
        }

        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number) {
            let k = setTimeout(() => {
                clearTimeout(k);
                this._audio.currentTime = start;
                this._audio.play();
                this._running = true;
                this._startTime = start;
                if (end == 0) {
                    this._endTime = this._totalTime == 0 ? 0 : this._totalTime;
                } else {
                    this._endTime = end;
                }
            }, 200);

        }

        pause() {
            this._running = false;
            this._audio.pause();
        }

        /**
         * 设置音频地址
         */
        setMusicUrl(url: string) {
            this._endTime = 0;
            this._totalTime = 0;
            this._audio.src = url;
            this._audio.load();
        }

        /**
         * 加载完音频
         */
        setLoaded(fun: (duration: number) => void, context?: any) {
            this._loaded.fun = fun;
            this._loaded.context = context;
        }

        /**
         * 播放一遍回调
         */
        setComplete(fun: () => void, context?: any) {
            this._complete.fun = fun;
            this._complete.context = context;
        }


        get loop(): boolean {
            return this._loop;
        }

        set loop(value: boolean) {
            this._loop = value;
        }

        get running(): boolean {
            return this._running;
        }

        get currentTime(): number {
            return this._audio.currentTime;
        }

        set currentTime(time) {
            this._audio.currentTime = time;
        }
    }

    /**
     * 播放音频
     * start        开始时间
     * end          0:播放到结束
     */
    export function play(start: number, end: number) {
        singleton(Music).play(start, end);
    }

    export function pause() {
        singleton(Music).pause();
    }

    /**
     * 设置音频地址
     */
    export function setMusicUrl(url: string) {
        singleton(Music).setMusicUrl(url);
    }

    /**
     * 加载完音频
     */
    export function setLoaded(fun: (duration: number) => void, context?: any) {
        singleton(Music).setLoaded(fun, context);
    }

    /**
     * 播放一遍回调
     */
    export function setComplete(fun: () => void, context?: any) {
        singleton(Music).setComplete(fun, context);
    }

    export function isRunning() {
        return singleton(Music).running;
    }

    export function setLoop(b: boolean) {
        singleton(Music).loop = b;
    }

    export function getCurrentTime(): number {
        return singleton(Music).currentTime;
    }

    export function setCurrentTime(time) {
        singleton(Music).currentTime = time;
    }
}