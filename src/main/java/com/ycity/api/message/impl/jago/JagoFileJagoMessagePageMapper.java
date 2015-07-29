package com.ycity.api.message.impl.jago;

import com.ycity.api.DocumentCreator;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import com.ycity.api.message.AbstractMessagePageMapper;
import org.jsoup.nodes.Document;

import java.util.HashMap;
import java.util.Map;

public class JagoFileJagoMessagePageMapper extends AbstractMessagePageMapper<JagoShowMessageArgs>
    implements JagoMessagePageMapper {
    private final static Map<JagoShowMessageArgs, String> pathToMessage = new HashMap<>();

    static {
        //inbox
        pathToMessage
            .put(new JagoShowMessageArgs("697", "697", "Your medical records required", "1"),
                "/viewMessage/inbox/1/1.html");
        pathToMessage.put(new JagoShowMessageArgs("666", "673", "Re:Medical questions", "1"),
            "/viewMessage/inbox/2/2.html");
        pathToMessage.put(new JagoShowMessageArgs("667", "672", "Re:Smith Appointment date", "1"),
            "/viewMessage/inbox/3/3.html");
        pathToMessage.put(new JagoShowMessageArgs("668", "671", "Re:Billing questions", "1"),
            "/viewMessage/inbox/4/4.html");
        pathToMessage.put(new JagoShowMessageArgs("669", "670", "Re:Appointment questions", "1"),
            "/viewMessage/inbox/5/5.html");

        //sent
        pathToMessage.put(new JagoShowMessageArgs("697", "698", "undefined", "null", "0"),
            "/viewMessage/sent/1/1.html");
        pathToMessage.put(new JagoShowMessageArgs("669", "669", "undefined", "null", "0"),
            "/viewMessage/sent/2/2.html");
        pathToMessage.put(new JagoShowMessageArgs("668", "668", "undefined", "null", "0"),
            "/viewMessage/sent/3/3.html");
        pathToMessage.put(new JagoShowMessageArgs("667", "667", "undefined", "null", "0"),
            "/viewMessage/sent/4/4.html");
        pathToMessage.put(new JagoShowMessageArgs("666", "666", "undefined", "null", "0"),
            "/viewMessage/sent/5/5.html");
    }


    public JagoFileJagoMessagePageMapper(String host, DocumentCreator documentCreator) {
        super(host,documentCreator);
    }

    @Override protected String getPath(JagoShowMessageArgs messageArgs) {
        return pathToMessage.get(messageArgs);
    }
}
