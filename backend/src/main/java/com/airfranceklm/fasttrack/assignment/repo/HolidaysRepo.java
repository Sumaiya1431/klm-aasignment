package com.airfranceklm.fasttrack.assignment.repo;

import com.airfranceklm.fasttrack.assignment.resources.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.UUID;

public interface HolidaysRepo extends JpaRepository<Holiday, Long> {

    void deleteByHolidayId(UUID id);

    List<Holiday> findHolidaysByEmployeeId(String employeeId);

    @Query(value = "SELECT h.employeeId FROM Holiday h where (:startDate between h.startOfHoliday AND h.endOfHoliday) " +
            "OR (:endDate between h.startOfHoliday AND h.endOfHoliday)")
    List<String> getEmployeeIds(Date startDate, Date endDate);

    @Query(value = "select new com.airfranceklm.fasttrack.assignment.resources.Holiday(h.holidayId,h.holidayLabel,h.employeeId,h.startOfHoliday,h.endOfHoliday,h.status,e.name) " +
            "from Holiday h, EmployeeDetail e where e.employeeId = h.employeeId")
    List<Holiday> getHolidays();
}
