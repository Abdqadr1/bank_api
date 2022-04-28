package qadr.bank.api;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import qadr.bank.api.controller.BankController;
import qadr.bank.api.model.Bank;
import qadr.bank.api.service.BankService;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiApplicationTests extends AbstractContainerBaseTest {
	@LocalServerPort
	private int port;

	@Autowired
	private BankController controller;

	@Autowired
	private TestRestTemplate testRestTemplate;

	List<Bank> banks = List.of(
			new Bank(null,"Guaranty Trust Bank", "GTB", "Commercial", "37535984"),
			new Bank(null,"Zenith Bank", "ZENITH", "Commercial", "3701345984"));


	@Test
	void shouldReturnAllBanks() {
		String url = "http://localhost:"+port+"/bank/";
		List<Bank> banks = testRestTemplate.getForObject(url, List.class);
		System.out.println(banks.toString());
		assertThat(banks).isNotNull();
		assertThat(banks.size()).isEqualTo(5);
	}

	@Test
	void shouldReturnBankWithGivenShortName(){
		//given
		String shortName = banks.get(0).getShortName();
		String url = "http://localhost:"+port+"/bank/name/"+shortName;
		Bank banks = testRestTemplate.getForObject(url, Bank.class);
		System.out.println(banks.toString());
		assertThat(banks).isNotNull();
		assertThat(banks.getShortName()).isEqualTo(shortName);
	}

	@Test
	void shouldReturnBanksWithGivenTypeName() {
		//given
		String type = banks.get(0).getType();
		String url = "http://localhost:"+port+"/bank/type/"+type;
		List<Bank> banks = testRestTemplate.getForObject(url, List.class);
		System.out.println(banks.toString());
		assertThat(banks).isNotNull();
		assertThat(banks.size()).isGreaterThan(2);
	}

	@Test
	void shouldAddBank(){
		//given
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Authorization", "Bearer Auth");
		HttpEntity<Bank> entity = new HttpEntity<>(banks.get(0));
		String url = "http://localhost:"+port+"/bank/add";
		ResponseEntity<Bank> response = testRestTemplate.postForEntity(url, entity, Bank.class);
		System.out.println(response.toString());
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
	}

	@Test
	void testingActuatorsLink(){
		//given
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("Authorization", "Bearer Auth");
		HttpEntity<Bank> entity = new HttpEntity<>(banks.get(0), httpHeaders);
		String url = "http://localhost:"+port+"/manage/";
		ResponseEntity<Object> response = testRestTemplate.postForEntity(url, entity, Object.class);
		System.out.println(response.toString());
		assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}
}
