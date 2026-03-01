const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jgmwqjepeyjgjsmlkaej.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbXdxamVwZXlqZ2pzbWxrYWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzUyNTMsImV4cCI6MjA4Nzk1MTI1M30.0vA--9Kgk7sG4753-AXuA9Iq3Kc8Q-3cudkt3Pi3HzY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('\nTesting Masters Image URL...');
    const { data: masters } = await supabase.from('masters').select('src').limit(1);
    console.log('Masters URL:', masters?.[0]?.src);

    console.log('\nTesting Blackbelts Image URL...');
    const { data: blackbelts } = await supabase.from('blackbelts').select('img').limit(1);
    console.log('Blackbelts URL:', blackbelts?.[0]?.img);

    console.log('\nTesting Gallery Image URL...');
    const { data: gallery } = await supabase.from('gallery').select('url').limit(1);
    console.log('Gallery URL:', gallery?.[0]?.url);
}

testConnection();
