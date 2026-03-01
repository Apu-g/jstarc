const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jgmwqjepeyjgjsmlkaej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbXdxamVwZXlqZ2pzbWxrYWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzUyNTMsImV4cCI6MjA4Nzk1MTI1M30.0vA--9Kgk7sG4753-AXuA9Iq3Kc8Q-3cudkt3Pi3HzY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('\nTesting Masters Table...');
    const { data: masters, error: e1 } = await supabase.from('masters').select('*');
    console.log('Masters Data:', masters, 'Error:', e1 ? e1.message : null);

    console.log('\nTesting Gallery Table...');
    const { data: gallery, error: e2 } = await supabase.from('gallery').select('*');
    console.log('Gallery Data:', gallery, 'Error:', e2 ? e2.message : null);
}

testConnection();
