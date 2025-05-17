<!--
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 14:35:56
 * @FilePath: \vue-chrome-ext-demo\src\content\App\App.vue
-->
<template>
  <div class="penk_app">
    <h3>选择点赞区域</h3>
    <div class="input-group">
      <div class="input-row">
        <label>Top:
          <input v-model.number="top" @blur="validateInput" />
        </label>
        <label>Bottom:
          <input v-model.number="bottom" @blur="validateInput" />
        </label>
      </div>
      <div class="input-row">
        <label>Left:
          <input v-model.number="left" @blur="validateInput" />
        </label>
        <label>Right:
          <input v-model.number="right" @blur="validateInput" />
        </label>
      </div>
    </div>
    <div class="action-row">
      <label style="font-size:12px;width:160px" class="input-wrapper">
        执行间隔(ms)
        <input type="text" v-model.number="timebtn">
      </label>
      <button class="btnok" @click="clickBtn">开始自动点赞</button>
    </div>

    <div class="action-row">
      <label style="font-size:12px" class="input-wrapper">
        执行间隔(ms)
        <input type="text" v-model.number="timepl">
      </label>
      <label style="font-size:12px" class="input-wrapper">
        评论内容
        <input type="text" v-model.trim="textStr">
      </label>
      <!-- <button class="btnpl" @click="clickPl">开始自动评论</button> -->
    </div>
     <button class="btnpl" @click="clickPl">开始自动评论</button>
    <div v-if="error" class="error">{{ error }}</div>
    <div
      v-if="isValid"
      class="highlight-box"
      :style="highlightStyle"
    ></div>
    <span style="color:gold;font-size:10px">提示! 修改之后需要重新启动插件或者刷新页面</span>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      top: 200,
      bottom: 600,
      left: 300,
      right: 600,
      error: '',
      textStr:'',
      likeLooping: false,
      commentLooping: false,
      timebtn:200,
      timepl:1000,
      // str:['你好啊,主播', '哇塞,这么漂亮的主播吗','爱了爱了','66666','好厉害','加油主播','你们也喜欢看这个主播吗','加油','真好看'],
      // str:['1','2','3','4'],
      index:0
    };
  },
  computed: {
    isValid() {
      return !this.error && this.bottom > this.top && this.right > this.left;
    },
    highlightStyle() {
      return {
        top: this.top + 'px',
        left: this.left + 'px',
        width: this.right - this.left + 'px',
        height: this.bottom - this.top + 'px',
      };
    },
  },
  mounted() {
    this.init();
    this.startClickLoop();
    this.startCommentLoop();
  },
  methods: {
    // 模拟点击开始按钮
      clickBtn() {
      const btn = document.querySelector('.btnok')
      if( btn.textContent === '开始自动点赞'){
        btn.textContent = '停止自动点赞'
        this.likeLooping = true
      }else{
        btn.textContent = '开始自动点赞'
        this.likeLooping = false
      }
      },
      // 模拟点击评论按钮
      clickPl(){
        const btn = document.querySelector('.btnpl')
        if( btn.textContent === '开始自动评论'){
          btn.textContent = '停止自动评论'
          this.commentLooping = true
        }else{
          btn.textContent = '开始自动评论'
          this.commentLooping = false
        }
      },
      // 校验输入范围
      validateInput() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const vals = [this.top, this.bottom, this.left, this.right];
        if (vals.some(v => isNaN(v))) {
          this.error = '所有输入都必须是数字';
          this.removeSelectionBox();
          return;
        }
        if (this.top < 0 || this.bottom < 0 || this.left < 0 || this.right < 0) {
          this.error = '不能输入负数';
          this.removeSelectionBox();
          return;
        }
        if (this.top >= h || this.bottom >= h || this.left >= w || this.right >= w) {
          this.error = `超出窗口范围：宽度 ${w}px，高度 ${h}px`;
          this.removeSelectionBox();
          return;
        }
        if (this.bottom <= this.top || this.right <= this.left) {
          this.error = 'bottom 必须大于 top，right 必须大于 left';
          this.removeSelectionBox();
          return;
        }
        this.error = '';
        this.drawSelectionBox(); // 画出区域
      },
      // 开始画图
      drawSelectionBox() {
        this.removeSelectionBox(); // 清理旧区域
        const box = document.createElement('div');
        box.id = 'custom-click-region';
        box.style.position = 'fixed';
        box.style.top = this.top + 'px';
        box.style.left = this.left + 'px';
        box.style.width = (this.right - this.left) + 'px';
        box.style.height = (this.bottom - this.top) + 'px';
        box.style.border = '2px dashed red';
        box.style.pointerEvents = 'none';
        box.style.zIndex = '9999';
        document.body.appendChild(box);
      },
      // 清除旧区域
      removeSelectionBox() {
        const old = document.getElementById('custom-click-region');
        if (old) old.remove();
      },
      // 用于点击输入框设定的区域
      simulateClickInCustomRegion() {
        if(!this.likeLooping) {
          return;
        }
        const x = Math.random() * (this.right - this.left) + this.left;
        const y = Math.random() * (this.bottom - this.top) + this.top;
        const el = document.elementFromPoint(x, y);
        if (el) {
          const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
          });
          el.dispatchEvent(evt);
        }
      },
      // 修改点击循环为用“设定区域”点击
      startClickLoop() {
        if(typeof this.timebtn !== 'number' || this.timebtn < 0){
          this.timebtn = 200
        }
        const delay = Math.floor(Math.random() * 5) + this.timebtn;
        setTimeout(() => {
          this.simulateClickInCustomRegion();
          this.startClickLoop();
        }, delay);
      },
      startCommentLoop(){
        if(typeof this.timepl !== 'number' || this.timepl < 0){
          this.timepl = 1000
        }
        const delay = Math.floor(Math.random() * 5) + this.timepl;
        setTimeout(() => {
          this.simulateSlateInput();
          this.startCommentLoop();
        }, delay);
      },
      // 模拟输入评论
      simulateSlateInput() {
        if(!this.commentLooping) {
          return
        }
        const editor = document.querySelector('[contenteditable="true"]');
        const sendBtn = document.querySelector('.webcast-chatroom___send-btn');
        if (editor && sendBtn) {
          const currentText = editor.textContent.replace(/\p{Zs}|\u200B|\u200C|\u200D|\uFEFF/gu, '');
          if (currentText.length > 0) {
            // 发送
            sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
            // this.index ++
            return;
          }
          editor.click();
          editor.focus();
          // const text = this.textStr ? this.textStr : "你好~直播间";
            const text = this.textStr ? this.textStr : "你好~直播间";
            // if(this.index >= this.str.length){
            //   this.index = 0
            // }
          document.execCommand("insertText", false, text);
          setTimeout(() => {
            sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          }, 100);
        }
      },

      init() {
        let body = document.querySelector('body');
        let ponit = document.createElement('div');
        ponit.classList = 'ponit animate';
        body.appendChild(ponit);
        const computedStyle = window.getComputedStyle(ponit);
        const weidth = parseInt(computedStyle.width);
        const height = parseInt(computedStyle.height);
        body.addEventListener('click', (e) => {
          ponit.classList.remove('animate');
          setTimeout(() => {
            ponit.style.left = e.clientX - weidth / 2 + 'px';
            ponit.style.top = e.clientY - height / 2 + 'px';
            ponit.classList.add('animate');
          }, 0);
        });
      },
    }
  }

