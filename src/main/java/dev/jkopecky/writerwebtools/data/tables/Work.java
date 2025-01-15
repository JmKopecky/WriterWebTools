package dev.jkopecky.writerwebtools.data.tables;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.jkopecky.writerwebtools.data.Util;
import jakarta.persistence.*;

import java.io.File;
import java.io.IOError;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

@Entity
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String title;
    private String path;
    @ManyToOne
    private Account account;


    public static void createWork(Account owner, String title, WorkRepository workRepository) {
        Work work = new Work();
        work.setTitle(title);
        work.setAccount(owner);
        work.buildPath();
        work.createWorkFile();
        workRepository.save(work);
    }


    public void buildPath() {
        path = System.getProperty("user.home") + "/writerwebtools/" + Util.toInternalResource(account.getUsername()) + "/works/" + Util.toInternalResource(title) + "/";
    }


    public boolean createWorkFile() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String fullPath = path + Util.toInternalResource(title) + ".json";
            Files.createDirectories(Paths.get(path));
            File file = new File(fullPath);
            mapper.writeValue(file, this);
            System.out.println("Created work file: " + file.getAbsolutePath());
            return true;
        } catch (IOException e) {
            System.out.println(e);
            return false;
        }
    }


    public boolean createChapter(String title, int index, ChapterRepository chapterRepository) {
        ArrayList<Chapter> chapters = Chapter.associatedWith(this, chapterRepository);
        if (index > chapters.size()) {
            index = chapters.size() + 1;
        }

        Chapter chapter = new Chapter();
        chapter.setTitle(title);
        chapter.setWork(this);
        chapter.setNumber(index);
        chapter.buildPath();

        try {
            ObjectMapper mapper = new ObjectMapper();
            String fullPath = path + "chapter_" + Util.toInternalResource(chapter.getTitle()) + ".json";
            Files.createDirectories(Paths.get(path));
            File file = new File(fullPath);
            mapper.writeValue(file, chapter);
            fullPath = path + "chapter_" + Util.toInternalResource(chapter.getTitle()) + ".txt";
            Files.createDirectories(Paths.get(path));
            file = new File(fullPath);
            mapper.writeValue(file, "");
        } catch (IOException e) {
            System.out.println(e);
            return false;
        }

        chapterRepository.save(chapter);

        return true;
    }


    public String toResource() {
        return Util.toInternalResource(title);
    }



    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }
    public Account getAccount() {
        return account;
    }
    public void setAccount(Account account) {
        this.account = account;
    }
}
