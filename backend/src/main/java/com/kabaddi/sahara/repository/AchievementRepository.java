package com.kabaddi.sahara.repository;

import com.kabaddi.sahara.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByYearOrderByAchievementDateDesc(Integer year);
    List<Achievement> findAllByOrderByAchievementDateDescYearDesc();
    List<Achievement> findByTournamentNameContainingIgnoreCaseOrderByAchievementDateDesc(String q);
}
