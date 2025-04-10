// app/admin/page.js
import { revalidatePath } from 'next/cache';

// Fetch all items
async function getItems() {
  const res = await fetch('http://localhost:4000/items');
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

// Server action for deleting an item
export async function deleteItem(formData) {
  'use server';
  const id = formData.get('id');
  await fetch(`http://localhost:4000/items/${id}`, {
    method: 'DELETE',
  });
  // On-demand revalidation
  revalidatePath('/admin');
  revalidatePath('/collection');
 
}

export default async function AdminPage() {
  const items = await getItems();

  return (
    <div>
      <h1>Admin - Manage Menu Items</h1>
      <a href="/admin/create">Create New</a>
      <table border="1" cellPadding="8" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dish Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.dishName}</td>
              <td>{item.price}</td>
              <td>{item.dish_description}</td>
              <td>
                <form action={deleteItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit">D</button>
                </form>
              </td>
              <td>
                <a href={`/admin/edit/${item.id}`}>E</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
