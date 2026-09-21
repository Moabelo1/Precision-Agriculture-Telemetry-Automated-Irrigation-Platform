package com.agritech.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AgriTechPlatformApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgriTechPlatformApiGatewayApplication.class, args);
	}

}
