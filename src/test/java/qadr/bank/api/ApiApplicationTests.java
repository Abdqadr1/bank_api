package qadr.bank.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class ApiApplicationTests {
	Calculator calculator = new Calculator();
	@Test
	@DisplayName("Testing addition of two numbers")
	void contextLoads() {
		//give
		int a = 32; int b = 13;
		// when
		int sum = calculator.addition(a, b);
		//then
		int expected = 45;
		assertThat(sum).isEqualTo(expected);
	}

	class Calculator{
		int addition(int a, int b){
			return a + b;
		}
	}

}
