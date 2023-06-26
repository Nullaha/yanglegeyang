
import {useGlobalStore} from '../stores/gameStore'

import _ from 'lodash'
import { ref } from 'vue'

const useGame = () => {
  const gameStore = useGlobalStore()

  // 游戏状态： 0 - 初始化, 1 - 进行中, 2 - 失败结束, 3 - 胜利
  const gameStatus = ref(0)

  //各层块
  const levelBlocksVal = ref<IBlockType[]>([])
  //随机区块
  const randomBlocksVal= ref<IBlockType[][]>([])
  //插槽区
  const slotAreaVal = ref<IBlockType[]>([])
  //当前槽占用数
  const currSlotNum =ref(0)

  //保存所有块(包括随机块)
  const allBlocks:IBlockType[] = [];
  const blockData:Record<number,IBlockType> ={};

  //总块数
  let totalBlockNum = ref(0)

  //已消除块数
  let clearBlockNum = ref(0)

  // 总共划分 24 x 24 的格子，每个块占 3 x 3 的格子，生成的起始 x 和 y 坐标范围均为 0 ~ 21
  const boxWidthNum = 24;
  const boxHeightNum = 24;

  //每个格子的宽高
  const widthUnit = 14;
  const heightUnit =14;

  // 保存整个 "棋盘" 的每个格子状态（下标为格子起始点横纵坐标）
  let board:IBoardUnitType[][] = []

  //操作历史(存储点击的块)
  let opHistory:IBlockType[] = []

  //技能相关
  const isHolyLight = ref(false)
  const canSeeRandom = ref(false)

  /**
   * 初始化指定大小的棋盘
   */
  const initGameBoard =(width:number,height:number) =>{
    // width行height列的矩阵
    board = new Array(width).fill(0).map(()=>new Array(height).fill( {blocks:[]} ))
  }

  initGameBoard(boxWidthNum,boxHeightNum)
  /**
   * 游戏初始化
   */
  const initGame = ()=>{
    console.log('initGame',gameStore);
    
    const levelBoardDom:any = document.querySelector('.level-board')
    levelBoardDom[0].style.cssText +=`
      width: ${widthUnit * boxWidthNum}px;
      height: ${heightUnit * boxHeightNum}px;
    `

  }

  /**
   * 开始游戏
   */
  const doStart = () =>{

  }
  /**
   * 洗牌
   */
  const doShuffle = ()=>{

  }


  return {

  }
}
export default useGame