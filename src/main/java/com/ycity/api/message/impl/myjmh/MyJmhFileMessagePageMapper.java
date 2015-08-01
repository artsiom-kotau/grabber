package com.ycity.api.message.impl.myjmh;

import com.ycity.api.AbstractPageMapper;
import com.ycity.api.DocumentCreator;

import java.util.HashMap;
import java.util.Map;

public class MyJmhFileMessagePageMapper extends AbstractPageMapper<MyJmhShowMessageArgs>
    implements MyJmhMessagePageMapper {
    private static Map<MyJmhShowMessageArgs, String> pathToMessage = new HashMap<>();

    static {
        pathToMessage.put(new MyJmhShowMessageArgs("1", "read", "1"),
            "/johnmuirhealth/myjmh-client/tiles/messages_1.htm");
        pathToMessage.put(new MyJmhShowMessageArgs("1", "read", "2"),
            "/johnmuirhealth/myjmh-client/tiles/messages_1.htm");
        pathToMessage.put(new MyJmhShowMessageArgs("1", "read", "3"),
            "/johnmuirhealth/myjmh-client/tiles/messages_1.htm");
        pathToMessage.put(new MyJmhShowMessageArgs("1", "read", "4"),
            "/johnmuirhealth/myjmh-client/tiles/messages_1.htm");
        pathToMessage.put(new MyJmhShowMessageArgs("1", "read", "5"),
            "/johnmuirhealth/myjmh-client/tiles/messages_1.htm");
    }

    public MyJmhFileMessagePageMapper(String host, DocumentCreator documentCreator) {
        super(host, documentCreator);
    }

    @Override protected String getPath(MyJmhShowMessageArgs messageArgs) {
        return pathToMessage.get(messageArgs);
    }
}
