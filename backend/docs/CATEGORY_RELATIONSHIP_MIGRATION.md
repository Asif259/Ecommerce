# Category Relationship Migration

## Overview

This document explains the improved category-product relationship structure and how to migrate existing data.

## What Changed?

### Before (String-based)

```typescript
@Prop({ required: true })
category: string;  // e.g., "Wall Decor"
```

### After (Relationship-based with Denormalization)

```typescript
@Prop({ type: Types.ObjectId, ref: 'Category', required: true })
category: Types.ObjectId;  // Reference to Category document

@Prop()
categoryName: string;  // Denormalized for fast queries
```

## Benefits

### 1. **Data Integrity**

- Enforces referential integrity between products and categories
- Prevents orphaned products with invalid category names
- Catches typos and inconsistencies at creation time

### 2. **Better Performance**

- Virtual populate for product counts on categories
- Efficient aggregation queries
- No need to fetch all products to count by category

### 3. **Flexibility**

- Easy to update category names across all products
- Can add more category metadata without affecting products
- Supports future features like category hierarchies

### 4. **Backward Compatibility**

- `categoryName` field ensures existing queries still work
- Frontend doesn't need immediate changes
- Gradual migration path

## New Features

### Virtual Product Count

Categories now automatically include product counts:

```typescript
// Schema definition
CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

// Usage in service
async findAll(): Promise<Category[]> {
  return this.categoryModel
    .find({ isActive: true })
    .populate('productCount')  // Automatically counts products
    .exec();
}
```

### API Response Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Wall Decor",
  "heroImage": "https://...",
  "description": "Beautiful wall decorations",
  "productCount": 42, // Virtual field
  "isActive": true
}
```

## Migration Steps

### 1. **Backup Your Database**

```bash
mongodump --db=fenian-gadgets --out=./backup
```

### 2. **Update Dependencies** (if needed)

```bash
cd backend
npm install
```

### 3. **Run Migration Script**

```bash
npx ts-node scripts/migrate-category-relationships.ts
```

The script will:

- Find all existing products
- Look up category ObjectIds by name
- Update products with both `category` (ObjectId) and `categoryName` (string)
- Report success/failure for each product

### 4. **Verify Migration**

```bash
# Check a few products in MongoDB
mongosh fenian-gadgets
db.products.findOne({}, { category: 1, categoryName: 1 })
```

Expected output:

```javascript
{
  _id: ObjectId('...'),
  category: ObjectId('...'),  // Reference to Category
  categoryName: 'Wall Decor',  // Denormalized name
  // ... other fields
}
```

### 5. **Test the API**

```bash
# Start the server
npm run start:dev

# Test category filtering
curl http://localhost:3000/products?category=Wall%20Decor

# Test product count
curl http://localhost:3000/categories
```

## Frontend Impact

### No Immediate Changes Required ✅

The frontend can continue using category names as strings:

```typescript
// This still works!
const response = await getProducts({ category: 'Wall Decor' });
```

### Optional: Use Category IDs (Future Enhancement)

For better type safety, you can optionally update to use category IDs:

```typescript
interface Product {
  _id: string;
  name: string;
  category: string; // Category ObjectId
  categoryName: string; // Display name
  // ...
}

// Filter by ID (more efficient)
const response = await getProducts({
  categoryId: '507f1f77bcf86cd799439011',
});
```

## Rollback Plan

If issues occur, rollback is straightforward:

### 1. **Restore Database Backup**

```bash
mongorestore --db=fenian-gadgets ./backup/fenian-gadgets
```

### 2. **Revert Code Changes**

```bash
git checkout HEAD^ -- backend/src/products/product.schema.ts
git checkout HEAD^ -- backend/src/categories/category.schema.ts
git checkout HEAD^ -- backend/src/products/products.service.ts
git checkout HEAD^ -- backend/src/categories/categories.service.ts
```

### 3. **Restart Server**

```bash
npm run start:dev
```

## Troubleshooting

### Error: "Category not found for product"

**Cause**: Product has a category name that doesn't exist in the categories table.

**Solution**:

1. Create the missing category in the admin panel
2. Re-run the migration script
3. Or manually update the product with a valid category

### Error: "Property '\_id' does not exist on type 'Category'"

**Cause**: TypeScript type definitions don't include Mongoose document \_id.

**Solution**: Already fixed with `(category as any)._id` type casting.

### Products not showing in category filter

**Cause**: Migration didn't complete successfully.

**Solution**:

1. Check migration logs
2. Manually update affected products
3. Re-run migration script

## Best Practices

### Creating New Products

Always use category names (the service handles ObjectId conversion):

```typescript
await productsService.create({
  name: 'Beautiful Mirror',
  category: 'Wall Decor', // Use name, not ObjectId
  // ... other fields
});
```

### Updating Categories

When renaming a category, update all related products:

```typescript
// 1. Update category name
await categoriesService.update(categoryId, { name: 'New Name' });

// 2. Update all products (handled automatically in update hook)
// OR run a batch update:
await productModel.updateMany(
  { category: categoryId },
  { categoryName: 'New Name' },
);
```

### Querying Products by Category

Use category names for backward compatibility:

```typescript
// By name (fast due to indexed categoryName)
const products = await productsService.findAll({
  category: 'Wall Decor',
});

// By ID (if needed in future)
const products = await productsService.findByCategoryId(categoryId);
```

## Performance Notes

- **Category Name Index**: Added index on `categoryName` for fast filtering
- **Virtual Populate**: Product counts use MongoDB aggregation (efficient)
- **Denormalization**: `categoryName` eliminates need for joins in most queries

## Future Enhancements

1. **Category Hierarchies**: Parent-child category relationships
2. **Multi-Category Products**: Products can belong to multiple categories
3. **Category Analytics**: Track views, sales by category
4. **Dynamic Category Filters**: Frontend dropdowns populated from backend

## Summary

✅ **Benefits**: Better data integrity, performance, and flexibility  
✅ **Migration**: Automated script handles existing data  
✅ **Backward Compatible**: Frontend works without changes  
✅ **Rollback**: Simple backup/restore process

The new relationship structure provides a solid foundation for future features while maintaining current functionality!
