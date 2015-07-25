package com.ycity.api;

import com.ycity.api.exception.DocumentCreatorException;
import org.jsoup.nodes.Document;

public interface DocumentCreator {
    Document create(String path) throws DocumentCreatorException;
}
