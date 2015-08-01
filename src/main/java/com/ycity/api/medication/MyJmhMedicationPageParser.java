package com.ycity.api.medication;

import com.ycity.api.*;
import com.ycity.api.admission.ShowAdmissionArgs;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import com.ycity.api.model.Medication;
import com.ycity.api.model.MedicationForm;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MyJmhMedicationPageParser extends AbstractPageParser
    implements PageParser<Medication> {
    private static final Pattern admissionOnclickPattern =
        Pattern.compile("gotoInsideAsp\\('inside\\.asp\\?mode=admissions&dat=(\\d*)'\\)");
    private final String MEDICATION_ADMISSION_URL =
        "/johnmuirhealth/myjmh-client/tiles/admissions.htm";
    private final String MEDICATION_URL = "/johnmuirhealth/myjmh-client/tiles/medslist.htm";

    public MyJmhMedicationPageParser(DocumentCreator documentCreator, PageMapper pageMapper) {
        super(documentCreator, pageMapper);
    }

    @Override public PageParseResult<Medication> parsePage(String host, Serializable memberId) {
        try {
            List<Medication> medications = new ArrayList<>();
            medications.addAll(getMedicationsFromTargetPage(host, memberId));
            //medications.addAll(getMedicationsFromAdmissions(host, memberId));
            return new PageParseResult<Medication>(Medication.class, medications);
        } catch (Exception exc) {
            return new PageParseResult<>(Medication.class, exc);
        }
    }

    private List<Medication> getMedicationsFromTargetPage(String host, Serializable memberId)
        throws DocumentCreatorException {
        List<Medication> medications = new ArrayList<>();
        Document medslistDocument = documentCreator.create(host + MEDICATION_URL);
        Element medslistElement = medslistDocument.getElementById("medslist");
        for (Element medRow : medslistElement.getElementsByClass("rx")) {
            Medication medication = new Medication();
            medication.setMemberId(memberId);
            medication.setName(getName(medRow));
            medication.setKnownDescription(getKnownName(medRow));
            medication.setInstructions(getInstruction(medRow));
            medication.setPrescribedProvider(getPrescribed(medRow));
            medication.setDate(getDate(medRow));
            medication.setQuantity(getQuantity(medRow));
            if (medication.getName() != null && medication.getName().toLowerCase()
                .contains(MedicationForm.TABLET.getName())) {
                medication.setForm(MedicationForm.TABLET);
            } else {
                medication.setForm(MedicationForm.INJECTION);
            }
            medications.add(medication);
        }
        return medications;
    }

    private String getName(Element medRow) {
        String name = null;
        Elements h2 = medRow.getElementsByTag("h2");
        if (!h2.isEmpty()) {
            Element nameElement = h2.first();
            name = nameElement.text();
        }
        return name;
    }

    private String getKnownName(Element medRow) {
        String knownName = null;
        Elements knownNameElements = medRow.getElementsByClass("commonname");
        if (!knownNameElements.isEmpty()) {
            String[] knownNameParts = knownNameElements.first().text().split("Commonly known as:");
            if (knownNameParts.length > 1) {
                knownName = knownNameParts[1].trim();
            }
        }
        return knownName;
    }

    private String getInstruction(Element medRow) {
        String instructions = null;
        Elements instructionsElements = medRow.getElementsByClass("rxsig");
        if (!instructionsElements.isEmpty()) {
            String[] instructionsParts =
                instructionsElements.first().text().split("Instructions: ");
            if (instructionsParts.length > 1) {
                instructions = instructionsParts[1].trim();
            }
        }
        return instructions;
    }

    private String getPrescribed(Element medRow) {
        String prescribed = null;
        Elements prescribedElements = medRow.getElementsByTag("p");
        if (prescribedElements.size() > 1) {
            Element prescribedElement = prescribedElements.get(1);
            String[] prescribedParts = prescribedElement.text().split(",");
            if (prescribedParts.length > 0) {
                prescribed = prescribedParts[0].replace("Prescribed by ", "").trim();
            }
        }
        return prescribed;
    }

    private String getDate(Element medRow) {
        String date = null;
        Elements dateElements = medRow.getElementsByTag("p");
        if (dateElements.size() > 1) {
            Element dateElement = dateElements.get(1);
            String[] dateParts = dateElement.text().split(",");
            if (dateParts.length > 1) {
                date = dateParts[1].replace("MD on ", "").trim();
            }
        }
        return date;
    }

    private String getQuantity(Element medRow) {
        String quantity = null;
        Elements pElements = medRow.getElementsByTag("p");
        if (pElements.size() > 2) {
            Element quantityElement = pElements.get(2);
            quantity = quantityElement.text().replace("Quantity: ", "");
        }
        return quantity;
    }

    private List<Medication> getMedicationsFromAdmissions(String host, Serializable memberId)
        throws DocumentCreatorException, PathException {
        List<Medication> medications = new ArrayList<>();
        Document admissionsDocument = documentCreator.create(host + MEDICATION_ADMISSION_URL);
        Element admissionsTable =
            admissionsDocument.getElementById("hoslist18").getElementsByTag("tbody").first();
        if (admissionsTable != null) {
            for (Element row : admissionsTable.getElementsByTag("tr")) {
                ShowAdmissionArgs args = getShowAdmissionArgs(row);
                Document admissionDocument = pageMapper.getPageByParams(args);
                medications.addAll(getStartAndContinueTakingMedications(
                    admissionDocument.getElementsByClass("rz_12")));
                //medications.addAll(getStopTakingMedications(admissionDocument));
            }
        }
        return medications;
    }

    private ShowAdmissionArgs getShowAdmissionArgs(Element row) {
        ShowAdmissionArgs showAdmissionArgs = null;
        String onclick = row.attr("onclick");
        Matcher match = admissionOnclickPattern.matcher(onclick);
        if (match.find()) {
            showAdmissionArgs = new ShowAdmissionArgs(match.group(1));
        }
        return showAdmissionArgs;
    }

    private List<Medication> getStartAndContinueTakingMedications(Elements medicationsList) {
        List<Medication> medications = new ArrayList<>();
        for (Element table : medicationsList) {
            for (Element row : table.getElementsByClass("rz_3")) {
                Elements td = row.getElementsByClass("rz_13");
                Medication medication = new Medication();
                //                medication.setName(getNameFromRz13Td(td.get(0)));
                //                medication
            }
        }
        return medications;
    }
}
