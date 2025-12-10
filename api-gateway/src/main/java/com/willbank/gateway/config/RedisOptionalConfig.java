package com.willbank.gateway.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.data.redis.RedisReactiveAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import jakarta.annotation.PostConstruct;

/**
 * Configuration pour gérer Redis de manière gracieuse
 * L'application démarre même si Redis n'est pas disponible
 */
@Configuration
@Import({RedisAutoConfiguration.class, RedisReactiveAutoConfiguration.class})
@Slf4j
public class RedisOptionalConfig {

    @PostConstruct
    public void init() {
        log.info("Redis configuration loaded. Redis is optional - application will start without it.");
        log.info("To enable rate limiting, please start Redis on localhost:6379");
    }
}
