package com.ycity.api.model;

public class Medication extends BaseEntity {
    private Long visitId;
    private String date;
    private String name;
    private String dose;
    private MedicationForm form;
    private String prescribedProvider;
    private String administeredProvider;
    private String knownDescription;
    private String description;
    private String instructions;
    private String code;
    private String quantity;
    private String refillRemaining;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDose() {
        return dose;
    }

    public void setDose(String dose) {
        this.dose = dose;
    }

    public MedicationForm getForm() {
        return form;
    }

    public void setForm(MedicationForm form) {
        this.form = form;
    }

    public String getPrescribedProvider() {
        return prescribedProvider;
    }

    public void setPrescribedProvider(String prescribedProvider) {
        this.prescribedProvider = prescribedProvider;
    }

    public String getAdministeredProvider() {
        return administeredProvider;
    }

    public void setAdministeredProvider(String administeredProvider) {
        this.administeredProvider = administeredProvider;
    }

    public String getKnownDescription() {
        return knownDescription;
    }

    public void setKnownDescription(String knownDescription) {
        this.knownDescription = knownDescription;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getRefillRemaining() {
        return refillRemaining;
    }

    public void setRefillRemaining(String refillRemaining) {
        this.refillRemaining = refillRemaining;
    }

    @Override public String toString() {
        return "Medication{" +
            "visitId=" + visitId +
            ", date='" + date + '\'' +
            ", name='" + name + '\'' +
            ", dose='" + dose + '\'' +
            ", form=" + form +
            ", prescribedProvider='" + prescribedProvider + '\'' +
            ", administeredProvider='" + administeredProvider + '\'' +
            ", knownDescription='" + knownDescription + '\'' +
            ", description='" + description + '\'' +
            ", instructions='" + instructions + '\'' +
            ", code='" + code + '\'' +
            ", quantity='" + quantity + '\'' +
            ", refillRemaining='" + refillRemaining + '\'' +
            '}';
    }
}
