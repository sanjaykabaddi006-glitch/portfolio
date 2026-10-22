package com.kabaddi.sahara.config;

import com.kabaddi.sahara.model.Achievement;
import com.kabaddi.sahara.model.AchievementPhoto;
import com.kabaddi.sahara.model.AdminUser;
import com.kabaddi.sahara.repository.AchievementRepository;
import com.kabaddi.sahara.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

/**
 * Seeds the default admin account and PLACEHOLDER achievements.
 * PLACEHOLDER CONTENT — replace with the team's real data via the admin dashboard
 * or by editing this seeder (set app.seed.enabled=false to stop reseeding).
 */
@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(@Value("${app.seed.enabled}") boolean enabled,
                           AdminUserRepository users,
                           AchievementRepository achievements,
                           PasswordEncoder encoder) {
        return args -> {
            if (users.findByUsername("admin").isEmpty()) {
                AdminUser admin = new AdminUser();
                admin.setUsername("admin");
                admin.setPasswordHash(encoder.encode("admin123")); // CHANGE in production
                users.save(admin);
            }
            if (!enabled || achievements.count() > 0) return;

            Achievement a1 = new Achievement();
            a1.setTitle("1st Place Champions — AP Sports Club Ayyanarpalayam");
            a1.setDescription("Sahara Kabaddi Team lifted the 1st Prize and rolling trophy along with ₹12,000 cash prize presented by Mr. Er. T. Stalin, B.Tech. Outstanding raider performances and defensive coordination secured an emphatic championship victory.");
            a1.setTournamentName("AP Sports Club Ayyanarpalayam 3rd Year Tournament 2K26");
            a1.setYear(2026);
            a1.setPosition("1st Place Champions");
            a1.setAchievementDate(LocalDate.of(2026, 8, 15));
            a1.setCoverImageUrl("/uploads/achievements/1/cover.jpg");
            achievements.save(a1);

            Achievement a2 = new Achievement();
            a2.setTitle("2nd Prize Trophy — Kumara Cup Tournament");
            a2.setDescription("Sahara Kabaddi squad secured the prestigious 2nd prize trophy in the Kumarakoppai tournament against top district competitors after an intense final showdown.");
            a2.setTournamentName("Kumarakoppai Kabaddi Tournament");
            a2.setYear(2026);
            a2.setPosition("Runner-up (2nd Prize)");
            a2.setAchievementDate(LocalDate.of(2026, 7, 20));
            a2.setCoverImageUrl("/uploads/achievements/2/cover.jpg");
            achievements.save(a2);

            Achievement a3 = new Achievement();
            a3.setTitle("3rd Place Trophy — State Invitational Night Cup");
            a3.setDescription("Competing under floodlights against seasoned state squads, Sahara Kabaddi fought through demanding knockout rounds to lift the 3rd place rolling trophy and player medals.");
            a3.setTournamentName("State Level Floodlight Kabaddi Championship");
            a3.setYear(2025);
            a3.setPosition("3rd Place (Bronze Trophy)");
            a3.setAchievementDate(LocalDate.of(2025, 11, 14));
            a3.setCoverImageUrl("/uploads/achievements/3/cover.jpg");
            achievements.save(a3);

            Achievement a4 = new Achievement();
            a4.setTitle("3rd Prize Celebration — District Invitational Cup");
            a4.setDescription("The squad celebrated a podium finish and rolling trophy at the daytime district tournament with strong support from the Ammapalayam community.");
            a4.setTournamentName("District Level Kabaddi Tournament");
            a4.setYear(2025);
            a4.setPosition("3rd Prize");
            a4.setAchievementDate(LocalDate.of(2025, 5, 10));
            a4.setCoverImageUrl("/uploads/achievements/4/cover.jpg");
            achievements.save(a4);

            Achievement a5 = new Achievement();
            a5.setTitle("Sahara Kabaddi Legend Tribute — A. Suresh");
            a5.setDescription("Honorary tribute to A. Suresh (அகில இந்திய பல்கலைக்கழக கபாடி வீரர்) — All India University Kabaddi Player representing Sahara Kabaddi Club, Ammapalayam, Perambalur.");
            a5.setTournamentName("All India University Kabaddi Icon");
            a5.setYear(2024);
            a5.setPosition("Club Icon / Legend");
            a5.setAchievementDate(LocalDate.of(2024, 1, 26));
            a5.setCoverImageUrl("/images/sahara-legend-a-suresh.jpg");
            achievements.save(a5);

            Achievement a6 = new Achievement();
            a6.setTitle("4th Place Trophy — SKL Sports Club Sirukudal");
            a6.setDescription("Sahara Kabaddi Team battled through intense floodlight knockout matches to secure the 4th place rolling trophy at the SKL Sports Club state tournament in Sirukudal.");
            a6.setTournamentName("SKL Sports Club State Tournament");
            a6.setYear(2026);
            a6.setPosition("4th Place");
            a6.setAchievementDate(LocalDate.of(2026, 8, 28));
            a6.setCoverImageUrl("/images/sahara-skl-sirukudal-4th.jpg");
            achievements.save(a6);

            Achievement a7 = new Achievement();
            a7.setTitle("1st Prize Champions — Grand Sand Court Night Cup");
            a7.setDescription("Dominant championship victory under floodlights on the sand court. Sahara squad clinched the grand 1st place trophy cup and cash prize after an undefeated campaign.");
            a7.setTournamentName("District Floodlight Kabaddi Championship");
            a7.setYear(2026);
            a7.setPosition("1st Place Champions");
            a7.setAchievementDate(LocalDate.of(2026, 6, 12));
            a7.setCoverImageUrl("/images/sahara-night-champions-1st.jpg");
            achievements.save(a7);

            Achievement a8 = new Achievement();
            a8.setTitle("3rd Prize Trophy — Sellur PMK Invitational Cup");
            a8.setDescription("Podium celebration and 3rd prize rolling trophy presented by Thiru. A. Muthukumar, Ondriya Udaka Peravai Sellur PMK, recognizing Sahara Kabaddi team's valiant raid points.");
            a8.setTournamentName("Sellur PMK Kabaddi Tournament");
            a8.setYear(2025);
            a8.setPosition("3rd Prize");
            a8.setAchievementDate(LocalDate.of(2025, 9, 18));
            a8.setCoverImageUrl("/images/sahara-sellur-pmk-3rd.jpg");
            achievements.save(a8);

            Achievement a9 = new Achievement();
            a9.setTitle("1st Place Champions — RS Veerargal Mat Tournament");
            a9.setDescription("Undefeated championship on professional blue kabaddi mat arena under the grand canopy. Sahara raiders and corner defenders lifted the prestigious RS Veerargal 1st place golden cup.");
            a9.setTournamentName("RS Veerargal State Mat Championship");
            a9.setYear(2025);
            a9.setPosition("1st Place Champions");
            a9.setAchievementDate(LocalDate.of(2025, 3, 22));
            a9.setCoverImageUrl("/images/sahara-rs-veerargal-mat-1st.jpg");
            achievements.save(a9);
        };
    }
}
