import Document from '../models/Document.js';
import Employee from '../models/Employee.js';
import Partner from '../models/Partner.js';
import Vehicle from '../models/Vehicle.js';
import BankAccount from '../models/BankAccount.js';
import Invoice from '../models/Invoice.js';

class SearchRepository {
  async globalSearch(companyId, query, limit = 5) {
    const regex = new RegExp(query, 'i');

    const [documents, employees, partners, vehicles, bankAccounts, invoices] = await Promise.all([
      Document.find({
        companyId,
        $or: [{ title: regex }, { originalName: regex }, { category: regex }]
      })
        .limit(limit)
        .select('_id title category originalName mimeType')
        .lean(),

      Employee.find({
        companyId,
        $or: [{ fullName: regex }, { email: regex }, { department: regex }, { designation: regex }]
      })
        .limit(limit)
        .select('_id fullName email department designation employmentStatus')
        .lean(),

      Partner.find({
        companyId,
        $or: [{ partnerName: regex }, { email: regex }, { role: regex }]
      })
        .limit(limit)
        .select('_id partnerName email ownershipPercentage role partnerStatus')
        .lean(),

      Vehicle.find({
        companyId,
        $or: [{ plateNumber: regex }, { make: regex }, { model: regex }, { assignedDriver: regex }]
      })
        .limit(limit)
        .select('_id plateNumber make model year vehicleStatus')
        .lean(),

      BankAccount.find({
        companyId,
        $or: [{ bankName: regex }, { accountTitle: regex }, { accountNumber: regex }, { iban: regex }]
      })
        .limit(limit)
        .select('_id bankName accountTitle accountNumber iban currency isPrimary')
        .lean(),

      Invoice.find({
        companyId,
        $or: [{ invoiceNumber: regex }, { clientName: regex }]
      })
        .limit(limit)
        .select('_id invoiceNumber clientName totalAmount currency invoiceStatus invoiceType')
        .lean()
    ]);

    return {
      documents,
      employees,
      partners,
      vehicles,
      bankAccounts,
      invoices
    };
  }
}

export default new SearchRepository();
