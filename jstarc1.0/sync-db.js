const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jgmwqjepeyjgjsmlkaej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbXdxamVwZXlqZ2pzbWxrYWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzUyNTMsImV4cCI6MjA4Nzk1MTI1M30.0vA--9Kgk7sG4753-AXuA9Iq3Kc8Q-3cudkt3Pi3HzY';
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'jstarc-photos';

// Helper to get public URL
const getPublicUrl = (path) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

async function syncData() {
    console.log('Starting data synchronization from Storage to Database...');

    // 1. Sync Masters
    console.log('\n--- Syncing Masters ---');
    const { data: mkFiles, error: errM } = await supabase.storage.from(BUCKET).list('masters', { limit: 100 });
    if (mkFiles && mkFiles.length > 0) {
        for (const file of mkFiles) {
            if (!file.name || file.name === '.emptyFolderPlaceholder') continue;

            const name = file.name.split('.')[0] || 'Unknown';
            const url = getPublicUrl(`masters/${file.name}`);

            const { error: insertErr } = await supabase.from('masters').insert([{
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                name: name.replace(/_/g, ' ').toUpperCase(),
                src: url,
                designation: 'Master / Instructor',
                rank: 'Instructor',
                facePos: '50% 10%'
            }]);

            if (!insertErr || insertErr.code === '23505') { // Ignore duplicate keys
                console.log(`Successfully processed Master: ${name}`);
            } else {
                console.error(`Error inserting master ${name}:`, insertErr.message);
            }
        }
    } else {
        console.log('No files found in masters folder or error:', errM?.message);
    }

    // 2. Sync Blackbelts
    console.log('\n--- Syncing Blackbelts ---');
    const { data: bbFiles, error: errB } = await supabase.storage.from(BUCKET).list('blackbelts', { limit: 100 });
    if (bbFiles && bbFiles.length > 0) {
        for (const file of bbFiles) {
            if (!file.name || file.name === '.emptyFolderPlaceholder') continue;

            const name = file.name.split('.')[0] || 'Unknown';
            const url = getPublicUrl(`blackbelts/${file.name}`);

            const { error: insertErr } = await supabase.from('blackbelts').insert([{
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
                name: name.replace(/_/g, ' ').toUpperCase(),
                img: url,
                rank: 'Black Belt',
                desc: 'Team Member',
                facePos: '50% 15%'
            }]);

            if (!insertErr || insertErr.code === '23505') {
                console.log(`Successfully processed Blackbelt: ${name}`);
            } else {
                console.error(`Error inserting blackbelt ${name}:`, insertErr.message);
            }
        }
    } else {
        console.log('No files found in blackbelts folder or error:', errB?.message);
    }

    // 3. Sync Gallery
    console.log('\n--- Syncing Gallery ---');
    const { data: galFiles, error: errG } = await supabase.storage.from(BUCKET).list('gallery', { limit: 100 });
    if (galFiles && galFiles.length > 0) {
        for (const file of galFiles) {
            if (!file.name || file.name === '.emptyFolderPlaceholder') continue;

            const url = getPublicUrl(`gallery/${file.name}`);
            const { error: insertErr } = await supabase.from('gallery').insert([{
                filename: file.name,
                url: url
            }]);

            if (!insertErr || insertErr.code === '23505') {
                console.log(`Successfully processed Gallery image: ${file.name}`);
            } else {
                console.error(`Error inserting gallery image ${file.name}:`, insertErr.message);
            }
        }
    } else {
        console.log('No files found in gallery folder or error:', errG?.message);
    }

    // 4. Sync Events
    console.log('\n--- Syncing Events ---');
    const { data: evFolders, error: errE } = await supabase.storage.from(BUCKET).list('events', { limit: 100 });
    if (evFolders && evFolders.length > 0) {
        for (const folder of evFolders) {
            // Supabase storage list might return files instead of folders if there are top level files
            if (!folder.name || folder.name === '.emptyFolderPlaceholder') continue;

            const folderName = folder.name;
            // Check if it's a file by looking for extension, if it has no extension it's likely a folder
            if (folderName.includes('.')) continue;

            const title = folderName.replace(/_/g, ' ').toUpperCase();

            let eventId;
            const { data: evRecord, error: insertErr } = await supabase.from('events').insert([{
                title: title,
                folder: folderName,
                category: 'Gallery'
            }]).select();

            if (!insertErr && evRecord) {
                eventId = evRecord[0].id;
                console.log(`Created Event: ${title}`);
            } else if (insertErr && insertErr.code === '23505') { // Unique constraint on folder
                const { data: extEvent } = await supabase.from('events').select('id').eq('folder', folderName).single();
                eventId = extEvent?.id;
            } else {
                console.error(`Error creating Event ${title}:`, insertErr?.message);
                continue;
            }

            if (eventId) {
                // Sync photos for this event
                const { data: pFiles } = await supabase.storage.from(BUCKET).list(`events/${folderName}`, { limit: 100 });
                if (pFiles && pFiles.length > 0) {
                    for (const pFile of pFiles) {
                        if (!pFile.name || pFile.name === '.emptyFolderPlaceholder') continue;

                        const url = getPublicUrl(`events/${folderName}/${pFile.name}`);
                        await supabase.from('event_photos').insert([{
                            event_id: eventId,
                            folder: folderName,
                            filename: pFile.name,
                            url: url
                        }]);
                        console.log(`  Included photo ${pFile.name}`);
                    }
                }
            }
        }
    } else {
        console.log('No files found in events folder or error:', errE?.message);
    }

    console.log('\nSync Complete! You can now view the website.');
}

syncData();
