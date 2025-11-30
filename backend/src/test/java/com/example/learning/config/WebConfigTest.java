package com.example.learning.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class WebConfigTest {

    @Test
    void testWebConfigLoads() {
        // Test that WebConfig bean loads successfully
        // If this test passes, it means the ApplicationContext loaded
        // and WebConfig was properly configured
    }
}
