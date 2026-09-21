package com.agritech.Eureka_Server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class AgriTechEurekaServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AgriTechEurekaServerApplication.class, args);
	}

}
