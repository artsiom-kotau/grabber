package com.ycity.api.message.impl.myjmh;

public class MyJmhShowMessageArgs {
    private String mbox;
    private String action;
    private String id;

    public MyJmhShowMessageArgs(String mbox, String action, String id) {
        this.mbox = mbox;
        this.action = action;
        this.id = id;
    }

    public String getMbox() {
        return mbox;
    }

    public String getAction() {
        return action;
    }

    public String getId() {
        return id;
    }

    @Override public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof MyJmhShowMessageArgs))
            return false;

        MyJmhShowMessageArgs that = (MyJmhShowMessageArgs) o;

        if (mbox != null ? !mbox.equals(that.mbox) : that.mbox != null)
            return false;
        if (action != null ? !action.equals(that.action) : that.action != null)
            return false;
        return !(id != null ? !id.equals(that.id) : that.id != null);

    }

    @Override public int hashCode() {
        int result = mbox != null ? mbox.hashCode() : 0;
        result = 31 * result + (action != null ? action.hashCode() : 0);
        result = 31 * result + (id != null ? id.hashCode() : 0);
        return result;
    }

    @Override public String toString() {
        return "MyJmhShowMessageArgs{" +
            "mbox='" + mbox + '\'' +
            ", action='" + action + '\'' +
            ", id='" + id + '\'' +
            '}';
    }
}
