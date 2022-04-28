package qadr.bank.api;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;

public abstract class AbstractContainerBaseTest {

    protected static final MySQLContainer MY_SQL_CONTAINER;

    @DynamicPropertySource
    public static void overrideProps(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", MY_SQL_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", MY_SQL_CONTAINER::getUsername);
        registry.add("spring.datasource.password", MY_SQL_CONTAINER::getPassword);
    }

    static {
        MY_SQL_CONTAINER = new MySQLContainer("mysql:latest");
        MY_SQL_CONTAINER.start();
    }
}

