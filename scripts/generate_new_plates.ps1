Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\sanja\.gemini\antigravity-ide\brain\36f65a71-9d06-42ae-ab66-40fcdde2e803\.user_uploaded"
$imagesDir = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\images"
$sketchbookDir = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\landing-pages\meng-to-sketchbook"
$baseBookPath = "$sketchbookDir\blank-sketchbook.png"
$logoPath = "$sketchbookDir\sahara-logo.png"

$photoMap = @(
    @{
        Src = "$srcDir\media_1789208162444.jpg"
        DestName = "sahara-skl-sirukudal-4th.jpg"
        PlateName = "sahara-plate-06.png"
        PlateNo = "06"
        Category = "STATE INVITATIONAL ARCHIVE"
        Title = "SKL Sports Club Sirukudal"
        Award = "4th Place Trophy & Cup"
        Tournament = "SKL Sports Club State Level Kabaddi Tournament"
        Venue = "Sirukudal Ground - Floodlight Arena"
        Donated = "SKL Sports Club Committee, Sirukudal"
        SquadNote = "Sahara Kabaddi Team (#3, #4 Jersey) in Blue & White Hexagonal Kit"
        Quote = "Built to Raid - Trained to Win"
        Caption = "Plate 06 : Sahara squad with the SKL Sirukudal 4th Place trophy"
    },
    @{
        Src = "$srcDir\media_1789208199667.jpg"
        DestName = "sahara-night-champions-1st.jpg"
        PlateName = "sahara-plate-07.png"
        PlateNo = "07"
        Category = "CHAMPIONSHIP VICTORY ARCHIVE"
        Title = "Grand Sand Court Night Cup"
        Award = "1st Place Champions & Grand Trophy"
        Tournament = "District Level Floodlight Kabaddi Championship"
        Venue = "Sand Court Arena - Perambalur District"
        Donated = "Tournament Organizing Committee"
        SquadNote = "Sahara Kabaddi Team in Teal Squad Kit with Grand Championship Trophy"
        Quote = "Unbroken Defense - Relentless Raiders"
        Caption = "Plate 07 : Sahara Kabaddi squad celebrating 1st Place championship victory"
    },
    @{
        Src = "$srcDir\media_1789208199696.jpg"
        DestName = "sahara-sellur-pmk-3rd.jpg"
        PlateName = "sahara-plate-08.png"
        PlateNo = "08"
        Category = "DISTRICT PODIUM ARCHIVE"
        Title = "Sellur PMK Invitational Cup"
        Award = "3rd Prize Rolling Trophy"
        Tournament = "Sellur PMK Kabaddi Tournament (Thiru. A. Muthukumar)"
        Venue = "Sellur - Perambalur District"
        Donated = "Ondriya Udaka Peravai Sellur PMK"
        SquadNote = "Sahara Kabaddi Team with 3rd Place Trophy on Wooden Pedestal"
        Quote = "Courage on the Mat - Pride in the Soul"
        Caption = "Plate 08 : Podium celebration with Thiru. A. Muthukumar 3rd prize trophy"
    },
    @{
        Src = "$srcDir\media_1789208357748.jpg"
        DestName = "sahara-rs-veerargal-mat-1st.jpg"
        PlateName = "sahara-plate-09.png"
        PlateNo = "09"
        Category = "STATE MAT CHAMPIONSHIP ARCHIVE"
        Title = "RS Veerargal Mat Tournament"
        Award = "1st Place Champions & Cup"
        Tournament = "RS Veerargal State Level Professional Mat Kabaddi Cup"
        Venue = "Indoor Blue Mat Arena - Grand Canopy"
        Donated = "RS Veerargal Sports Association"
        SquadNote = "Undefeated Sahara Kabaddi Raiders on Blue Pro-Kabaddi Mat"
        Quote = "Masters of the Mat - Champions of Tamil Nadu"
        Caption = "Plate 09 : 1st Place Champions holding RS Veerargal Golden Trophy"
    }
)

foreach ($item in $photoMap) {
    Copy-Item -Path $item.Src -Destination "$imagesDir\$($item.DestName)" -Force
    Copy-Item -Path $item.Src -Destination "$sketchbookDir\$($item.DestName)" -Force
    Write-Output "Copied $($item.DestName)"
}

