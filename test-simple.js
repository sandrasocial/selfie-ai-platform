async function testSimple() {
  const response = await fetch('http://localhost:3000/api/test-env');
  const data = await response.json();
  console.log('Environment check:', data);
}

testSimple(); 