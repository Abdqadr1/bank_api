package qadr.bank.api.controller;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class MyUserDetailService implements UserDetailsService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public MyUserDetailService(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return User.builder()
                .username("admin")
                .password(bCryptPasswordEncoder.encode("discowale"))
                .roles("ADMIN")
                .build();
    }
}
