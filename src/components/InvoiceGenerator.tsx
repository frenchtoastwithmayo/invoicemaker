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
  serviceAddress: string;
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
    serviceAddress: '',
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
          <CardContent className="p-6 print:p-4">
            {/* Compact header with business info and invoice details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4 print:mb-3">
              {/* Business Info - Compact */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50 print:hidden">
                    {businessInfo.logo ? (
                      <img src={businessInfo.logo} alt="Logo" className="w-full h-full object-contain rounded" />
                    ) : (
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 print:hidden">
                    <Label htmlFor="logo" className="cursor-pointer">
                      <span className="text-xs font-medium">Logo</span>
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
                    <div className="hidden print:block w-16 h-16">
                      <img src={businessInfo.logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="print:hidden">
                    <Input
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      placeholder="Business Name"
                      className="text-sm font-medium h-8"
                    />
                  </div>
                  <div className="print:block hidden">
                    <h2 className="text-lg font-bold text-foreground">{businessInfo.name || 'Business Name'}</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <div className="print:hidden">
                      <Input
                        type="email"
                        value={businessInfo.email}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                        placeholder="Email"
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="print:block hidden">
                      <p className="text-xs text-muted-foreground">{businessInfo.email}</p>
                    </div>

                    <div className="print:hidden">
                      <Input
                        value={businessInfo.phone}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                        placeholder="Phone"
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="print:block hidden">
                      <p className="text-xs text-muted-foreground">{businessInfo.phone}</p>
                    </div>
                  </div>

                  <div className="print:hidden">
                    <Textarea
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      placeholder="Business Address"
                      rows={2}
                      className="text-xs resize-none"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{businessInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Customer & Service Info */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground print:text-xs">Bill To:</h3>
                  
                  <div className="print:hidden">
                    <Input
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Customer Name"
                      className="text-sm h-8"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-sm font-medium text-foreground">{customerInfo.name || 'Customer Name'}</p>
                  </div>

                  <div className="print:hidden">
                    <Input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      placeholder="Customer Email"
                      className="text-xs h-7"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-xs text-muted-foreground">{customerInfo.email}</p>
                  </div>

                  <div className="print:hidden">
                    <Textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="Customer Address"
                      rows={2}
                      className="text-xs resize-none"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{customerInfo.address}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground print:text-xs">Service Address:</h3>
                  
                  <div className="print:hidden">
                    <Textarea
                      value={customerInfo.serviceAddress}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, serviceAddress: e.target.value })}
                      placeholder="Address where service was performed"
                      rows={2}
                      className="text-xs resize-none"
                    />
                  </div>
                  <div className="print:block hidden">
                    <p className="text-xs text-muted-foreground whitespace-pre-line">{customerInfo.serviceAddress || 'Same as billing address'}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Details - Compact */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground print:text-xs">Invoice Details:</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <div className="print:hidden">
                      <Label htmlFor="invoiceNumber" className="text-xs">Invoice #</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoiceDetails.invoiceNumber}
                        onChange={(e) => setInvoiceDetails({ ...invoiceDetails, invoiceNumber: e.target.value })}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="print:block hidden">
                      <p className="text-xs font-medium text-muted-foreground">Invoice #</p>
                      <p className="text-sm font-semibold">{invoiceDetails.invoiceNumber}</p>
                    </div>
                  </div>

                  <div>
                    <div className="print:hidden">
                      <Label htmlFor="invoiceDate" className="text-xs">Date</Label>
                      <Input
                        id="invoiceDate"
                        type="date"
                        value={invoiceDetails.date}
                        onChange={(e) => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="print:block hidden">
                      <p className="text-xs font-medium text-muted-foreground">Date</p>
                      <p className="text-sm font-semibold">{new Date(invoiceDetails.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <div className="print:hidden">
                      <Label htmlFor="dueDate" className="text-xs">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={invoiceDetails.dueDate}
                        onChange={(e) => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="print:block hidden">
                      <p className="text-xs font-medium text-muted-foreground">Due Date</p>
                      <p className="text-sm font-semibold">{new Date(invoiceDetails.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <div className="print:hidden">
                      <Label htmlFor="taxRate" className="text-xs">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        step="0.1"
                        value={invoiceDetails.taxRate}
                        onChange={(e) => setInvoiceDetails({ ...invoiceDetails, taxRate: parseFloat(e.target.value) || 0 })}
                        className="text-xs h-7"
                      />
                    </div>
                    <div className="print:block hidden">
                      <p className="text-xs font-medium text-muted-foreground">Tax Rate</p>
                      <p className="text-sm font-semibold">{invoiceDetails.taxRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items - Compact */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground print:text-xs">Items & Services</h3>
                <Button 
                  onClick={addLineItem} 
                  variant="outline" 
                  size="sm"
                  className="print:hidden text-xs h-7"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2 font-medium text-xs">Description</th>
                      <th className="text-right p-2 font-medium text-xs w-16">Qty</th>
                      <th className="text-right p-2 font-medium text-xs w-24">Unit Price</th>
                      <th className="text-right p-2 font-medium text-xs w-24">Total</th>
                      <th className="w-10 print:hidden"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, index) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="p-2">
                          <div className="print:hidden">
                            <Input
                              value={item.description}
                              onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                              placeholder="Service or product description"
                              className="border-0 p-0 focus-visible:ring-0 text-xs h-6"
                            />
                          </div>
                          <div className="print:block hidden">
                            <p className="text-xs">{item.description || `Item ${index + 1}`}</p>
                          </div>
                        </td>
                        <td className="p-2 text-right">
                          <div className="print:hidden">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="border-0 p-0 text-right focus-visible:ring-0 text-xs h-6"
                              min="0"
                            />
                          </div>
                          <div className="print:block hidden">
                            <p className="text-xs">{item.quantity}</p>
                          </div>
                        </td>
                        <td className="p-2 text-right">
                          <div className="print:hidden">
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="border-0 p-0 text-right focus-visible:ring-0 text-xs h-6"
                              step="0.01"
                              min="0"
                            />
                          </div>
                          <div className="print:block hidden">
                            <p className="text-xs">${item.unitPrice.toFixed(2)}</p>
                          </div>
                        </td>
                        <td className="p-2 text-right">
                          <p className="text-xs font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                        </td>
                        <td className="p-2 print:hidden">
                          {lineItems.length > 1 && (
                            <Button
                              onClick={() => removeLineItem(item.id)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compact Notes and Totals Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="print:hidden">
                  <Label htmlFor="notes" className="text-xs">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes or terms..."
                    rows={3}
                    className="text-xs resize-none"
                  />
                </div>
                <div className="print:block hidden">
                  {notes && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Notes:</p>
                      <p className="text-xs whitespace-pre-line">{notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Card className="bg-muted/50 print:bg-transparent print:border-0">
                  <CardContent className="p-3 print:p-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Subtotal:</span>
                        <span className="text-xs">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Tax ({invoiceDetails.taxRate}%):</span>
                        <span className="text-xs">${calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-foreground">Total:</span>
                          <span className="text-sm font-bold text-primary">${calculateTotal().toFixed(2)}</span>
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