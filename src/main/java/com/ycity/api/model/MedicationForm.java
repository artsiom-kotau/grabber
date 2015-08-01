package com.ycity.api.model;

public enum MedicationForm {
    TABLET(1, "tablet"),
    INJECTION(2, "injection");

    private Integer id;
    private String name;

    MedicationForm(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
