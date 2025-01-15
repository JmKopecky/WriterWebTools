package dev.jkopecky.writerwebtools.data.tables;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import dev.jkopecky.writerwebtools.data.Util;

@Entity
public class Chapter implements Comparable<Chapter> {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String title;
    private Integer number;
    @ManyToOne
    private Work work;
    private String path;



    @Override
    public int compareTo(Chapter o) {
        return this.number.compareTo(o.number);
    }


    public static ArrayList<Chapter> associatedWith(Work work, ChapterRepository chapterRepository) {
        ArrayList<Chapter> output = new ArrayList<>();
        for (Chapter c : chapterRepository.findAll()) {
            if (Util.toInternalResource(c.work.getTitle()).equals(Util.toInternalResource(work.getTitle()))) {
                output.add(c);
            }
        }
        Collections.sort(output);
        return output;
    }


    public String retrieveHTML() {
        try {
            String fullPath = path + "chapter_" + Util.toInternalResource(getTitle()) + ".txt";
            File file = new File(fullPath);
            if (file.isFile()) {
                return Files.readString(file.toPath());
            } else {
                //project does not exist, create it.
                return "file does not exist";
            }
        } catch (IOException e) {
            System.out.println(e);
            return "file does not exist";
        }
    }


    public String toResource() {
        return Util.toInternalResource(getTitle());
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
    public Work getWork() {
        return work;
    }
    public void setWork(Work work) {
        this.work = work;
    }
    public String getPath() {
        return path;
    }
    public void setPath(String path) {
        this.path = path;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }


}
