package com.ycity.api;

import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import org.jsoup.nodes.Document;

public interface PageMapper<T> {
    Document getPageByParams(T mapperArgs)
        throws DocumentCreatorException, PathException;
}
