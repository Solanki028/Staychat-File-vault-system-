import Document from '../models/Document.js';

class DocumentRepository {
  async findByCompany(companyId, { category, search, isFavorite, page = 1, limit = 10 }) {
    const filter = { companyId };
    if (category && category !== 'All') filter.category = category;
    if (isFavorite) filter.isFavorite = true;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      Document.find(filter)
        .populate('uploadedBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      Document.countDocuments(filter)
    ]);

    return {
      documents,
      total,
      pages: Math.ceil(total / limit),
      page: Number(page),
      limit: Number(limit)
    };
  }

  async findById(id) {
    return await Document.findById(id).populate('uploadedBy', 'fullName email').exec();
  }

  async create(docData) {
    return await Document.create(docData);
  }

  async update(id, updateData) {
    return await Document.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
  }

  async softDelete(id, userId) {
    const doc = await Document.findById(id);
    if (!doc) return null;
    return await doc.softDelete(userId);
  }

  async countByCompany(companyId) {
    return await Document.countDocuments({ companyId });
  }

  async toggleFavorite(id) {
    const doc = await Document.findById(id);
    if (!doc) return null;
    doc.isFavorite = !doc.isFavorite;
    return await doc.save();
  }
}

export default new DocumentRepository();
