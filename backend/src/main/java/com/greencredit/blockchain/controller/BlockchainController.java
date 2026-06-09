package com.greencredit.blockchain.controller;

import com.greencredit.blockchain.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/blockchain")
public class BlockchainController {

    @Autowired
    private BlockchainService blockchainService;

    /** 生成钱包地址 */
    @PostMapping("/generateWallet")
    public Map<String, Object> generateWallet() {
        Map<String, Object> result = new HashMap<>();
        try {
            String address = blockchainService.generateWalletAddress();
            result.put("code", 0);
            result.put("message", "Wallet generated successfully");
            result.put("address", address);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /** 提交评级到智能合约 */
    @PostMapping("/submitRating")
    public Map<String, Object> submitRating(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String enterpriseId = (String) params.get("enterpriseId");
            int score = ((Number) params.get("score")).intValue();
            String rating = (String) params.get("rating");

            String txHash = blockchainService.submitRating(enterpriseId, score, rating);
            result.put("code", 0);
            result.put("message", "Rating submitted successfully");
            result.put("txHash", txHash);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /** 获取链上评级 */
    @PostMapping("/getRating")
    public Map<String, Object> getRating(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String enterpriseId = (String) params.get("enterpriseId");
            Map<String, Object> rating = blockchainService.getRating(enterpriseId);

            result.put("code", 0);
            result.put("message", "Rating retrieved successfully");
            result.put("data", rating);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /** 生成零知识证明 */
    @PostMapping("/generateZKProof")
    public Map<String, Object> generateZKProof(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String data = (String) params.get("data");
            String proof = blockchainService.generateZKProof(data);

            result.put("code", 0);
            result.put("message", "ZK proof generated successfully");
            result.put("proof", proof);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /** 验证零知识证明 */
    @PostMapping("/verifyZKProof")
    public Map<String, Object> verifyZKProof(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String proof = (String) params.get("proof");
            String data = (String) params.get("data");

            boolean isValid = blockchainService.verifyZKProof(proof, data);

            result.put("code", 0);
            result.put("message", "ZK proof verified");
            result.put("valid", isValid);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }

    /** 数据加密上链 */
    @PostMapping("/encryptAndUpload")
    public Map<String, Object> encryptAndUpload(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            String enterpriseId = (String) params.get("enterpriseId");
            String dataType = (String) params.get("dataType");
            String data = (String) params.get("data");
            String recipientPublicKey = (String) params.get("recipientPublicKey");

            Map<String, Object> uploadResult = blockchainService.encryptAndUploadData(
                enterpriseId, dataType, data, recipientPublicKey
            );

            result.put("code", 0);
            result.put("message", "Data encrypted and uploaded");
            result.put("data", uploadResult);
        } catch (Exception e) {
            result.put("code", 500);
            result.put("message", e.getMessage());
        }
        return result;
    }
}
