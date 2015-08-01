package com.ycity.api.impl;

import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.Parser;
import com.ycity.api.appointment.myjmh.MyJmhAppointmentPageParser;
import com.ycity.api.demographics.myjmh.MyJmhDemographicsPageParser;
import com.ycity.api.message.impl.myjmh.MyJmhMessagePageMapper;
import com.ycity.api.message.impl.myjmh.MyJmhMessagePageParser;
import com.ycity.api.model.BaseEntity;
import com.ycity.api.visit.MyJmhVisitPageParser;

import java.io.Serializable;
import java.util.*;

public class MyJmhParser implements Parser {

    private String host;
    private List<PageParser> pageParsers;

    public MyJmhParser(String host, DocumentCreator documentCreator,
        MyJmhMessagePageMapper myjmhMessagePageMapper) {
        this.host = host;
        this.pageParsers = new ArrayList<>(4);
        this.pageParsers.add(new MyJmhMessagePageParser(documentCreator, myjmhMessagePageMapper));
        this.pageParsers.add(new MyJmhAppointmentPageParser(documentCreator));
        this.pageParsers.add(new MyJmhDemographicsPageParser(documentCreator));
        this.pageParsers.add(new MyJmhVisitPageParser(documentCreator));
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
