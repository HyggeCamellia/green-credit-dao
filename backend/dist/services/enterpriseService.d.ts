/**
 * 获取企业信息
 */
export declare const getEnterprise: (enterpriseId: string) => Promise<any>;
/**
 * 创建企业
 */
export declare const createEnterprise: (data: any) => Promise<any>;
/**
 * 获取评级申请
 */
export declare const getRatingApplication: (applicationId: string) => Promise<any>;
/**
 * 创建评级申请
 */
export declare const createRatingApplication: (data: any) => Promise<any>;
/**
 * 更新评级申请
 */
export declare const updateRatingApplication: (applicationId: string, data: any) => Promise<any>;
/**
 * 获取授权记录
 */
export declare const getAuthorizationRecords: (enterpriseId: string) => Promise<any[]>;
/**
 * 创建授权记录
 */
export declare const createAuthorization: (data: any) => Promise<any>;
//# sourceMappingURL=enterpriseService.d.ts.map