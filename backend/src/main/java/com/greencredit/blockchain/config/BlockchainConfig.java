package com.greencredit.blockchain.config;

import org.fisco.bcos.sdk.BcosSDK;
import org.fisco.bcos.sdk.client.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BlockchainConfig {

    @Value("${blockchain.config-path}")
    private String configPath;

    @Value("${blockchain.group-id:1}")
    private String groupId;

    @Bean
    public Client getClient() {
        try {
            BcosSDK sdk = BcosSDK.build(configPath);
            return sdk.getClient(groupId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize FISCO BCOS client", e);
        }
    }
}
