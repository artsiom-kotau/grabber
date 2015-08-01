package com.ycity.api;

import com.ycity.api.model.BaseEntity;

import java.io.Serializable;

public interface PageParser<T extends BaseEntity> {

    PageParseResult<T> parsePage(String host, Serializable memberId);
}
