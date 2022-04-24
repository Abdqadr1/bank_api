package qadr.bank.api.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import qadr.bank.api.model.Bank;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankRepo extends JpaRepository<Bank, Integer> {
    List<Bank> findByType(String type);
    Optional<Bank> findByShortName(String name);
    Optional<Bank> findBySortCode(String code);
}
