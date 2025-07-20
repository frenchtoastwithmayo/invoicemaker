import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Upload, Download, Calculator } from 'lucide-react';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface BusinessInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
}

interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  taxRate: number;
}

const InvoiceGenerator = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    address: '',
  });

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: 8.5,
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ]);

  const [notes, setNotes] = useState('');

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceDetails.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBusinessInfo({ ...businessInfo, logo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted p-4 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto space-y-6 print:space-y-4">
        {/* Header */}
        <div className="print:hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Invoice Generator</h1>
              <p className="text-muted-foreground">Create professional invoices for your business</p>
            </div>
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Invoice Content */}
        <Card className="shadow-invoice-lg print:shadow-none print:border-0">
          <CardContent className="p-8 print:p-6">
            {/* Business & Customer Info Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:mb-6">
              {/* Business Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50 print:hidden">
                    {businessInfo.logo ? (
                      <img src={businessInfo.logo} alt="Logo" className="w-full h-full object-contain rounded" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 print:hidden">
                    <Label htmlFor="logo" className="cursor-pointer">
                      <span className="text-sm font-medium">Business Logo</span>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </Label>
                  </div>
                  {businessInfo.logo && (
                    <div className="hidden print:block w-20 h-20">
                      <img src={businessInfo.logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="print:hidden">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div className="print:block hidden">
                    <h2 className="text-xl font-bold text-foreground">{businessInfo.name || 'Your Business Name'}</h2>
                  </div>

                  <div className="print:hidden">
                    <Label htmlFor="businessEmail">Email</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      placeholder="business@example.com"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm text-muted-foreground">{businessInfo.email}</p>
                  </div>

                  <div className="print:hidden">
                    <Label htmlFor="businessPhone">Phone</Label>
                    <Input
                      id="businessPhone"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm text-muted-foreground">{businessInfo.phone}</p>
                  </div>

                  <div className="print:hidden">
                    <Label htmlFor="businessAddress">Address</Label>
                    <Textarea
                      id="businessAddress"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      placeholder="123 Business St, City, State 12345"
                      rows={3}
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{businessInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground print:text-base">Bill To:</h3>
                
                <div className="print:hidden">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Customer Name"
                  />
                </div>
                <div className="print:block hidden">
                  <p className="font-medium text-foreground">{customerInfo.name || 'Customer Name'}</p>
                </div>

                <div className="print:hidden">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>
                <div className="print:block hidden">
                  <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                </div>

                <div className="print:hidden">
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Textarea
                    id="customerAddress"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="456 Customer Ave, City, State 12345"
                    rows={3}
                  />
                </div>
                <div className="print:block hidden">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{customerInfo.address}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="border-t border-b border-border py-6 mb-6 print:py-4 print:mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="print:hidden">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceDetails.invoiceNumber}
                      onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceNumber: e.target.value })}
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm font-medium text-muted-foreground">Invoice #</p>
                    <p className="font-semibold">{invoiceDetails.invoiceNumber}</p>
                  </div>
                </div>

                <div>
                  <div className="print:hidden">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceDetails.date}
                      onChange={(e) => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date(invoiceDetails.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <div className="print:hidden">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceDetails.dueDate}
                      onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                    <p className="font-semibold">{new Date(invoiceDetails.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <div className="print:hidden">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={invoiceDetails.taxRate}
                      onChange={(e) => setInvoiceDetails({ ...invoiceDetails, taxRate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm font-medium text-muted-foreground">Tax Rate</p>
                    <p className="font-semibold">{invoiceDetails.taxRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground print:text-base">Items & Services</h3>
                <Button 
                  onClick={addLineItem} 
                  variant="outline" 
                  size="sm"
                  className="print:hidden"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Description</th>
                      <th className="text-right p-3 font-medium text-sm w-20">Qty</th>
                      <th className="text-right p-3 font-medium text-sm w-28">Unit Price</th>
                      <th className="text-right p-3 font-medium text-sm w-28">Total</th>
                      <th className="w-12 print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="p-3">
                          <div className="print:hidden">
                            <Input
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              placeholder="Service or product description"
                              className="border-0 p-0 focus-visible:ring-0"
                            />
                          </div>
                          <div className="print:block hidden">
                            <p className="text-sm">{item.description || `Item ${index + 1}`}</p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="print:hidden">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="border-0 p-0 text-right focus-visible:ring-0"
                              min="0"
                            />
                          </div>
                          <div className="print:block hidden">
                            <p className="text-sm">{item.quantity}</p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="print:hidden">
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="border-0 p-0 text-right focus-visible:ring-0"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <div className="print:block hidden">
                            <p className="text-sm">${item.unitPrice.toFixed(2)}</p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <p className="text-sm font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                        </td>
                        <td className="p-3 print:hidden">
                          {lineItems.length > 1 && (
                            <Button
                              onClick={() => removeLineItem(item.id)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="print:hidden">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or terms..."
                    rows={4}
                  />
                </div>
                <div className="print:block hidden">
                  {notes && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Notes:</p>
                      <p className="text-sm whitespace-pre-line">{notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-80">
                <Card className="bg-muted/50 print:bg-transparent print:border-0">
                  <CardContent className="p-4 print:p-0">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Subtotal:</span>
                        <span className="text-sm">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tax ({invoiceDetails.taxRate}%):</span>
                        <span className="text-sm">${calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-foreground">Total:</span>
                          <span className="text-lg font-bold text-primary">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default InvoiceGenerator;