package com.ycity;

import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.appointment.impl.AppointmentPageParser;
import com.ycity.api.demographics.DemographicsPageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.impl.FileDocumentCreator;
import com.ycity.api.message.impl.MessagePageParser;
import com.ycity.api.message.MessagePageMapper;
import com.ycity.api.message.impl.FileMessagePageMapper;
import com.ycity.api.model.Appointment;
import com.ycity.api.model.Demographics;
import com.ycity.api.model.Message;

import java.io.IOException;

public class Runner {

    private static String host = "F://java_projects/grabber/jago/";

    public static void main(String[] args)
        throws IOException, PathException, InvalidShowMessageArgsAmount, DocumentCreatorException {
        DocumentCreator documentCreator = new FileDocumentCreator();
        MessagePageMapper messagePageMapper =
            new FileMessagePageMapper(host + "/patientMessage", documentCreator);
//        PageParser<Message> messagePageParser =
//            new MessagePageParser(documentCreator, messagePageMapper);
//        PageParseResult<Message> messagePageParseResult = messagePageParser.parsePage(host, 1l);
//        PageParser<Appointment> appointmentPageParser =
//            new AppointmentPageParser(documentCreator);
//        PageParseResult<Appointment> appointmentPageParseResult = appointmentPageParser.parsePage(host, 1l);
        PageParser<Demographics> demographicsPageParser =
            new DemographicsPageParser(documentCreator);
        PageParseResult<Demographics> appointmentPageParseResult = demographicsPageParser.parsePage(host, 1l);

    }
}
