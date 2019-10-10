/**
 * Created by lxz on 2017/12/18.
 */
module audio {
    import singleton = gameTool.singleton;

    export class Music {
        // private _ac = new AudioContext();
        private _ac;
        private _audio: HTMLAudioElement;
        private _startTime: number;
        private _endTime: number;
        private _totalTime: number;
        private _loaded: FunctionInfo;
        private _complete: FunctionInfo;
        private _running: boolean;
        private _loop: boolean;
        private _timeID: number;

        public constructor() {
            console.log("audio1");
            window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
            this._ac = new window["AudioContext"]();
            // this._ac = music.getAudioContext();
            this._loaded = new FunctionInfo();
            this._complete = new FunctionInfo();
            this._audio = document.createElement("audio");
            this._audio.setAttribute("id", "__music__");
            this._audio.crossOrigin = "anonymous";
            document.body.appendChild(this._audio);
            this._audio.onloadeddata = () => {
                console.log("onloadeddata");
                this._totalTime = this._audio.duration;
                if (this._endTime == 0) {
                    this._endTime = this._totalTime;
                }
                this._loaded.args = [this._totalTime];
                if (this._loaded.fun) {
                    this._loaded.call();
                }
            }
            console.log("audio2");
            // this._audio.addEventListener("loadeddata", function () {
            //         console.log("xxxxxxxxxx");
            //     }
            // );
            // this._audio.addEventListener("loadstart", function (e) {
            //         console.log(e);
            //     }
            // );
            // this._audio.addEventListener("durationchange", function (e) {
            //         console.log(e);
            //     }
            // );
            // this._audio.addEventListener("error", function (e) {
            //         console.log(e);
            //     }
            // );
            // this._audio.onerror = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.onloadstart = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.ondurationchange = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.onloadedmetadata = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.onprogress = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.oncanplay = (ev) => {
            //     console.log(ev);
            // }
            // this._audio.oncanplaythrough = (ev) => {
            //     console.log(ev);
            // }
            console.log("audio3");
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

                this._timeID = egret.setInterval(() => {
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
                }, this, 200);
            }, 200);

        }

        pause() {
            this._running = false;
            this._audio.pause();
            egret.clearInterval(this._timeID);
        }

        /**
         * 设置音频地址
         */
        setMusicUrl(url: string) {
            this._endTime = 0;
            this._totalTime = 0;
            this._audio.src = url;
            if (url && url != "") {
                this._audio.load();
                console.log("设置音频地址");
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

        get endTime(): number {
            return this._endTime;
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

    export function getEndTime() {
        return singleton(Music).endTime;
    }
}