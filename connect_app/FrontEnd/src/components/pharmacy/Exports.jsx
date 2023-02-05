import React, { useState, useEffect } from 'react'
import { ExportExcel } from '../features/ExportExcel'
const ExportPurchaseEntry = (props) => {
    const [ExportPurchaseEntry, setExportPurchaseEntry] = useState([])
    const [ExportPurchaseEntry2, setExportPurchaseEntry2] = useState([])
    const fileName = props.fromdate + '-' + props.todate +'Purchase Entry'
    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }

    }
    function TotalTaxPercent(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    async function MakePurchaseEntryExport() {
        if (props.purchaseentryarr.length !== 0) {
            const vendors = await props.purchaseentryarr.map(data => (

                {
                    "PE ID": "PE-" + data.bill_id,
                    "PO ID": data.purchase_order_id != null ? data.purchase_order_id : '',
                    'Channel': data.channel == 1 ? 'Pharmacy' : 'Consumables',
                    'Invoice No.': data.invoice_no != null ? data.invoice_no : '',
                    'Bill Date': data.bill_date != null ? data.bill_date : '',
                    'Bill Total': data.bill_total != null ? data.bill_total : '',
                    'Vendor': data.distributor.entity_name && data.distributor.entity_name != null ? data.distributor.entity_name : ''

                }
            ))
            var obj = []
            for (let i = 0; i < props.purchaseentryarr.length; i++) {
                var vendorsitems = props.purchaseentryarr[i].medicines.map(Data => ({
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': Data.purchase_entry.distributor.entity_name,
                    'GSTIN': Data.purchase_entry.distributor.GSTIN_no,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.medicine && Data.medicine.name && Data.medicine.name != null ? Data.medicine.name : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Trade Disc.': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST %': Data.CGST,
                    'CGST Rs': Data.CGST_rate,
                    'SGST %': Data.SGST,
                    'SGST Rs': Data.SGST_rate,
                    'IGST %': Data.IGST,
                    'IGST Rs': Data.IGST_rate,
                    'Total Tax %': TotalTaxPercent(Data.CGST, Data.SGST, Data.IGST),
                    'Total Tax Rs': TotalTaxPercent(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }
            var obj2 = obj.flat()

            setExportPurchaseEntry(vendors)
            setExportPurchaseEntry2(obj2)
            console.log(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakePurchaseEntryExport()
        }
        func()
    }, [props.purchaseentryarr])
    console.log(props.purchaseentryarr)
    // console.log(ExportPurchaseEntry, ExportPurchaseEntry2)
    return (
        <ExportExcel apiData={ExportPurchaseEntry2} fileName={fileName} />
    )
}

export { ExportPurchaseEntry }