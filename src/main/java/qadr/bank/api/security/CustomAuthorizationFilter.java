package qadr.bank.api.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class CustomAuthorizationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
            if (request.getServletPath().equals("/login")
                    || request.getServletPath().matches("/manage/[A-Za-z0-9-]*")){
                log.error("Server path {} ", request.getServletPath());
                filterChain.doFilter(request,response);
            } else {
                String authHeader = request.getHeader(AUTHORIZATION);
                if (authHeader != null && authHeader.startsWith("Bearer ")){
                    try {
                        String token = authHeader.substring("Bearer ".length());
                        DecodedJWT decodedJWT = JWTUtil.verifyToken(token);
                        String username = decodedJWT.getSubject();
                        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                        String[] roles = decodedJWT.getClaim("roles").asArray(String.class);
                        stream(roles).forEach(role -> authorities.add(new SimpleGrantedAuthority(role)));
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(username, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        filterChain.doFilter(request, response);

                    } catch (Exception exception){
                        Map<String, String> error = new HashMap<>();
                        error.put("error", exception.getMessage());
                        error.put("timestamp", new Date().toString());
                        error.put("status", HttpStatus.BAD_REQUEST.toString());
                        response.setContentType(APPLICATION_JSON_VALUE);
                        response.setStatus(HttpStatus.BAD_REQUEST.value());
                        new ObjectMapper().writeValue(response.getOutputStream(), error);
                    }

                } else {
                    filterChain.doFilter(request, response);
                }
            }
    }
}
