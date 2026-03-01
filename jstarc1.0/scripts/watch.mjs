import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const BLACKBELTS_DIR = path.join(rootDir, 'public', 'assets', 'jstarc_blackbelts');
const MASTERS_DIR = path.join(rootDir, 'public', 'assets', 'masters');
const MARQUEE_DIR = path.join(rootDir, 'public', 'marquee-photos');

const BLACKBELTS_DATA = path.join(rootDir, 'data', 'blackbelts', 'index.js');
const MASTERS_DATA = path.join(rootDir, 'data', 'masters', 'index.js');
const MARQUEE_MANIFEST = path.join(rootDir, 'data', 'marquee.json');

const LOG_FILE = path.join(rootDir, 'logs', 'audit.jsonl');
const REFRESH_TRIGGER = path.join(rootDir, 'scripts', 'refresh.trigger');

const supportedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Ensure log directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// Ensure refresh trigger exists
if (!fs.existsSync(REFRESH_TRIGGER)) {
    try {
        fs.writeFileSync(REFRESH_TRIGGER, '');
    } catch (e) {
        console.error("Could not create refresh trigger file", e);
    }
}

function logAudit(action, file, type, status, details = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        action,
        file,
        type,
        status,
        ...details
    };
    try {
        fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
    } catch (e) {
        console.error("Failed to write audit log", e);
    }
}

function watchFolder(dir, type) {
    if (!fs.existsSync(dir)) {
        if (type === 'marquee') {
             try {
                 fs.mkdirSync(dir, { recursive: true });
                 console.log(`Created directory: ${dir}`);
             } catch (e) { 
                 console.error(`Failed to create ${dir}`, e);
                 return; 
             }
        } else {
             console.error(`Directory not found: ${dir}`);
             return;
        }
    }
    console.log(`Watching ${dir} for ${type}...`);
    let debounceTimer;
    
    fs.watch(dir, (eventType, filename) => {
        if (!filename) return;
        // For marquee, we rebuild manifest on any change
        if (type === 'marquee') {
             clearTimeout(debounceTimer);
             debounceTimer = setTimeout(() => {
                 buildMarqueeManifest();
             }, 500);
             return;
        }

        const ext = path.extname(filename).toLowerCase();
        if (!supportedExts.includes(ext)) return;

        // Debounce to avoid multiple triggers
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            try {
                const filePath = path.join(dir, filename);
                if (fs.existsSync(filePath)) {
                    processFile(filename, dir, type);
                } else {
                    processDeletion(filename, dir, type);
                }
            } catch (err) {
                console.error(`Error processing ${filename}:`, err);
                logAudit('process', filename, type, 'failed', { error: err.message });
            }
        }, 500);
    });
}

function buildMarqueeManifest() {
    try {
        if (!fs.existsSync(MARQUEE_DIR)) {
            fs.mkdirSync(MARQUEE_DIR, { recursive: true });
        }
        const files = fs.readdirSync(MARQUEE_DIR)
            .filter(f => supportedExts.includes(path.extname(f).toLowerCase()))
            .map(f => {
                const fp = path.join(MARQUEE_DIR, f);
                const stats = fs.statSync(fp);
                return {
                    src: `/marquee-photos/${f}`,
                    size: stats.size,
                    mtime: stats.mtimeMs,
                    name: f
                };
            })
            .sort((a, b) => b.mtime - a.mtime);

        fs.writeFileSync(MARQUEE_MANIFEST, JSON.stringify({ updatedAt: Date.now(), files }, null, 2));
        console.log(`Marquee Manifest updated: ${files.length} images`);
        logAudit('build', 'manifest', 'marquee', 'success', { count: files.length });
    } catch (e) {
        console.error("Error building marquee manifest", e);
        logAudit('build', 'manifest', 'marquee', 'failed', { error: e.message });
    }
}

function findObjectBounds(content, searchIndex) {
    // 1. Find the opening brace backwards
    let openBrace = -1;
    let braceCount = 0;
    // Walk backwards from searchIndex
    for (let i = searchIndex; i >= 0; i--) {
        if (content[i] === '}') braceCount++;
        else if (content[i] === '{') {
            if (braceCount > 0) braceCount--;
            else {
                openBrace = i;
                break;
            }
        }
    }

    if (openBrace === -1) return null;

    // 2. Find the matching closing brace forwards from openBrace
    let closeBrace = -1;
    let balance = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = openBrace; i < content.length; i++) {
        const char = content[i];
        
        if (inString) {
            if (char === stringChar && content[i-1] !== '\\') {
                inString = false;
            }
            continue;
        }
        
        if (char === '"' || char === "'" || char === '`') {
            inString = true;
            stringChar = char;
            continue;
        }
        
        if (char === '{') {
            balance++;
        } else if (char === '}') {
            balance--;
            if (balance === 0) {
                closeBrace = i;
                break;
            }
        }
    }
    
    return (closeBrace !== -1) ? { start: openBrace, end: closeBrace } : null;
}

