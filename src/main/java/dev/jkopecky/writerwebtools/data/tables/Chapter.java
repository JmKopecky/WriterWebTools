package dev.jkopecky.writerwebtools.data.tables;

import jakarta.persistence.*;

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
