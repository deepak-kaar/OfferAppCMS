import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { app } from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { Category } from '../../../shared/interface/category';
import { CreatedBy } from '../../../shared/interface/vendor';
import {
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../dto/category.dto';

@Injectable()
export class CategoryService {
    #db: FirebaseFirestore.Firestore;
    #collection: FirebaseFirestore.CollectionReference;

    constructor(@Inject('FIREBASE_APP') private firebaseApp: app.App) {
        this.#db = firebaseApp.firestore();
        this.#collection = this.#db.collection('categories');
    }

    /**
     * Create a new category
     *
     * If icon or image files are provided, they will be uploaded to
     * GCS bucket `offerapp-bucket` and the resulting public URLs
     * will be stored in the respective fields.
     */
    async create(
        createCategoryDto: CreateCategoryDto,
        createdBy: CreatedBy,
        iconFile?: any,
        imageFile?: any,
    ): Promise<Category> {
        try {
            const now = new Date().toISOString();

            let iconUrl = createCategoryDto.icon || '';
            let imageUrl = createCategoryDto.image || '';

            // Upload icon if provided
            if (iconFile) {
                iconUrl = await this.uploadFileToGcs(iconFile, 'categories/icons');
            }

            // Upload image if provided
            if (imageFile) {
                imageUrl = await this.uploadFileToGcs(imageFile, 'categories/images');
            }

            const categoryData = {
                name: createCategoryDto.name,
                name_ar: createCategoryDto.name_ar || '',
                icon: iconUrl,
                image: imageUrl,
                order: createCategoryDto.order ?? 0,
                isActive: true, // Always set to true by default, ignoring payload value
                createdBy,
                updatedBy: createdBy,
                createdAt: { $date: now },
                updatedAt: { $date: now },
                __v: 0,
            };

            const docRef = await this.#collection.add(categoryData);
            const doc = await docRef.get();

            return {
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Category, '_id'>,
            };
        } catch (error) {
            throw new BadRequestException(`Failed to create category: ${error.message}`);
        }
    }

    /**
     * Get all categories
     */
    async findAll(): Promise<Category[]> {
        try {
            const snapshot = await this.#collection.get();
            const categories = snapshot.docs.map(doc => ({
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Category, '_id'>,
            }));

            // Sort by order
            return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
        } catch (error) {
            throw new BadRequestException(`Failed to fetch categories: ${error.message}`);
        }
    }

    /**
     * Get a single category by ID
     */
    async findOne(id: string): Promise<Category> {
        try {
            const doc = await this.#collection.doc(id).get();

            if (!doc.exists) {
                throw new NotFoundException(`Category with ID ${id} not found`);
            }

            return {
                _id: { $oid: doc.id },
                ...doc.data() as Omit<Category, '_id'>,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException(`Failed to fetch category: ${error.message}`);
        }
    }

    /**
     * Upload file to Google Cloud Storage and return URL.
     *
     * Note: Bucket is using uniform bucket-level access, so we do NOT
     * modify object ACLs here (no makePublic). Access is controlled
     * entirely via bucket-level IAM.
     */
    private async uploadFileToGcs(file: any, folderPath: string): Promise<string> {
        try {
            const storage = getStorage(this.firebaseApp as any);
            const bucket = storage.bucket('offerapp-bucket');

            const timestamp = Date.now();
            const safeOriginalName = (file.originalname || 'file').replace(/\s+/g, '_');
            const fileName = `${folderPath}/${timestamp}-${safeOriginalName}`;
            const fileUpload = bucket.file(fileName);

            // If file buffer is available (memory storage)
            if (file.buffer) {
                await fileUpload.save(file.buffer, {
                    contentType: file.mimetype,
                    metadata: {
                        cacheControl: 'public,max-age=31536000',
                    },
                });
            } else {
                // Fallback: create a stream from the file
                await new Promise<void>((resolve, reject) => {
                    const stream = fileUpload.createWriteStream({
                        metadata: {
                            contentType: file.mimetype,
                            cacheControl: 'public,max-age=31536000',
                        },
                    });

                    stream.on('error', (err) => reject(err));
                    stream.on('finish', () => resolve());

                    if (file.stream) {
                        file.stream.pipe(stream);
                    } else {
                        stream.end(file.buffer);
                    }
                });
            }

            // Just return the object URL; access is managed by bucket IAM
            return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        } catch (error) {
            throw new BadRequestException(`Failed to upload file to storage: ${error.message}`);
        }
    }
}
