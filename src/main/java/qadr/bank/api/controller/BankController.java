package qadr.bank.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import qadr.bank.api.errors.CustomException;
import qadr.bank.api.model.Bank;
import qadr.bank.api.security.JWTUtil;
import qadr.bank.api.service.BankService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController @RequiredArgsConstructor
@RequestMapping("/bank") @CrossOrigin("*")
public class BankController {
    private final BankService bankService;
    private final AuthenticationManager authenticationManager;
    private final MyUserDetailService userDetailService;

    @PostMapping("/add")
    public Bank addBank(@RequestBody Bank bank){
        return bankService.addBank(bank);
    }

    @GetMapping("/")
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

    @DeleteMapping("/delete/{id}")
    public Bank deleteBank(@PathVariable("id") int id){
        return bankService.deleteBank(id);
    }

    @PutMapping("/edit/{id}")
    public Bank editBank (@PathVariable("id") int id, @RequestBody Bank bank){
        return bankService.updateBank(id, bank);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> login (@RequestParam("username") String username,
                                 @RequestParam("password") String password){

        try{
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            authenticationManager.authenticate(authenticationToken);
        } catch (Exception e) {
            throw new CustomException("Incorrect username or password", HttpStatus.BAD_REQUEST);
        }

        User user = (User) userDetailService.loadUserByUsername(username);
        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", JWTUtil.createAccessToken(user, "/bank/api/login"));
        tokens.put("refresh_token", JWTUtil.createRefreshToken(user));
        return new ResponseEntity<>(tokens, HttpStatus.OK);
    }

}



