package com.ycity.api.impl;

import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.Parser;
import com.ycity.api.appointment.impl.AppointmentPageParser;
import com.ycity.api.demographics.DemographicsPageParser;
import com.ycity.api.message.impl.jago.JagoMessagePageMapper;
import com.ycity.api.message.impl.jago.JagoMessagePageParser;
import com.ycity.api.model.BaseEntity;

import java.io.Serializable;
import java.util.*;

public class JagoParser implements Parser {

    private String host;
    private List<PageParser> pageParsers;

    public JagoParser(String host, DocumentCreator documentCreator,
        JagoMessagePageMapper jagoMessagePageMapper) {
        this.host = host;
        this.pageParsers = new ArrayList<>(3);
        this.pageParsers.add(new JagoMessagePageParser(documentCreator, jagoMessagePageMapper));
        this.pageParsers.add(new AppointmentPageParser(documentCreator));
        this.pageParsers.add(new DemographicsPageParser(documentCreator));
    }

    public <T extends BaseEntity> Map<Class<T>, Collection<T>> parse(Serializable memberId) {
        Map<Class<T>, Collection<T>> result = new HashMap<>();
        for (PageParser pageParser : pageParsers) {
            PageParseResult parseResult = pageParser.parsePage(host, memberId);
            if (parseResult.hasError()) {
                //todo log system
                System.out.println(String
                    .format("Class : %s; Error: %s", parseResult.getEntityClass().getName(),
                        parseResult.getException().getMessage()));
            } else {
                result.put(parseResult.getEntityClass(), parseResult.getEntities());
            }

        }

        return result;
    }
}
