package com.ycity;

import com.ycity.api.DocumentCreator;
import com.ycity.api.PageMapper;
import com.ycity.api.PageParser;
import com.ycity.api.Parser;
import com.ycity.api.impl.FileDocumentCreator;
import com.ycity.api.impl.JagoParser;
import com.ycity.api.message.impl.jago.JagoMessagePageMapper;
import com.ycity.api.message.impl.jago.JagoFileJagoMessagePageMapper;
import com.ycity.api.message.impl.myjmh.MyJmhFileMessagePageMapper;
import com.ycity.api.message.impl.myjmh.MyJmhMessagePageParser;
import com.ycity.api.message.impl.myjmh.MyJmhShowMessageArgs;
import com.ycity.api.model.Message;

import java.util.Map;

public class Runner {

    private static String host = "jmh/";

    public static void main(String[] args) {
        DocumentCreator documentCreator = new FileDocumentCreator();
        PageMapper<MyJmhShowMessageArgs> pageMapper = new MyJmhFileMessagePageMapper(host,documentCreator);
        PageParser<Message> pageParser = new MyJmhMessagePageParser(documentCreator,pageMapper);
        System.out.println(pageParser.parsePage(host,1l).getEntities());
        System.out.println(pageParser.parsePage(host,1l).getException());

    }
}
