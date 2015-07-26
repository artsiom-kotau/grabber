package com.ycity.api;

import java.util.ArrayList;
import java.util.Collection;

public class PageParseResult<T> {
    private Class<T> entityClass;
    private Collection<T> entities;
    private Throwable exception;

    public PageParseResult(Class<T> entityClass, Collection<T> entities) {
        this.entityClass = entityClass;
        this.entities = entities;
    }

    public PageParseResult(Class<T> entityClass, Throwable exception) {
        this.entityClass = entityClass;
        this.exception = exception;
    }

    public Class<T> getEntityClass() {
        return entityClass;
    }

    public Collection<T> getEntities() {
        if (entities == null) {
            entities = new ArrayList<>(0);
        }
        return entities;
    }

    public boolean hasError() {
        return exception != null;
    }
}
