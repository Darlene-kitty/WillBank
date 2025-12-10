package com.willbank.gateway.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

@Configuration
public class OptionalRedisConfig {

    /**
     * Configuration pour utiliser Redis si disponible
     */
    @Bean
    @ConditionalOnProperty(name = "spring.data.redis.host")
    public KeyResolver redisKeyResolver() {
        return exchange -> {
            String hostAddress = exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                : "unknown";
            return Mono.just(hostAddress);
        };
    }

    /**
     * KeyResolver par défaut si Redis n'est pas disponible
     * Permet à l'application de démarrer sans Redis
     */
    @Bean
    @Primary
    public KeyResolver defaultKeyResolver() {
        return exchange -> Mono.just("default-key");
    }
}
