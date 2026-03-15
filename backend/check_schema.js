const supabase = require('./src/lib/supabaseClient');

async function checkSchema() {
  console.log('Checking scans table schema...');
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error.message);
  } else if (data && data.length > 0) {
    console.log('Columns found:', Object.keys(data[0]));
  } else {
    // If table is empty, we can't get columns this way easily without the 'rpc' or 'postgres' access
    console.log('Table is empty. Trying to get columns via a failing query...');
    const { error: err2 } = await supabase
      .from('scans')
      .select('non_existent_column');
    console.log('Error hint:', err2.message);
  }
  process.exit();
}

checkSchema();
