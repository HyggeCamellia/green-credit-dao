/** 区块链数据生成工具 — 模拟FISCO BCOS链上数据（开发/演示用） */

const toHex = (num: number, pad: number = 64): string =>
  num.toString(16).padStart(pad, '0').slice(0, pad)

const randomHex = (bytes: number = 32): string => {
  const chars = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < bytes * 2; i++) {
    result += chars[Math.floor(Math.random() * 16)]
  }
  return result
}

let _blockCounter = Date.now() - 1700000000000

export const generateBlockNumber = (): number => {
  _blockCounter += Math.floor(Math.random() * 5) + 1
  return _blockCounter
}

export const generateBlockHash = (blockNumber?: number): string => {
  return `0x${toHex(blockNumber || generateBlockNumber(), 64)}`
}

export const generateTxHash = (): string => {
  return `0x${randomHex(32)}`
}

export const generateCertificateHash = (_enterpriseId: string | number, _rating: string): string => {
  return `0x${randomHex(32)}`
}

export interface BlockInfo {
  txHash: string
  blockNumber: number
  blockHash: string
  timestamp: string
}

export const createBlockInfo = (): BlockInfo => {
  const blockNumber = generateBlockNumber()
  return {
    txHash: `0x${randomHex(32)}`,
    blockNumber,
    blockHash: `0x${toHex(blockNumber, 64)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  }
}
