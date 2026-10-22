# SAHARA KABADDI TEAM WEBSITE

Full-stack Kabaddi achievement website: React + TypeScript frontend, Spring Boot 3 + JPA backend, H2 file database (zero credentials), JWT-protected admin dashboard, multi-photo upload per achievement.

> PLACEHOLDER CONTENT: All achievements/players are seeded sample data — replace via the admin dashboard.

## PROJECT STRUCTURE

`
sahara/
├── backend/                      Spring Boot 3.3.5 (Java 17)
│   ├── pom.xml
│   └── src/main/java/com/kabaddi/sahara/
│       ├── SaharaApplication.java
│       ├── model/                Achievement, AchievementPhoto, AdminUser
│       ├── repository/           JPA repositories
│       ├── controller/           Auth, Achievement, Photo (REST)
│       ├── service/              JwtService, ImageStorageService
│       └── config/               SecurityConfig, JwtAuthFilter, WebConfig, DataSeeder
└── frontend/                     React 18 + Vite 5 + TS
    └── src/
        ├── pages/                Home, Achievements, AchievementDetail, Gallery
        ├── admin/                AdminLogin, AdminDashboard, AchievementForm, ManagePhotos
        ├── components/           Navbar, Footer, AchievementCard, Lightbox
        ├── api/client.ts         Axios + JWT interceptor + typed API
        └── styles/globals.css    ThreeUI dark cinematic design language
`

## RUN

Backend (terminal 1):
`
cd backend
mvn spring-boot:run          # http://localhost:8080
`

Frontend (terminal 2):
`
cd frontend
npm install
npm run dev                  # http://localhost:5173
`

Admin: http://localhost:5173/admin/login — dmin / admin123 (CHANGE AFTER FIRST LOGIN)

## DATABASE

H2 file mode at ackend/data/kabaddi.mv.db — zero install. To swap to MySQL:
1. Install MySQL 8, create DB kabaddi_db
2. In ackend/src/main/resources/application.properties replace spring.datasource.* with your MySQL url/username/password
3. In ackend/pom.xml replace the com.h2database:h2 dependency with com.mysql:mysql-connector-j

## API ENDPOINTS

`
POST   /api/auth/login                       public     {token}
GET    /api/achievements                     public     ?year=&position=&search=
GET    /api/achievements/:id                 public
POST   /api/achievements                     admin JWT
PUT    /api/achievements/:id                 admin JWT
DELETE /api/achievements/:id                 admin JWT
GET    /api/achievements/:id/photos          public
POST   /api/achievements/:id/photos          admin JWT   multipart files[] + caption
PUT    /api/photos/:photoId                  admin JWT   {caption, displayOrder}
DELETE /api/photos/:photoId                  admin JWT
`

## IMAGE UPLOAD ARCHITECTURE

`
Admin selects photos (JPG/PNG/WEBP, max 10MB each)
  -> Vite proxy -> Spring Boot multipart endpoint
  -> ImageStorageService validates MIME + size, stores as {uuid}.ext
     under ./uploads/achievements/{achievementId}/
  -> URL saved in achievement_photos table (FK -> achievements)
  -> served statically at /uploads/** (swap for Cloudinary/S3 in ImageStorageService)
`

## SCHEMA

`
users(id, username UNIQUE, password_hash, created_at)
achievements(id, title, description, tournament_name, achievement_year,
             position, achievement_date, cover_image_url, created_at, updated_at)
achievement_photos(id, achievement_id FK, image_url, caption, display_order, created_at)
`

## DEPLOY (PRODUCTION)

- Frontend: 
pm run build -> serve dist/ on Netlify/Vercel/Nginx; set API base to backend URL in src/api/client.ts
- Backend: mvn clean package -> java -jar target/sahara-0.0.1-SNAPSHOT.jar with pp.jwt.secret changed and MySQL configured
- Reverse-proxy (Nginx) /api and /uploads to the backend; never expose secrets in frontend code