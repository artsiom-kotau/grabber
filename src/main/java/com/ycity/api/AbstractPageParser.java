package com.ycity.api;

public class AbstractPageParser  {

    protected DocumentCreator documentCreator;

    public AbstractPageParser(DocumentCreator documentCreator) {
        this.documentCreator = documentCreator;
    }
}
