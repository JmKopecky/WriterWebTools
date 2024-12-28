package dev.jkopecky.writerwebtools.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class SignonController {


    @GetMapping("/signon")
    public String home(Model model, @RequestParam(name = "mode", required = false) String mode) {
        if (mode == null || !mode.equals("signup")) {
            mode = "signin";
        }

        model.addAttribute("mode", mode);
        return "signon";
    }

}
