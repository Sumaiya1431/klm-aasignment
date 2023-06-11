package com.airfranceklm.fasttrack.assignment.services;

import com.airfranceklm.fasttrack.assignment.repo.EmployeesRepo;
import com.airfranceklm.fasttrack.assignment.repo.HolidaysRepo;
import com.airfranceklm.fasttrack.assignment.resources.Holiday;
import com.airfranceklm.fasttrack.assignment.resources.Status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class HolidaysServiceTest {

    @Mock
    private HolidaysRepo holidaysRepo;

    @Mock
    private EmployeesRepo employeesRepo;

    @InjectMocks
    private HolidaysService holidaysService;

    Holiday holiday = new Holiday(UUID.randomUUID(),  "Summer Vacation", "klm123456", new Date(), new Date(), Status.REQUESTED, "John Doe");
    Holiday holiday1 = new Holiday(UUID.randomUUID(),  "Summer Vacation1", "klm123459", new Date(), new Date(), Status.REQUESTED, "John Doe1");

    List<Holiday> expectedHolidays = new ArrayList<>();
    @BeforeEach
    void setup() {
        expectedHolidays.add(holiday);
        expectedHolidays.add(holiday1);
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAllHolidays() {
        when(holidaysRepo.getHolidays()).thenReturn(expectedHolidays);

        List<Holiday> actualHolidays = holidaysService.findAllHolidays();

        assertEquals(expectedHolidays, actualHolidays);
        verify(holidaysRepo, times(1)).getHolidays();

        assertEquals(actualHolidays.size(), 2);
    }

    @Test
    void testFindHolidaysForEmployee() {
        String employeeId = "klm123456";
        List<Holiday> expectedHolidays = List.of(
                new Holiday(
                        UUID.randomUUID(),
                        "Summer Vacation",
                        employeeId,
                        new Date(),
                        new Date(),
                        Status.REQUESTED,
                        "John Doe"
                )
        );
        when(holidaysRepo.findHolidaysByEmployeeId(employeeId)).thenReturn(expectedHolidays);

        List<Holiday> actualHolidays = holidaysService.findHolidaysForEmployee(employeeId);

        assertEquals(expectedHolidays, actualHolidays);
        verify(holidaysRepo, times(1)).findHolidaysByEmployeeId(employeeId);

        assertEquals(actualHolidays.size(), 1);
    }

    @Test
    void testAddHoliday() {
        Holiday holiday = new Holiday(null,
                "Summer Vacation",
                "klm123456",
                new Date(),
                new Date(),
                Status.REQUESTED,
                null
        );
        Holiday savedHoliday = new Holiday(UUID.randomUUID(),
                "Summer Vacation",
                "klm123456",
                new Date(),
                new Date(),
                Status.REQUESTED,
                null
        );

        when(holidaysRepo.save(holiday)).thenReturn(savedHoliday);
        when(employeesRepo.getEmployeeName("klm123456")).thenReturn("John Doe");

        Holiday addedHoliday = holidaysService.addHoliday(holiday);

        verify(holidaysRepo, times(1)).save(holiday);
        verify(employeesRepo, times(1)).getEmployeeName(savedHoliday.getEmployeeId());
        assertEquals(addedHoliday.getEmployeeName(), "John Doe");
    }

    @Test
    void testDeleteHoliday() {
        UUID holidayId = UUID.randomUUID();

        holidaysService.deleteHoliday(holidayId);

        verify(holidaysRepo, times(1)).deleteByHolidayId(holidayId);
    }

    @Test
    void testUpdateHoliday() {
        UUID uuid = UUID.randomUUID();
        Holiday holiday = new Holiday(uuid,
                "Summer Vacation2",
                "klm123456",
                new Date(),
                new Date(),
                Status.REQUESTED,
                "John Doe"
        );

        expectedHolidays.get(0).setHolidayLabel("Summer Vacation2");
        when(holidaysRepo.getHolidays()).thenReturn(expectedHolidays);
        List<Holiday> updatedHolidays = holidaysService.updateHoliday(holiday);

        verify(holidaysRepo, times(1)).save(holiday);
        verify(holidaysRepo, times(1)).getHolidays();
        assertEquals(updatedHolidays,expectedHolidays);
    }

    @Test
    void testGetEmployeeIdsWithHoliday() {
        List<String> expectedEmployeeIds = List.of("klm123456","klm123457");
        Holiday holiday = new Holiday(UUID.randomUUID(),
                "Summer Vacation2",
                "klm123456",
                new Date(),
                new Date(),
                Status.REQUESTED,
                "John Doe"
        );
        when(holidaysRepo.getEmployeeIds(holiday.getStartOfHoliday(), holiday.getEndOfHoliday())).thenReturn(expectedEmployeeIds);

        List<String> actualEmployeeIds = holidaysService.getEmployeeIds(holiday);

        assertEquals(expectedEmployeeIds, actualEmployeeIds);
        verify(holidaysRepo, times(1)).getEmployeeIds(holiday.getStartOfHoliday(), holiday.getEndOfHoliday());
    }

    @Test
    void testGetEmployeeIds() {
        List<String> expectedEmployeeIds = new ArrayList<>();
        when(employeesRepo.getEmployeeIds()).thenReturn(expectedEmployeeIds);

        List<String> actualEmployeeIds = holidaysService.getEmployeeIds();

        assertEquals(expectedEmployeeIds, actualEmployeeIds);
        verify(employeesRepo, times(1)).getEmployeeIds();
    }
}
