// app/collection/page.js
import Link from 'next/link';

// Fetch all items from JSON Server
async function getItems() {
  const res = await fetch('http://localhost:4000/collection');
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export default async function CollectionPage() {
  const items = await getItems();

  return (
    <div>
      <h1>Menu Items</h1>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: '1rem' }}>
          <p>{item.dishName}</p>
          {/* "more" link */}
          <Link href={`/collection/${item.id}`}>more</Link>
        </div>
      ))}
    </div>
  );
}
