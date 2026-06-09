package com.greencredit.blockchain.service;

import com.greencredit.blockchain.contract.GreenRatingContract;
import com.greencredit.blockchain.util.PaillierEncryption;
import com.greencredit.blockchain.util.ZeroKnowledgeProof;
import org.fisco.bcos.sdk.client.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BlockchainService {

    @Autowired
    private Client client;

    /** 生成钱包地址 */
    public String generateWalletAddress() {
        // TODO: 调用FISCO BCOS SDK生成账户
        return "0x" + System.currentTimeMillis();
    }

    /** 提交企业绿色评级 */
    public String submitRating(String enterpriseId, int score, String rating) throws Exception {
        // 调用智能合约
        String txHash = GreenRatingContract.submitRating(enterpriseId, score, rating);
        
        // 生成零知识证明
        String zkProof = ZeroKnowledgeProof.generateRatingProof(
            String.format("{\"enterpriseId\":\"%s\",\"score\":%d,\"rating\":\"%s\"}", 
                enterpriseId, score, rating)
        );
        
        // TODO: 保存txHash和zkProof到数据库
        
        return txHash;
    }

    /** 获取链上评级 */
    public Map<String, Object> getRating(String enterpriseId) {
        GreenRatingContract.RatingData ratingData = GreenRatingContract.getRating(enterpriseId);
        
        Map<String, Object> result = new HashMap<>();
        result.put("enterpriseId", ratingData.enterpriseId);
        result.put("score", ratingData.score);
        result.put("rating", ratingData.rating);
        result.put("timestamp", ratingData.timestamp);
        result.put("txHash", ratingData.txHash);
        result.put("zkProof", ratingData.zkProof);
        
        return result;
    }

    /** 生成零知识证明 */
    public String generateZKProof(String data) {
        return ZeroKnowledgeProof.generateRatingProof(data);
    }

    /** 验证零知识证明 */
    public boolean verifyZKProof(String proof, String data) {
        return ZeroKnowledgeProof.verifyProof(proof, data);
    }

    /** 数据加密上链 */
    public Map<String, Object> encryptAndUploadData(
        String enterpriseId, 
        String dataType, 
        String data,
        String recipientPublicKey) throws Exception {
        
        // Paillier加密
        PaillierEncryption paillier = new PaillierEncryption(recipientPublicKey);
        String encryptedData = paillier.encrypt(new java.math.BigInteger(data));
        
        // 计算数据哈希
        String dataHash = calculateHash(encryptedData);
        
        // 存证到链上
        String txHash = GreenRatingContract.commitDataHash(dataHash);
        
        Map<String, Object> result = new HashMap<>();
        result.put("encryptedData", encryptedData);
        result.put("dataHash", dataHash);
        result.put("txHash", txHash);
        result.put("timestamp", System.currentTimeMillis());
        
        return result;
    }

    private String calculateHash(String data) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(data.getBytes());
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate hash", e);
        }
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return "0x" + hexString.toString();
    }
}
