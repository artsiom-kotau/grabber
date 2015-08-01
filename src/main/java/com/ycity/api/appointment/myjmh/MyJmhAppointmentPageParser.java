package com.ycity.api.appointment.myjmh;

import com.ycity.api.AbstractPageParser;
import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.model.Appointment;
import com.ycity.api.model.AppointmentType;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.Serializable;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class MyJmhAppointmentPageParser extends AbstractPageParser
    implements PageParser<Appointment> {

    private static final SimpleDateFormat formatterWithTime =
        new SimpleDateFormat("EEEE MMMM dd, yyyy HH:mm a", Locale.ENGLISH);
    private static final SimpleDateFormat formatterWithoutTime =
        new SimpleDateFormat("EEEE MMMM dd, yyyy", Locale.ENGLISH);
    private final String APP_URL = "/johnmuirhealth/myjmh-client/tiles/recentappts.htm";

    public MyJmhAppointmentPageParser(DocumentCreator documentCreator) {
        super(documentCreator);
    }

    @Override public PageParseResult<Appointment> parsePage(String host, Serializable memberId) {
        try {
            List<Appointment> appointments =
                getAppointments(host + APP_URL, AppointmentType.PAST, memberId);
            return new PageParseResult<>(Appointment.class, appointments);
        } catch (Exception exc) {
            return new PageParseResult<>(Appointment.class, exc);
        }
    }

    private List<Appointment> getAppointments(String path, AppointmentType type,
        Serializable memberId) throws DocumentCreatorException, ParseException {
        List<Appointment> appointments = new ArrayList<>();
        Document document = documentCreator.create(path);
        Element appTable = document.getElementById("appttable21");
        if (appTable != null) {
            Element tbody = appTable.getElementsByTag("tbody").first();
            for (Element row : tbody.getElementsByTag("tr")) {
                Appointment appointment = new Appointment();
                appointment.setMemberId(memberId);
                appointment.setAppointmentType(type);
                Elements tds = row.getElementsByTag("td");
                if (tds.size() > 0) {
                    appointment.setDate(getDate(tds.get(0)));
                }
                if (tds.size() > 1) {
                    appointment.setDescription(getDescription(tds.get(1)));
                }

                if (tds.size() > 2) {
                    appointment.setDepartment(getDepartment(tds.get(2)));
                }
                appointments.add(appointment);
            }
        }
        return appointments;
    }

    private Date getDate(Element td) throws ParseException {
        Date date = null;
        Elements aElements = td.getElementsByTag("a");
        if (!aElements.isEmpty()) {
            String stringDate = aElements.first().text();
            if (stringDate != null && !"".equals(stringDate)) {
                try {
                    date = formatterWithTime.parse(stringDate);
                } catch (Exception exc) {
                    try {
                        date = formatterWithoutTime.parse(stringDate);
                    } catch (Exception exc1) {
                        throw exc;
                    }
                }

            }
        }

        return date;
    }

    private String getDescription(Element td) {
        return td.text();

    }

    private String getDepartment(Element td) {
        return td.text();
    }
}
