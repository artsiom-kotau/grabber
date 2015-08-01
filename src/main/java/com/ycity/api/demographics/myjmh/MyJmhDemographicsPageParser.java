package com.ycity.api.demographics.myjmh;

import com.ycity.api.AbstractPageParser;
import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.model.Demographics;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class MyJmhDemographicsPageParser extends AbstractPageParser
    implements PageParser<Demographics> {

    private final String DEMOGRAPHICS_URL = "/johnmuirhealth/myjmh-client/tiles/visitsummary.htm";

    public MyJmhDemographicsPageParser(DocumentCreator documentCreator) {
        super(documentCreator);
    }

    @Override public PageParseResult<Demographics> parsePage(String host, Serializable memberId) {
        try {
            List<Demographics> demographicses = new ArrayList<>();
            demographicses.add(getDemographicsFromReport(host + DEMOGRAPHICS_URL, memberId));
            return new PageParseResult<>(Demographics.class, demographicses);
        } catch (Exception exc) {
            return new PageParseResult<>(Demographics.class, exc);
        }
    }

    private Demographics getDemographicsFromReport(String path, Serializable id)
        throws DocumentCreatorException {
        Demographics demographics = null;
        Document document = documentCreator.create(path);
        Elements rz2Elements = document.getElementsByClass("rz_2");
        if (rz2Elements.size() > 3) {
            Elements demographicRz3Element = rz2Elements.get(5).getElementsByClass("rz_3");
            if (!demographicRz3Element.isEmpty()) {
                Element demRow = demographicRz3Element.first();
                Elements tds = demRow.getElementsByTag("td");
                demographics = new Demographics();
                demographics.setMemberId(id);
                demographics.setRace(tds.get(3).text());
                demographics.setEthnicity(tds.get(4).text());
                demographics.setPrimaryLanguage(tds.get(5).text());
                demographics.setSecondaryLanguage(tds.get(6).text());

            }
        }
        return demographics;
    }
}
