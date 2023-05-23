import { db } from '@loaders/database.loader';
import { Category } from '@models/category.model';

export const CategoryRepository = db.getRepository(Category);
export default CategoryRepository;
