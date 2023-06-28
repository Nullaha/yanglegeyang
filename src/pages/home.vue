<template>
  home
  <el-button @click="toGamePage(easyGameConfig)">简单模式</el-button>
  <span>{{ globalStore.count }}</span>
  <span>{{ globalStore.double }}</span>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/gameStore'
import { easyGameConfig } from '../utils/gameConfig';


const router = useRouter()
const globalStore = useGlobalStore()

const toGamePage = (config?:IGameConfigType)=>{
  if(config){
    globalStore.setGameConfig(config)
    router.push('/game')
  }
}
</script>
