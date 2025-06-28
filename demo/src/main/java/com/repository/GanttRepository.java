package com.repository;

import java.util.List;

import com.dto.GanttChartDto;
import com.entity.Gantt;
import com.entity.Project;
import com.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GanttRepository  extends JpaRepository<Gantt, Long>{

   
}
