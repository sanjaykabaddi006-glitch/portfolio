package com.kabaddi.sahara.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Local file-based object storage.
 * Storage architecture: multipart -> validate -> uuid.ext under {root}/{folder}/
 * To swap to Cloudinary/S3: implement the same two public methods against
 * the cloud SDK and return the secure URL — controllers stay untouched.
 */
@Service
public class ImageStorageService {

    private static final Set<String> ALLOWED_MIME = Set.of(
            "image/jpeg", "image/png", "image/webp");
    private static final Map<String, String> MIME_TO_EXT = Map.of(
            "image/jpeg", "jpg", "image/png", "png", "image/webp", "webp");

    private final Path root;
    private final long maxBytes;

    public ImageStorageService(@Value("${app.storage.root}") String root,
                               @Value("${spring.servlet.multipart.max-file-size:10MB}") String maxSize) {
        this.root = Paths.get(root).toAbsolutePath().normalize();
        this.maxBytes = parseSize(maxSize);
    }

    public String store(MultipartFile file, String folder) throws IOException {
        String mime = file.getContentType();
        if (mime == null || !ALLOWED_MIME.contains(mime.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Allowed: JPG, PNG, WEBP");
        }
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("File exceeds maximum size of " + (maxBytes / 1024 / 1024) + "MB");
        }
        String ext = MIME_TO_EXT.get(mime.toLowerCase());
        String filename = UUID.randomUUID() + "." + ext;
        Path dir = root.resolve(folder).normalize();
        if (!dir.startsWith(root)) {
            throw new IllegalArgumentException("Invalid storage path");
        }
        Files.createDirectories(dir);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        }
        // URL path served statically by WebConfig: /uploads/{folder}/{filename}
        return "/uploads/" + folder + "/" + filename;
    }

    public boolean delete(String publicUrl) throws IOException {
        if (publicUrl == null || !publicUrl.startsWith("/uploads/")) return false;
        String relative = publicUrl.substring("/uploads/".length());
        Path target = root.resolve(relative).normalize();
        if (!target.startsWith(root) || !Files.exists(target)) return false;
        Files.delete(target);
        return true;
    }

    private static long parseSize(String size) {
        // e.g. "10MB" -> 10485760
        String s = size.trim().toUpperCase();
        long mult = 1;
        if (s.endsWith("MB")) { mult = 1024L * 1024; s = s.substring(0, s.length() - 2); }
        else if (s.endsWith("KB")) { mult = 1024L; s = s.substring(0, s.length() - 2); }
        return Long.parseLong(s.trim()) * mult;
    }
}