function processDeletion(filename, dir, type) {
    console.log(`Detected deletion: ${filename}`);
    const dataFile = type === 'blackbelt' ? BLACKBELTS_DATA : MASTERS_DATA;
    if (!fs.existsSync(dataFile)) return;

    let content = fs.readFileSync(dataFile, 'utf-8');
    
    const relPath = type === 'blackbelt' 
        ? `/assets/jstarc_blackbelts/${filename}`
        : `/assets/masters/${filename}`;
    
    const imgIndex = content.indexOf(relPath);
    if (imgIndex === -1) {
        console.log(`Entry for ${filename} not found in data.`);
        return;
    }
    
    const bounds = findObjectBounds(content, imgIndex);
    
    if (bounds) {
        const { start, end } = bounds;
        let removeEnd = end + 1;
        
        // Consume trailing comma and whitespace
        while (removeEnd < content.length) {
            const char = content[removeEnd];
            if (char === ',') {
                removeEnd++;
                break; // Found the comma, stop consuming
            }
            if (!/\s/.test(char)) {
                break; // Found non-whitespace, stop
            }
            removeEnd++;
        }
        
        const newContent = content.slice(0, start).trimEnd() + content.slice(removeEnd);
        fs.writeFileSync(dataFile, newContent);
        console.log(`Removed entry for ${filename} from ${dataFile}`);
        logAudit('delete', filename, type, 'success');
    } else {
        console.error(`Could not find object bounds for ${filename}`);
        logAudit('delete', filename, type, 'failed', { reason: 'Bounds not found' });
    }
}

function processFile(filename, dir, type) {
    const filePath = path.join(dir, filename);
    if (!fs.existsSync(filePath)) return; 

    const stats = fs.statSync(filePath);
    const meta = {
        size: stats.size,
        modified: stats.mtime.toISOString()
    };

    const id = path.parse(filename).name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const name = path.parse(filename).name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()); 

    const dataFile = type === 'blackbelt' ? BLACKBELTS_DATA : MASTERS_DATA;
    
    if (!fs.existsSync(dataFile)) {
        console.error(`Data file not found: ${dataFile}`);
        return;
    }

    let content = fs.readFileSync(dataFile, 'utf-8');
    
    const relPath = type === 'blackbelt' 
        ? `/assets/jstarc_blackbelts/${filename}`
        : `/assets/masters/${filename}`;
    const escapedPath = relPath.replace(/\./g, '\\.');
    const pathRegex = new RegExp(`(img|src):\\s*["']${escapedPath}["']`);
    
    if (pathRegex.test(content)) {
        return;
    }

    console.log(`Adding new ${type}: ${name}`);

    let entry = '';

    if (type === 'blackbelt') {
        entry = `
    {
        id: "${id}",
        name: "${name}",
        rank: "Black Belt",
        desc: "Black Belt",
        img: "${relPath}",
        facePos: "50% 15%",
        achievements: [],
        bio: "Automatically detected. Please update bio.",
        meta: ${JSON.stringify(meta)}
    },`;
    } else {
        entry = `
    {
        id: "${id}",
        name: "Master ${name}",
        designation: "Instructor",
        rank: "Instructor",
        src: "${relPath}",
        img: "${relPath}",
        facePos: "50% 15%",
        quote: "Dedication defines us.",
        bio: "Automatically detected. Please update bio.",
        achievements: [],
        meta: ${JSON.stringify(meta)}
    },`;
    }

    const lastBracketIndex = content.lastIndexOf('];');
    if (lastBracketIndex !== -1) {
        let prefix = '';
        let i = lastBracketIndex - 1;
        while (i >= 0 && /\s/.test(content[i])) i--;
        
        // If the character before insertion isn't a comma and isn't the start of the array, add a comma
        if (i >= 0 && content[i] !== ',' && content[i] !== '[') {
            prefix = ',';
        }

        const newContent = content.slice(0, lastBracketIndex) + prefix + entry + content.slice(lastBracketIndex);
        fs.writeFileSync(dataFile, newContent);
        console.log(`Updated ${dataFile}`);
        logAudit('add', filename, type, 'success', { meta });
    } else {
        console.error(`Could not find array end in ${dataFile}`);
        logAudit('add', filename, type, 'failed', { reason: 'Invalid data file structure' });
    }
}

function scan(dir, type) {
    if (!fs.existsSync(dir)) return;
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            if (supportedExts.includes(ext)) {
                processFile(file, dir, type);
            }
        });
    } catch (err) {
        console.error(`Error scanning ${dir}:`, err);
    }
}

// Manual refresh watcher
if (fs.existsSync(REFRESH_TRIGGER)) {
    fs.watch(REFRESH_TRIGGER, () => {
        console.log("Manual Refresh Triggered");
        scan(BLACKBELTS_DIR, 'blackbelt');
        scan(MASTERS_DIR, 'master');
        buildMarqueeManifest();
        logAudit('refresh', 'manual', 'all', 'success');
    });
}

// Start
console.log("Starting Image Watcher with Audit Logging...");
scan(BLACKBELTS_DIR, 'blackbelt');
scan(MASTERS_DIR, 'master');
buildMarqueeManifest();

watchFolder(BLACKBELTS_DIR, 'blackbelt');
watchFolder(MASTERS_DIR, 'master');
watchFolder(MARQUEE_DIR, 'marquee');
