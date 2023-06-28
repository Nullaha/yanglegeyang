
import {useGlobalStore} from '../stores/gameStore'

import _ from 'lodash'
import { ref } from 'vue'

const useGame = () => {
  const {gameConfig } = useGlobalStore()

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
    console.log('initGame',gameConfig);
    
    const levelBoardDom:any = document.querySelector('.level-board')
    levelBoardDom.style.cssText +=`
      width: ${widthUnit * boxWidthNum}px;
      height: ${heightUnit * boxHeightNum}px;
    `;


    // 块数单位
    const blockNumUnit = gameConfig.composeNum*gameConfig.typeNum
    // 随机生成的总块数
    const totalRandomBlockNum = gameConfig.randomBlocks.reduce((pre:number,nex:number)=>{
      return pre+nex
    },0)
    // 需要的最小块数
    const minBlockNum = gameConfig.levelNum *gameConfig.levelBlockNum +totalRandomBlockNum
    //补齐 blockNumUnit的倍数
    totalBlockNum.value = totalBlockNum.value % blockNumUnit !=0 
                          ?(Math.floor(minBlockNum/blockNumUnit)+1)*blockNumUnit 
                          :minBlockNum;


    
    //
    const animalBlocks:string[] = []
    const needAnimals = gameConfig.animals.slice(0,gameConfig.typeNum)
    for(let i =0;i<totalBlockNum.value;i++){
      animalBlocks.push(needAnimals[i%gameConfig.typeNum])
    }
    const randomAnimalBlocks = _.shuffle(animalBlocks)


    //
    for(let i=0;i<totalBlockNum.value;i++){
      const _newBlock = {
        id:i,
        status:0,
        level:0,
        type:randomAnimalBlocks[i],
        higherThanBlocks:[] as IBlockType[],
        lowerThanBlocks:[] as IBlockType[],
      } as IBlockType;
      allBlocks.push(_newBlock)
    }
    


    //
    let pos =0


    // 3 计算随机生成的块
    const randomBlocks:IBlockType[][] = [];
    gameConfig.randomBlocks.forEach((k:number,idx:number)=>{
      randomBlocks[idx] =[]
      for(let i=0;i<k;i++ ){
        randomBlocks[idx].push(allBlocks[pos])  // todo
        blockData[pos] = allBlocks[pos] //todo
        pos++;
      }
    })


    // 剩余块数
    let leftBlockNum = totalBlockNum.value - totalRandomBlockNum;

    // 4 计算有层级关系的块
    const levelBlocks:IBlockType[] = [];
    let minX = 0,maxX = 22,minY = 0,maxY =22;
    for(let i=0;i<gameConfig.levelNum;i++){
      let nextBlockNum = Math.min(gameConfig.levelBlockNum,leftBlockNum)
      //最后一批，分配所有剩余块数
      if(i==gameConfig.levelNum-1){
        nextBlockNum = leftBlockNum;
      }
      //边界收缩 todo
      if(gameConfig.borderStep>0){
        const dir = i*4
        if(dir==0){
          minX +=gameConfig.borderStep
        } else if(dir==1){
          maxY -= gameConfig.borderStep
        }else if(dir==2){
          minY +=gameConfig.borderStep
        }else {
          maxX -=gameConfig.borderStep
        }
      }
      const nextGenBlocks = allBlocks.slice(pos,pos+nextBlockNum)  //todo
      levelBlocks.push(...nextGenBlocks)
      pos +=nextBlockNum
      //生成块的坐标
      genLevelBlockPos(nextGenBlocks,minX,minY,maxX,maxY)
      leftBlockNum-=nextBlockNum
      if(leftBlockNum<=0)break;

    }
    //4 初始化空插槽
    const slotArea:IBlockType[] = new Array(gameConfig.slotNum).fill(null)

    return {
      levelBlocks,
      randomBlocks,
      slotArea,
    }

  }
  const genLevelBlockPos = (blocks:IBlockType[],minX:number,minY:number,maxX:number,maxY:number)=>{
    //记录这批块的坐标，用于保证同批次元素不能完全重叠
    const currentPosSet = new Set<string>()
    for(let i=0;i<blocks.length;i++){
      const block = blocks[i]
      //随机生成坐标
      let newPosX,newPosY,key;

      while(true){
        newPosX = Math.floor(Math.random()*(maxX-minX+1)+minX) //2-10    [0,1) -> [0,9) ->[2,11)   -> [2,10]
        newPosY = Math.floor(Math.random()*(maxY-minY+1)+minY)
        key = newPosX+','+newPosY
        //同批次元素不能完全重叠
        if(!currentPosSet.has(key)){
          break;
        }
      }

      board[newPosX][newPosY].blocks.push(block)
      currentPosSet.add(key)
      block.x = newPosX
      block.y = newPosY
      //填充层级关系
      genLevelRelation(block)
    }
  }
  /**
   * 给块绑定层级关系（用于确认哪些元素是当前可点击的）
   * 核心逻辑：每个块压住和其坐标有交集棋盘格内所有 level 大于它的点，双向建立联系
   * @param block
   */
  const genLevelRelation = (block:IBlockType)=>{
    // 确定该块附近的格子坐标范围
    const minX = Math.max(block.x - 2, 0);
    const minY = Math.max(block.y - 2, 0);
    const maxX = Math.min(block.x + 3, boxWidthNum - 2);
    const maxY = Math.min(block.y + 3, boxWidthNum - 2);

    //遍历
    let maxLevel = 0
    for(let i=minX;i<maxX;i++){
      for(let j=minY;j<maxY;j++){
        const relationBlocks = board[i][j].blocks;
        if(relationBlocks.length>0){
          //取当前位置最高的块
          const maxLevelRelationBlock = relationBlocks[relationBlocks.length-1]
          if(maxLevelRelationBlock.id ===block.id) {
            continue;
          }
          maxLevel = Math.max(maxLevel,maxLevelRelationBlock.level)
          block.higherThanBlocks.push(maxLevelRelationBlock)
          maxLevelRelationBlock.lowerThanBlocks.push(block)
        }
      }
    }
    //比最高层的块再高一层（初始为1）
    block.level = maxLevel+1



  }
  /**
   * 点击块事件
   * @param block
   * @param randomIdx 随机区域下标，>= 0 表示点击的是随机块
   * @param force 强制移除
   */
  const doClickBlock = (block:IBlockType,randomIdx=-1,force=false)=>{
    // 已经输了 / 已经被点击 / 有上层块（且非强制和圣光），不能再点击
    if(currSlotNum.value>=gameConfig.slotNum ||
        block.status!=0 ||
        (block.lowerThanBlocks.length>0 && !force && !isHolyLight.value)
    ){

      return ;
    }

    isHolyLight.value = false;
    //修改状态
    block.status = 1
    //移除当前元素
    if(randomIdx>-1){
      //移除所点击的随机区域的第一个元素  todo
      randomBlocksVal.value[randomIdx] = randomBlocksVal.value[randomIdx].slice(1)
    }else{
      //非随机区才可撤回
      opHistory.push(block)
      //移除覆盖关系
      block.higherThanBlocks.forEach((highterThanBlock)=>{
        _.remove(highterThanBlock.lowerThanBlocks,(lowerThanBlock)=>{
          return lowerThanBlock.id ===block.id
        })
      })
    }
    //新元素加入插槽
    let tempSlotNum = currSlotNum.value
    slotAreaVal.value[tempSlotNum] = block
    //检查是否有可消除的
    const map:Record<string,number> = {}
    const tempSlotAreaVal = slotAreaVal.value.filter((s)=>!!s)
    tempSlotAreaVal.forEach((slotBlock)=>{
      const type =slotBlock.type
      map[type] = (map[type] || 0) +1;
    })
    //得到新数组
    const newSlotAreaVal = new Array(gameConfig.slotNum).fill(null)
    tempSlotNum = 0
    tempSlotAreaVal.forEach(slotBlock=>{
      //成功消除
      if(map[slotBlock.type]>=gameConfig.composeNum){
        slotBlock.status = 2
        clearBlockNum.value++
        opHistory = []
        return 
      }
      newSlotAreaVal[tempSlotNum++] = slotBlock
    })
    slotAreaVal.value = newSlotAreaVal
    currSlotNum.value = tempSlotNum

    //游戏结束
    if(tempSlotNum>=gameConfig.composeNum){
      gameStatus.value =2
      setTimeout(() => {
        alert('你输了')
      }, 2000);
    }

    if(clearBlockNum.value>=totalBlockNum.value){
      gameStatus.value = 3
    }
  }


  /**
   * 开始游戏
   */
  const doStart = () =>{
    gameStatus.value = 0
    const {levelBlocks,randomBlocks,slotArea} = initGame()
    levelBlocksVal.value = levelBlocks
    randomBlocksVal.value =randomBlocks
    slotAreaVal.value = slotArea
    gameStatus.value =1
  }
  /**
   * 洗牌 - 随机重洗所有未被点击的块
   */
  const doShuffle = ()=>{
    //洗牌
    const undoBlocks = allBlocks.filter(b=>b.status===0)
    const shuffleType = _.shuffle(undoBlocks.map(block=>block.type))
    undoBlocks.forEach( (block,index)=>{
      block.type = shuffleType[index]
    })

    //这是在干啥？ todo 为了触发vue的响应？
    levelBlocksVal.value = [...levelBlocksVal.value]
  }

  /**
   * 破坏
   */
  const doBroke = () =>{

  }
  /**撤回
   * 
   */
  const doRevert = () =>{
    if(opHistory.length<1){
      return;
    }
    opHistory[opHistory.length-1].status = 0
    genLevelRelation(slotAreaVal.value[currSlotNum.value-1])

    slotAreaVal.value.splice(currSlotNum.value-1,1)


  }

  /**
   * 移出块
   */
  const doRemove = () =>{

  }

  /**
   * 圣光
   */
  const doHolyLight = () =>{
    isHolyLight.value = true;
  }

  /**
   * 透视
   */
  const doSeeRandom = () =>{
    canSeeRandom.value = !canSeeRandom.value
  }


  return {
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
  }
}
export default useGame