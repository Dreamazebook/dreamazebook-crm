'use client';

import { FC } from 'react';
import { OrderDetail, AddressInfo } from '@/types/order';

interface OrderLogisticsProps {
  order: OrderDetail;
}

const OrderLogistics: FC<OrderLogisticsProps> = ({ order }) => {
  const logistics = order.logistics_data;

  if (!logistics) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500 text-center">No logistics data available</p>
        </div>
      </div>
    );
  }

  const renderAddressInfo = (title: string, address: AddressInfo) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Name</p>
          <p className="text-sm font-medium text-gray-900">{address.first_name} {address.last_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Phone</p>
          <p className="text-sm font-medium text-gray-900">{address.phone}</p>
        </div>
        {address.email && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">{address.email}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600 mb-1">Country</p>
          <p className="text-sm font-medium text-gray-900">{address.country}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">State/Province</p>
          <p className="text-sm font-medium text-gray-900">{address.state}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">City</p>
          <p className="text-sm font-medium text-gray-900">{address.city}</p>
        </div>
        {address.district && (
          <div>
            <p className="text-sm text-gray-600 mb-1">District</p>
            <p className="text-sm font-medium text-gray-900">{address.district}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-600 mb-1">Post Code</p>
          <p className="text-sm font-medium text-gray-900">{address.post_code}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-600 mb-1">Street Address</p>
          <p className="text-sm font-medium text-gray-900">{address.street}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Logistics Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Logistics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Reference Number</p>
            <p className="text-sm font-medium text-gray-900">{logistics.ref_no}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">4PX Tracking No</p>
            <p className="text-sm font-medium text-gray-900 font-mono">{logistics["4px_tracking_no"]}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Label Barcode</p>
            <p className="text-sm font-medium text-gray-900 font-mono">{logistics.label_barcode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">DS Consignment No</p>
            <p className="text-sm font-medium text-gray-900 font-mono">{logistics.ds_consignment_no}</p>
          </div>
        </div>
      </div>

      {/* Logistics Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Logistics Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Business Type</p>
            <p className="text-sm font-medium text-gray-900">{logistics.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Duty Type</p>
            <p className="text-sm font-medium text-gray-900">{logistics.duty_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Insured</p>
            <p className="text-sm font-medium text-gray-900">{logistics.is_insure === 'Y' ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Logistics Product Code</p>
            <p className="text-sm font-medium text-gray-900">{logistics.logistics_service_info.logistics_product_code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Delivery Type</p>
            <p className="text-sm font-medium text-gray-900">{logistics.deliver_type_info.deliver_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Deliver to Recipient</p>
            <p className="text-sm font-medium text-gray-900">{logistics.deliver_to_recipient_info.deliver_type}</p>
          </div>
        </div>
      </div>

      {/* Sender & Recipient */}
      {renderAddressInfo('Sender Information', logistics.sender)}
      {renderAddressInfo('Recipient Information', logistics.recipient_info)}

      {/* Return Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Domestic Return Available</p>
            <p className="text-sm font-medium text-gray-900">{logistics.return_info.is_return_on_domestic === 'Y' ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Overseas Return Available</p>
            <p className="text-sm font-medium text-gray-900">{logistics.return_info.is_return_on_oversea === 'Y' ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Parcel Details */}
      {logistics.parcel_list.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Parcel Details</h3>
          {logistics.parcel_list.map((parcel, parcelIndex) => (
            <div key={parcelIndex} className="mb-8 last:mb-0">
              {logistics.parcel_list.length > 1 && (
                <h4 className="text-base font-medium text-gray-900 mb-4">Parcel {parcelIndex + 1}</h4>
              )}
              
              {/* Parcel Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Weight</p>
                  <p className="text-sm font-medium text-gray-900">{parcel.weight} g</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Currency</p>
                  <p className="text-sm font-medium text-gray-900">{parcel.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Parcel Value</p>
                  <p className="text-sm font-medium text-gray-900">{parcel.currency} {parcel.parcel_value.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Include Battery</p>
                  <p className="text-sm font-medium text-gray-900">{parcel.include_battery === 'Y' ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Products */}
              {parcel.product_list.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Products</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-gray-600">SKU Code</th>
                          <th className="text-left py-2 px-3 text-gray-600">Product Name</th>
                          <th className="text-left py-2 px-3 text-gray-600">Qty</th>
                          <th className="text-left py-2 px-3 text-gray-600">Unit Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parcel.product_list.map((product, prodIndex) => (
                          <tr key={prodIndex} className="border-b border-gray-100">
                            <td className="py-2 px-3 text-gray-900 font-mono text-xs">{product.sku_code}</td>
                            <td className="py-2 px-3 text-gray-900">{product.product_name}</td>
                            <td className="py-2 px-3 text-gray-900">{product.qty}</td>
                            <td className="py-2 px-3 text-gray-900">{product.currency} {product.product_unit_price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Declare Product Info */}
              {parcel.declare_product_info.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-4">Declaration Information</h5>
                  {parcel.declare_product_info.map((declareInfo, declareIndex) => (
                    <div key={declareIndex} className="bg-gray-50 rounded p-4 mb-4 last:mb-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Product Name (CN)</p>
                          <p className="text-sm font-medium text-gray-900">{declareInfo.declare_product_name_cn}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Product Name (EN)</p>
                          <p className="text-sm font-medium text-gray-900">{declareInfo.declare_product_name_en}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Unit Price (Export)</p>
                          <p className="text-sm font-medium text-gray-900">USD {declareInfo.declare_unit_price_export.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Unit Price (Import)</p>
                          <p className="text-sm font-medium text-gray-900">USD {declareInfo.declare_unit_price_import.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Unit</p>
                          <p className="text-sm font-medium text-gray-900">{declareInfo.unit_declare_product}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Quantity</p>
                          <p className="text-sm font-medium text-gray-900">{declareInfo.declare_product_code_qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Print PDF */}
      {logistics.print_pdf && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Label</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Status</p>
              <p className="text-sm font-medium text-gray-900">{logistics.print_pdf.status}</p>
            </div>
            {logistics.print_pdf.completed_at && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Completed At</p>
                <p className="text-sm font-medium text-gray-900">{new Date(logistics.print_pdf.completed_at).toLocaleString()}</p>
              </div>
            )}
            {logistics.print_pdf.files.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-3">Files</p>
                <div className="space-y-2">
                  {logistics.print_pdf.files.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderLogistics;
