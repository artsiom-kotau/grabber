package com.ycity.api.visit;

import com.ycity.api.AbstractPageParser;
import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.model.Visit;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MyJmhVisitPageParser extends AbstractPageParser implements PageParser<Visit> {
    private static final SimpleDateFormat formatterWithTime =
        new SimpleDateFormat("mm/dd/yyyy hh:mm", Locale.ENGLISH);
    private final String VISIT_URL = "/johnmuirhealth/myjmh-client/tiles/visitsummary.htm";

    public MyJmhVisitPageParser(DocumentCreator documentCreator) {
        super(documentCreator);
    }

    @Override public PageParseResult<Visit> parsePage(String host, Serializable memberId) {
        try {
            List<Visit> visitList = new ArrayList<>();
            visitList.add(getVisitFromReport(host + VISIT_URL, memberId));
            return new PageParseResult<>(Visit.class, visitList);

        } catch (Exception exc) {
            return new PageParseResult<>(Visit.class, exc);
        }
    }

    private Visit getVisitFromReport(String path, Serializable id)
        throws DocumentCreatorException, ParseException {
        Visit visit = null;
        Document document = documentCreator.create(path);
        Elements rz7Elements = document.getElementsByClass("rz_7");
        if (rz7Elements.size() > 0) {
            Elements rz8Elements = rz7Elements.get(0).getElementsByClass("rz_8");
            if (rz8Elements.size() > 0) {
                visit = new Visit();
                visit.setMemberId(id);
                Element rz9Element = getFirstElementByClassIfExist(rz8Elements.first(), "rz_9");
                Element rzeElement = getFirstElementByClassIfExist(rz8Elements.first(), "rz_e");
                if (rz9Element != null) {
                    setInfoFromRz9(rz9Element, visit);
                }
                if (rzeElement != null) {
                    setInfoFromRze(rzeElement, visit);
                }

            }
        }
        return visit;
    }



    private void setInfoFromRz9(Element rz9, Visit visit) throws ParseException {
        StringBuilder description = new StringBuilder("");
        Element nameElement = getFirstElementByClassIfExist(rz9, "rz_b");
        if (nameElement != null) {
            description.append(nameElement.text()).append(";");
        }

        Element dateElement = getFirstElementByClassIfExist(rz9, "rz_d");
        if (dateElement != null) {
            String source = dateElement.text();
            String date = source.replaceAll("[^0-9\\s\\/\\:]+", "").trim();
            visit.setDate(formatterWithTime.parse(date));

            String something = source.replaceAll("[\\d\\/\\:]+", "").trim();
            description.append(something);
        }

        visit.setDescription(description.toString());

    }

    private void setInfoFromRze(Element rze, Visit visit) {
        Element providerElement = getFirstElementByClassIfExist(rze, "rz_h");
        if (providerElement != null) {
            visit.setProviderName(providerElement.text());
        }

        Element departmentElement = getFirstElementByClassAndOrderIfExist(rze, "rz_h", 1);
        if (departmentElement != null) {
            visit.setDepartment(departmentElement.text());
        }
    }

    private Element getFirstElementByClassIfExist(Element element, String cls) {
        return getFirstElementByClassAndOrderIfExist(element, cls, 0);
    }

    private Element getFirstElementByClassAndOrderIfExist(Element element, String cls, int order) {
        Elements elements = element.getElementsByClass(cls);
        return elements.size() >= (order + 1) ? elements.get(order) : null;
    }
}
