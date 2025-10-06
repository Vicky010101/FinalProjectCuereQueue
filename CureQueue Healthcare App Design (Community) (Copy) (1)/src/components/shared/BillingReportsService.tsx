import React from 'react';

// Mock billing and reports data service for the chatbot
export interface BillingRecord {
  id: string;
  patientName: string;
  service: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  insuranceProvider?: string;
}

export interface Report {
  id: string;
  type: 'lab' | 'imaging' | 'pathology';
  testName: string;
  status: 'completed' | 'in-progress' | 'pending';
  orderedDate: string;
  completedDate?: string;
  doctorName: string;
  patientName: string;
  priority: 'normal' | 'urgent' | 'stat';
}

// Mock data
export const mockBillingRecords: BillingRecord[] = [
  {
    id: 'BILL001',
    patientName: 'Sarah Johnson',
    service: 'Cardiology Consultation',
    amount: 250,
    status: 'paid',
    date: '2024-01-10',
    insuranceProvider: 'Blue Cross'
  },
  {
    id: 'BILL002',
    patientName: 'Sarah Johnson',
    service: 'Blood Test Panel',
    amount: 120,
    status: 'pending',
    date: '2024-01-15'
  },
  {
    id: 'BILL003',
    patientName: 'Sarah Johnson',
    service: 'X-Ray Chest',
    amount: 85,
    status: 'overdue',
    date: '2024-01-05'
  }
];

export const mockReports: Report[] = [
  {
    id: 'LAB001',
    type: 'lab',
    testName: 'Complete Blood Count',
    status: 'completed',
    orderedDate: '2024-01-15',
    completedDate: '2024-01-16',
    doctorName: 'Dr. Emily Johnson',
    patientName: 'Sarah Johnson',
    priority: 'normal'
  },
  {
    id: 'IMG001',
    type: 'imaging',
    testName: 'Chest X-Ray',
    status: 'completed',
    orderedDate: '2024-01-14',
    completedDate: '2024-01-14',
    doctorName: 'Dr. Michael Chen',
    patientName: 'Sarah Johnson',
    priority: 'normal'
  },
  {
    id: 'LAB002',
    type: 'lab',
    testName: 'Lipid Profile',
    status: 'in-progress',
    orderedDate: '2024-01-16',
    doctorName: 'Dr. Sarah Williams',
    patientName: 'Sarah Johnson',
    priority: 'normal'
  },
  {
    id: 'IMG002',
    type: 'imaging',
    testName: 'MRI Brain',
    status: 'pending',
    orderedDate: '2024-01-16',
    doctorName: 'Dr. Robert Davis',
    patientName: 'Sarah Johnson',
    priority: 'urgent'
  }
];

