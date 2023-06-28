<template>

  <el-button @click="toGamePage(testGameConfig)">test模式</el-button>
  <el-button @click="toGamePage(easyGameConfig)">简单模式</el-button>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGlobalStore } from '../stores/gameStore'
import { testGameConfig, easyGameConfig } from '../utils/gameConfig';


const router = useRouter()
const globalStore = useGlobalStore()

const toGamePage = (config?:IGameConfigType)=>{
  if(config){
    globalStore.setGameConfig(config)
    router.push('/game')
  }
}
</script>
