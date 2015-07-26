package com.ycity.api.impl;

import com.ycity.api.AbstractPageParser;
import com.ycity.api.DocumentCreator;
import com.ycity.api.PageParseResult;
import com.ycity.api.PageParser;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.message.MessagePageMapper;
import com.ycity.api.message.ShowMessageArgs;
import com.ycity.api.model.Message;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.select.Elements;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MessagePageParser extends AbstractPageParser implements PageParser<Message> {

    private static final Pattern ARGS_PATTERN = Pattern.compile("(\\d*),(\\d*),(\\d*),(.*)");
    //todo remove html
    private final String MESSAGES_URL = "/patientMessage/messages/messages.html";
    private MessagePageMapper messagePageMapper;

    public MessagePageParser(DocumentCreator documentCreator, MessagePageMapper messagePageMapper) {
        super(documentCreator);
        this.messagePageMapper = messagePageMapper;
    }

    public PageParseResult<Message> parsePage(String host, Serializable memberId)
        throws DocumentCreatorException, InvalidShowMessageArgsAmount, PathException {
        Document messagesPage = documentCreator.create(host + MESSAGES_URL);
        List<Message> messages = new ArrayList<Message>();
        messages.addAll(
            processMessageDocument(memberId, getMessagesElements(messagesPage, "tab1"), false));
        messages.addAll(
            processMessageDocument(memberId, getMessagesElements(messagesPage, "tab3"), true));

        return new PageParseResult<Message>(Message.class, messages);
    }

    private Elements getMessagesElements(Document document, String tabName) {
        Elements tab = document.select("div#" + tabName);
        return tab.select("td");
    }

    private List<Message> processMessageDocument(Serializable id, Elements messageElements,
        boolean sent) throws InvalidShowMessageArgsAmount, PathException, DocumentCreatorException {
        List<Message> messages = new ArrayList<Message>();
        Set<ShowMessageArgs> processed = new HashSet<ShowMessageArgs>();
        for (Element messageElement : messageElements) {
            ShowMessageArgs messageArgs = getShowMessageArgsFromElement(messageElement, sent);
            if (messageArgs != null && !processed.contains(messageArgs)) {
                Document messageViewDocument = messagePageMapper.getMessagePage(messageArgs);
                Message newMessage = getMessageFromDocument(messageViewDocument);
                if (newMessage != null) {
                    newMessage.setMemberId(id);
                    newMessage.setInbox(!sent);
                    messages.add(newMessage);
                }
                processed.add(messageArgs);
            }
        }
        return messages;
    }

    private ShowMessageArgs getShowMessageArgsFromElement(Element messageElement, boolean isSent)
        throws InvalidShowMessageArgsAmount {
        String onclick = messageElement.attr("onclick");
        String[] showMessage = onclick.split("showMessags");
        if (showMessage.length > 1) {
            String onclickArgs = showMessage[1];
            onclickArgs = onclickArgs.replaceFirst("\\(", "").replace(")", "").replace(";", "");
            Matcher matcher = ARGS_PATTERN.matcher(onclickArgs);
            if (matcher.matches() && matcher.groupCount() == 4) {
                return !isSent ?
                    new ShowMessageArgs(matcher.group(1), matcher.group(2),
                        removeQuotes(matcher.group(4)), matcher.group(3)) :
                    new ShowMessageArgs(matcher.group(1), matcher.group(2), "undefined",
                        removeQuotes(matcher.group(4)), matcher.group(3));
            } else {
                throw new InvalidShowMessageArgsAmount(String
                    .format("Arguments amount of showMessags function is %s",
                        matcher.groupCount() - 1));
            }
        } else {
            return null;
        }
    }

    private String removeQuotes(String quotedString) {
        if (quotedString.charAt(0) == '\'') {
            quotedString = quotedString.substring(1);
        }
        if (quotedString.endsWith("'")) {
            quotedString = quotedString.substring(0, quotedString.lastIndexOf("'"));
        }
        return quotedString;
    }

    private Message getMessageFromDocument(Document document) {
        Message message = null;
        Elements messageBox = document.select("div.widget.span.box");
        if (!messageBox.isEmpty()) {
            Element messagesWidget = messageBox.first();
            Elements headers = null;
            Elements bodies = null;
            for (Element child : messagesWidget.children()) {
                if (headers == null || headers.isEmpty()) {
                    headers = child.getElementsByClass("blue-text");
                } else if (bodies == null || bodies.isEmpty()) {
                    bodies = child.getElementsByTag("p");
                } else {
                    break;
                }
            }
            if ((headers != null && !headers.isEmpty()) || (bodies != null && !bodies.isEmpty())) {
                message = new Message();
                fillMessageHeader(message, headers);
                fillMessageBody(message, bodies);
            }
        }
        return message;
    }

    private void fillMessageHeader(Message message, Elements header) {
        if (header != null && !header.isEmpty()) {
            Element element = header.select("h6").first();
            Node fromNode = element.childNode(0);
            Node toNode = element.childNode(2);
            Node sendNode = element.childNode(4);

            message.setFrom(getFrom(fromNode));
            message.setTo(getTo(toNode));
            message.setDate(getSendDate(sendNode));
        }

    }

    private String getFrom(Node from) {
        return getHeaderPart(from, "From : ");
    }

    private String getTo(Node to) {
        return getHeaderPart(to, "To : ");
    }

    private String getSendDate(Node sendDate) {
        return getHeaderPart(sendDate, "Send : ");
    }

    private String getHeaderPart(Node node, String label) {
        String value = null;
        String header = node.toString();
        String[] headerParts = header.split(label);
        if (headerParts.length > 1) {
            value = headerParts[1];
        }
        return value;
    }

    private void fillMessageBody(Message message, Elements body) {
        if (body != null && !body.isEmpty()) {
            Element element = body.select("p").first();
            Node subject = null;
            Node text = null;
            switch (element.childNodes().size()) {
                case 1:
                case 2: {
                    subject = element.childNode(0);
                    break;
                }
                case 3: {
                    subject = element.childNode(0);
                    text = element.childNode(2);
                    break;
                }
                case 4: {
                    subject = element.childNode(0);
                    text = element.childNode(3);
                    break;
                }
            }
            message.setSubject(subject != null ? subject.toString() : null);
            message.setMessage(text != null ? text.toString() : null);
        }
    }
}
