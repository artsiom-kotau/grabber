package com.ycity.api;

public class AbstractPageParser {

    protected DocumentCreator documentCreator;
    protected PageMapper pageMapper;

    public AbstractPageParser(DocumentCreator documentCreator) {
        this.documentCreator = documentCreator;
    }

    public AbstractPageParser(DocumentCreator documentCreator, PageMapper pageMapper) {
        this.documentCreator = documentCreator;
        this.pageMapper = pageMapper;
    }
}
