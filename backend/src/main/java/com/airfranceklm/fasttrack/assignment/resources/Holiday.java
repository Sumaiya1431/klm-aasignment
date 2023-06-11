package com.airfranceklm.fasttrack.assignment.resources;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Entity
public class Holiday {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(36)")
    @Type(type = "uuid-char")
    private UUID holidayId;
    @Column(nullable = false)
    private String holidayLabel;
    @Column(nullable = false)
    private String employeeId;
    private Date startOfHoliday;
    private Date endOfHoliday;
    @Column(nullable = false)
    private Status status;
    private String employeeName;

    public Holiday() {
    }

    public Holiday(UUID holidayId, String holidayLabel, String employeeId, Date startOfHoliday, Date endOfHoliday, Status status, String employeeName) {
        this.holidayId = holidayId;
        this.holidayLabel = holidayLabel;
        this.employeeId = employeeId;
        this.startOfHoliday = startOfHoliday;
        this.endOfHoliday = endOfHoliday;
        this.status = status;
        this.employeeName = employeeName;
    }
}
