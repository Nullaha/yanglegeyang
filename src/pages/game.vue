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
    <!-- 槽位 -->
    <div>

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
  .level-board{
    position: relative;
  }
  .level-block{
    position: absolute;
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
</style>
