package com.ycity.api;

import java.util.ArrayList;
import java.util.Collection;

public class PageParseResult<T> {
    private Class<T> entityClass;
    private Collection<T> entities;

    public PageParseResult(Class<T> entityClass, Collection<T> entities) {
        this.entityClass = entityClass;
        this.entities = entities;
    }

    public Class<T> getEntityClass() {
        return entityClass;
    }

    public Collection<T> getEntities() {
        if (entities == null) {
            entities = new ArrayList<T>(0);
        }
        return entities;
    }
}
