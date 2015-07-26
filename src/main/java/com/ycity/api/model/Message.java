package com.ycity.api.model;

public class Message extends BaseEntity {
    private Long visitId;
    private String date;
    private String subject;
    private String to;
    private String from;
    private String message;
    private String attachment;
    private boolean inbox;


    public Long getVisitId() {
        return visitId;
    }

    public void setVisitId(Long visitId) {
        this.visitId = visitId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public boolean isInbox() {
        return inbox;
    }

    public void setInbox(boolean inbox) {
        this.inbox = inbox;
    }

    @Override public String toString() {
        return "Message{" +
            "visitId=" + visitId +
            ", date='" + date + '\'' +
            ", subject='" + subject + '\'' +
            ", to='" + to + '\'' +
            ", from='" + from + '\'' +
            ", message='" + message + '\'' +
            ", attachment='" + attachment + '\'' +
            ", inbox=" + inbox +
            '}';
    }
}