function Generate-PlateSpread($config) {
    $baseImg = [System.Drawing.Bitmap]::FromFile($baseBookPath)
    $photoImg = [System.Drawing.Bitmap]::FromFile($config.Src)
    $logoImg = [System.Drawing.Bitmap]::FromFile($logoPath)
    
    $canvas = [System.Drawing.Bitmap]::new(1760, 1240)
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # Draw base sketchbook
    $g.DrawImage($baseImg, 0, 0, 1760, 1240)

    # ---------------- RIGHT PAGE (PHOTO SPREAD) ----------------
    $availW = 600
    $availH = 760
    $pW = $photoImg.Width
    $pH = $photoImg.Height

    $scale = [Math]::Min($availW / $pW, $availH / $pH)
    $photoW = [int]($pW * $scale)
    $photoH = [int]($pH * $scale)

    $centerX = 940 + [int]((620 - $photoW) / 2)
    $centerY = 220 + [int]((740 - $photoH) / 2)

    # Drop shadow
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(45, 43, 39, 33))
    $g.FillRectangle($shadowBrush, $centerX + 6, $centerY + 8, $photoW, $photoH)
    $shadowBrush.Dispose()

    # Borders
    $matPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(90, 43, 39, 33), 1)
    $outerMatPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(35, 43, 39, 33), 1)
    $g.DrawRectangle($outerMatPen, $centerX - 5, $centerY - 5, $photoW + 10, $photoH + 10)
    $g.DrawRectangle($matPen, $centerX - 1, $centerY - 1, $photoW + 2, $photoH + 2)
    $matPen.Dispose()
    $outerMatPen.Dispose()

    # Photo
    $g.DrawImage($photoImg, $centerX, $centerY, $photoW, $photoH)

    # Caption
    $captionFont = [System.Drawing.Font]::new('Georgia', 12, [System.Drawing.FontStyle]::Italic)
    $captionBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(160, 43, 39, 33))
    $captionFormat = [System.Drawing.StringFormat]::new()
    $captionFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $captionRect = [System.Drawing.RectangleF]::new(940, $centerY + $photoH + 14, 620, 30)
    $g.DrawString($config.Caption, $captionFont, $captionBrush, $captionRect, $captionFormat)
    $captionFont.Dispose()
    $captionBrush.Dispose()
    $captionFormat.Dispose()

    # ---------------- LEFT PAGE (EDITORIAL TYPOGRAPHY) ----------------
    $leftX = 220
    $leftW = 590

    # 1. Sahara Crest Logo
    $logoSize = 58
    $logoX = $leftX + [int](($leftW - $logoSize) / 2)
    $logoY = 225
    $g.DrawImage($logoImg, $logoX, $logoY, $logoSize, $logoSize)

    # 2. Club Subhead
    $headerFont = [System.Drawing.Font]::new('Arial', 10, [System.Drawing.FontStyle]::Regular)
    $softBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(150, 43, 39, 33))
    $centerFormat = [System.Drawing.StringFormat]::new()
    $centerFormat.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString('SAHARA SPORTS CLUB · AMMAPALAYAM', $headerFont, $softBrush, [System.Drawing.RectangleF]::new($leftX, 292, $leftW, 20), $centerFormat)
    $headerFont.Dispose()

    # 3. Plate badge
    $plateFont = [System.Drawing.Font]::new('Arial', 10, [System.Drawing.FontStyle]::Bold)
    $earthBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(230, 154, 106, 62))
    $plateText = "PLATE NO. " + $config.PlateNo + " - " + $config.Category
    $g.DrawString($plateText, $plateFont, $earthBrush, [System.Drawing.RectangleF]::new($leftX, 316, $leftW, 20), $centerFormat)
    $plateFont.Dispose()

    # Divider
    $linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(70, 43, 39, 33), 1)
    $g.DrawLine($linePen, $leftX + 40, 345, $leftX + $leftW - 40, 345)

    # 4. Tournament Title
    $titleFont = [System.Drawing.Font]::new('Georgia', 24, [System.Drawing.FontStyle]::Bold)
    $inkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 43, 39, 33))
    $g.DrawString($config.Title, $titleFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX, 365, $leftW, 64), $centerFormat)
    $titleFont.Dispose()

    # 5. Award
    $awardFont = [System.Drawing.Font]::new('Georgia', 18, [System.Drawing.FontStyle]::Italic)
    $g.DrawString($config.Award, $awardFont, $earthBrush, [System.Drawing.RectangleF]::new($leftX, 430, $leftW, 36), $centerFormat)
    $awardFont.Dispose()

    # Fine divider
    $g.DrawLine($linePen, $leftX + 80, 475, $leftX + $leftW - 80, 475)

    # 6. Detailed Metadata
    $metaTitleFont = [System.Drawing.Font]::new('Arial', 9.5, [System.Drawing.FontStyle]::Bold)
    $metaBodyFont = [System.Drawing.Font]::new('Georgia', 14, [System.Drawing.FontStyle]::Regular)
    $leftFormat = [System.Drawing.StringFormat]::new()
    $leftFormat.Alignment = [System.Drawing.StringAlignment]::Near

    $currY = 500
    $lineStep = 54

    # Item A: Tournament
    $g.DrawString('TOURNAMENT', $metaTitleFont, $softBrush, $leftX + 40, $currY)
    $g.DrawString($config.Tournament, $metaBodyFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX + 40, $currY + 16, $leftW - 80, 36), $leftFormat)
    $currY += $lineStep + 6

    # Item B: Venue
    $g.DrawString('VENUE & ARENA', $metaTitleFont, $softBrush, $leftX + 40, $currY)
    $g.DrawString($config.Venue, $metaBodyFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX + 40, $currY + 16, $leftW - 80, 36), $leftFormat)
    $currY += $lineStep

    # Item C: Inscription / Donated
    $g.DrawString('PRESENTATION & TROPHY', $metaTitleFont, $softBrush, $leftX + 40, $currY)
    $g.DrawString($config.Donated, $metaBodyFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX + 40, $currY + 16, $leftW - 80, 36), $leftFormat)
    $currY += $lineStep

    # Item D: Squad Record
    $g.DrawString('SQUAD PARTICIPATION', $metaTitleFont, $softBrush, $leftX + 40, $currY)
    $g.DrawString($config.SquadNote, $metaBodyFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX + 40, $currY + 16, $leftW - 80, 48), $leftFormat)
    $currY += $lineStep + 10

    # 7. Motto & Verification Footer
    $g.DrawLine($linePen, $leftX + 40, $currY, $leftX + $leftW - 40, $currY)
    $currY += 16

    $mottoFont = [System.Drawing.Font]::new('Georgia', 14.5, [System.Drawing.FontStyle]::Italic)
    $mottoText = [char]0x201C + $config.Quote + [char]0x201D
    $g.DrawString($mottoText, $mottoFont, $earthBrush, [System.Drawing.RectangleF]::new($leftX, $currY, $leftW, 26), $centerFormat)
    $currY += 32

    $stampFont = [System.Drawing.Font]::new('Arial', 8.5, [System.Drawing.FontStyle]::Regular)
    $g.DrawString('OFFICIAL KABADDI ARCHIVE - VERIFIED AMMAPALAYAM CLUB RECORD', $stampFont, $softBrush, [System.Drawing.RectangleF]::new($leftX, $currY, $leftW, 20), $centerFormat)

    # Dispose left page resources
    $metaTitleFont.Dispose()
    $metaBodyFont.Dispose()
    $leftFormat.Dispose()
    $linePen.Dispose()
    $softBrush.Dispose()
    $earthBrush.Dispose()
    $inkBrush.Dispose()
    $mottoFont.Dispose()
    $stampFont.Dispose()
    $centerFormat.Dispose()

    # Save generated plate
    $outPath = "$sketchbookDir\$($config.PlateName)"
    $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $baseImg.Dispose()
    $photoImg.Dispose()
    $logoImg.Dispose()
    $canvas.Dispose()
    $g.Dispose()

    Write-Output "Successfully generated: $outPath"
}

foreach ($item in $photoMap) {
    Generate-PlateSpread $item
}
Write-Output "ALL 4 PLATES GENERATED SUCCESSFULLY!"
