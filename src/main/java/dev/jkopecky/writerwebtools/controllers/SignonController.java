package dev.jkopecky.writerwebtools.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.jkopecky.writerwebtools.data.tables.Account;
import dev.jkopecky.writerwebtools.data.tables.AccountRepository;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.naming.AuthenticationException;

@Controller
public class SignonController {


    private final ResourcePatternResolver resourcePatternResolver;
    AccountRepository accountRepository;
    public SignonController(AccountRepository accountRepository, ResourcePatternResolver resourcePatternResolver) {
        this.accountRepository = accountRepository;
        this.resourcePatternResolver = resourcePatternResolver;
    }


    @GetMapping("/signon")
    public String signOnGet(Model model, @RequestParam(name = "mode", required = false) String mode) {
        if (mode == null || !mode.equals("signup")) {
            mode = "signin";
        }

        model.addAttribute("mode", mode);
        return "signon";
    }



    @PostMapping("/signon")
    public ResponseEntity<String> signOnPost(Model model, @RequestBody String data) {
        String account = "";

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(data);
            boolean signup = node.get("mode").asText().equals("signup");
            String username = node.get("username").asText();
            String password = node.get("password").asText();
            if (!signup) {
                //authenticate sign on.
                Account a = Account.authenticate(username,password,accountRepository);
                if (a == null) {
                    throw new AuthenticationException("incorrect username or password");
                }
            } else {
                //create account
                Account.create(username, password, accountRepository);
            }

            account = username;
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>("auth_failure", HttpStatus.OK);
        }

        String toAdd = "account=" + account + "; Max-Age=3600;";
        HttpHeaders cookieHeaders = new HttpHeaders();
        cookieHeaders.add("Set-Cookie", toAdd);
        return new ResponseEntity<>("authenticated", cookieHeaders, HttpStatus.OK);
    }

}
