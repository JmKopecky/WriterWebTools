package dev.jkopecky.writerwebtools.controllers;

import dev.jkopecky.writerwebtools.data.tables.Account;
import dev.jkopecky.writerwebtools.data.tables.AccountRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DashboardController {

    public AccountRepository accountRepository;
    public DashboardController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }


    @GetMapping("/dashboard")
    public String dashboard(Model model, @RequestParam(name = "section", required = false) String section, @CookieValue(value = "account", defaultValue = "null") String account) {

        if (false && !Account.exists(account, accountRepository)) { //todo improve signon
            return "redirect:/signon?mode=signin";
        }

        //add content
        if (section == null) {
            section = "dashboard";
        }
        model.addAttribute("section", section);
        model.addAttribute("accountname", account);

        return "dashboard";
    }
}
