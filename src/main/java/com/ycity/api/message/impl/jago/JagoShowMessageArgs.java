package com.ycity.api.message.impl.jago;

public class JagoShowMessageArgs {
    private String id;
    private String messageId;
    private String refrence;
    private String value;
    private String enable;

    public JagoShowMessageArgs(String messageId, String id, String value, String enable) {
        this.messageId = messageId;
        this.id = id;
        this.refrence = messageId;
        this.value = value;
        this.enable = enable;
    }

    public JagoShowMessageArgs(String messageId, String id, String refrence, String value,
        String enable) {
        this.messageId = messageId;
        this.id = id;
        this.refrence = refrence;
        this.value = value;
        this.enable = enable;
    }

    public String getId() {
        return id;
    }

    public String getMessageId() {
        return messageId;
    }

    public String getRefrence() {
        return refrence;
    }

    public String getValue() {
        return value;
    }

    public String getEnable() {
        return enable;
    }

    @Override public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof JagoShowMessageArgs))
            return false;

        JagoShowMessageArgs that = (JagoShowMessageArgs) o;

        if (id != null ? !id.equals(that.id) : that.id != null)
            return false;
        if (messageId != null ? !messageId.equals(that.messageId) : that.messageId != null)
            return false;
        if (refrence != null ? !refrence.equals(that.refrence) : that.refrence != null)
            return false;
        if (value != null ? !value.equals(that.value) : that.value != null)
            return false;
        return !(enable != null ? !enable.equals(that.enable) : that.enable != null);

    }

    @Override public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (messageId != null ? messageId.hashCode() : 0);
        result = 31 * result + (refrence != null ? refrence.hashCode() : 0);
        result = 31 * result + (value != null ? value.hashCode() : 0);
        result = 31 * result + (enable != null ? enable.hashCode() : 0);
        return result;
    }

    @Override public String toString() {
        return "JagoShowMessageArgs{" +
            "id='" + id + '\'' +
            ", messageId='" + messageId + '\'' +
            ", refrence='" + refrence + '\'' +
            ", value='" + value + '\'' +
            ", enable='" + enable + '\'' +
            '}';
    }
}
