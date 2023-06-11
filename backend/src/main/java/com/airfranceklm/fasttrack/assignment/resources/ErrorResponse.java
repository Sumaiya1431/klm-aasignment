package com.airfranceklm.fasttrack.assignment.resources;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Getter
@Setter
public class ErrorResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    private Date timestamp;

    private int code;

    private String status;

    private String message;

    private String stackTrace;

    private Object data;

    public ErrorResponse(
            HttpStatus httpStatus,
            String message
    ) {
        this.code = httpStatus.value();
        this.status = httpStatus.name();
        this.message = message;
    }


    public ErrorResponse() {
    }
}
