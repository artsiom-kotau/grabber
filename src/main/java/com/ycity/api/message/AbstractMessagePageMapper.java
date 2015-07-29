package com.ycity.api.message;

import com.ycity.api.DocumentCreator;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import org.jsoup.nodes.Document;

public abstract class AbstractMessagePageMapper<T> {
    private DocumentCreator documentCreator;
    private String host;

    protected AbstractMessagePageMapper(String host, DocumentCreator documentCreator) {
        this.documentCreator = documentCreator;
        this.host = host;
    }

    public Document getPageByParams(T messageArgs)
        throws DocumentCreatorException, PathException {
        String path = getPath(messageArgs);
        if (path != null) {
            return documentCreator.create(host + path);
        } else {
            throw new PathException("Cannot find path for: " + messageArgs.toString());
        }
    }

    protected abstract String getPath(T messageArgs);
}
