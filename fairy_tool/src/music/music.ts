/**
 * Created by lxz on 2017/12/18.
 */


module music {
    // export function getAudioContext():AudioContext {
    //     window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
    //     return gameTool.singleton(window["AudioContext"]) as AudioContext;
    // }

    import singleton = gameTool.singleton;

    export class Music {
        private _ac: AudioContext;
        private _endTime: number;
        private _totalTime: number;
        private _loaded: FunctionInfo;
        private _complete: FunctionInfo;
        private _running: boolean;
        private _loop: boolean;
        private _buffer: AudioBuffer;
        private _sourceNode: AudioBufferSourceNode;
        private _currentTime: number;
        private _analyser;
        // gain为gainNode，音频的声音处理模块
        private _gainnode;
        private _isPause: boolean;

        private _acStartTime: number;
        private _startTime: number;
        private _pauseTime: number;

        public constructor() {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this.init();
        }

        dispose() {
            this.pause();
            this._ac.close();
            this._ac = null;
            this._buffer = null;
            this._sourceNode = null;
        }

        init() {
            this._ac = new window["AudioContext"]();
            // this._ac = getAudioContext();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._analyser = this._ac.createAnalyser();
            this._gainnode = this._ac.createGain();
            // this._gainnode.gain.value = 1;
        }

        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number) {
            // this.pause();
            this.pauseMusic();
            if (this._pauseTime) {
                this._acStartTime += this._ac.currentTime - this._pauseTime;
                this._pauseTime = 0;
            }
            this._isPause = false;
            // if(this._sourceNode){
            this._sourceNode = this._ac.createBufferSource();//创建一个音频源 相当于是装音频的容器
            //连接analyserNode
            this._sourceNode.connect(this._analyser);
            //再连接到gainNode
            this._analyser.connect(this._gainnode);
            //最终输出到音频播放器
            this._gainnode.connect(this._ac.destination);
            // }
            this._sourceNode.buffer = this._buffer;//  告诉音频源 播放哪一段音频
            // this._sourceNode.connect(this._ac.destination);// 连接到输出源
            this._running = true;
            if (end == 0) {
                this._sourceNode.start(0, start);//开始播放
            } else {
                this._sourceNode.start(0, start, end - start);//开始播放
            }
            this._sourceNode.onended = (e) => {
                if (this._complete.fun) {
                    this._complete.call();
                }
            };
        }

        pause() {
            this._pauseTime = this._ac.currentTime;
            this._isPause = true;
            this._running = false;
            this._currentTime = this._ac.currentTime;
            this.pauseMusic();
            this._sourceNode = null;
        }

        /**
         * 设置音频地址
         */
        setMusicUrl(url: string) {
            this._endTime = 0;
            this._totalTime = 0;
            var request = new XMLHttpRequest();
            request.open("GET", url, true);
            request.responseType = "arraybuffer";
            // console.log("设置音频地址" , url);
            //下面就是对音频文件的异步解析
            request.onload = () => {
                // console.log(request.response);
                this._startTime = 0;
                this._ac.decodeAudioData(request.response, (buffer) => {
                    // console.log(buffer);
                    this._buffer = buffer;
                    this._totalTime = this._buffer.duration;
                    if (this._endTime == 0) {
                        this._endTime = this._totalTime;
                    }
                    this._loaded.args = [this._totalTime];
                    this._acStartTime = this._ac.currentTime;
                    this._pauseTime = 0;
                    if (this._loaded.fun) {
                        this._loaded.call();
                    }
                }, this.onError);
            }
            request.onerror = (e) => {
                console.log(e);
            }
            request.upload.addEventListener("error", (e) => {
                console.log(e);
            });
            request.send();
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
         *
         */
        setComplete(fun: () => void, context?: any) {
            this._complete.fun = fun;
            this._complete.context = context;
        }

        /******************************************************************/
        private onError(e) {
            console.log(e);
        }

        // private pauseMusic() {
        //     if (this._sourceNode && ('stop' in this._sourceNode)) {
        //         try {
        //             this._sourceNode.stop();
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        //     if (this._sourceNode) {
        //         try {
        //             this._sourceNode.disconnect(this._analyser);
        //             this._analyser.disconnect(this._gainnode);
        //             this._gainnode.disconnect(this._ac.destination);
        //         } catch (e) {
        //             console.log(e);
        //         }
        //     }
        // }
        private pauseMusic() {
            if (this._sourceNode) {
                this._sourceNode.stop();
            }
            if (this._sourceNode) {
                this._sourceNode.disconnect(this._analyser);
                this._analyser.disconnect(this._gainnode);
                this._gainnode.disconnect(this._ac.destination);
            }
        }

        /******************************************************************/
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
            // console.log((this._ac.currentTime - this._acStartTime));
            return this._isPause ? this._currentTime : (this._startTime + this._ac.currentTime - this._acStartTime);
        }

        set currentTime(time) {
            this._currentTime = time;
        }

        set startTime(time) {
            this._startTime = time;
        }

        get endTime(): number {
            return this._endTime;
        }
    }

    export function init() {
        singleton(Music).init();
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

    export function dispose() {
        singleton(Music).dispose();
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

    export function setStartTime(time) {
        singleton(Music).startTime = time;
    }

    export function getEndTime() {
        return singleton(Music).endTime;
    }
}