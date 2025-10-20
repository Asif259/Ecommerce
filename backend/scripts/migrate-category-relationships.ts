/**
 * Migration Script: Update Products with Category Relationships
 *
 * This script updates existing products to use the new category relationship structure:
 * - Converts string category names to ObjectId references
 * - Populates the categoryName field for backward compatibility
 *
 * Run this script after updating the schema:
 * npx ts-node scripts/migrate-category-relationships.ts
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../src/products/product.schema';
import { Category, CategoryDocument } from '../src/categories/category.schema';

async function migrateCategories() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const productModel = app.get<Model<ProductDocument>>(
    getModelToken(Product.name),
  );
  const categoryModel = app.get<Model<CategoryDocument>>(
    getModelToken(Category.name),
  );

  try {
    console.log('🚀 Starting category migration...\n');

    // Get all products
    const products = await productModel.find().exec();
    console.log(`📦 Found ${products.length} products to migrate\n`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        // Check if already migrated (has ObjectId category)
        if (typeof product.category !== 'string') {
          console.log(`✅ Product "${product.name}" already migrated`);
          successCount++;
          continue;
        }

        const categoryName = product.category as unknown as string;

        // Find the category by name
        const category = await categoryModel
          .findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } })
          .exec();

        if (!category) {
          const errorMsg = `❌ Category "${categoryName}" not found for product "${product.name}"`;
          console.error(errorMsg);
          errors.push(errorMsg);
          errorCount++;
          continue;
        }

        // Update product with both category ObjectId and categoryName
        await productModel
          .findByIdAndUpdate(product._id, {
            category: category._id,
            categoryName: category.name,
          })
          .exec();

        console.log(
          `✅ Migrated product "${product.name}" → Category: ${category.name}`,
        );
        successCount++;
      } catch (error) {
        const errorMsg = `❌ Error migrating product "${product.name}": ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    if (errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      errors.forEach((err) => console.log(`   ${err}`));
    }

    console.log('\n✨ Migration completed!');
  } catch (error) {
    console.error('💥 Migration failed:', error);
  } finally {
    await app.close();
  }
}

// Run migration
migrateCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration error:', error);
    process.exit(1);
  });
