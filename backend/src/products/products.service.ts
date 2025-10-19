import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validate that category exists in categories database
    const category = await this.categoriesService.findByName(
      createProductDto.category,
    );

    if (!category) {
      throw new BadRequestException(
        `Category "${createProductDto.category}" does not exist. Please create the category first in the categories management.`,
      );
    }

    if (!category.isActive) {
      throw new BadRequestException(
        `Category "${createProductDto.category}" is not active. Please activate it first.`,
      );
    }

    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(query: ProductQueryDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      isActive,
    } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    console.log('Products query params:', { page, limit, skip, filter });

    const products = await this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await this.productModel.countDocuments(filter);

    console.log('Products found:', products.length, 'Total:', total);

    return {
      products,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Validate category if it's being updated
    if (updateProductDto.category) {
      const category = await this.categoriesService.findByName(
        updateProductDto.category,
      );

      if (!category) {
        throw new BadRequestException(
          `Category "${updateProductDto.category}" does not exist. Please create the category first in the categories management.`,
        );
      }

      if (!category.isActive) {
        throw new BadRequestException(
          `Category "${updateProductDto.category}" is not active. Please activate it first.`,
        );
      }
    }

    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    product.stock -= quantity;
    return product.save();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.productModel
      .find({
        category: { $regex: new RegExp(`^${category}$`, 'i') },
        isActive: true,
      })
      .exec();
  }

  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    return this.productModel
      .find({ isActive: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit)
      .exec();
  }

  // Category hero image mapping
  private readonly categoryHeroImages: Record<string, string> = {
    furniture:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=600&fit=crop',
    bedroom:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&h=600&fit=crop',
    lighting:
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1200&h=600&fit=crop',
    kitchen:
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=1200&h=600&fit=crop',
    bathroom:
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop',
    'wall decor':
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&h=600&fit=crop',
    'wall art':
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&h=600&fit=crop',
    rugs: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&h=600&fit=crop',
    pillows:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&h=600&fit=crop',
    cushions:
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1200&h=600&fit=crop',
    mirrors:
      'https://images.unsplash.com/photo-1618220924273-338d82d6b886?w=1200&h=600&fit=crop',
    candles:
      'https://images.unsplash.com/photo-1602874801007-5e6e4af7f1e1?w=1200&h=600&fit=crop',
    vases:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&h=600&fit=crop',
    flowers:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=600&fit=crop',
    plants:
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1200&h=600&fit=crop',
    clocks:
      'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=1200&h=600&fit=crop',
    accessories:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=600&fit=crop',
    textiles:
      'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=1200&h=600&fit=crop',
    decor:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=600&fit=crop',
    living:
      'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&h=600&fit=crop',
    dining:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop',
    office:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop',
    outdoor:
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1200&h=600&fit=crop',
    art: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=600&fit=crop',
  };

  async getCategories(): Promise<
    {
      category: string;
      count: number;
      heroImage: string;
      description: string;
    }[]
  > {
    const categories = await this.productModel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: { $toLower: '$category' },
          count: { $sum: 1 },
          originalCategory: { $min: '$category' }, // Use $min for deterministic result
        },
      },
      {
        $project: {
          category: '$originalCategory',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { count: -1 } }, // Sort by count descending
    ]);

    // Add hero images to categories - fetch from database first, then fallback to hardcoded
    const categoryWithImages = await Promise.all(
      categories.map(async (cat) => {
        // Try to find category in database
        const dbCategory = await this.categoriesService.findByName(
          cat.category,
        );

        if (dbCategory && dbCategory.heroImage) {
          return {
            ...cat,
            heroImage: dbCategory.heroImage,
            description: dbCategory.description || '',
          };
        }

        // Fallback to hardcoded images
        const normalizedCategory = cat.category.toLowerCase();
        let heroImage =
          this.categoryHeroImages[normalizedCategory] ||
          this.categoryHeroImages[
            Object.keys(this.categoryHeroImages).find((key) =>
              normalizedCategory.includes(key),
            ) || ''
          ] ||
          // Default fallback image
          'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&h=600&fit=crop';

        return {
          ...cat,
          heroImage,
          description: '',
        };
      }),
    );

    return categoryWithImages;
  }
}
