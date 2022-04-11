package qadr.bank.api.service;

import qadr.bank.api.model.Bank;

import java.util.List;

public interface BankService {
    Bank addBank(Bank bank);
    Bank getBank(long id);
    Bank getBank (String name);
    List<Bank> getBanks(String type);
    List<Bank> getAll();
    Bank deleteBank(long id);
    Bank updateBank(long id, Bank bank);
}
