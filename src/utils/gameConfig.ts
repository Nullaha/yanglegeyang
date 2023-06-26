const animals = [
  "🐔",
  "🐟",
  "🦆",
  "🐶",
  "🐱",
  "🐴",
  "🐑",
  "🐦",
  "🐧",
  "🐊",
  "🐺",
  "🐒",
  "🐳",
  "🐬",
  "🐢",
  "🦖",
  "🦒",
  "🦁",
  "🐍",
  "🐭",
  "🐂",
];

export const defaultGameConfig:IGameConfigType = {
  // 槽容量
  slotNum: 7,
  // 需要多少个一样块的才能合成
  composeNum: 3,
  // 动物类别数
  typeNum: 12,
  // 每层块数（大致）
  levelBlockNum: 24,
  // 边界收缩步长
  borderStep: 1,
  // 总层数（最小为 2）
  levelNum: 6,
  // 随机区块数（数组长度代表随机区数量，值表示每个随机区生产多少块）
  randomBlocks: [8, 8],
  // 动物数组
  animals,
}

/**
 * 简单难度
 */
export const easyGameConfig: IGameConfigType = {
  // 槽容量
  slotNum: 7,
  // 需要多少个一样块的才能合成
  composeNum: 3,
  // 动物类别数
  typeNum: 8,
  // 每层块数（大致）
  levelBlockNum: 10,
  // 边界收缩步长
  borderStep: 1,
  // 总层数（最小为 2）
  levelNum: 6,
  // 随机区块数（数组长度代表随机区数量，值表示每个随机区生产多少块）
  randomBlocks: [4, 4],
  // 动物数组
  animals,
};