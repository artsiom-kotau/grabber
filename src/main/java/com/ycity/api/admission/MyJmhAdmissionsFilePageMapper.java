package com.ycity.api.admission;

import com.ycity.api.AbstractPageMapper;
import com.ycity.api.DocumentCreator;

import java.util.HashMap;
import java.util.Map;

public class MyJmhAdmissionsFilePageMapper extends AbstractPageMapper<ShowAdmissionArgs>
    implements MyJmhAdmissionPageMapper {

    private static Map<ShowAdmissionArgs, String> pathToMessage = new HashMap<>();

    static {
        pathToMessage
            .put(new ShowAdmissionArgs("1"), "/johnmuirhealth/myjmh-client/tiles/admissions_1.htm");
        pathToMessage
            .put(new ShowAdmissionArgs("2"), "/johnmuirhealth/myjmh-client/tiles/admissions_1.htm");
        pathToMessage
            .put(new ShowAdmissionArgs("3"), "/johnmuirhealth/myjmh-client/tiles/admissions_1.htm");
    }

    public MyJmhAdmissionsFilePageMapper(String host, DocumentCreator documentCreator) {
        super(host, documentCreator);
    }

    @Override protected String getPath(ShowAdmissionArgs messageArgs) {
        return null;
    }
}
