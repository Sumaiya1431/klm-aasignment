package com.airfranceklm.fasttrack.assignment.controller;

import com.airfranceklm.fasttrack.assignment.resources.ErrorResponse;
import com.airfranceklm.fasttrack.assignment.resources.Holiday;
import com.airfranceklm.fasttrack.assignment.services.HolidaysService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@Controller
@RequestMapping()
public class HolidaysApi {
    private final HolidaysService holidaysService;

    public HolidaysApi(HolidaysService holidaysService) {
        this.holidaysService = holidaysService;
    }

    @RequestMapping("/holidays")
    public ResponseEntity<List<Holiday>> getHolidays() {
        List<Holiday> holidays = holidaysService.findAllHolidays();
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    @RequestMapping("/holidays/{employeeId}")
    public ResponseEntity<List<Holiday>> getHolidaysForEmployee(@PathVariable String employeeId) {
        List<Holiday> holidays = holidaysService.findHolidaysForEmployee(employeeId);
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    @RequestMapping("/employees")
    public ResponseEntity<List<String>> getEmployeeIds() {
        List<String> employeeIds = holidaysService.getEmployeeIds();
        return new ResponseEntity<>(employeeIds, HttpStatus.OK);
    }

    @PostMapping("/holiday")
    public ResponseEntity<?> addHoliday(@RequestBody Holiday holiday) {
        ResponseEntity<?> overlapResponse = validateHolidayOverlap(holiday);
        if (overlapResponse != null) {
            return overlapResponse;
        }
        Holiday newHoliday = holidaysService.addHoliday(holiday);
        return new ResponseEntity<>(newHoliday, HttpStatus.CREATED);
    }

    @Transactional
    @DeleteMapping("/holiday/{id}")
    public ResponseEntity<Holiday> deleteHoliday(@PathVariable String id) {
        holidaysService.deleteHoliday(UUID.fromString(id));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/holiday")
    public ResponseEntity<?> updateHoliday(@RequestBody Holiday holiday) {
        ResponseEntity<?> overlapResponse = validateHolidayOverlap(holiday);
        if (overlapResponse != null) {
            return overlapResponse;
        }
        List<Holiday> holidays = holidaysService.updateHoliday(holiday);
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    private ResponseEntity<?> validateHolidayOverlap(Holiday holiday) {
        List<String> employeeIds = holidaysService.getEmployeeIds(holiday);
        if (employeeIds.size() > 0) {
            HttpStatus status = HttpStatus.NOT_FOUND;
            String message = "";
            if (employeeIds.contains(holiday.getEmployeeId())) {
                message = "Overlap of Holidays with your previous holidays";
            } else {
                message = "Overlap of Holidays with other crew members";
            }
            ErrorResponse errorResponse = new ErrorResponse(status, message);
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
        return null;
    }
}
