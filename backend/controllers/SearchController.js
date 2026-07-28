import searchService from '../services/SearchService.js';

class SearchController {
  async searchWorkspace(req, res, next) {
    try {
      const { companyId, query } = req.query;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company workspace ID is required for search.'
        });
      }

      const results = await searchService.searchWorkspace(
        companyId,
        query || '',
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SearchController();
