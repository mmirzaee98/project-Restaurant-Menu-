// app/collection/[id]/page.js
import Link from 'next/link';

/** Fetch a single item by ID */
async function getItem(id) {
  const res = await fetch(`http://localhost:4000/items/${id}`);
  if (!res.ok) return null;
  return res.json();
}

/**  up to the first 10 items is generated static pages*/
export async function generateStaticParams() {
  const res = await fetch('http://localhost:4000/items');
  const items = await res.json();
  return items.slice(0, 10).map((item) => ({
    id: item.id.toString(),
  }));
}

export default async function ItemDetail({ params }) {
  const { id } = params;
  const item = await getItem(id);

  if (!item) {
    return <div>No item with ID {id} exists.</div>;
  }

  return (
    <div>
      <Link href="/collection">Back</Link>
      <h1>Item Details</h1>
      <table border="1" cellPadding="8">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{item.id}</td>
          </tr>
          <tr>
            <th>Dish Name</th>
            <td>{item.dishName}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>{item.price}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>{item.dish_description}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
