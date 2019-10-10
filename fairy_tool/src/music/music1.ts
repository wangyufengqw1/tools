/**
 * Created by lxz on 2017/12/18.
 */


module music_test {
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
        private _pauseTime: number;
        private _resList: any;

        public constructor() {
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this.init();
        }

        dispose() {
            this._ac.close();
            this._ac = null;
            this._buffer = null;
            this._sourceNode = null;
            this._resList = null;
        }

        init() {
            this._resList = {};
            this._ac = new window["AudioContext"]();
            // this._ac = getAudioContext();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._gainnode = this._ac.createGain();
            this._gainnode.gain.value = 1;
        }

        /**
         * 播放音频
         * start        开始时间
         * end          0:播放到结束
         */
        play(start: number, end: number) {
            // this.pause();
            if (this._pauseTime) {
                this._acStartTime += this._ac.currentTime - this._pauseTime;
                this._pauseTime = 0;
            }
            this._isPause = false;
            // if(!this._sourceNode){
            this._sourceNode = this._ac.createBufferSource();//创建一个音频源 相当于是装音频的容器
            // }
            this._sourceNode.buffer = this._buffer;//  告诉音频源 播放哪一段音频
            let audioDestinationNode = this._ac.destination;
            this._sourceNode.connect(audioDestinationNode);
            this._sourceNode.start(0);//开始播放
            console.log(this._sourceNode);
            // if (end == 0) {
            //     this._sourceNode.start(0, start);//开始播放
            // } else {
            //     this._sourceNode.start(0, start, end - start);//开始播放
            // }
            this._sourceNode.onended = (e) => {
                tip.showTextTip("播放完毕");
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
            if (this._sourceNode && ('stop' in this._sourceNode)) {
                try {
                    this._sourceNode.stop();
                } catch (e) {
                    console.log(e);
                }
            }
            if (this._sourceNode) {
                try {
                    this._sourceNode.disconnect(this._analyser);
                    this._analyser.disconnect(this._gainnode);
                    this._gainnode.disconnect(this._ac.destination);
                } catch (e) {
                    console.log(e);
                }
            }
            this._sourceNode = null;
        }

        /**
         * 设置音频地址
         */
        setMusicUrl(url: string) {
            this._endTime = 0;
            this._totalTime = 0;
            if (this._resList[url]) {
                this.getBuffer(this._resList[url]);
            } else {
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                // console.log("设置音频地址" , url);
                //下面就是对音频文件的异步解析
                request.onload = () => {
                    // console.log(request.response);
                    this._ac.decodeAudioData(request.response, (buffer) => {
                        this.getBuffer(buffer);
                        this._resList[url] = buffer;
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

        /******************************************************************/
        private getBuffer(buffer) {
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
        }

        private onError(e) {
            console.log(e);
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
            return this._isPause ? this._currentTime : (this._ac.currentTime - this._acStartTime);
        }

        set currentTime(time) {
            this._currentTime = time;
        }

        get endTime(): number {
            return this._endTime;
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

    export function getEndTime() {
        return singleton(Music).endTime;
    }
}