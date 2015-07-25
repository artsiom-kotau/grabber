package com.ycity.api;

import com.ycity.api.model.Message;

public class ResultObjectFactory {

    public static Result createResultObjectByUrl (Url url ) {
        switch (url) {
            case WELCOME: {
                return null;
            }
            case PROFILE: {
                return null;
            }
            case MESSAGES: {
                return new Result<Message>(Message.class,new Message());
            }
            default: {
                return null;
            }
        }
    }
}
