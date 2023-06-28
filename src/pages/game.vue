<template>
  <div id="gamePage">
    <div>
      <el-button @click="onBack">返回</el-button>
      <el-button>块数：{{ clearBlockNum + '/' +totalBlockNum  }}</el-button>
    </div>
    <!-- 胜利 -->
    <div v-if="gameStatus==3">
      <h2>你赢了！</h2>
    </div>
    <!-- 分层选块 -->
    <div class="level-board">
      <div v-for="block,idx in levelBlocksVal" :key="idx">
        <div v-if="block.status==0"
          class="block level-block"
          :data-id="block.id"
          :style="{
            zIndex:100+block.level,
            left:block.x*widthUnit+'px',
            top:block.y*heightUnit+'px',
          }"
          @click="doClickBlock(block)"
        >
          {{ block.type }}
        </div>
      </div>
    </div>
    <!-- 随机选块  -->
    <div class="random-board">
      <div v-for="randomBlock,idx in randomBlocksVal" :key="idx" class="random-area">
        <span v-if="randomBlock.length>0" :data-id="randomBlock[0].id" class="block" @click="()=>doClickBlock(randomBlock[0],idx)">
          {{ randomBlock[0].type }}
        </span>
        <span v-for="num in Math.max(randomBlock.length-1,0)" :key="num" class="block disabled">
          <span v-if="canSeeRandom">
            {{ randomBlock[num].type }}
          </span>
        </span>
      </div>
    </div>
    <!-- 槽位 -->
    <div class="slot-board">
      <span  v-for="slotBlock,idx in slotAreaVal" :key="idx" class="block">
        {{ slotBlock?.type }}
      </span>
    </div>
    <!-- 技能 -->
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import {useGlobalStore} from '../stores/gameStore'
import { onMounted } from 'vue'

import useGame from '../hooks/game';

const router = useRouter()
const globalStore = useGlobalStore()

const {
  gameStatus,
  levelBlocksVal,
  randomBlocksVal,
  slotAreaVal,
  widthUnit,heightUnit,
  currSlotNum,
  opHistory,
  totalBlockNum,
  clearBlockNum,
  isHolyLight,canSeeRandom,
  doClickBlock,
  doStart,
  doBroke,
  doRemove,
  doRevert,
  doHolyLight,
  doSeeRandom,
} = useGame()

onMounted(()=>{
  doStart()
})

const onBack = ()=>{
  router.go(-1)
}

</script>
<style scoped>
  #gamePage{
    background-color: aliceblue;
  }
  .level-board{
    position: relative;
    border: 1px solid blueviolet;
  }
  .level-block{
    position: absolute;
  }
  .random-board{
    border: 1px solid red;
    margin-top: 8px;
  }
  .random-area{
    margin-top: 8px;
  }

  .slot-board{
    border:10px solid saddlebrown;
  }
  .skill-board{
    text-align: center;
  }
  .block{
    font-size: 28px;
    width: 42px;
    height: 42px;
    line-height: 42px;
    border: 1px solid #eee;
    background: #fff;
    text-align: center;
    vertical-align: top;
    display: inline-block;
  }
  .disabled{
    background: grey;
    cursor: not-allowed;
  }
</style>
