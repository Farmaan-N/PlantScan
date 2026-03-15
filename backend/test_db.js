const supabase = require('./src/lib/supabaseClient');

async function testInsert() {
  console.log('Testing Supabase insert with new columns...');
  
  const testData = {
    user_id: 'd9b7a4b1-e022-4757-984b-132b821dc7b6', // Dummy UUID
    plant_name: 'Test Plant',
    scientific_name: 'Testus plantus',
    indian_english_name: 'Indian Test Plant',
    hindi_name: 'परीक्षण',
    tamil_name: 'சோதனை',
    confidence: 100,
    description: 'Testing if columns exist',
    medicinal_uses: 'None',
    key_benefits: ['Test'],
    side_effects: 'None',
    restrictions: 'None',
    habitat: 'Digital',
    growing_regions: 'The Cloud'
  };

  const { data, error } = await supabase
    .from('scans')
    .insert([testData])
    .select();

  if (error) {
    console.error('❌ Insert failed:', error.message);
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('💡 CONFIRMED: One or more columns are missing in the database table.');
    }
  } else {
    console.log('✅ Insert successful! Columns exist.');
    console.log('Data:', data);
    // Cleanup
    await supabase.from('scans').delete().eq('id', data[0].id);
  }
  process.exit();
}

testInsert();
