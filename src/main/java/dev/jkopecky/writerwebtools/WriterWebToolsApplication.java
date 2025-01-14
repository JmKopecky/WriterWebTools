package dev.jkopecky.writerwebtools;

import dev.jkopecky.writerwebtools.data.tables.ChapterRepository;
import dev.jkopecky.writerwebtools.data.tables.WorkRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WriterWebToolsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WriterWebToolsApplication.class, args);
    }

}
