package qadr.bank.api.actuator;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class LoggerService implements HealthIndicator {
    private static final String name = "loggerService";
    @Override
    public Health health() {
        if (getLogger()){
            return Health.up().withDetail(name, "Logger service is up and running").build();
        }else {
            return Health.down().withDetail(name, "Logger service is down and out").build();
        }
    }
    public boolean getLogger(){
        return false;
    }

}
