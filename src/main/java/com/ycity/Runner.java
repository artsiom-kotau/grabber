package com.ycity;

import com.ycity.api.DocumentCreator;
import com.ycity.api.Parser;
import com.ycity.api.impl.FileDocumentCreator;
import com.ycity.api.impl.JagoParser;
import com.ycity.api.impl.MyJmhParser;
import com.ycity.api.message.impl.jago.JagoFileJagoMessagePageMapper;
import com.ycity.api.message.impl.jago.JagoMessagePageMapper;
import com.ycity.api.message.impl.myjmh.MyJmhFileMessagePageMapper;
import com.ycity.api.message.impl.myjmh.MyJmhMessagePageMapper;

import java.util.Map;

public class Runner {

    private static String jmhHost = "jmh/";
    private static String jagoHost = "jago/";

    public static void main(String[] args) {
        {
            DocumentCreator documentCreator = new FileDocumentCreator();
            MyJmhMessagePageMapper messagePageMapper = new MyJmhFileMessagePageMapper(jmhHost + "/patientMessage", documentCreator);
            Parser parser = new MyJmhParser(jmhHost, documentCreator, messagePageMapper);
            for (Map.Entry entry : parser.parse(1l).entrySet()) {
                System.out.println(entry.getKey());
                System.out.println(entry.getValue());
                System.out.println("--------------------------");
            }
        }
        {
            DocumentCreator documentCreator = new FileDocumentCreator();
            JagoMessagePageMapper messagePageMapper =
                new JagoFileJagoMessagePageMapper(jagoHost + "/patientMessage", documentCreator);
            Parser parser = new JagoParser(jagoHost,documentCreator,messagePageMapper);
            for(Map.Entry entry : parser.parse(1l).entrySet()) {
                System.out.println(entry.getKey());
                System.out.println(entry.getValue());
                System.out.println("--------------------------");
            }

        }

    }
}
