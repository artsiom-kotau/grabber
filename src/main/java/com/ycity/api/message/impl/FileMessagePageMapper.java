package com.ycity.api.message.impl;

import com.ycity.api.DocumentCreator;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import com.ycity.api.message.MessagePageMapper;
import com.ycity.api.message.ShowMessageArgs;
import org.jsoup.nodes.Document;

import java.util.HashMap;
import java.util.Map;

public class FileMessagePageMapper implements MessagePageMapper {
    private static Map<ShowMessageArgs, String> pathToMessage;

    static {
        pathToMessage = new HashMap<>();
        //inbox
        pathToMessage.put(new ShowMessageArgs("697", "697", "Your medical records required", "1"),
            "/viewMessage/inbox/1/1.html");
        pathToMessage.put(new ShowMessageArgs("666", "673", "Re:Medical questions", "1"),
            "/viewMessage/inbox/2/2.html");
        pathToMessage.put(new ShowMessageArgs("667", "672", "Re:Smith Appointment date", "1"),
            "/viewMessage/inbox/3/3.html");
        pathToMessage.put(new ShowMessageArgs("668", "671", "Re:Billing questions", "1"),
            "/viewMessage/inbox/4/4.html");
        pathToMessage.put(new ShowMessageArgs("669", "670", "Re:Appointment questions", "1"),
            "/viewMessage/inbox/5/5.html");

        //sent
        pathToMessage.put(new ShowMessageArgs("697", "698", "undefined", "null", "0"),
            "/viewMessage/sent/1/1.html");
        pathToMessage.put(new ShowMessageArgs("669", "669", "undefined", "null", "0"),
            "/viewMessage/sent/2/2.html");
        pathToMessage.put(new ShowMessageArgs("668", "668", "undefined", "null", "0"),
            "/viewMessage/sent/3/3.html");
        pathToMessage.put(new ShowMessageArgs("667", "667", "undefined", "null", "0"),
            "/viewMessage/sent/4/4.html");
        pathToMessage.put(new ShowMessageArgs("666", "666", "undefined", "null", "0"),
            "/viewMessage/sent/5/5.html");
    }

    private DocumentCreator documentCreator;
    private String host;

    public FileMessagePageMapper(String host, DocumentCreator documentCreator) {
        this.host = host;
        this.documentCreator = documentCreator;
    }

    public Document getMessagePage(ShowMessageArgs messageArgs)
        throws DocumentCreatorException, PathException {
        String path = pathToMessage.get(messageArgs);
        if (path != null) {
            return documentCreator.create(host + path);
        } else {
            throw new PathException("Cannot find path for: " + messageArgs.toString());
        }

    }
}
