package com.airfranceklm.fasttrack.assignment.repo;

import com.airfranceklm.fasttrack.assignment.resources.EmployeeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeesRepo extends JpaRepository<EmployeeDetail, Long> {

    @Query(value = "select e.name from EmployeeDetail e where e.employeeId = :employeeId")
    String getEmployeeName(String employeeId);

    @Query(value = "select employeeId from EmployeeDetail")
    List<String> getEmployeeIds();
}
