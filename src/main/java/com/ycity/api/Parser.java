package com.ycity.api;

import com.ycity.api.model.BaseEntity;

import java.io.Serializable;
import java.util.Collection;
import java.util.Map;

public interface Parser {

    <T extends BaseEntity> Map<Class<T>, Collection<T>> parse(Serializable memberId);
}
