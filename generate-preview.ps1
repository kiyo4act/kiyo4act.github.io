# PowerShell Script to generate preview HTML from template
# Usage: .\generate-preview.ps1

# File paths configuration
$dummyDataFile = "_templates\dummy-data.json"
$templateFile = "_templates\index.template.html"
$outputFile = "index.html"

# Fixed values
$SITE_URL = "https://kiyo.bio/"
$OG_IMAGE_DEFAULT_URL = "${SITE_URL}images/og-default.png"

# HTML escape function
function Escape-Html {
  param([string]$text)
  if ([string]::IsNullOrEmpty($text)) {
    return ""
  }
  return [System.Web.HttpUtility]::HtmlEncode($text)
}

# Error handling settings
$ErrorActionPreference = "Stop"

try {
  Write-Host "==================================================" -ForegroundColor Cyan
  Write-Host "  Preview HTML Generation Script" -ForegroundColor Cyan
  Write-Host "==================================================" -ForegroundColor Cyan
  Write-Host ""

  # Load dummy data file
  Write-Host "[1/4] Loading dummy data..." -ForegroundColor Yellow
  if (Test-Path $dummyDataFile) {
    $profileData = Get-Content $dummyDataFile -Raw -Encoding UTF8 | ConvertFrom-Json
    Write-Host "      OK: Dummy data loaded" -ForegroundColor Green
  }
  else {
    Write-Host "      WARNING: Dummy data file not found: $dummyDataFile" -ForegroundColor Red
    Write-Host "      -> Using default data" -ForegroundColor Yellow
    $profileData = @{
      name      = "Your Name/Activity Name"
      bio       = "A page introducing your activities."
      avatarUrl = ($SITE_URL + "images/profile.jpg")
    }
  }

  # Load template file
  Write-Host "[2/4] Loading template file..." -ForegroundColor Yellow
  if (-not (Test-Path $templateFile)) {
    Write-Host "      ERROR: Template file not found: $templateFile" -ForegroundColor Red
    exit 1
  }
  $templateContent = Get-Content $templateFile -Raw -Encoding UTF8
  Write-Host "      OK: Template file loaded" -ForegroundColor Green

  # Prepare placeholder replacement values
  Write-Host "[3/4] Preparing placeholder values..." -ForegroundColor Yellow

  # Escape profile name
  $profileName = Escape-Html $profileData.name
  if ([string]::IsNullOrEmpty($profileName)) {
    $profileName = "Your Link Collection"
  }

  # Process profile bio
  $profileBioRaw = $profileData.bio
  if ([string]::IsNullOrEmpty($profileBioRaw)) {
    $profileBioRaw = "A page introducing your activities."
  }

  # Meta description (limit to 120 characters)
  $metaDescriptionText = $profileBioRaw -replace '\n', ' '
  $metaDescriptionText = $metaDescriptionText.Trim()
  if ($metaDescriptionText.Length -gt 120) {
    $metaDescriptionText = $metaDescriptionText.Substring(0, 120) + "..."
  }
  $metaDescriptionText = Escape-Html $metaDescriptionText

  # Profile Bio (HTML escape, then convert line breaks to <br>)
  $profileBioHtml = Escape-Html $profileBioRaw
  $profileBioHtml = $profileBioHtml -replace '\n', '<br>`n'

  # Avatar URL
  $profileAvatarUrl = if ($profileData.avatarUrl) {
    $profileData.avatarUrl
  }
  else {
    ($SITE_URL + "images/profile.jpg")
  }

  # OG image URL
  $ogImageUrl = if ($profileData.avatarUrl) {
    $profileData.avatarUrl
  }
  else {
    $OG_IMAGE_DEFAULT_URL
  }

  # Page title
  $pageTitleText = "$profileName | Link Collection"

  Write-Host "      OK: Placeholder values prepared" -ForegroundColor Green
  Write-Host ""
  Write-Host "      Settings:" -ForegroundColor Cyan
  Write-Host "        - Name: $profileName" -ForegroundColor Gray
  Write-Host "        - Description: $($metaDescriptionText.Substring(0, [Math]::Min(50, $metaDescriptionText.Length)))..." -ForegroundColor Gray
  Write-Host "        - URL: $SITE_URL" -ForegroundColor Gray
  Write-Host ""

  # Replace placeholders
  Write-Host "[4/4] Converting template..." -ForegroundColor Yellow

  $outputContent = $templateContent

  # Replacement map
  $replacements = @{
    "{{ PAGE_TITLE }}"         = $pageTitleText
    "{{ META_DESCRIPTION }}"   = $metaDescriptionText
    "{{ OG_TITLE }}"           = $pageTitleText
    "{{ OG_DESCRIPTION }}"     = $metaDescriptionText
    "{{ SITE_URL }}"           = $SITE_URL
    "{{ OG_IMAGE_URL }}"       = $ogImageUrl
    "{{ PROFILE_AVATAR_URL }}" = $profileAvatarUrl
    "{{ PROFILE_NAME }}"       = $profileName
    "{{ PROFILE_BIO_HTML }}"   = $profileBioHtml
  }

  # Replace each placeholder
  foreach ($placeholder in $replacements.Keys) {
    $value = $replacements[$placeholder]
    if ($null -eq $value) {
      $value = ""
    }
    $outputContent = $outputContent -replace [regex]::Escape($placeholder), $value
  }

  # Write to file
  [System.IO.File]::WriteAllText($outputFile, $outputContent, [System.Text.Encoding]::UTF8)

  Write-Host "      OK: HTML file generated" -ForegroundColor Green
  Write-Host ""
  Write-Host "==================================================" -ForegroundColor Green
  Write-Host "  SUCCESS!" -ForegroundColor Green
  Write-Host "==================================================" -ForegroundColor Green
  Write-Host ""
  Write-Host "Generated file: $outputFile" -ForegroundColor White
  Write-Host "Template used: $templateFile" -ForegroundColor Gray
  Write-Host "Data used: $dummyDataFile" -ForegroundColor Gray
  Write-Host ""
  Write-Host "To preview:" -ForegroundColor Cyan
  Write-Host "  1. Open index.html in Explorer" -ForegroundColor White
  Write-Host "  2. Or in PowerShell: Start-Process index.html" -ForegroundColor White
  Write-Host ""
}
catch {
  Write-Host ""
  Write-Host "==================================================" -ForegroundColor Red
  Write-Host "  ERROR OCCURRED" -ForegroundColor Red
  Write-Host "==================================================" -ForegroundColor Red
  Write-Host ""
  Write-Host "Error: $_" -ForegroundColor Red
  Write-Host ""
  Write-Host "Stack trace:" -ForegroundColor Yellow
  Write-Host $_.ScriptStackTrace -ForegroundColor Gray
  exit 1
}
