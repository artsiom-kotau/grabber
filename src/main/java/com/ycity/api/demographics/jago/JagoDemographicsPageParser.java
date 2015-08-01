package com.ycity.api.demographics.jago;

import com.ycity.api.AbstractPageParser;
import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.model.Demographics;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import sun.plugin.dom.exception.InvalidStateException;

import java.io.Serializable;
import java.util.Arrays;

public class JagoDemographicsPageParser extends AbstractPageParser
    implements PageParser<Demographics> {
    //TODO REMOVE HTML
    private static final String DEMOGRAPHICS_URL = "/patientProfile/profileEdit/profileEdit.html";

    public JagoDemographicsPageParser(DocumentCreator documentCreator) {
        super(documentCreator);
    }

    @Override public PageParseResult<Demographics> parsePage(String host, Serializable memberId) {
        try {
            Document document = documentCreator.create(host + DEMOGRAPHICS_URL);
            return new PageParseResult<>(Demographics.class,
                Arrays.asList(getDemographicsFromDocument(document, memberId)));
        } catch (Exception exc) {
            return new PageParseResult<>(Demographics.class, exc);
        }
    }

    private Demographics getDemographicsFromDocument(Document document, Serializable memberId) {
        Elements formElements = document.select("form#patientForm");
        if (!formElements.isEmpty()) {
            Element form = formElements.first();
            Demographics demographics = new Demographics();
            demographics.setMemberId(memberId);
            demographics.setStreet1(getValueFromControl(form, "street", true));
            demographics.setCity(getValueFromControl(form, "city", true));
            demographics.setState(getValueFromControl(form, "state", true));
            demographics.setZip(getValueFromControl(form, "zipcode", true));
            demographics.setCountry(getValueFromControl(form, "county", true));
            demographics.setEmailAddress1(getValueFromControl(form, "email_Id", true));
            demographics.setPrimaryLanguage(getValueFromControl(form, "langList", false));
            demographics.setHomePhone(getValueFromControl(form, "homePhone", true));
            demographics.setWorkPhone(getValueFromControl(form, "workphone", true));
            demographics.setMobilePhone(getValueFromControl(form, "mobilephone", true));
            return demographics;
        } else {
            throw new InvalidStateException("Form with name 'patientForm' have not found");
        }
    }

    private String getValueFromControl(Element formElement, String controlName, boolean input) {
        if (input) {
            return formElement.getElementById(controlName).attr("value");
        } else {
            Elements select =
                formElement.select(String.format("select[id=%s] option[selected]", controlName));
            if (!select.isEmpty()) {
                Element option = select.first();
                return option.text();
            } else {
                return null;
            }
        }
    }

}
