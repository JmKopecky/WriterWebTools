package dev.jkopecky.writerwebtools.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.jkopecky.writerwebtools.data.Util;
import dev.jkopecky.writerwebtools.data.tables.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.util.HashMap;

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


    @PostMapping("/work")
    public ResponseEntity<HashMap<String, Object>> work(Model model, @RequestParam(name = "target", required = true) String target, @CookieValue(value = "account", defaultValue = "null") String account, @RequestBody String data) {
        if (!Account.exists(account, accountRepository)) { //todo improve signon
            //return "redirect:/signon?mode=signin";
        }

        HashMap<String, Object> output = new HashMap<>();
        output.put("error", "none");

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(data);
            String mode = node.get("mode").asText();

            Work work = null;
            for (Work w : workRepository.findAll()) {
                if (Util.toInternalResource(w.getTitle()).equals(target)) {
                    work = w;
                }
            }
            if (mode.equals("create")) {
                String chname = node.get("chaptername").asText();
                String chnum = node.get("chapternumber").asText();
                work.createChapter(chname, Integer.parseInt(chnum), chapterRepository);
                return new ResponseEntity<>(output, HttpStatus.OK);
            }
            if (mode.equals("select")) {
                for (Chapter c : Chapter.associatedWith(work, chapterRepository)) {
                    if (c.toResource().equals(node.get("target").asText())) {
                        output.put("content", c.retrieveHTML());
                        output.put("title", c.getTitle());
                        return new ResponseEntity<>(output, HttpStatus.OK);
                    }
                }
                output.put("error", "unrecognized_chapter");
                return new ResponseEntity<>(output, HttpStatus.OK);
            }
            if (mode.equals("save_chapter")) {
                String chapterTitle = node.get("target").asText();
                String content = node.get("content").asText();
                Chapter chapter = null;
                for (Chapter c : Chapter.associatedWith(work, chapterRepository)) {
                    if (c.getTitle().equals(chapterTitle)) {
                        chapter = c;
                    }
                }
                if (chapter != null) {
                    chapter.writeHTML(content);
                    return new ResponseEntity<>(output, HttpStatus.OK);
                }
            }



        } catch (Exception e) {
            System.out.println(e);
            output.put("error", e.getMessage());
            return new ResponseEntity<>(output, HttpStatus.OK);
        }
        return new ResponseEntity<>(output, HttpStatus.OK);
    }
}
