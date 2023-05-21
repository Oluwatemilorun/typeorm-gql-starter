import { db } from '@loaders/database.loader';
import { Category } from '@models';

export const CategoryRepository = db.getRepository(Category);
export default CategoryRepository;
