package qadr.bank.api.errors;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<CustomErrorResponse> customException(CustomException customException){
        HttpStatus status = customException.getStatus();
        CustomErrorResponse errorResponse = new CustomErrorResponse(
                customException.getMessage(),
                status.toString(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, status);
    }

    @AllArgsConstructor
    public class CustomErrorResponse{
        public String message;
        public String status;
        public LocalDateTime timestamp;
    }
}



