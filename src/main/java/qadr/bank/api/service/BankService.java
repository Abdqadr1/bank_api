package qadr.bank.api.service;

import org.springframework.security.core.userdetails.User;
import qadr.bank.api.model.Bank;

import java.util.List;

public interface BankService {
    Bank addBank(Bank bank);
    Bank getBank(int id);
    Bank getBank (String name);
    List<Bank> getBanks(String type);
    List<Bank> getAll();
    Bank deleteBank(int id);
    Bank updateBank(int id, Bank bank);
}
