package com.ycity.api.appointment.jago;

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
import java.time.DateTimeException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JagoAppointmentPageParser extends AbstractPageParser
    implements PageParser<Appointment> {

    //todo remove html
    private static final String REQUEST_URL =
        "/patientAppointments/getUpdateRequestedAppointments/getUpdateRequestedAppointments.html";
    private static final String UPCOMING_URL =
        "/patientAppointments/getUpdateUpcominAppointment/getUpdateUpcominAppointment.html";
    private static final String PAST_URL =
        "/patientAppointments/getUpdatePastAppointments/getUpdatePastAppointments.html";
    private static final SimpleDateFormat formatterWithTime =
        new SimpleDateFormat("dd-mm-yyyy HH:mm a");
    private static final SimpleDateFormat formatterWithoutTime = new SimpleDateFormat("dd-mm-yyyy");
    private static final Pattern requestDatesPattern =
        Pattern.compile("\\((\\d{2}-\\d{2}-\\d{4})\\)\\s-\\s\\((\\d{2}-\\d{2}-\\d{4})\\)");

    public JagoAppointmentPageParser(DocumentCreator documentCreator) {
        super(documentCreator);
    }

    public PageParseResult<Appointment> parsePage(String host, Serializable memberId) {
        try {
            List<Appointment> appointments = new ArrayList<>();
            appointments.addAll(getAppointments(host + PAST_URL, AppointmentType.PAST, memberId));
            appointments
                .addAll(getAppointments(host + UPCOMING_URL, AppointmentType.UPCOMING, memberId));
            appointments
                .addAll(getAppointments(host + REQUEST_URL, AppointmentType.REQUESTED, memberId));
            return new PageParseResult<>(Appointment.class, appointments);
        } catch (Exception exc) {
            return new PageParseResult<>(Appointment.class, exc);
        }

    }

    private List<Appointment> getAppointments(String path, AppointmentType appointmentType,
        Serializable memberId) throws DocumentCreatorException, ParseException {
        List<Appointment> appointments = new ArrayList<>();
        Document document = documentCreator.create(path);
        Elements tableBody = document.select("tbody");
        for (Element tr : tableBody.select("tr")) {
            Elements td = tr.select("td");
            if (td.size() == 4) {
                Appointment appointment = new Appointment();
                appointment.setMemberId(memberId);
                appointment.setAppointmentType(appointmentType);
                appointment.setDepartment(getDepartment(td.get(0)));
                appointment.setDescription(getDescription(td.get(2)));
                if (appointmentType != AppointmentType.REQUESTED) {
                    appointment.setDate(getAppointmentDate(td.get(3)));
                } else {
                    List<Date> dates = getRequestAppointmentDates(td.get(3));
                    if (dates.size() == 2) {
                        appointment.setStartDate(dates.get(0));
                        appointment.setEndDate(dates.get(1));
                    }
                }
                appointments.add(appointment);
            }
        }
        return appointments;
    }

    private String getDepartment(Element element) {

        return getTextFromNode(element, false);
    }

    private String getDescription(Element element) {
        return getTextFromNode(element, true);
    }

    private Date getAppointmentDate(Element element) throws ParseException {
        String dateValue = getTextFromNode(element, false);
        return formatterWithTime.parse(dateValue);
    }

    private List<Date> getRequestAppointmentDates(Element element) throws ParseException {
        String dateValue = getTextFromNode(element, false);
        Matcher matcher = requestDatesPattern.matcher(dateValue);
        if (matcher.find()) {
            List<Date> dates = new ArrayList<>();
            String startDate = matcher.group(1);
            String endDate = matcher.group(2);
            dates.add(formatterWithoutTime.parse(startDate));
            dates.add(formatterWithoutTime.parse(endDate));
            return dates;
        }
        throw new DateTimeException(dateValue);
    }

    private String getTextFromNode(Element element, boolean twiceDeep) {
        String text = null;
        if (element.childNodes() != null && !element.childNodes().isEmpty()) {
            if (twiceDeep) {
                text = element.childNode(0).childNode(0).toString();
            } else {
                text = element.childNode(0).toString();
            }
        }
        return text;
    }
}
