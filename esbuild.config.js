/* ============================================
   esbuild.config.js - Build Configuration
   ============================================
   
   Creates production build in dist/:
   - Bundles JS and CSS
   - Processes HTML with PWA tags
   - Copies assets
   - Adds service worker
   
   Run: node esbuild.config.js
   
   ============================================ */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// JS files in correct load order
const jsFiles = [
    'js/utils.js',
    'js/config.js',
    'js/utils/mobile-spotlight.js',
    'js/components/nav.js',
    'js/components/footer.js',
    'js/pods/project-card-v2.js',
    'js/pods/carousel.js',
    'js/pods/tool-card.js',
    'js/pods/term-card.js',
    'js/pods/submit-project-form.js',
    'js/pods/submit-idea-form.js',
    'js/pods/home-sections.js',
    'js/pages/home.js',
    'js/pages/projects.js',
    'js/pages/tools.js',
    'js/pages/dictionary.js',
    'js/pages/submit.js',
    'js/discord-webhooks.js',
    'js/supabase-client.js'
];

// CSS files in correct order
const cssFiles = [
    'css/_config.css',
    'css/_reset.css',
    'css/_typography.css',
    'css/_utilities.css',
    'css/layout/grid.css',
    'css/layout/nav.css',
    'css/layout/footer.css',
    'css/components/buttons.css',
    'css/components/cards.css',
    'css/components/carousel.css',
    'css/components/forms.css',
    'css/components/glow.css',
    'css/components/key-modal.css',
    'css/components/modal.css',
    'css/components/tags.css',
    'css/pods/hero.css',
    'css/pods/home-sections.css',
    'css/pods/project-card-v2.css',
    'css/pods/tool-card.css',
    'css/pods/term-card.css',
    'css/pods/submit-project-form.css',
    'css/pods/submit-idea-form.css',
    'css/pods/feature-card.css',
    'css/pages/projects-page.css',
    'css/utils/mobile-spotlight.css'
];

// HTML files to process
const htmlFiles = ['index.html', 'projects.html', 'tools.html', 'dictionary.html', 'submit.html'];

// Copy directory recursively
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Process HTML - replace CSS/JS with bundles
function processHtml(html) {
    // Find </head> and insert CSS bundle before it
    // Remove all existing <link rel="stylesheet" href="css/..."> tags
    html = html.replace(/<link rel="stylesheet" href="css\/[^"]+\.css">\s*/g, '');

    // Find </head> and add our bundle
    html = html.replace(
        '</head>',
        `    <!-- CSS Bundle -->
    <link rel="stylesheet" href="styles.min.css">
</head>`
    );

    // Remove all existing <script src="js/..."> tags
    html = html.replace(/<script src="js\/[^"]+\.js"><\/script>\s*/g, '');

    // Also remove any stray Mobile Spotlight comments
    html = html.replace(/\s*<!-- Mobile Spotlight -->\s*/g, '');

    // Find </body> and add our bundle + SW before it
    html = html.replace(
        '</body>',
        `    <!-- JS Bundle -->
    <script src="app.min.js"></script>

    <!-- Service Worker -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW error:', err));
            });
        }
    </script>
</body>`
    );

    // Add PWA tags after </title>
    if (!html.includes('rel="manifest"')) {
        html = html.replace(
            '</title>',
            `</title>

    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#8b5cf6">
    <meta name="mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" href="/assets/images/white-logo.svg">`
        );
    }

    return html;
}

async function build() {
    console.log('🔨 Building production...\n');

    // Clean and create dist folder
    if (fs.existsSync('dist')) {
        fs.rmSync('dist', { recursive: true });
    }
    fs.mkdirSync('dist');

    // === BUNDLE JS ===
    console.log('📦 Bundling JavaScript...');
    let jsContent = '';
    let jsCount = 0;
    for (const file of jsFiles) {
        if (fs.existsSync(file)) {
            jsContent += fs.readFileSync(file, 'utf8') + '\n';
            jsCount++;
        }
    }
    fs.writeFileSync('dist/_temp.js', jsContent);
    await esbuild.build({
        entryPoints: ['dist/_temp.js'],
        minify: true,
        outfile: 'dist/app.min.js',
        target: ['es2020']
    });
    fs.unlinkSync('dist/_temp.js');

    // === BUNDLE CSS ===
    console.log('🎨 Bundling CSS...');
    let cssContent = '';
    let cssCount = 0;
    for (const file of cssFiles) {
        if (fs.existsSync(file)) {
            cssContent += fs.readFileSync(file, 'utf8') + '\n';
            cssCount++;
        }
    }
    fs.writeFileSync('dist/_temp.css', cssContent);
    await esbuild.build({
        entryPoints: ['dist/_temp.css'],
        minify: true,
        outfile: 'dist/styles.min.css'
    });
    fs.unlinkSync('dist/_temp.css');

    // === PROCESS HTML FILES ===
    console.log('📄 Processing HTML files...');
    for (const htmlFile of htmlFiles) {
        if (fs.existsSync(htmlFile)) {
            let html = fs.readFileSync(htmlFile, 'utf8');
            html = processHtml(html);
            fs.writeFileSync(`dist/${htmlFile}`, html);
        }
    }

    // === COPY PWA FILES ===
    console.log('📱 Adding PWA files...');
    fs.copyFileSync('manifest.json', 'dist/manifest.json');
    fs.copyFileSync('sw.js', 'dist/sw.js');

    // === COPY ASSETS ===
    console.log('📁 Copying assets...');
    copyDir('assets', 'dist/assets');
    copyDir('data', 'dist/data');

    // === SUMMARY ===
    const jsSize = fs.statSync('dist/app.min.js').size;
    const cssSize = fs.statSync('dist/styles.min.css').size;

    console.log(`\n✅ Production build complete!\n`);
    console.log(`   Location: dist/`);
    console.log(`   JS:  ${jsCount} files → ${(jsSize / 1024).toFixed(2)} KB`);
    console.log(`   CSS: ${cssCount} files → ${(cssSize / 1024).toFixed(2)} KB`);
    console.log(`   Total: ${((jsSize + cssSize) / 1024).toFixed(2)} KB`);
    console.log(`   PWA: ✓ manifest.json, sw.js`);
    console.log(`\n   Deploy dist/ folder to Vercel! 🚀\n`);
}

build().catch(err => {
    console.error('Build failed:', err);
    process.exit(1);
});
