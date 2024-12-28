package dev.jkopecky.writerwebtools.data.tables;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String username;
    private String password;


    public static Account create(String username, String password, AccountRepository repo) {
        Account account = new Account();
        account.setUsername(username);
        account.setPassword(password);
        repo.save(account);
        return account;
    }


    public static Account authenticate(String username, String password, AccountRepository repo) {
        for (Account account : repo.findAll()) {
            if (account.getUsername().equals(username) && account.getPassword().equals(password)) {
                return account;
            }
        }
        return null;
    }



    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
