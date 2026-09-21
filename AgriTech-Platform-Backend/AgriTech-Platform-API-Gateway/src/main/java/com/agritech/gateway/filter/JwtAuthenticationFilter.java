package com.agritech.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final SecretKey secretKey;

    // Endpoints that do not require JWT authentication
    private static final List<String> OPEN_API_ENDPOINTS = List.of(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/validate",
            "/actuator"
    );

    public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Allow open endpoints and pre-flight CORS OPTIONS requests
        if (request.getMethod().name().equalsIgnoreCase("OPTIONS") || isOpenEndpoint(path)) {
            return chain.filter(exchange);
        }

        // Check for Authorization header
        if (request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION) == null) {
            // For learning/convenient demo, allow unauthenticated read-only queries if requested,
            // but for mutating commands (like toggling valves or auto-irrigating), require valid token
            if (isMutatingOperation(path, request.getMethod().name())) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            if (claims.getExpiration().before(new Date())) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // Propagate user context to downstream microservices via request headers
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Email", claims.getSubject())
                    .header("X-User-Role", (String) claims.get("role"))
                    .header("X-User-Id", String.valueOf(claims.get("userId")))
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    private boolean isOpenEndpoint(String path) {
        return OPEN_API_ENDPOINTS.stream().anyMatch(path::startsWith);
    }

    private boolean isMutatingOperation(String path, String method) {
        // Enforce strict JWT auth for valve toggling and auto-irrigation executions
        return (path.contains("/irrigation/valves/") && "POST".equalsIgnoreCase(method)) ||
               (path.contains("/irrigation/auto-evaluate-and-irrigate") && "POST".equalsIgnoreCase(method));
    }

    @Override
    public int getOrder() {
        return -1; // Highest precedence
    }
}
