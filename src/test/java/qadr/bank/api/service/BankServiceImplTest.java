package qadr.bank.api.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import qadr.bank.api.errors.CustomException;
import qadr.bank.api.model.Bank;
import qadr.bank.api.repo.BankRepo;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BankServiceImplTest {
    @Mock private BankRepo bankRepo;
    private BankServiceImpl bankService;

    @BeforeEach
    void setUp() {
        bankService = new BankServiceImpl(bankRepo);
    }

    @Test @DisplayName("Is add bank works well")
    void addBank() {
        //given
        Bank bank = new Bank(null,"United Bank of Africa", "UBA",
                "Commercial", "3759845984");
        //when
        bankService.addBank(bank);

        //then
        ArgumentCaptor<Bank> bankArgumentCaptor = ArgumentCaptor.forClass(Bank.class);
        verify(bankRepo).save(bankArgumentCaptor.capture());
        Bank capturedBank = bankArgumentCaptor.getValue();
        verify(bankRepo).findBySortCode(capturedBank.getSortCode());
        assertThat(capturedBank).isEqualTo(bank);

        given(bankRepo.findBySortCode(bank.getSortCode())).willReturn(Optional.of(bank));

        assertThatThrownBy(()-> bankService.addBank(bank))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("already exists");

        verify(bankRepo, times(1)).save(any());

    }

    @Test
    void getBankById() {
        //given
        int id = 2;
         Bank bank = new Bank(id,"United Bank of Africa", "UBA",
                        "Commercial", "3759845984");
        given(bankRepo.findById(id)).willReturn(Optional.of(bank));

         //when
        bankService.getBank(id);
         //then
        verify(bankRepo).findById(anyInt());

//         given(bankRepo.findById(id)).willReturn(Optional.of(bank));
         given(bankRepo.findById(1)).willReturn(Optional.empty());

        //then
        assertThatThrownBy(()->bankService.getBank(1))
                .hasMessageContaining("not found").isInstanceOf(CustomException.class);

    }

    @Test
    void testGetBankByName() {
        //given
        String name = "UBA";
        Bank bank = new Bank(null,"United Bank of Africa", name,
                "Commercial", "3759845984");
        given(bankRepo.findByShortName(name)).willReturn(Optional.of(bank));
        //when
        bankService.getBank(name);
        //then
        verify(bankRepo).findByShortName(name);

        //Test for errors, given
        given(bankRepo.findByShortName("another")).willReturn(Optional.empty());
        //then
        assertThatThrownBy(()-> bankService.getBank("another"))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Bank not found");

    }

    @Test
    void testGetBanksByType() {
        //given
        String type = "commercial";
        // when
        bankService.getBanks(type);
        //then
        verify(bankRepo).findByType(type);
    }

    @Test
    @DisplayName("test get all banks method")
    void getAll() {
        //when
        bankService.getAll();
        // then
        verify(bankRepo).findAll();
    }

    @Test
    void deleteBank() {
        //given
        int id = 2;

        //when and then
        assertThatThrownBy(() -> bankService.deleteBank(id))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Bank not found");
        //given
        given(bankRepo.findById(id)).willReturn(Optional.of(new Bank()));
        //when
        bankService.deleteBank(id);
        verify(bankRepo, times(2)).findById(id);
        verify(bankRepo).deleteById(id);
    }

    @Test
    void updateBank() {
        //given
        int id = 1;
        Bank bank = new Bank(id,"United Bank of Africa", "UBA",
                "Commercial", "3759845984");
        Bank nBank = new Bank(id,"United Bank of Nigeria", "UBA",
                "Commercial", "3759845984");
        //when and then
        assertThatThrownBy(() -> bankService.updateBank(id, any()))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("Bank not found");

        //given
        given(bankRepo.findById(any())).willReturn(Optional.of(bank));
        bank.setId(2);
        given(bankRepo.findBySortCode(any())).willReturn(Optional.of(bank));
        //when and then
        assertThatThrownBy(() -> bankService.updateBank(id, bank))
                .isInstanceOf(CustomException.class)
                .hasMessageContaining("already exists");


        // given no errors
        given(bankRepo.findById(any())).willReturn(Optional.of(nBank));
        given(bankRepo.findBySortCode(any())).willReturn(Optional.of(nBank));
        Bank newBank = bankService.updateBank(id, nBank);
        assertThat(newBank).isEqualTo(nBank);
    }
}