import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export async function GET(req, { params }) {
  await dbConnect();

  const { slug } = params;

  const category = await Category.findOne({ slug });
  if (!category) return new Response(JSON.stringify({ message: 'Category not found' }), { status: 404 });

  const products = await Product.find({ category: category.name });

  return new Response(JSON.stringify({ category, products }), { status: 200 });
}
