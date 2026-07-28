import partnerService from '../services/PartnerService.js';

class PartnerController {
  async getCompanyPartners(req, res, next) {
    try {
      const result = await partnerService.getCompanyPartners(
        req.params.companyId,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        data: result.partners,
        meta: {
          totalOwnershipPercentage: result.totalOwnershipPercentage,
          availablePercentage: result.availablePercentage
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPartnerById(req, res, next) {
    try {
      const partner = await partnerService.getPartnerById(req.params.partnerId);
      return res.status(200).json({
        success: true,
        data: partner
      });
    } catch (error) {
      next(error);
    }
  }

  async createPartner(req, res, next) {
    try {
      const partner = await partnerService.createPartner(req.body, req.user.id);
      return res.status(201).json({
        success: true,
        message: 'Partner record created successfully.',
        data: partner
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePartner(req, res, next) {
    try {
      const updated = await partnerService.updatePartner(req.params.partnerId, req.body, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Partner record updated successfully.',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePartner(req, res, next) {
    try {
      await partnerService.deletePartner(req.params.partnerId, req.user.id);
      return res.status(200).json({
        success: true,
        message: 'Partner record soft-deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PartnerController();
