package com.ycity.api;

public enum Url {
    WELCOME("/dashBoard/patientIndex"),
    PROFILE("/patientProfile/profileEdit"),
    MESSAGES("/patientMessage/messages");


    private String url;

    Url(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }


}
