import { defineStore } from 'pinia' 
import { defaultGameConfig } from '../utils/gameConfig'

/**
 * 全局状态存储
 */
export const useGlobalStore = defineStore('global',{
  state: () => ({ 
    count: 5, 
    customConfig:{...defaultGameConfig},
    gameConfig:{...defaultGameConfig},
  }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    },
    setGameConfig(config:IGameConfigType){
      this.gameConfig = config
    },
    setCustomConfig(config:IGameConfigType){
      this.customConfig = config
    },
    reset(){
      this.$reset()
    }
  },
  //持久化
  persist: {
    enabled: true,
    strategies:[{

      key:"global",
      storage:window.localStorage,
    }]
  }
})
