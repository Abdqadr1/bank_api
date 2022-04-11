package qadr.bank.api.errors;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class CustomException extends RuntimeException{
    private final HttpStatus status;

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }
    public CustomException(String message, HttpStatus status, Throwable throwable){
        super(message, throwable);
        this.status = status;
    }

}
