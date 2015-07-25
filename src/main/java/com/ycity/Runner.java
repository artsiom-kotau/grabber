package com.ycity;

import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidJsFunction;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.impl.FileDocumentCreator;
import com.ycity.api.impl.MessagePageParser;
import com.ycity.api.message.MessagePageMapper;
import com.ycity.api.message.impl.FileMessagePageMapper;
import com.ycity.api.model.Message;

import java.io.IOException;

public class Runner {

    private static String host = "F://java_projects/grabber/jago/";

    public static void main(String[] args) throws IOException, PathException, InvalidShowMessageArgsAmount, DocumentCreatorException, InvalidJsFunction {
        DocumentCreator documentCreator = new FileDocumentCreator();
        MessagePageMapper messagePageMapper = new FileMessagePageMapper(host+"/patientMessage",documentCreator);
        PageParser<Message> messagePageParser = new MessagePageParser(documentCreator,messagePageMapper);
        messagePageParser.parsePage(host,1l);
    }
}
