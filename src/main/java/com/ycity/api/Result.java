package com.ycity.api;

public class Result<T> {
    private Class<T> resultClass;
    private T object;

    public Result(Class<T> resultClass, T object) {
        this.resultClass = resultClass;
        this.object = object;
    }

    public Class<T> getResultClass() {
        return resultClass;
    }

    public T getObject() {
        return object;
    }
}
