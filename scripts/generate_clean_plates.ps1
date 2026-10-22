Add-Type -AssemblyName System.Drawing

$sketchbookDir = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\landing-pages\meng-to-sketchbook"
$imagesDir = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\images"
$blankPath = "$sketchbookDir\blank-sketchbook.png"
$cleanBasePath = "$sketchbookDir\clean-book-base.png"
$coverPath = "$sketchbookDir\sahara-cover.png"
$logoPath = "$sketchbookDir\sahara-logo.png"

Write-Output "=== 1. CREATING 100% PRISTINE CLEAN-BOOK-BASE.PNG ==="

$srcBlank = [System.Drawing.Bitmap]::FromFile($blankPath)
$cleanBase = [System.Drawing.Bitmap]::new(1760, 1240)
$g = [System.Drawing.Graphics]::FromImage($cleanBase)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw the original book base with desk edges & outer curvature
$g.DrawImage($srcBlank, 0, 0, 1760, 1240)

# Warm parchment paper colors
$paperWarm = [System.Drawing.Color]::FromArgb(238, 232, 222)
$paperBrush = [System.Drawing.SolidBrush]::new($paperWarm)

# Fill left page interior (covers all old Singapore ink marks)
$g.FillRectangle($paperBrush, 135, 210, 735, 820)
# Fill right page interior
$g.FillRectangle($paperBrush, 890, 210, 735, 820)

# Realistic paper shading:
# 1. Outer edge vignettes (soft warm shadow on far left and far right edges of paper)
$edgeBrushL = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new(135, 210),
    [System.Drawing.Point]::new(200, 210),
    [System.Drawing.Color]::FromArgb(40, 50, 40, 30),
    [System.Drawing.Color]::FromArgb(0, 50, 40, 30)
)
$g.FillRectangle($edgeBrushL, 135, 210, 65, 820)
$edgeBrushL.Dispose()

$edgeBrushR = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new(1560, 210),
    [System.Drawing.Point]::new(1625, 210),
    [System.Drawing.Color]::FromArgb(0, 50, 40, 30),
    [System.Drawing.Color]::FromArgb(40, 50, 40, 30)
)
$g.FillRectangle($edgeBrushR, 1560, 210, 65, 820)
$edgeBrushR.Dispose()

# 2. Top and bottom subtle page curves
$topBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new(880, 210),
    [System.Drawing.Point]::new(880, 260),
    [System.Drawing.Color]::FromArgb(25, 50, 40, 30),
    [System.Drawing.Color]::FromArgb(0, 50, 40, 30)
)
$g.FillRectangle($topBrush, 135, 210, 1490, 50)
$topBrush.Dispose()

$botBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new(880, 980),
    [System.Drawing.Point]::new(880, 1030),
    [System.Drawing.Color]::FromArgb(0, 50, 40, 30),
    [System.Drawing.Color]::FromArgb(35, 50, 40, 30)
)
$g.FillRectangle($botBrush, 135, 980, 1490, 50)
$botBrush.Dispose()

# 3. Spine / gutter shadow in center
$spineBrushLeft = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new(780, 210),
    [System.Drawing.Point]::new(880, 210),
    [System.Drawing.Color]::FromArgb(0, 45, 35, 25),
    [System.Drawing.Color]::FromArgb(70, 45, 35, 25)
)
$g.FillRectangle($spineBrushLeft, 780, 210, 100, 820)
$spineBrushLeft.Dispose()

$spineBrushRight = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new(880, 210),
    [System.Drawing.Point]::new(980, 210),
    [System.Drawing.Color]::FromArgb(70, 45, 35, 25),
    [System.Drawing.Color]::FromArgb(0, 45, 35, 25)
)
$g.FillRectangle($spineBrushRight, 880, 210, 100, 820)
$spineBrushRight.Dispose()

# Spine center crease line
$creasePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(100, 45, 35, 25), 2)
$g.DrawLine($creasePen, 880, 210, 880, 1030)
$creasePen.Dispose()
$paperBrush.Dispose()
$g.Dispose()

