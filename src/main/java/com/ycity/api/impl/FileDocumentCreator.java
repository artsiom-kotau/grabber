package com.ycity.api.impl;

import com.ycity.api.DocumentCreator;
import com.ycity.api.exception.DocumentCreatorException;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.File;

public class FileDocumentCreator implements DocumentCreator {

    public Document create(String path) throws DocumentCreatorException {
        Document document = null;
        File input = new File(path);
        if (input.exists()) {
            try {
                document = Jsoup.parse(input, "UTF-8", "http://example.com/");
            } catch (Exception exc) {
                throw new DocumentCreatorException(exc);
            }

        }
        return document;
    }
}
