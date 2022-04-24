package qadr.bank.api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@Entity @Data @NoArgsConstructor
@AllArgsConstructor @Table(name = "banks")
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name")
    private String fullName;
    @Column(name = "short_name")
    private String shortName;

    @Column(name = "category")
    private String type;

    @Column(name = "sort_code", unique = true)
    private String sortCode;

    public Bank(String fullName, String shortName, String type, String sortCode){
        this.fullName = fullName;
        this.shortName = shortName;
        this.type = type;
        this.sortCode = sortCode;
    }

}
