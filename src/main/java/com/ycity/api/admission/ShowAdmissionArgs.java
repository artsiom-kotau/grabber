package com.ycity.api.admission;

public class ShowAdmissionArgs {
    private String dat;

    public ShowAdmissionArgs(String dat) {
        this.dat = dat;
    }

    public String getDat() {
        return dat;
    }

    @Override public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ShowAdmissionArgs))
            return false;

        ShowAdmissionArgs that = (ShowAdmissionArgs) o;

        return !(dat != null ? !dat.equals(that.dat) : that.dat != null);

    }

    @Override public int hashCode() {
        return dat != null ? dat.hashCode() : 0;
    }
}
