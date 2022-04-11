package qadr.bank.api.actuator;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseService implements HealthIndicator {
    private static final String name = "databaseService";
    @Override
    public Health health() {
        if (getDbHealth()){
            return Health.up().withDetail(name, "DB service is running").build();
        }else{
            return Health.down().withDetail(name, "DB service is down").build();
        }
    }

    public boolean getDbHealth(){
        return true;
    }

}
