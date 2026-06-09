/**
 * 调用Java区块链交互服务
 */
export declare const callBlockchainService: (method: string, params: any) => Promise<any>;
/**
 * 提交评级请求到智能合约
 */
export declare const submitRatingToContract: (enterpriseId: string, ratingData: any) => Promise<any>;
/**
 * 获取链上评级结果
 */
export declare const getRatingFromContract: (enterpriseId: string) => Promise<any>;
/**
 * 生成零知识证明
 */
export declare const generateZKProof: (data: any) => Promise<any>;
/**
 * 验证零知识证明
 */
export declare const verifyZKProof: (proof: string, data: any) => Promise<any>;
//# sourceMappingURL=blockchain.d.ts.map