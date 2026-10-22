package com.kabaddi.sahara.controller;

import com.kabaddi.sahara.model.Achievement;
import com.kabaddi.sahara.model.AchievementPhoto;
import com.kabaddi.sahara.repository.AchievementPhotoRepository;
import com.kabaddi.sahara.repository.AchievementRepository;
import com.kabaddi.sahara.service.ImageStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PhotoController {

    private final AchievementRepository achievements;
    private final AchievementPhotoRepository photos;
    private final ImageStorageService storage;

    public PhotoController(AchievementRepository achievements, AchievementPhotoRepository photos, ImageStorageService storage) {
        this.achievements = achievements;
        this.photos = photos;
        this.storage = storage;
    }

    @GetMapping("/achievements/{id}/photos")
    public List<AchievementPhoto> list(@PathVariable Long id) {
        Achievement a = get(id);
        return a.getPhotos();
    }

    /** Multipart upload — accepts one or many files, in display order. */
    @PostMapping(value = "/achievements/{id}/photos", consumes = "multipart/form-data")
    public ResponseEntity<?> upload(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(required = false) String caption) throws IOException {
        Achievement a = get(id);
        int baseOrder = a.getPhotos().size();
        List<AchievementPhoto> saved = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile f = files.get(i);
            if (f.isEmpty()) continue;
            String url = storage.store(f, "achievements/" + id);
            AchievementPhoto p = new AchievementPhoto();
            p.setAchievement(a);
            p.setImageUrl(url);
            p.setCaption(caption != null && !caption.isBlank()
                    ? caption + " " + (i + 1)
                    : a.getTitle() + " — Photo " + (baseOrder + i + 1));
            p.setDisplayOrder(baseOrder + i);
            photos.save(p);
            saved.add(p);
            // First uploaded photo with no cover set becomes the cover image
            if (a.getCoverImageUrl() == null || a.getCoverImageUrl().isBlank()) {
                a.setCoverImageUrl(url);
                achievements.save(a);
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", saved.size() + " photos uploaded successfully.", "photos", saved));
    }

    @PutMapping("/photos/{photoId}")
    public AchievementPhoto update(
            @PathVariable Long photoId,
            @RequestBody Map<String, Object> body) {
        AchievementPhoto p = photos.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found"));
        if (body.containsKey("caption")) p.setCaption((String) body.get("caption"));
        if (body.containsKey("displayOrder")) p.setDisplayOrder(((Number) body.get("displayOrder")).intValue());
        return photos.save(p);
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<?> delete(@PathVariable Long photoId) throws IOException {
        AchievementPhoto p = photos.findById(photoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found"));
        Achievement a = p.getAchievement();
        storage.delete(p.getImageUrl());
        // If the deleted photo was the cover, fall back to the next photo (or null)
        if (publicUrlEquals(a.getCoverImageUrl(), p.getImageUrl())) {
            a.setCoverImageUrl(a.getPhotos().stream()
                    .filter(x -> !x.getId().equals(photoId))
                    .findFirst().map(AchievementPhoto::getImageUrl).orElse(null));
            achievements.save(a);
        }
        photos.delete(p);
        return ResponseEntity.ok().build();
    }

    private static boolean publicUrlEquals(String a, String b) {
        return a != null && a.equals(b);
    }

    private Achievement get(Long id) {
        return achievements.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Achievement not found"));
    }
}
