package com.kabaddi.sahara.controller;

import com.kabaddi.sahara.model.Achievement;
import com.kabaddi.sahara.repository.AchievementRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementRepository repo;

    public AchievementController(AchievementRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Achievement> list(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) String search) {
        List<Achievement> all = repo.findAllByOrderByAchievementDateDescYearDesc();
        return all.stream()
                .filter(a -> year == null || year.equals(a.getYear()))
                .filter(a -> position == null || position.isBlank()
                        || position.equalsIgnoreCase(a.getPosition())
                        || ("Championship".equalsIgnoreCase(position) && a.getPosition() != null
                                && a.getPosition().toLowerCase().contains("1st")))
                .filter(a -> search == null || search.isBlank()
                        || (a.getTournamentName() != null
                                && a.getTournamentName().toLowerCase().contains(search.toLowerCase())))
                .toList();
    }

    @GetMapping("/{id}")
    public Achievement detail(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Achievement not found"));
    }

    @PostMapping
    public Achievement create(@Valid @RequestBody Achievement a) {
        a.setId(null);
        return repo.save(a);
    }

    @PutMapping("/{id}")
    public Achievement update(@PathVariable Long id, @Valid @RequestBody Achievement in) {
        Achievement a = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Achievement not found"));
        a.setTitle(in.getTitle());
        a.setDescription(in.getDescription());
        a.setTournamentName(in.getTournamentName());
        a.setYear(in.getYear());
        a.setPosition(in.getPosition());
        a.setAchievementDate(in.getAchievementDate());
        a.setCoverImageUrl(in.getCoverImageUrl());
        return repo.save(a);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Achievement not found");
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
