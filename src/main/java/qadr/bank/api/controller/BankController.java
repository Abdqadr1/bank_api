package qadr.bank.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import qadr.bank.api.model.Bank;
import qadr.bank.api.service.BankService;

import java.util.List;

@RestController @RequiredArgsConstructor
@RequestMapping("/api") @CrossOrigin("*")
public class BankController {
    private final BankService bankService;

    @PostMapping("/add")
    public Bank addBank(@RequestBody Bank bank){
        return bankService.addBank(bank);
    }

    @GetMapping
    public List<Bank> getAll(){
        return bankService.getAll();
    }

    @GetMapping("/name/{name}")
    public Bank getBank(@PathVariable("name") String name){
        return bankService.getBank(name);
    }


    @GetMapping("/type/{type}")
    public List<Bank> getBanksByType(@PathVariable("type") String type){
        return bankService.getBanks(type);
    }

    @GetMapping("/delete/{id}")
    public Bank deleteBank(@PathVariable("id") long id){
        return bankService.deleteBank(id);
    }

    @PostMapping("/edit/{id}")
    public Bank editBank (@PathVariable("id") long id, @RequestBody Bank bank){
        return bankService.updateBank(id, bank);
    }

}
