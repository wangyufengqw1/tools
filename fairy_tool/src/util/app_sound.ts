module app_sound {
    import singleton = gameTool.singleton;
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
            stage.addEventListener(egret.Event.DEACTIVATE, this.onBlur, this);
            stage.addEventListener(egret.Event.ACTIVATE, this.onFocus, this);
        }

        /******************************************************************/

        /**
         * 播放特效音乐
         */
        playEffect(res, volume ?: number): void {
            var effect: egret.Sound = RES.getRes(res);
            if(effect){
                effect.type = egret.Sound.EFFECT;
                var channel = effect.play(0, 1);
                channel.volume = volume ? volume : this.volume;
            }
        }

        /**
         * 播放背景音乐
         */
        playBGM(name: string): void {
            if (this._lastMusic == name) {
                this.disposeSound();
                this._soundChannel = this._sound.play();
                return;
            }
            this._lastMusic = name;
            this._sound = RES.getRes(this._lastMusic);
            if(this._sound){
                this._sound.type = egret.Sound.MUSIC;
                this.disposeSound();
                this._soundChannel = this._sound.play();
            }
        }

        /**
         * 暂停背景音乐
         */
        pauseBGM(): void {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = 0;
            }
        }

        /**
         * 继续背景音乐
         */
        resumeBGM(): void {
            if (this._soundChannel && !this._soundChannel["isStopped"]) {
                this._soundChannel.volume = this.volume;
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
        }

        /******************************************************************/

        private onBlur() {
            this.pauseBGM();
        }

        private onFocus() {
            this.resumeBGM();
        }

    }

}
