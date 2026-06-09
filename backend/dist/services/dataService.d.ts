/**
 * 创建碳数据记录
 */
export declare const createCarbonData: (data: any) => Promise<any>;
/**
 * 获取企业的碳数据
 */
export declare const getCarbonDataByEnterprise: (enterpriseId: string, limit?: number) => Promise<any[]>;
/**
 * 更新碳数据状态
 */
export declare const updateCarbonDataStatus: (dataId: string, status: string, encryptedValue?: string) => Promise<any>;
/**
 * 获取数据质量统计
 */
export declare const getDataQualityStats: (dataSourceId: string) => Promise<any>;
//# sourceMappingURL=dataService.d.ts.map