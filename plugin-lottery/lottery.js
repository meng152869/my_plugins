class Lottery {
    constructor(options) {
      this._jumptime = 15; // 时间变化的幅度  每次闪动时间增加或减少的值
      this.current = -1; // 当时被选中的奖项 在所有奖项中的索引 初始值为-1
      this.isrotate = false; // isrotate 标识是否正在抽奖
      this.acount = 0; // 闪动的次数
      this.time = 200; // 开始时间
      this.canstop = false; // 可以停止闪动
      this.awardslen = null; // 奖项个数
      this.$wrap = null;
      this.$awards = null;
      this.curawardClass = '';
      this.options = {
        wrap: '',
        awards: '',
        curawardClass: '',
        initCallback: function(){// 初始化回调【选填】
        },
        successCallback: function(){ // 抽奖成功回调【选填】
        }
      };
      this.init(options);
    }
  
    init(options) {// 初始化
      this.options = Object.assign(this.options, options);
      this.$wrap = document.querySelector(this.options.wrap);
      this.$awards = this.$wrap.querySelectorAll(this.options.awards);
      this.curawardClass = this.options.curawardClass ? this.options.curawardClass : 'current';
      this.awardslen = this.$awards.length;
      if(typeof this.options.initCallback == 'function'){
        this.options.initCallback();
      }
    }
  
    startLottery() {// 开始抽奖
      if(this.isrotate){return;}
      this.isrotate = true;
      this.rotate();
    }
  
    flashing(speed) {// 加速闪动
      clearTimeout(this.flashtime);
      this.current++;
      this.acount++;
      if (this.current > this.awardslen - 1) {
        this.current = 0;
      }
      this.$awards.forEach((award) => award.classList.remove(this.curawardClass));
      this.$awards[this.current].classList.add(this.curawardClass);
  
      if(this.acount < this.awardslen + 1){
        this.time = this.time - this._jumptime;
      }
      if(this.canstop){return;}
      this.flashtime = setTimeout(() => {
        this.flashing();
      }, this.time);
    }
  
    slowDown(n) {// 减速闪动
      clearTimeout(this.slowtime);
      this.current++;
      this.acount++;
      if (this.current > this.awardslen - 1) {
        this.current = 0;
      }
      this.$awards.forEach((award) => award.classList.remove(this.curawardClass));
      this.$awards[this.current].classList.add(this.curawardClass);
      this.time = this.time + this._jumptime;
  
      if(this.acount > this.awardslen + 1 && this.$awards[this.current].getAttribute('data-num') == n){
        this.isrotate = false;
        this.canstop = false;
        this.acount = 0;
        this.$wrap.dispatchEvent(new Event('rotateEnd'));
        if(typeof this.options.successCallback == 'function'){
        this.options.successCallback(this.$awards[this.current].getAttribute('data-num'));
        }
        return;
        }
        this.slowtime = setTimeout(() => {
        this.slowDown(n);
        }, this.time);
        }
        
        rotate() {// 转动
        this.flashing();
        setTimeout(() => {
        this.canstop = true;
        }, 3000);
        this.$wrap.addEventListener('rotateEnd', () => {
        clearTimeout(this.flashtime);
        clearTimeout(this.slowtime);
        });
        }
        }
        
        // 示例用法
        const lottery = new Lottery({
        wrap: '#Jlotterywrap', //抽奖主区域DOM【必填】
        awards: '.lottery-award', //奖项DOM【必填】
        initCallback: function(){ //初始化回调【选填】
        console.log('init...');
        },
        successCallback: function(data){ //抽奖成功回调【选填】
        alert(`恭喜您获得了${data}号奖品`);
        }
        });
        
        document.querySelector('#Jstart').addEventListener('click', () => {
        lottery.startLottery();
        });