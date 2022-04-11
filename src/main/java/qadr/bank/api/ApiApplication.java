package qadr.bank.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.trace.http.HttpTraceRepository;
import org.springframework.boot.actuate.trace.http.InMemoryHttpTraceRepository;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import qadr.bank.api.model.Bank;
import qadr.bank.api.service.BankService;

import java.util.ArrayList;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	// this bean turn on the httptrace actuator endpoint that has been turned off by default
	@Bean
	public HttpTraceRepository htttpTraceRepository()
	{
		return new InMemoryHttpTraceRepository();
	}

	@Bean
	CommandLineRunner run(BankService bankService) {
		return args -> {
			bankService.addBank(new Bank(null,"United Bank of Africa", "UBA", "Commercial", "3759845984"));
			bankService.addBank(new Bank(null,"Guaranty Trust Bank", "GTB", "Commercial", "3752635984"));
			bankService.addBank(new Bank(null,"Zenith Bank", "ZENITH", "Commercial", "3701345984"));
			bankService.addBank(new Bank(null,"First Bank", "FIRSTBANK", "Commercial", "1342845984"));
			bankService.addBank(new Bank(null,"Kuda Microfinance Bank", "KUDA", "microfinance", "213445984"));
		};
	}

}
