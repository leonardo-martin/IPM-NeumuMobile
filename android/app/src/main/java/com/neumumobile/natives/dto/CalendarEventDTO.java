package com.neumumobile.natives.dto;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;

import java.util.Objects;

public class CalendarEventDTO {

    public CalendarEventDTO() {
    }

    private String title;
    private String description;
    private String location;
    private Boolean allDay;
    private Long dtStart;
    private Long dtEnd;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getAllDay() {
        return allDay;
    }

    public void setAllDay(Boolean allDay) {
        this.allDay = allDay;
    }

    public Long getDtStart() {
        return dtStart;
    }

    public void setDtStart(Long dtStart) {
        this.dtStart = dtStart;
    }

    public Long getDtEnd() {
        return dtEnd;
    }

    public void setDtEnd(Long dtEnd) {
        this.dtEnd = dtEnd;
    }

    public CalendarEventDTO toDTO(ReadableMap readableMap) {
        this.setDtStart(Long.valueOf(Objects.requireNonNull(readableMap.getString("dtStart"))));
        this.setDtEnd(Long.valueOf(Objects.requireNonNull(readableMap.getString("dtEnd"))));
        this.setTitle(readableMap.getString("title"));
        this.setDescription(readableMap.getString("description"));
        this.setAllDay(readableMap.getBoolean("allDay"));
        this.setLocation(readableMap.getString("location"));
        return this;
    }

    @NonNull
    @Override
    public String toString() {
        return "CalendarDTO{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", allDay=" + allDay +
                ", dtStart=" + dtStart +
                ", dtEnd=" + dtEnd +
                '}';
    }
}
