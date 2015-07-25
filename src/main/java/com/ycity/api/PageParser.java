package com.ycity.api;

import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidJsFunction;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.model.BaseEntity;

import java.io.Serializable;

public interface PageParser<T extends BaseEntity> {

    PageParseResult<T> parsePage(String host, Serializable memberId) throws DocumentCreatorException, InvalidJsFunction, InvalidShowMessageArgsAmount, PathException;
}