# Save pristine clean-book-base
$cleanBase.Save($cleanBasePath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved 100% clean base: $cleanBasePath"

# Also overwrite blank-sketchbook.png with this 100% clean base so no old ink marks exist
$cleanBase.Save($blankPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Updated blank-sketchbook.png to be 100% clean"
$srcBlank.Dispose()
$cleanBase.Dispose()


Write-Output "`n=== 2. GENERATING CLOSED BOOK FRONT COVER (sahara-cover.png) ==="
# The closed cover shows the book in its closed state with the Sahara logo
$coverBmp = [System.Drawing.Bitmap]::new(1760, 1240)
$gCover = [System.Drawing.Graphics]::FromImage($coverBmp)
$gCover.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gCover.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gCover.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gCover.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# The closed album sits gracefully in the center of the desk
$coverX = 490
$coverY = 175
$coverW = 780
$coverH = 890

# 1. Realistic drop shadow underneath the closed book onto desk
$shadowBrushOuter = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(45, 25, 18, 12))
$gCover.FillRectangle($shadowBrushOuter, $coverX + 28, $coverY + 36, $coverW, $coverH)
$shadowBrushOuter.Dispose()

$shadowBrushMid = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(65, 30, 20, 14))
$gCover.FillRectangle($shadowBrushMid, $coverX + 16, $coverY + 22, $coverW, $coverH)
$shadowBrushMid.Dispose()

$shadowBrushNear = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(90, 35, 25, 18))
$gCover.FillRectangle($shadowBrushNear, $coverX + 6, $coverY + 10, $coverW, $coverH)
$shadowBrushNear.Dispose()

# 2. Page block thickness on right & bottom edge (stacked cream pages visible beneath cover)
$pageBlockBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(232, 226, 214))
$gCover.FillRectangle($pageBlockBrush, $coverX + 8, $coverY + 8, $coverW + 14, $coverH + 12)
# Fine page lines along the edge
$pageLinePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(195, 185, 170), 1)
for ($l = 0; $l -lt 12; $l += 2) {
    $gCover.DrawLine($pageLinePen, $coverX + $coverW + $l, $coverY + 14, $coverX + $coverW + $l, $coverY + $coverH + 8)
    $gCover.DrawLine($pageLinePen, $coverX + 16, $coverY + $coverH + $l, $coverX + $coverW + 12, $coverY + $coverH + $l)
}
$pageLinePen.Dispose()
$pageBlockBrush.Dispose()

# 3. Rich leather/cloth hardcover
$leatherBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new($coverX, $coverY),
    [System.Drawing.Point]::new($coverX + $coverW, $coverY + $coverH),
    [System.Drawing.Color]::FromArgb(38, 30, 24),
    [System.Drawing.Color]::FromArgb(22, 17, 13)
)
$gCover.FillRectangle($leatherBrush, $coverX, $coverY, $coverW, $coverH)
$leatherBrush.Dispose()

# 4. Spine on the left side (distinct embossed leather spine)
$spineW = 55
$spineBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new($coverX, $coverY),
    [System.Drawing.Point]::new($coverX + $spineW, $coverY),
    [System.Drawing.Color]::FromArgb(18, 14, 10),
    [System.Drawing.Color]::FromArgb(44, 35, 28)
)
$gCover.FillRectangle($spineBrush, $coverX, $coverY, $spineW, $coverH)
$spineBrush.Dispose()

# Spine crease shadow and gold accent line
$spineCreasePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(15, 10, 8), 3)
$gCover.DrawLine($spineCreasePen, $coverX + $spineW, $coverY, $coverX + $spineW, $coverY + $coverH)
$spineCreasePen.Dispose()

$goldPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(218, 165, 32), 1.5)
$gCover.DrawLine($goldPen, $coverX + $spineW + 3, $coverY + 12, $coverX + $spineW + 3, $coverY + $coverH - 12)

# 5. Ornate Gold Stitched Border around the front cover
$innerBorderX = $coverX + $spineW + 24
$innerBorderY = $coverY + 28
$innerBorderW = $coverW - $spineW - 52
$innerBorderH = $coverH - 56

# Outer gold rectangle
$gCover.DrawRectangle($goldPen, $innerBorderX, $innerBorderY, $innerBorderW, $innerBorderH)
# Inner fine gold rectangle
$fineGoldPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(160, 218, 165, 32), 1)
$gCover.DrawRectangle($fineGoldPen, $innerBorderX + 6, $innerBorderY + 6, $innerBorderW - 12, $innerBorderH - 12)
$fineGoldPen.Dispose()

