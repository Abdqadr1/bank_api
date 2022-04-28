package qadr.bank.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import qadr.bank.api.filter.CustomAuthenticationFilter;
import qadr.bank.api.filter.CustomAuthorizationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity @RequiredArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.cors().configurationSource(request -> {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(List.of("*"));
            configuration.setAllowedMethods(List.of("*"));
            configuration.setAllowedHeaders(List.of("*"));
            return configuration;
        });
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.authorizeRequests().antMatchers("/bank/add/**").hasRole("ADMIN");
        http.authorizeRequests().antMatchers("/bank/edit/**").hasRole("ADMIN");
        http.authorizeRequests().antMatchers("/bank/delete/**").hasRole("ADMIN");
        http.authorizeRequests().antMatchers("/manage/**").hasRole("ADMIN");

        http.authorizeRequests().anyRequest().permitAll();
        http.formLogin().disable();

//        http.addFilter(new CustomAuthenticationFilter(authenticationManagerBean()));
        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        UserDetails admin = User.builder()
                .username("admin")
                .password(bCryptPasswordEncoder.encode("discowale"))
                .roles("ADMIN")
                .build();
        auth.inMemoryAuthentication().withUser(admin);
    }

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
