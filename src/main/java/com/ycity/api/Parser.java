package com.ycity.api;

import com.ycity.api.exception.DocumentCreatorException;
import com.ycity.api.exception.InvalidJsFunction;
import com.ycity.api.exception.InvalidShowMessageArgsAmount;
import com.ycity.api.exception.PathException;
import com.ycity.api.model.BaseEntity;

import java.io.Serializable;
import java.util.Collection;
import java.util.Map;

public interface Parser {

    <T extends BaseEntity> Map<Class<T>,Collection<T>> parse(Serializable memberId) throws PathException, InvalidShowMessageArgsAmount, DocumentCreatorException, InvalidJsFunction;
}
