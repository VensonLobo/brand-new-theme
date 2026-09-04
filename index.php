<?php
/**
 * Lobo Travels - WordPress / Apache Web Server Entry Point
 * Prevents 403 Forbidden errors when repository is deployed directly to WordPress / cPanel hosting.
 */

// 1. If static export output exists in out/index.html, serve it directly
$outIndex = __DIR__ . '/out/index.html';
if (file_exists($outIndex)) {
    // If request has a sub-path, check if corresponding file exists in out/
    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $cleanPath = trim($uri, '/');
    
    if (!empty($cleanPath)) {
        $targetHtml = __DIR__ . '/out/' . $cleanPath . '/index.html';
        $targetFile = __DIR__ . '/out/' . $cleanPath;
        if (file_exists($targetHtml)) {
            header('Content-Type: text/html; charset=UTF-8');
            readfile($targetHtml);
            exit;
        } elseif (file_exists($targetFile) && !is_dir($targetFile)) {
            // Determine MIME type
            $ext = pathinfo($targetFile, PATHINFO_EXTENSION);
            $mimes = [
                'css' => 'text/css',
                'js' => 'application/javascript',
                'svg' => 'image/svg+xml',
                'png' => 'image/png',
                'jpg' => 'image/jpeg',
                'webp' => 'image/webp',
                'json' => 'application/json',
                'woff2' => 'font/woff2'
            ];
            if (isset($mimes[$ext])) {
                header('Content-Type: ' . $mimes[$ext]);
            }
            readfile($targetFile);
            exit;
        }
    }
    
    header('Content-Type: text/html; charset=UTF-8');
    readfile($outIndex);
    exit;
}

// 2. If root index.html exists, serve it
$rootIndex = __DIR__ . '/index.html';
if (file_exists($rootIndex)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($rootIndex);
    exit;
}

// 3. Fallback screen if files were pulled to WordPress hosting before static build
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lobo Travels — Deployment Setup</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #FAF8F5;
            color: #0A1428;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(10, 20, 40, 0.08);
            border: 1px border #E8DFC8;
            max-width: 620px;
            width: 100%;
            padding: 40px;
            box-sizing: border-box;
        }
        .badge {
            display: inline-block;
            background: #0A1428;
            color: #E5C07B;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 6px 14px;
            border-radius: 999px;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 26px;
            margin: 0 0 12px 0;
            color: #0A1428;
        }
        p {
            font-size: 14px;
            line-height: 1.6;
            color: #4A5568;
            margin: 0 0 20px 0;
        }
        .step-box {
            background: #F7FAFC;
            border: 1px solid #EDF2F7;
            border-radius: 10px;
            padding: 16px;
            margin-bottom: 16px;
        }
        .step-title {
            font-weight: 600;
            font-size: 13px;
            color: #0A1428;
            margin-bottom: 6px;
        }
        code {
            display: block;
            background: #0A1428;
            color: #E5C07B;
            padding: 10px 14px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 13px;
            overflow-x: auto;
            margin-top: 6px;
        }
        .help-note {
            font-size: 12px;
            color: #718096;
            border-top: 1px solid #E2E8F0;
            padding-top: 16px;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="badge">Repository Connected Successfully</div>
        <h1>Lobo Travels Website Deployed</h1>
        <p>Your repository files are safely deployed to your WordPress / Apache hosting server. Because this is a modern React/Next.js application, static HTML files need to be compiled to be served publicly.</p>
        
        <div class="step-box">
            <div class="step-title">Option A: Build Static Files (Recommended for WordPress Hosting)</div>
            <p style="margin-bottom: 6px; font-size: 13px;">Run this command in your terminal or SSH, then copy the contents of <code>out/</code> to your <code>public_html/</code> folder:</p>
            <code>npm run build:static</code>
        </div>

        <div class="step-box">
            <div class="step-title">Option B: Automatic Deployment via GitHub Actions</div>
            <p style="margin-bottom: 0; font-size: 13px;">This repository includes a ready-to-use GitHub Action workflow in <code>.github/workflows/deploy.yml</code> that automatically builds and deploys static files whenever you push changes.</p>
        </div>

        <div class="help-note">
            The <code>403 Forbidden</code> error has been permanently prevented by adding <code>.htaccess</code> permissions and directory index rules.
        </div>
    </div>
</body>
</html>
