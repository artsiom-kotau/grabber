package com.ycity.api;

import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import org.jsoup.nodes.Document;

public abstract class AbstractPageMapper<T> implements PageMapper<T> {
    private DocumentCreator documentCreator;
    private String host;

    protected AbstractPageMapper(String host, DocumentCreator documentCreator) {
        this.documentCreator = documentCreator;
        this.host = host;
    }

    public Document getPageByParams(T messageArgs) throws DocumentCreatorException, PathException {
        String path = getPath(messageArgs);
        if (path != null) {
            return documentCreator.create(host + path);
        } else {
            throw new PathException("Cannot find path for: " + messageArgs.toString());
        }
    }

    protected abstract String getPath(T messageArgs);
}
