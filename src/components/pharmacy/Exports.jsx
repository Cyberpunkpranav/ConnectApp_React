import React, { useState, useEffect } from 'react'
import { ExportExcel } from '../features/ExportExcel'

const ExportPurchaseEntry = (props) => {
    const [ExportPurchaseEntry, setExportPurchaseEntry] = useState([])
    const fileName = props.fromdate + '-' + props.todate + 'Purchase Entry'
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

            var obj = []
            for (let i = 0; i < props.purchaseentryarr.length; i++) {
                var vendorsitems = props.purchaseentryarr[i].medicines.map(Data => ({
                    'Type': 'Medicine',
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
                    'Total Tax Rs': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }
            var obj2 = obj.flat()

            var objvaccine = []
            for (let i = 0; i < props.purchaseentryarr.length; i++) {
                var vendorsitems = props.purchaseentryarr[i].vaccines.map(Data => ({
                    'Type': 'Vaccine',
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
                    'Total Tax Rs': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }
            var objj = objvaccine.flat()
            var TotalExport = []
            TotalExport.push(obj2)
            TotalExport.push(objj)
            TotalExport = TotalExport.flat()
            setExportPurchaseEntry(TotalExport)
        }
    }
    useEffect(() => {
        async function func() {
            await MakePurchaseEntryExport()
        }
        func()
    }, [props.purchaseentryarr])
    // console.log(props.purchaseentryarr)
    return (
        <>
            <ExportExcel apiData={ExportPurchaseEntry} fileName={fileName} />
        </>
    )
}

export { ExportPurchaseEntry }

const ExportPurchaseReturn = (props) => {
    const [ReturnEntry, setReturnEntry] = useState([])
    const fileName = props.fromdate + '-' + props.todate + 'Purchase Return'
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
    async function MakePurchaseReturnExport() {
        if (props.purchasereturnarr.length !== 0) {

            var obj = []
            for (let i = 0; i < props.purchasereturnarr.length; i++) {
                let distributor = props.purchasereturnarr[i].distributor.entity_name
                let GST = props.purchasereturnarr[i].distributor.GSTIN_no
                console.log()
                var vendorsitems = props.purchasereturnarr[i].purchase_medicines.map(Data => ({
                    'Type': 'Medicine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': distributor,
                    'GSTIN': GST,
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
                    'Total Tax Rs': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }
            var obj2 = obj.flat()

            var objvaccine = []
            for (let i = 0; i < props.purchasereturnarr.length; i++) {
                let distributor = props.purchasereturnarr[i].distributor.entity_name
                let GST = props.purchasereturnarr[i].distributor.GSTIN_no
                var vendorsitems = props.purchasereturnarr[i].purchase_vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': distributor,
                    'GSTIN':GST,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
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
                    'Total Tax Rs': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }
            var objj = objvaccine.flat()
            var TotalExport = []
            TotalExport.push(obj2)
            TotalExport.push(objj)
            TotalExport = TotalExport.flat()
            setReturnEntry(TotalExport)
        }
    }
    useEffect(() => {
        async function func() {
            await MakePurchaseReturnExport()
        }
        func()
    }, [props.purchasereturnarr])
    console.log(props.purchasereturnarr)
    return (
        <>
            <ExportExcel apiData={ReturnEntry} fileName={fileName} />
        </>
    )
}

export { ExportPurchaseReturn }

const ExportSaleEntry = (props) => {

}
export { ExportSaleEntry }
const ExportSaleReturn = (props) => {

}
export { ExportSaleReturn }