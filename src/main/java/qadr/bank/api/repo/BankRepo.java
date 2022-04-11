package qadr.bank.api.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import qadr.bank.api.model.Bank;

import java.util.List;
import java.util.Optional;

public interface BankRepo extends JpaRepository<Bank, Long> {
    List<Bank> findByType(String type);
    Optional<Bank> findByShortName(String name);
    Optional<Bank> findBySortCode(String code);
}
