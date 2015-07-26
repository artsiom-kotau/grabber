package com.ycity;

import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.Parser;
import com.ycity.api.appointment.impl.AppointmentPageParser;
import com.ycity.api.demographics.DemographicsPageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.impl.FileDocumentCreator;
import com.ycity.api.impl.JagoParser;
import com.ycity.api.message.impl.MessagePageParser;
import com.ycity.api.message.MessagePageMapper;
import com.ycity.api.message.impl.FileMessagePageMapper;
import com.ycity.api.model.Appointment;
import com.ycity.api.model.Demographics;
import com.ycity.api.model.Message;

import java.io.IOException;
import java.util.Map;

public class Runner {

    private static String host = "jago/";

    public static void main(String[] args) {
        DocumentCreator documentCreator = new FileDocumentCreator();
        MessagePageMapper messagePageMapper =
            new FileMessagePageMapper(host + "/patientMessage", documentCreator);
        Parser parser = new JagoParser(host,documentCreator,messagePageMapper);
        for(Map.Entry entry : parser.parse(1l).entrySet()) {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
            System.out.println("--------------------------");
        }

    }
}
