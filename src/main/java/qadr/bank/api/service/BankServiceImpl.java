package qadr.bank.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import qadr.bank.api.errors.CustomException;
import qadr.bank.api.model.Bank;
import qadr.bank.api.repo.BankRepo;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service @RequiredArgsConstructor @Transactional
public class BankServiceImpl implements BankService{
    private final BankRepo bankRepo;

    @Override
    public Bank addBank(Bank newBank) {
        Optional<Bank> bankOptional = bankRepo.findBySortCode(newBank.getSortCode());
        if (bankOptional.isPresent()) {
            throw new CustomException(String.format("Sort code already exists!"), HttpStatus.BAD_REQUEST);
        }
        return bankRepo.save(newBank);
    }

    @Override
    public Bank getBank(long id) {
        return bankRepo.findById(id).orElseThrow(
                ()-> new CustomException(String.format("Bank not found"), HttpStatus.NOT_FOUND));
    }

    @Override
    public Bank getBank(String name) {
        return bankRepo.findByShortName(name).orElseThrow(
                ()-> new CustomException(String.format("Bank not found"), HttpStatus.NOT_FOUND));
    }

    @Override
    public List<Bank> getBanks(String type) {
        return bankRepo.findByType(type);
    }

    @Override
    public List<Bank> getAll() {
        return bankRepo.findAll();
    }

    @Override
    public Bank deleteBank(long id) {
        Bank bank = bankRepo.findById(id)
                .orElseThrow(
                        ()-> new CustomException(String.format("Bank not found"), HttpStatus.NOT_FOUND)
                );
        bankRepo.deleteById(id);
        return bank;
    }

    @Override
    public Bank updateBank(long id, Bank newBank) {
        Bank bank = bankRepo.findById(id).orElseThrow(
                () -> new CustomException(String.format("Bank not found"), HttpStatus.NOT_FOUND)
        );

        Optional<Bank> bankOptional = bankRepo.findBySortCode(newBank.getSortCode());
        if (bankOptional.isPresent() && id != bankOptional.get().getId()) {
            throw new CustomException(String.format("Sort code already exists!"), HttpStatus.BAD_REQUEST);
        }

        bank.setFullName(newBank.getFullName());
        bank.setShortName(newBank.getShortName());
        bank.setType(newBank.getType());
        bank.setSortCode(newBank.getSortCode());
        return bank;
    }
}
