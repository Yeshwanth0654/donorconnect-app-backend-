package com.app.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class SchemaMigrationConfig {

    @Bean
    public CommandLineRunner ensureDriveSchema(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                jdbcTemplate.execute("ALTER TABLE drive MODIFY COLUMN title VARCHAR(300) NULL");
            } catch (Exception ignored) {
            }

            try {
                jdbcTemplate.execute("ALTER TABLE drive MODIFY COLUMN description TEXT NULL");
            } catch (Exception ignored) {
            }

            try {
                jdbcTemplate.execute("ALTER TABLE drive MODIFY COLUMN location VARCHAR(255) NULL");
            } catch (Exception ignored) {
            }

            try {
                jdbcTemplate.execute("ALTER TABLE drive MODIFY COLUMN status VARCHAR(40) NULL");
            } catch (Exception ignored) {
            }
        };
    }
}