# Corner decorative brackets
$bracketLen = 22
$bracketPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(245, 195, 68), 2.5)
# Top-Left
$gCover.DrawLine($bracketPen, $innerBorderX + 10, $innerBorderY + 10, $innerBorderX + 10 + $bracketLen, $innerBorderY + 10)
$gCover.DrawLine($bracketPen, $innerBorderX + 10, $innerBorderY + 10, $innerBorderX + 10, $innerBorderY + 10 + $bracketLen)
# Top-Right
$gCover.DrawLine($bracketPen, $innerBorderX + $innerBorderW - 10, $innerBorderY + 10, $innerBorderX + $innerBorderW - 10 - $bracketLen, $innerBorderY + 10)
$gCover.DrawLine($bracketPen, $innerBorderX + $innerBorderW - 10, $innerBorderY + 10, $innerBorderX + $innerBorderW - 10, $innerBorderY + 10 + $bracketLen)
# Bottom-Left
$gCover.DrawLine($bracketPen, $innerBorderX + 10, $innerBorderY + $innerBorderH - 10, $innerBorderX + 10 + $bracketLen, $innerBorderY + $innerBorderH - 10)
$gCover.DrawLine($bracketPen, $innerBorderX + 10, $innerBorderY + $innerBorderH - 10, $innerBorderX + 10, $innerBorderY + $innerBorderH - 10 - $bracketLen)
# Bottom-Right
$gCover.DrawLine($bracketPen, $innerBorderX + $innerBorderW - 10, $innerBorderY + $innerBorderH - 10, $innerBorderX + $innerBorderW - 10 - $bracketLen, $innerBorderY + $innerBorderH - 10)
$gCover.DrawLine($bracketPen, $innerBorderX + $innerBorderW - 10, $innerBorderY + $innerBorderH - 10, $innerBorderX + $innerBorderW - 10, $innerBorderY + $innerBorderH - 10 - $bracketLen)
$bracketPen.Dispose()
$goldPen.Dispose()

# 6. Center Sahara Sports Club Logo (Large, Pristine, Gold Foil Frame)
$logoImg = [System.Drawing.Bitmap]::FromFile($logoPath)
$logoDiameter = 280
$logoCenterX = $innerBorderX + [int]($innerBorderW / 2)
$logoCenterY = $coverY + 410
$logoDrawX = $logoCenterX - [int]($logoDiameter / 2)
$logoDrawY = $logoCenterY - [int]($logoDiameter / 2)

# Gold circular medallion behind and around logo
$goldCircleBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(218, 165, 32))
$gCover.FillEllipse($goldCircleBrush, $logoDrawX - 8, $logoDrawY - 8, $logoDiameter + 16, $logoDiameter + 16)
$goldCircleBrush.Dispose()

$darkRingBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(35, 27, 20))
$gCover.FillEllipse($darkRingBrush, $logoDrawX - 4, $logoDrawY - 4, $logoDiameter + 8, $logoDiameter + 8)
$darkRingBrush.Dispose()

# Clip circular logo
$logoPathObj = [System.Drawing.Drawing2D.GraphicsPath]::new()
$logoPathObj.AddEllipse($logoDrawX, $logoDrawY, $logoDiameter, $logoDiameter)
$gCover.SetClip($logoPathObj)
$gCover.DrawImage($logoImg, $logoDrawX, $logoDrawY, $logoDiameter, $logoDiameter)
$gCover.ResetClip()
$logoPathObj.Dispose()
$logoImg.Dispose()

# Outer gold ring border on logo
$outerRingPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(245, 195, 68), 3)
$gCover.DrawEllipse($outerRingPen, $logoDrawX, $logoDrawY, $logoDiameter, $logoDiameter)
$outerRingPen.Dispose()

# 7. Gold Foil Typography on Cover
$goldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 200, 95))
$creamBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(235, 225, 210))
$softGoldBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(200, 165, 100))

$centerFmt = [System.Drawing.StringFormat]::new()
$centerFmt.Alignment = [System.Drawing.StringAlignment]::Center

# Header Eyebrow
$subFont = [System.Drawing.Font]::new('Arial', 13, [System.Drawing.FontStyle]::Bold)
$gCover.DrawString('AMMAPALAYAM · TAMIL NADU', $subFont, $softGoldBrush, [System.Drawing.RectangleF]::new($innerBorderX, $coverY + 68, $innerBorderW, 26), $centerFmt)
$subFont.Dispose()

