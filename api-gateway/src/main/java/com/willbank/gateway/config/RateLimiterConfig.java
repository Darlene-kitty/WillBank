package com.willbank.gateway.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import reactor.core.publisher.Mono;

/**
 * Configuration du Rate Limiter - Actif uniquement si Redis est disponible
 */
@Configuration
public class RateLimiterConfig {
    
    @Bean
    @ConditionalOnBean(ReactiveRedisTemplate.class)
    public KeyResolver userKeyResolver() {
        return exchange -> {
            // Use IP address as key for rate limiting
            String hostAddress = exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                : "unknown";
            return Mono.just(hostAddress);
        };
    }
}
