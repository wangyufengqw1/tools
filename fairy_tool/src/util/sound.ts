module sound {
    import singleton = gameTool.singleton;

    /**
     *
     */
    /**
     * 播放特效音乐
     */
    export function playSound(res, volume ?: number): void {
        var effect: egret.Sound = RES.getRes(res);
        effect.type = egret.Sound.EFFECT;
        var channel = effect.play(0, 1);
        channel.volume = volume ? volume : .5;
        // effect.play(0,1);
    }

    /**
     * 背景音乐是否开着
     */
    export function isMusicOpen() {
        return singleton(SoundManager).isMusicOpen();
    }

    /**
     * 特效音乐是否开着
     */
    export function isEffectOpen() {
        return singleton(SoundManager).isEffectOpen();
    }

    /**
     * 背景音乐开关切换
     */
    export function switchMusic() {
        singleton(SoundManager).switchMusic();
    }

    /**
     * 特效音乐开关切换
     */
    export function switchEffect() {
        singleton(SoundManager).switchEffect();
    }

    /**
     * 播放特效音乐
     */
    export function playEffect(res, volume ?: number): void {
        singleton(SoundManager).playEffect(res, volume);
    }

    /**
     * 播放背景音乐
     */
    export function playBGM(name: string): void {
        singleton(SoundManager).playBGM(name);
    }

    /**
     * 暂停背景音乐
     */
    export function pauseBGM(): void {
        singleton(SoundManager).pauseBGM();
    }

    /**
     * 继续背景音乐
     */
    export function resumeBGM(): void {
        singleton(SoundManager).resumeBGM();
    }

    export class SoundManager {
        /**
         * 背景音乐音量
         */
        volume = 0.45;
        private _lastMusic = "";
        private _soundChannel: egret.SoundChannel;
        private _sound: egret.Sound;

        public constructor() {

        }

        init(stage: egret.Stage) {
            if (!egret.localStorage.getItem("music")) {
                this.switchMusic();
            }
            if (!egret.localStorage.getItem("effect")) {
                this.switchEffect();
            }
            stage.addEventListener(egret.Event.DEACTIVATE, this.onBlur, this);
            stage.addEventListener(egret.Event.ACTIVATE, this.onFocus, this);
        }

        /******************************************************************/
        /**
         * 背景音乐是否开着
         */
        isMusicOpen() {
            return egret.localStorage.getItem("music") == "1";
        }

        /**
         * 特效音乐是否开着
         */
        isEffectOpen() {
            return egret.localStorage.getItem("effect") == "1";
        }

        /**
         * 背景音乐开关切换
         */
        switchMusic() {
            if (this.isMusicOpen()) {
                egret.localStorage.setItem("music", "2");
            } else {
                egret.localStorage.setItem("music", "1");
            }
        }

        /**
         * 特效音乐开关切换
         */
        switchEffect() {
            if (this.isEffectOpen()) {
                egret.localStorage.setItem("effect", "2");
            } else {
                egret.localStorage.setItem("effect", "1");
            }
        }

        /**
         * 播放特效音乐
         */
        playEffect(res, volume ?: number): void {
            if (!this.isEffectOpen()) {
                return;
            }
            // RES.getResAsync(res, ()=> {
            var effect: egret.Sound = RES.getRes(res);
            effect.type = egret.Sound.EFFECT;
            var channel = effect.play(0, 1);
            channel.volume = volume ? volume : this.volume;
            // }, this);
        }

        /**
         * 播放背景音乐
         */
        playBGM(name: string): void {
            if (this._lastMusic == name) {
                return;
            }
            this.disposeSound();
            this._lastMusic = name;
            this.playMusic();
        }

        /**
         * 暂停背景音乐
         */
        pauseBGM(): void {
            if (this.isMusicOpen()) {
                if (this._soundChannel && !this._soundChannel["isStopped"]) {
                    this._soundChannel.volume = 0;
                }
            }
        }

        /**
         * 继续背景音乐
         */
        resumeBGM(): void {
            if (this.isMusicOpen()) {
                if (this._soundChannel && !this._soundChannel["isStopped"]) {
                    this._soundChannel.volume = this.volume;
                }
            }
        }

        /**
         * 释放音乐资源
         */
        disposeSound() {
            if (this._soundChannel) {
                this._soundChannel.stop();
                this._soundChannel = null;
            }
            if (this._sound) {
                this._sound.removeEventListener(egret.Event.COMPLETE, this.soundLoaded, this);
            }
        }

        /******************************************************************/

        private onBlur() {
            this.pauseBGM();
        }

        private onFocus() {
            this.resumeBGM();
        }

        private playMusic() {
            if (!this.isMusicOpen()) {
                return;
            }
            RES.getResAsync(this._lastMusic, this.soundLoaded, this);
        }

        private soundLoaded() {
            if (!this.isMusicOpen()) {
                return;
            }
            this._sound = RES.getRes(this._lastMusic);
            this._sound.type = egret.Sound.MUSIC;
            this._soundChannel = this._sound.play(0, -1);
            this._soundChannel.volume = this.volume;
        }
    }

}