# Main Title
$titleFont = [System.Drawing.Font]::new('Georgia', 32, [System.Drawing.FontStyle]::Bold)
$gCover.DrawString('SAHARA SPORTS CLUB', $titleFont, $goldBrush, [System.Drawing.RectangleF]::new($innerBorderX, $coverY + 98, $innerBorderW, 46), $centerFmt)
$titleFont.Dispose()

# Subheading
$bookTypeFont = [System.Drawing.Font]::new('Georgia', 16, [System.Drawing.FontStyle]::Italic)
$gCover.DrawString('Championship Kabaddi Victory Archive', $bookTypeFont, $creamBrush, [System.Drawing.RectangleF]::new($innerBorderX, $coverY + 148, $innerBorderW, 30), $centerFmt)
$bookTypeFont.Dispose()

# Decorative divider line beneath title
$divPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(180, 218, 165, 32), 1)
$gCover.DrawLine($divPen, $innerBorderX + 80, $coverY + 192, $innerBorderX + $innerBorderW - 80, $coverY + 192)
$divPen.Dispose()

# Motto below logo
$mottoFont = [System.Drawing.Font]::new('Georgia', 18, [System.Drawing.FontStyle]::Bold)
$gCover.DrawString('BUILT TO RAID · TRAINED TO WIN', $mottoFont, $goldBrush, [System.Drawing.RectangleF]::new($innerBorderX, $coverY + 580, $innerBorderW, 32), $centerFmt)
$mottoFont.Dispose()

$recordFont = [System.Drawing.Font]::new('Arial', 11, [System.Drawing.FontStyle]::Regular)
$gCover.DrawString('STATE & DISTRICT TOURNAMENT ROLL OF HONOUR', $recordFont, $softGoldBrush, [System.Drawing.RectangleF]::new($innerBorderX, $coverY + 616, $innerBorderW, 22), $centerFmt)
$recordFont.Dispose()

# 8. Interactive "CLICK TO OPEN BOOK" Button Badge directly on the cover
$btnW = 340
$btnH = 58
$btnX = $innerBorderX + [int](($innerBorderW - $btnW) / 2)
$btnY = $coverY + 685

# Glowing button background
$btnBackBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Point]::new($btnX, $btnY),
    [System.Drawing.Point]::new($btnX, $btnY + $btnH),
    [System.Drawing.Color]::FromArgb(235, 185, 65),
    [System.Drawing.Color]::FromArgb(170, 115, 25)
)
# Rounded button pill
$btnPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
$radius = 28
$btnPath.AddArc($btnX, $btnY, $radius * 2, $radius * 2, 180, 90)
$btnPath.AddArc($btnX + $btnW - $radius * 2, $btnY, $radius * 2, $radius * 2, 270, 90)
$btnPath.AddArc($btnX + $btnW - $radius * 2, $btnY + $btnH - $radius * 2, $radius * 2, $radius * 2, 0, 90)
$btnPath.AddArc($btnX, $btnY + $btnH - $radius * 2, $radius * 2, $radius * 2, 90, 90)
$btnPath.CloseFigure()

$gCover.FillPath($btnBackBrush, $btnPath)
$btnBorderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 235, 150), 2)
$gCover.DrawPath($btnBorderPen, $btnPath)

$btnTextFont = [System.Drawing.Font]::new('Georgia', 16, [System.Drawing.FontStyle]::Bold)
$btnTextBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(25, 18, 10))
$btnFmt = [System.Drawing.StringFormat]::new()
$btnFmt.Alignment = [System.Drawing.StringAlignment]::Center
$btnFmt.LineAlignment = [System.Drawing.StringAlignment]::Center
$gCover.DrawString('📖  CLICK TO OPEN BOOK', $btnTextFont, $btnTextBrush, [System.Drawing.RectangleF]::new($btnX, $btnY, $btnW, $btnH), $btnFmt)

$btnTextFont.Dispose()
$btnTextBrush.Dispose()
$btnBorderPen.Dispose()
$btnBackBrush.Dispose()
$btnPath.Dispose()
$btnFmt.Dispose()

