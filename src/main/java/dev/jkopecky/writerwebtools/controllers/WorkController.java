package dev.jkopecky.writerwebtools.controllers;

import dev.jkopecky.writerwebtools.data.Util;
import dev.jkopecky.writerwebtools.data.tables.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WorkController {

    AccountRepository accountRepository;
    WorkRepository workRepository;
    ChapterRepository chapterRepository;
    public WorkController(AccountRepository accountRepository, WorkRepository workRepository, ChapterRepository chapterRepository) {
        this.accountRepository = accountRepository;
        this.workRepository = workRepository;
        this.chapterRepository = chapterRepository;
    }

    @GetMapping("/work")
    public String work(Model model, @RequestParam(name = "target", required = true) String target, @CookieValue(value = "account", defaultValue = "null") String account) {

        if (!Account.exists(account, accountRepository)) { //todo improve signon
            //return "redirect:/signon?mode=signin";
        }

        Work work = null;

        for (Work w : workRepository.findAll()) {
            if (Util.toInternalResource(w.getTitle()).equals(target)) {
                work = w;
            }
        }

        if (work == null) {
            return "redirect:/error";
        }

        model.addAttribute("work", work);
        model.addAttribute("chapters", Chapter.associatedWith(work, chapterRepository));
        return "work";
    }
}
