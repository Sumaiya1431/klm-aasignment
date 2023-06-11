package com.airfranceklm.fasttrack.assignment.services;

import com.airfranceklm.fasttrack.assignment.repo.EmployeesRepo;
import com.airfranceklm.fasttrack.assignment.repo.HolidaysRepo;
import com.airfranceklm.fasttrack.assignment.resources.Holiday;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HolidaysService {
    private final HolidaysRepo holidaysRepo;
    private final EmployeesRepo employeesRepo;

    @Autowired
    public HolidaysService(HolidaysRepo holidaysRepo, EmployeesRepo employeesRepo) {
        this.holidaysRepo = holidaysRepo;
        this.employeesRepo = employeesRepo;
    }

    public List<Holiday> findAllHolidays(){
        return holidaysRepo.getHolidays();
    }

    public List<Holiday> findHolidaysForEmployee(String employeeId){
        return holidaysRepo.findHolidaysByEmployeeId(employeeId);
    }

    public Holiday addHoliday(Holiday holiday){
        Holiday newHoliday = holidaysRepo.save(holiday);
        newHoliday.setEmployeeName(employeesRepo.getEmployeeName(newHoliday.getEmployeeId()));
        return newHoliday;
    }

    public void deleteHoliday(UUID id){
        holidaysRepo.deleteByHolidayId(id);
    }

    public List<Holiday> updateHoliday(Holiday holiday){
        holidaysRepo.save(holiday);
        return findAllHolidays();
    }

    public List<String> getEmployeeIds (Holiday holiday) {
        return holidaysRepo.getEmployeeIds(holiday.getStartOfHoliday(),holiday.getEndOfHoliday());
    }

    public List<String> getEmployeeIds () {
        return employeesRepo.getEmployeeIds();
    }
}
