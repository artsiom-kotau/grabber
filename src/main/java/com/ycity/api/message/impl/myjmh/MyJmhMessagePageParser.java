package com.ycity.api.message.impl.myjmh;

import com.ycity.api.*;
import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.PathException;
import com.ycity.api.model.Message;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MyJmhMessagePageParser extends AbstractPageParser implements PageParser<Message> {
    private static final Pattern onclickPattern = Pattern.compile(
        "gotoInsideAsp\\('inside\\.asp\\?mode=messages&mbox=(\\d*)&action=([a-zA-Z]*)&id=(\\d*)'\\)");
    //todo replace with myjmh-client/tiles/inside.asp?mode=messages&mbox=1
    private final String MESSAGES_URL = "/johnmuirhealth/myjmh-client/tiles/messages.htm";

    public MyJmhMessagePageParser(DocumentCreator documentCreator, PageMapper pageMapper) {
        super(documentCreator, pageMapper);
    }

    @Override public PageParseResult<Message> parsePage(String host, Serializable memberId) {

        try {
            Document messagesPage = documentCreator.create(host + MESSAGES_URL);
            List<Message> messages = new ArrayList<>();
            for (MessageData messageData : getMessageData(messagesPage)) {
                Document messagePage = messageData.getMessagePage();
                Element messageSection = messagePage.getElementById("section1");
                Message message = new Message();
                message.setMemberId(memberId);
                message.setInbox(true);
                message.setSubject(messageData.getTitle());
                setHeader(messageSection, message);
                setBody(messageSection, message);
                messages.add(message);
            }
            return new PageParseResult<>(Message.class, messages);
        } catch (Exception exc) {
            return new PageParseResult<>(Message.class, exc);
        }
    }

    private void setHeader(Element messageSection, Message message) {
        Element header = messageSection.getElementsByClass("content").first();
        Elements content = header.getElementsByTag("p");
        message.setTo(content.get(0).text());
        message.setFrom(content.get(1).text());
        message.setDate(content.get(2).text());
    }

    private void setBody(Element messageSection, Message message) {
        Element body = messageSection.getElementsByClass("content").get(1);
        Elements content = body.getElementsByClass("srchbl");
        if (!content.isEmpty()) {
            message.setMessage(content.first().text());
        }
    }

    private List<MessageData> getMessageData(Document document)
        throws PathException, DocumentCreatorException {
        List<MessageData> messageDatas = new ArrayList<>();
        Set<MyJmhShowMessageArgs> alreadyAdded = new HashSet<>();
        Element messageTable = document.getElementById("msglist_inbox_2821");
        if (messageTable != null) {
            Element tbody = messageTable.getElementById("msglist_inbox_tbody");
            if (tbody != null) {
                Elements rows = tbody.getElementsByTag("tr");
                for (Element row : rows) {
                    MyJmhShowMessageArgs args = getArgsFromElement(row);
                    if (args != null && !alreadyAdded.contains(args)) {
                        Document messagePage = pageMapper.getPageByParams(args);
                        String title = getMessageTitle(row);
                        messageDatas.add(new MessageData(messagePage, title));
                        alreadyAdded.add(args);
                    }

                }
            }

        }
        return messageDatas;
    }

    private String getMessageTitle(Element row) {
        String title = null;
        Elements tds = row.getElementsByTag("td");
        if (tds.size() > 1) {
            Elements titleLink = tds.get(1).getElementsByTag("a");
            if (!titleLink.isEmpty()) {
                Element link = titleLink.first();
                title = link.text();
            }
        }
        return title;
    }

    private MyJmhShowMessageArgs getArgsFromElement(Element messageElement) {
        MyJmhShowMessageArgs myJmhShowMessageArgs = null;
        String onclick = messageElement.attr("onclick");
        Matcher matcher = onclickPattern.matcher(onclick);
        if (matcher.find()) {
            myJmhShowMessageArgs =
                new MyJmhShowMessageArgs(matcher.group(1), matcher.group(2), matcher.group(3));
        }
        return myJmhShowMessageArgs;

    }

    private static class MessageData {
        private Document messagePage;
        private String title;

        public MessageData(Document messagePage, String title) {
            this.messagePage = messagePage;
            this.title = title;
        }

        public Document getMessagePage() {
            return messagePage;
        }

        public String getTitle() {
            return title;
        }
    }
}