</script>

<style>
*{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
.penk_app{
  width: 200px;
  height: 330px;
}
.highlight-box {
  position: fixed;
  border: 2px dashed red;
  z-index: 9999;
  pointer-events: none;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.input-row label {
  flex: 1;
  font-size: 14px;
}

.input-row input {
  width: 100%;
  margin-top: 4px;
  padding: 2px 4px;
  box-sizing: border-box;
}
.action-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px; /* 左右间距 */
}

/* 输入框区域固定宽度 */
.input-wrapper {
  display: flex;
  flex-direction: column;
  width: 200px; 
}

.input-wrapper input {
  margin-top: 5px;
  padding: 4px 8px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

/* 按钮固定宽度 */
.action-row button {
  width: 120px;  /* 固定宽度 */
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
}

        body{
            position: relative;
            width: 100%;
            height: 100vh;
            background-color: blanchedalmond;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .player {
            background-color: rgb(255,255,0);
            width: 80%;
            height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;

        }
        .player span{
            font-size: 12vw;
            color: #fff;
            user-select: none;
            text-shadow: 2px 2px 7px rgba(0,0,0,0.3),
            5px 5px 70px rgba(255,255,255,0.3);
            
        }
        .ponit{
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: aliceblue;
            top: 20%;
            opacity: 0;
        }
        .ponit::after {
          content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
            transform: scale(0);
            animation: ripple 1.5s linear infinite;
        }
        .animate{
            animation: displayNone 1.5s linear normal;
        }
        @keyframes displayNone{
            0%{
                opacity: 1;
            }
          
            100%{
                opacity: 0;
            }
        }
        /* 水波纹动画帧 */
        @keyframes ripple {
            0% {
                opacity: 1;
                transform: scale(0);
            }
            100% {
                opacity: 0;
                transform: scale(2);
            }
        }
      </style>