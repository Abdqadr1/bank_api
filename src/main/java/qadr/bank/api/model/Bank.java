package qadr.bank.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@Entity @Data @NoArgsConstructor
@AllArgsConstructor
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String shortName;
    private String type;

    @Column(unique = true)
    private String sortCode;

    public Bank(String fullName, String shortName, String type, String sortCode){
        this.fullName = fullName;
        this.shortName = shortName;
        this.type = type;
        this.sortCode = sortCode;
    }

}