# Cover bottom copyright / establishment seal
$estFont = [System.Drawing.Font]::new('Arial', 10, [System.Drawing.FontStyle]::Regular)
$gCover.DrawString('ESTABLISHED 2018 · OFFICIAL CLUB ARCHIVE', $estFont, $softGoldBrush, [System.Drawing.RectangleF]::new($innerBorderX, $coverY + 765, $innerBorderW, 20), $centerFmt)
$estFont.Dispose()

$goldBrush.Dispose()
$creamBrush.Dispose()
$softGoldBrush.Dispose()
$centerFmt.Dispose()
$gCover.Dispose()

$coverBmp.Save($coverPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved Closed Book Cover: $coverPath"
$coverBmp.Dispose()


Write-Output "`n=== 3. GENERATING ALL 9 CLEAN PHOTO PLATES (NO OLD LETTERS) ==="
# Metadata for all 9 genuine plates
$platesData = @(
    @{
        PlateNo = "01"
        FileName = "sahara-plate-01.png"
        Photo = "sahara-first-prize-ayyanarpalayam.jpg"
        Title = "1st Prize Championship"
        Tournament = "AP Sports Club Ayyanarpalayam 2K26"
        Honors = "Champions & Grand Rolling Trophy"
        Award = "FIRST PLACE GOLD PODIUM"
    },
    @{
        PlateNo = "02"
        FileName = "sahara-plate-02.png"
        Photo = "sahara-trophy-2nd-kumarakoppai.jpg"
        Title = "2nd Prize Trophy"
        Tournament = "Kumara Cup State Invitational"
        Honors = "Silver Finalist Trophy & Medals"
        Award = "SECOND PLACE SILVER RUNNER-UP"
    },
    @{
        PlateNo = "03"
        FileName = "sahara-plate-03.png"
        Photo = "sahara-trophy-night-3rd.jpg"
        Title = "3rd Place Night Cup"
        Tournament = "State Level Floodlight Championship"
        Honors = "Bronze Podium Trophy & Medals"
        Award = "THIRD PLACE STATE PODIUM"
    },
    @{
        PlateNo = "04"
        FileName = "sahara-plate-04.png"
        Photo = "sahara-team-3rd-prize-day.jpg"
        Title = "3rd Prize Celebration"
        Tournament = "District Invitational Kabaddi Cup"
        Honors = "District Cup Trophy & Honors"
        Award = "THIRD PLACE DISTRICT FINISH"
    },
    @{
        PlateNo = "05"
        FileName = "sahara-plate-05.png"
        Photo = "sahara-legend-a-suresh.jpg"
        Title = "Legend A. Suresh"
        Tournament = "All India University Kabaddi Icon"
        Honors = "Perambalur District Honor Raider"
        Award = "UNIVERSITY LEVEL HALL OF FAME"
    },
    @{
        PlateNo = "06"
        FileName = "sahara-plate-06.png"
        Photo = "sahara-skl-sirukudal-4th.jpg"
        Title = "4th Place Trophy"
        Tournament = "SKL Sports Club Sirukudal State Cup"
        Honors = "Floodlight Arena Trophy"
        Award = "FOURTH PLACE STATE INVITATIONAL"
    },
    @{
        PlateNo = "07"
        FileName = "sahara-plate-07.png"
        Photo = "sahara-night-champions-1st.jpg"
        Title = "1st Prize Champions"
        Tournament = "Grand Sand Court Night Cup Perambalur"
        Honors = "1st Place Grand Championship Trophy"
        Award = "FIRST PLACE CHAMPIONS"
    },
    @{
        PlateNo = "08"
        FileName = "sahara-plate-08.png"
        Photo = "sahara-sellur-pmk-3rd.jpg"
        Title = "3rd Prize Trophy"
        Tournament = "Sellur PMK Kabaddi Tournament"
        Honors = "Thiru. A. Muthukumar 3rd Prize Trophy"
        Award = "THIRD PLACE DISTRICT PODIUM"
    },
    @{
        PlateNo = "09"
        FileName = "sahara-plate-09.png"
        Photo = "sahara-rs-veerargal-mat-1st.jpg"
        Title = "1st Place Champions"
        Tournament = "RS Veerargal State Level Pro Mat Cup"
        Honors = "State Mat Championship Gold Cup"
        Award = "FIRST PLACE STATE MAT CHAMPIONS"
    }
)

foreach ($p in $platesData) {
    # Start each plate from the 100% pristine clean base (zero old ink marks!)
    $baseImg = [System.Drawing.Bitmap]::FromFile($cleanBasePath)
    $photoPath = "$imagesDir\$($p.Photo)"
    $photoImg = [System.Drawing.Bitmap]::FromFile($photoPath)
    $logoImg = [System.Drawing.Bitmap]::FromFile($logoPath)

    $canvas = [System.Drawing.Bitmap]::new(1760, 1240)
    $gPlate = [System.Drawing.Graphics]::FromImage($canvas)
    $gPlate.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gPlate.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gPlate.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gPlate.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    # 1. Draw 100% clean sketchbook base
    $gPlate.DrawImage($baseImg, 0, 0, 1760, 1240)

    # ---------------- RIGHT PAGE: ACCURATE, UNBLURRED HERO PHOTO ----------------
    # Max dimensions for right page photo display
    $maxW = 630
    $maxH = 750
    $pW = $photoImg.Width
    $pH = $photoImg.Height

    # Preserve exact aspect ratio (no distortion!)
    $scale = [Math]::Min($maxW / $pW, $maxH / $pH)
    $photoW = [int]($pW * $scale)
    $photoH = [int]($pH * $scale)

    $rightAreaX = 930
    $rightAreaY = 220
    $rightAreaW = 630
    $rightAreaH = 760

    $photoX = $rightAreaX + [int](($rightAreaW - $photoW) / 2)
    $photoY = $rightAreaY + [int](($rightAreaH - $photoH) / 2)

    # Photo drop shadow onto paper
    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(45, 43, 39, 33))
    $gPlate.FillRectangle($shadowBrush, $photoX + 5, $photoY + 7, $photoW, $photoH)
    $shadowBrush.Dispose()

    # Archival photo mat border
    $outerMatPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(50, 43, 39, 33), 1)
    $innerMatPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(120, 43, 39, 33), 1)
    $gPlate.DrawRectangle($outerMatPen, $photoX - 6, $photoY - 6, $photoW + 12, $photoH + 12)
    $gPlate.DrawRectangle($innerMatPen, $photoX - 2, $photoY - 2, $photoW + 4, $photoH + 4)
    $outerMatPen.Dispose()
    $innerMatPen.Dispose()

    # Draw accurate photo
    $gPlate.DrawImage($photoImg, $photoX, $photoY, $photoW, $photoH)

    # Corner mount brackets (authentic photo album styling)
    $mountPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(160, 154, 106, 62), 2)
    $cLen = 14
    # Top-Left
    $gPlate.DrawLine($mountPen, $photoX - 8, $photoY + $cLen, $photoX + $cLen, $photoY - 8)
    # Top-Right
    $gPlate.DrawLine($mountPen, $photoX + $photoW - $cLen, $photoY - 8, $photoX + $photoW + 8, $photoY + $cLen)
    # Bottom-Left
    $gPlate.DrawLine($mountPen, $photoX - 8, $photoY + $photoH - $cLen, $photoX + $cLen, $photoY + $photoH + 8)
    # Bottom-Right
    $gPlate.DrawLine($mountPen, $photoX + $photoW - $cLen, $photoY + $photoH + 8, $photoX + $photoW + 8, $photoY + $photoH - $cLen)
    $mountPen.Dispose()

    # ---------------- LEFT PAGE: CLEAN, REFINED ARCHIVAL FACING PAGE ----------------
    # Pure clean gallery presentation — no clutter, no false text, no old book letters!
    $leftX = 220
    $leftW = 590
    $centerFmt = [System.Drawing.StringFormat]::new()
    $centerFmt.Alignment = [System.Drawing.StringAlignment]::Center

    # 1. Sahara Sports Club Logo (watermark medallion at top)
    $crestSize = 82
    $crestX = $leftX + [int](($leftW - $crestSize) / 2)
    $crestY = 260

    # Soft circular badge behind crest
    $crestRingPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(140, 180, 140, 90), 1.5)
    $gPlate.DrawEllipse($crestRingPen, $crestX - 4, $crestY - 4, $crestSize + 8, $crestSize + 8)
    $crestRingPen.Dispose()

    $gPlate.DrawImage($logoImg, $crestX, $crestY, $crestSize, $crestSize)

    # 2. Club Subhead
    $headerFont = [System.Drawing.Font]::new('Arial', 10, [System.Drawing.FontStyle]::Regular)
    $softBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(150, 43, 39, 33))
    $gPlate.DrawString('SAHARA SPORTS CLUB · AMMAPALAYAM', $headerFont, $softBrush, [System.Drawing.RectangleF]::new($leftX, 362, $leftW, 20), $centerFmt)
    $headerFont.Dispose()

    # 3. Plate Badge
    $badgeFont = [System.Drawing.Font]::new('Arial', 11, [System.Drawing.FontStyle]::Bold)
    $earthBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(215, 154, 106, 62))
    $plateLabel = "PLATE NO. " + $p.PlateNo + " · OFFICIAL ARCHIVE"
    $gPlate.DrawString($plateLabel, $badgeFont, $earthBrush, [System.Drawing.RectangleF]::new($leftX, 390, $leftW, 22), $centerFmt)
    $badgeFont.Dispose()

    # Divider line
    $divPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(60, 43, 39, 33), 1)
    $gPlate.DrawLine($divPen, $leftX + 60, 428, $leftX + $leftW - 60, 428)

    # 4. Tournament Title (Large, Pristine Instrument Serif)
    $titleFont = [System.Drawing.Font]::new('Georgia', 26, [System.Drawing.FontStyle]::Bold)
    $inkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 43, 39, 33))
    $gPlate.DrawString($p.Title, $titleFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX, 452, $leftW, 64), $centerFmt)
    $titleFont.Dispose()

    # 5. Tournament Subtitle
    $tournFont = [System.Drawing.Font]::new('Georgia', 17, [System.Drawing.FontStyle]::Italic)
    $gPlate.DrawString($p.Tournament, $tournFont, $earthBrush, [System.Drawing.RectangleF]::new($leftX, 520, $leftW, 36), $centerFmt)
    $tournFont.Dispose()

    # Fine divider
    $gPlate.DrawLine($divPen, $leftX + 110, 570, $leftX + $leftW - 110, 570)
    $divPen.Dispose()

    # 6. Honors Award Callout
    $awardFont = [System.Drawing.Font]::new('Arial', 10.5, [System.Drawing.FontStyle]::Bold)
    $gPlate.DrawString($p.Award, $awardFont, $softBrush, [System.Drawing.RectangleF]::new($leftX, 595, $leftW, 22), $centerFmt)
    $awardFont.Dispose()

    $honorsFont = [System.Drawing.Font]::new('Georgia', 15, [System.Drawing.FontStyle]::Regular)
    $gPlate.DrawString($p.Honors, $honorsFont, $inkBrush, [System.Drawing.RectangleF]::new($leftX, 622, $leftW, 30), $centerFmt)
    $honorsFont.Dispose()

    # 7. Motto & Verification Stamp
    $quoteFont = [System.Drawing.Font]::new('Georgia', 15, [System.Drawing.FontStyle]::Italic)
    $quoteText = [char]0x201C + "Built to Raid · Trained to Win" + [char]0x201D
    $gPlate.DrawString($quoteText, $quoteFont, $earthBrush, [System.Drawing.RectangleF]::new($leftX, 715, $leftW, 28), $centerFmt)
    $quoteFont.Dispose()

    $stampFont = [System.Drawing.Font]::new('Arial', 8.5, [System.Drawing.FontStyle]::Regular)
    $gPlate.DrawString('AMMAPALAYAM KABADDI TEAM · VERIFIED ARCHIVAL RECORD', $stampFont, $softBrush, [System.Drawing.RectangleF]::new($leftX, 750, $leftW, 20), $centerFmt)
    $stampFont.Dispose()

    $softBrush.Dispose()
    $earthBrush.Dispose()
    $inkBrush.Dispose()
    $centerFmt.Dispose()

    # Save generated plate
    $outPath = "$sketchbookDir\$($p.FileName)"
    $canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $baseImg.Dispose()
    $photoImg.Dispose()
    $logoImg.Dispose()
    $canvas.Dispose()
    $gPlate.Dispose()

    Write-Output "Generated clean plate: $($p.FileName)"
}

Write-Output "`n=== ALL 9 CLEAN PLATES & COVER SUCCESSFULLY GENERATED! ==="