// Service functions that the chatbot can use
export const BillingReportsService = {
  getBillingRecords: (patientName?: string): BillingRecord[] => {
    if (patientName) {
      return mockBillingRecords.filter(record => 
        record.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }
    return mockBillingRecords;
  },

  getReports: (patientName?: string, type?: string): Report[] => {
    let filteredReports = mockReports;
    
    if (patientName) {
      filteredReports = filteredReports.filter(report => 
        report.patientName.toLowerCase().includes(patientName.toLowerCase())
      );
    }
    
    if (type) {
      filteredReports = filteredReports.filter(report => 
        report.type === type.toLowerCase()
      );
    }
    
    return filteredReports;
  },

  getTotalOutstanding: (patientName?: string): number => {
    const records = this.getBillingRecords(patientName);
    return records
      .filter(record => record.status !== 'paid')
      .reduce((total, record) => total + record.amount, 0);
  },

  getPendingReports: (patientName?: string): Report[] => {
    return this.getReports(patientName).filter(report => 
      report.status === 'pending' || report.status === 'in-progress'
    );
  },

  formatBillingResponse: (records: BillingRecord[]): string => {
    if (records.length === 0) {
      return "No billing records found.";
    }

    let response = `📋 **Your Billing Summary:**\n\n`;
    
    const paid = records.filter(r => r.status === 'paid');
    const pending = records.filter(r => r.status === 'pending');
    const overdue = records.filter(r => r.status === 'overdue');
    
    if (paid.length > 0) {
      response += `✅ **Paid Bills (${paid.length}):**\n`;
      paid.forEach(record => {
        response += `• ${record.service} - $${record.amount} (${record.date})\n`;
      });
      response += '\n';
    }
    
    if (pending.length > 0) {
      response += `⏳ **Pending Bills (${pending.length}):**\n`;
      pending.forEach(record => {
        response += `• ${record.service} - $${record.amount} (Due: ${record.date})\n`;
      });
      response += '\n';
    }
    
    if (overdue.length > 0) {
      response += `⚠️ **Overdue Bills (${overdue.length}):**\n`;
      overdue.forEach(record => {
        response += `• ${record.service} - $${record.amount} (Overdue since: ${record.date})\n`;
      });
      response += '\n';
    }
    
    const totalOutstanding = records
      .filter(r => r.status !== 'paid')
      .reduce((total, record) => total + record.amount, 0);
    
    if (totalOutstanding > 0) {
      response += `💰 **Total Outstanding:** $${totalOutstanding}\n\n`;
      response += `💡 **Payment Options:**\n`;
      response += `• Pay online through patient portal\n`;
      response += `• Visit billing counter (Ground Floor)\n`;
      response += `• Call (555) 123-BILL\n`;
      response += `• Payment plans available`;
    }

    return response;
  },

  formatReportResponse: (reports: Report[]): string => {
    if (reports.length === 0) {
      return "No reports found.";
    }

    let response = `🔬 **Your Test Reports:**\n\n`;
    
    const completed = reports.filter(r => r.status === 'completed');
    const inProgress = reports.filter(r => r.status === 'in-progress');
    const pending = reports.filter(r => r.status === 'pending');
    
    if (completed.length > 0) {
      response += `✅ **Completed Reports (${completed.length}):**\n`;
      completed.forEach(report => {
        const icon = report.type === 'lab' ? '🧪' : report.type === 'imaging' ? '🏥' : '🔬';
        response += `${icon} ${report.testName}\n`;
        response += `   📅 Completed: ${report.completedDate}\n`;
        response += `   👨‍⚕️ Ordered by: ${report.doctorName}\n`;
        response += `   📋 Status: Ready for pickup/view\n\n`;
      });
    }
    
    if (inProgress.length > 0) {
      response += `⏳ **In Progress (${inProgress.length}):**\n`;
      inProgress.forEach(report => {
        const icon = report.type === 'lab' ? '🧪' : report.type === 'imaging' ? '🏥' : '🔬';
        response += `${icon} ${report.testName}\n`;
        response += `   📅 Ordered: ${report.orderedDate}\n`;
        response += `   👨‍⚕️ Doctor: ${report.doctorName}\n`;
        response += `   ⏱️ Expected: ${report.type === 'lab' ? '24-48 hours' : '2-4 hours'}\n\n`;
      });
    }
    
    if (pending.length > 0) {
      response += `📋 **Pending Tests (${pending.length}):**\n`;
      pending.forEach(report => {
        const icon = report.type === 'lab' ? '🧪' : report.type === 'imaging' ? '🏥' : '🔬';
        const urgencyIcon = report.priority === 'urgent' ? '🔴' : report.priority === 'stat' ? '⚡' : '🟢';
        response += `${icon} ${report.testName} ${urgencyIcon}\n`;
        response += `   📅 Ordered: ${report.orderedDate}\n`;
        response += `   👨‍⚕️ Doctor: ${report.doctorName}\n`;
        response += `   📍 Please visit ${report.type === 'lab' ? 'Laboratory' : 'Radiology'} department\n\n`;
      });
    }
    
    response += `📱 **How to Access Reports:**\n`;
    response += `• Online: Patient portal app\n`;
    response += `• SMS notifications when ready\n`;
    response += `• Pickup: Ground floor reception\n`;
    response += `• Email delivery available`;

    return response;
  }
};