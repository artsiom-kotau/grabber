package com.ycity.api.model;

import java.io.Serializable;

public class BaseEntity {

    Serializable memberId;

    public Serializable getMemberId() {
        return memberId;
    }

    public void setMemberId(Serializable memberId) {
        this.memberId = memberId;
    }
}
