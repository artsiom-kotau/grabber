package com.ycity.api.impl;

import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.Parser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.model.BaseEntity;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JagoParser implements Parser {

    private String host;
    private List<PageParser> pageParsers;

    public JagoParser(String host) {
        this.host = host;
    }

    public <T extends BaseEntity> Map<Class<T>, Collection<T>> parse(Serializable memberId)
        throws PathException, InvalidShowMessageArgsAmount, DocumentCreatorException {
        Map<Class<T>, Collection<T>> result = new HashMap<Class<T>, Collection<T>>();
        for (PageParser pageParser : pageParsers) {
            PageParseResult parseResult = pageParser.parsePage(host, memberId);
            result.put(parseResult.getEntityClass(), parseResult.getEntities());
        }

        return result;
    }
}
