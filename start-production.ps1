Write-Host "🚀 Starting Easy Park in Production Mode..." -ForegroundColor Green
$env:NODE_ENV = "production"
node backend/server.js
