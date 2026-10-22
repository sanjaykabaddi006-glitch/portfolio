Add-Type -AssemblyName System.Drawing

$basePath = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\landing-pages\meng-to-sketchbook\marina-bay-sands.png"
$photoPath = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\images\sahara-champion.jpg"
$outPath = "c:\Users\sanja\OneDrive\Desktop\sahara\frontend\public\landing-pages\meng-to-sketchbook\sahara-championship.png"

$baseImg = [System.Drawing.Bitmap]::FromFile($basePath)
$photoImg = [System.Drawing.Bitmap]::FromFile($photoPath)

$canvas = [System.Drawing.Bitmap]::new(1760, 1240)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# 1. Draw base open book
$g.DrawImage($baseImg, 0, 0, 1760, 1240)

# Warm paper color
$paperColor = [System.Drawing.Color]::FromArgb(238, 233, 222)
$paperBrush = [System.Drawing.SolidBrush]::new($paperColor)

# Right page artwork mask
$g.FillRectangle($paperBrush, 920, 190, 680, 860)

# Calculate dimensions for the photo on the right page
$photoW = 560
$photoH = [int]($photoW * ($photoImg.Height / $photoImg.Width))
if ($photoH -gt 780) {
    $photoH = 780
    $photoW = [int]($photoH * ($photoImg.Width / $photoImg.Height))
}

$photoX = 920 + [int]((680 - $photoW) / 2)
$photoY = 190 + [int]((860 - $photoH) / 2)

# Photo shadow & frame
$matBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(60, 43, 39, 33))
$g.FillRectangle($matBrush, $photoX - 4, $photoY - 4, $photoW + 8, $photoH + 8)

# Draw champion photo
$g.DrawImage($photoImg, $photoX, $photoY, $photoW, $photoH)

# Left page artwork mask
$g.FillRectangle($paperBrush, 160, 190, 680, 860)

# Fonts & Brushes for Left page
$titleFont = [System.Drawing.Font]::new('Georgia', 26, [System.Drawing.FontStyle]::Bold)
$h2Font = [System.Drawing.Font]::new('Georgia', 20, [System.Drawing.FontStyle]::Italic)
$bodyFont = [System.Drawing.Font]::new('Georgia', 15, [System.Drawing.FontStyle]::Regular)
$metaFont = [System.Drawing.Font]::new('Arial', 12, [System.Drawing.FontStyle]::Regular)

$inkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(240, 43, 39, 33))
$softBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(160, 43, 39, 33))
$accentBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 180, 65, 25))
$linePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(80, 43, 39, 33), 1)

# Left Page Text Layout
$g.DrawString('SAHARA KABADDI TEAM', $titleFont, $accentBrush, 220, 260)
$g.DrawString('Ammapalayam · Tamil Nadu', $h2Font, $softBrush, 220, 310)

$g.DrawLine($linePen, 220, 370, 750, 370)

$g.DrawString('1st Place Championship Rolling Trophy', $h2Font, $inkBrush, 220, 400)
$g.DrawString('Tournament: Sports Club Ayyanarpalayam', $bodyFont, $inkBrush, 220, 460)
$g.DrawString('Trophy Donated by: Thiru. D. Ilavarasan', $bodyFont, $inkBrush, 220, 500)
$g.DrawString('Catering Service (Kerala) Ayyanarpalayam', $metaFont, $softBrush, 220, 535)

$g.DrawString('Proudly lifted by Sahara Sports Club (#3 Jersey)', $bodyFont, $accentBrush, 220, 590)
$g.DrawString('Built to Raid · Trained to Win', $h2Font, $softBrush, 220, 640)

$g.DrawLine($linePen, 220, 710, 750, 710)
$g.DrawString('PLATE NO. 01 — CHAMPIONSHIP ARCHIVE', $metaFont, $softBrush, 220, 740)

# Save
$canvas.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$baseImg.Dispose()
$photoImg.Dispose()
$canvas.Dispose()
$g.Dispose()

Write-Output 'Generated sahara-championship.png successfully!'
