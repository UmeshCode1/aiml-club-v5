# Update .env.local with new database and collection IDs

$envFile = ".env.local"

# Read current content
$content = Get-Content $envFile -Raw

# Replace old database ID with new one
$content = $content -replace 'NEXT_PUBLIC_APPWRITE_DATABASE_ID=692136c3001bf41a6dfa', 'NEXT_PUBLIC_APPWRITE_DATABASE_ID=6921f63d00163d9ef5da'

# Update collection IDs
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_EVENTS=\w+', 'NEXT_PUBLIC_COLLECTION_EVENTS=6921f63e00107d3c70de'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_TEAM=\w+', 'NEXT_PUBLIC_COLLECTION_TEAM=6921f644000a5ca88bd6'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_GALLERY=\w+', 'NEXT_PUBLIC_COLLECTION_GALLERY=6921f64a002ecb1f0796'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_HIGHLIGHTS=\w+', 'NEXT_PUBLIC_COLLECTION_HIGHLIGHTS=6921f65100123adc9056'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_SUGGESTIONS=\w+', 'NEXT_PUBLIC_COLLECTION_SUGGESTIONS=6921f655002653c815eb'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_SUBSCRIBERS=\w+', 'NEXT_PUBLIC_COLLECTION_SUBSCRIBERS=6921f659000370df28de'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_NOTIFICATIONS=\w+', 'NEXT_PUBLIC_COLLECTION_NOTIFICATIONS=6921f65b0018e11457e3'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_MESSAGES=\w+', 'NEXT_PUBLIC_COLLECTION_MESSAGES=6921f65e002e8565f4d5'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_ALBUMS=\w+', 'NEXT_PUBLIC_COLLECTION_ALBUMS=6921f64a002ecb1f0796'
$content = $content -replace 'NEXT_PUBLIC_COLLECTION_MEMBERS=\w+', 'NEXT_PUBLIC_COLLECTION_MEMBERS=6921f644000a5ca88bd6'

# Write back
$content | Set-Content $envFile -NoNewline

Write-Host "✅ .env.local updated successfully!" -ForegroundColor Green
