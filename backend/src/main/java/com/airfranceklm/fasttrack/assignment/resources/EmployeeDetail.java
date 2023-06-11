package com.airfranceklm.fasttrack.assignment.resources;

import javax.persistence.*;
import java.util.Set;

@Entity
public class EmployeeDetail {

    @Id
    @Column(updatable = false, nullable = false, columnDefinition = "VARCHAR(9)")
    private String employeeId;

    @Column(nullable = false)
    private String name;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "employeeId", referencedColumnName = "employeeId")
    private Set<Holiday> holidayList;

    public Set<Holiday> getHolidayList() {
        return holidayList;
    }
}
