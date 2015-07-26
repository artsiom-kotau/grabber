package com.ycity.api.message;

import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import org.jsoup.nodes.Document;

public interface MessagePageMapper {

    Document getMessagePage(ShowMessageArgs messageArgs)
        throws DocumentCreatorException, PathException;
}
