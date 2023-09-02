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
    function TotalTax(cgst, sgst, igst, qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    var obj = []
    async function MakePurchaseEntryExport() {
        if (props.purchaseentryarr.length !== 0) {
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
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Qty': Data.qty,
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Trade Disc.': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax': TotalTax(Data.CGST, Data.SGST, Data.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost in Rs': Data.cost,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',

                }))
                obj.push(vendorsitems)
                var vendorsitems = props.purchaseentryarr[i].vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': Data.purchase_entry.distributor.entity_name,
                    'GSTIN': Data.purchase_entry.distributor.GSTIN_no,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccines && Data.vaccines.name && Data.vaccines.name != null ? Data.medicine.name : '',
                    'HSN Code': Data.vaccines && Data.vaccines.hsn_code !== null ? Data.vaccines.hsn_code : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Qty': Data.qty,
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Trade Disc.': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTax(Data.CGST, Data.SGST, Data.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',

                }))
                obj.push(vendorsitems)

            }

            var obj2 = obj.flat()
            setExportPurchaseEntry(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakePurchaseEntryExport()
        }
        func()
    }, [props.purchaseentryarr])
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
    function TotalTax(cgst, sgst, igst, qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    var obj = []
    async function MakePurchaseReturnExport() {
        if (props.purchasereturnarr.length !== 0) {
            for (let i = 0; i < props.purchasereturnarr.length; i++) {
                let distributor = props.purchasereturnarr[i].distributor.entity_name
                let GST = props.purchasereturnarr[i].distributor.GSTIN_no
                var vendorsitems = props.purchasereturnarr[i].purchase_medicines.map(Data => ({
                    'Type': 'Medicine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': distributor,
                    'GSTIN': GST,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.medicine && Data.medicine.name && Data.medicine.name != null ? Data.medicine.name : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Qty': Data.qty,
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Trade Disc.': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTax(Data.CGST, Data.SGST, Data.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',

                }))
                obj.push(vendorsitems)
                var vendorsitems = props.purchasereturnarr[i].purchase_vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': distributor,
                    'GSTIN': GST,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Qty': Data.qty,
                    'Discount %': Data.discount != null ? Data.discount : '',
                    'Trade Disc. %5': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTax(Data.CGST, Data.SGST, Data.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',

                }))
                obj.push(vendorsitems)
            }
            var obj2 = obj.flat()
            setReturnEntry(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakePurchaseReturnExport()
        }
        func()
    }, [props.purchasereturnarr])
    return (
        <>
            <ExportExcel apiData={ReturnEntry} fileName={fileName} />
        </>
    )
}
export { ExportPurchaseReturn }

const ExportSaleEntry = (props) => {
    const [SaleEntry, setSaleEntry] = useState([])
    const fileName = props.fromdate + '-' + props.todate + 'Sale Entry'

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
    function TotalTax(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {

            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    function taxableAmount(amt, cgst, sgst, igst) {
        if (amt) {
            amt = amt - (cgst + sgst + igst)
            return amt
        } else {
            return 0
        }

    }
    async function MakeSaleEntryExport() {
        if (props.saleentryarr.length !== 0) {

            var obj = []
            for (let i = 0; i < props.saleentryarr.length; i++) {
                let billid = props.saleentryarr[i].bill_id ? props.saleentryarr[i].bill_id : ''
                let billdate = props.saleentryarr[i].bill_date ? reversefunction(props.saleentryarr[i].bill_date) : ''
                let name = props.saleentryarr[i].patient.full_name !== null ? props.saleentryarr[i].patient.full_name : ''
                let doctor = props.saleentryarr[i].doctor_name !== null ? props.saleentryarr[i].doctor_name : ''

                var vendorsitems = props.saleentryarr[i].sale_medicines.map(Data => ({
                    'Type': 'Medicine',
                    'Bill ID': billid,
                    'Name': name,
                    'Doctor': doctor,
                    // 'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': billdate,
                    'Item ID': Data.medicine_stocks.id != null ? Data.medicine_stocks.id : '',
                    'Item Name': Data.medicine && Data.medicine.name && Data.medicine.name != null ? Data.medicine.name : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : '',
                    'Batch No.': Data.medicine_stocks.batch_no != null ? Data.medicine_stocks.batch_no : '',
                    'ExpiryDate': Data.medicine_stocks.expiry_date !== null ? reversefunction(Data.medicine_stocks.expiry_date) : '',
                    'Rate': Data.medicine_stocks.rate != null ? Data.medicine_stocks.rate : '',
                    'Cost': Data.medicine_stocks.cost != null ? Data.medicine_stocks.cost : '',
                    'MRP': Data.medicine_stocks.mrp != null ? Data.medicine_stocks.mrp : '',
                    'Qty': Data.qty,
                    'Disc. %': Data.discount != null ? Data.discount : '',
                    'Taxable Amt': taxableAmount(Number(Data.total_amount), Number(Data.CGST), Number(Data.SGST), Number(Data.IGST)),
                    'Total CGST': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'Total SGST': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'Total IGST': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax %': TotalTaxPercent(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total Tax ': TotalTax(Data.CGST, Data.SGST, Data.IGST) * Number(Data.qty),
                    'Amount': Data.total_amount !== null ? Data.total_amount : '',
                    'Grand Total': Data.total_amount ? Data.total_amount : '',

                }))
                obj.push(vendorsitems)
                var vendorsitems = props.saleentryarr[i].sale_vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'Bill ID': billid,
                    'Name': name,
                    'Doctor': doctor,
                    // 'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': billdate,
                    'Item ID': Data.vaccine_stocks.id != null ? Data.vaccine_stocks.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : '',
                    'Batch No.': Data.vaccine_stocks.batch_no != null ? Data.vaccine_stocks.batch_no : '',
                    'ExpiryDate': Data.vaccine_stocks.expiry_date !== null ? reversefunction(Data.vaccine_stocks.expiry_date) : '',
                    'Rate': Data.vaccine_stocks.rate != null ? Data.vaccine_stocks.rate : '',
                    'Cost': Data.vaccine_stocks.cost != null ? Data.vaccine_stocks.cost : '',
                    'MRP': Data.vaccine_stocks.mrp != null ? Data.vaccine_stocks.mrp : '',
                    'Qty': Data.qty,
                    'Disc. %': Data.discount != null ? Data.discount : '',
                    'Taxable Amt': taxableAmount(Number(Data.total_amount), Number(Data.CGST), Number(Data.SGST), Number(Data.IGST)),
                    'Total CGST': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'Total SGST': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'Total IGST': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax %': TotalTaxPercent(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total Tax ': TotalTax(Data.CGST, Data.SGST, Data.IGST) * Number(Data.qty),
                    'Amount': Data.total_amount !== null ? Data.total_amount : '',
                    'Grand Total': Data.total_amount ? Data.total_amount : '',

                }))
                obj.push(vendorsitems)
            }
            var obj2 = obj.flat()
            setSaleEntry(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakeSaleEntryExport()
        }
        func()
    }, [props.saleentryarr])
    return (
        <>
            <ExportExcel apiData={SaleEntry} fileName={fileName} />
        </>
    )
}
export { ExportSaleEntry }

const ExportSaleReturn = (props) => {
    const [ReturnEntry, setReturnEntry] = useState([])
    const fileName = props.fromdate + '-' + props.todate + 'Sale Returns'
    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }

    }
    function TotalTax(cgst, sgst, igst, qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    var obj = []
    async function MakeSaleReturnExport() {
        if (props.salereturnarr.length !== 0) {
            for (let i = 0; i < props.salereturnarr.length; i++) {
                let returndate = props.salereturnarr[i].return_date !== null ? reversefunction(props.salereturnarr[i].return_date) : ''
                let seid = props.salereturnarr[i].sale_entry_id !== null ? 'P-' + props.salereturnarr[i].sale_entry_id : ''
                let srid = props.salereturnarr[i].return_no !== null ? 'SR-' + props.salereturnarr[i].return_no : ''
                let name = props.salereturnarr[i].sale_entry.patient.full_name !== null ? props.salereturnarr[i].sale_entry.patient.full_name : ''
                let returnedamt = props.salereturnarr[i].grand_total !== null ? props.salereturnarr[i].grand_total : ''
                var vendorsitems = props.salereturnarr[i].sale_medicines.map(Data => ({
                    'Return No.': srid,
                    'Name': name,
                    'Type': 'Medicine',
                    'SE ID': seid,
                    // 'Invoice No.': Data.sale_entry.invoice_no && Data.sale_entry.invoice_no != null ? Data.sale_entry.invoice_no : '',
                    'Return Date': returndate,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.medicine && Data.medicine.name && Data.medicine.name != null ? Data.medicine.name : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : '',
                    'Batch No.': Data.medicine_stocks.batch_no != null ? Data.medicine_stocks.batch_no : '',
                    'ExpiryDate': Data.medicine_stocks.expiry_date !== null ? reversefunction(Data.medicine_stocks.expiry_date) : '',
                    'MRP': Data.medicine_stocks.mrp != null ? Data.medicine_stocks.mrp : '',
                    'Rate': Data.medicine_stocks.rate != null ? Data.medicine_stocks.rate : '',
                    'Cost': Data.medicine_stocks.cost != null ? Data.medicine_stocks.cost : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Selling Cost in Rs': Data.disc_mrp !== null ? Data.disc_mrp : '',
                    'Qty': Data.qty,
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTax(Data.CGST, Data.SGST, Data.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total in Rs': Data.total_amount ? Data.total_amount : '',
                    'Returned Amount': returnedamt,

                }))
                obj.push(vendorsitems)
                var vendorsitems = props.salereturnarr[i].sale_vaccines.map(Data => ({
                    'Return No.': srid,
                    'Name': name,
                    'Type': 'Vaccine',
                    'SE ID': seid,
                    // 'Invoice No.': Data.sale_entry.invoice_no && Data.sale_entry.invoice_no != null ? Data.sale_entry.invoice_no : '',
                    'Return Date': returndate,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : '',
                    'Batch No.': Data.vaccine_stocks.batch_no != null ? Data.vaccine_stocks.batch_no : '',
                    'ExpiryDate': Data.medicine_stocks.expiry_date !== null ? reversefunction(Data.vaccine_stocks.expiry_date) : '',
                    'MRP': Data.vaccine_stocks.mrp != null ? Data.vaccine_stocks.mrp : '',
                    'Rate': Data.vaccine_stocks.rate != null ? Data.vaccine_stocks.rate : '',
                    'Cost': Data.vaccine_stocks.cost != null ? Data.vaccine_stocks.cost : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Selling Cost in Rs': Data.disc_mrp !== null ? Data.disc_mrp : '',
                    'Qty': Data.qty,
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'Total Tax in Rs': TotalTax(Data.CGST, Data.SGST, Data.IGST),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total in Rs': Data.total_amount ? Data.total_amount : '',
                    'Returned Amount': returnedamt,

                }))
                obj.push(vendorsitems)
            }
            var obj2 = obj.flat()
            setReturnEntry(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakeSaleReturnExport()
        }
        func()
    }, [props.salereturnarr])
    return (
        <>
            <ExportExcel apiData={ReturnEntry} fileName={fileName} />
        </>
    )
}
export { ExportSaleReturn }

const ExportTransferIn=(props)=>{
    const [ExportTransferIn, setExportTransferIn] = useState([])
    const fileName = props.fromdate + '-' + props.todate + ' Transfer In '

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }
    }
    function TotalTax(cgst, sgst, igst, qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    var obj = []
    async function MakeTransferInExport() {
        if (props.transferinarr.length !== 0) {
            for (let i = 0; i < props.transferinarr.length; i++) {
                var vendorsitems = props.transferinarr[i].medicines.map(Data => ({
                    'Type': 'Medicine', 
                    'TI ID': props.transferinarr[i].id != undefined ? "TI-" + props.transferinarr[i].id : '', 
                    'From Location' :props.transferinarr[i].from_location != undefined && props.transferinarr[i].from_location.title !=undefined ? props.transferinarr[i].from_location.title:'',
                    'Channel' :props.transferinarr[i].channel !=undefined ? props.transferinarr[i].channel== 1 ? "Pharmacy" : "Clinic":'',
                    'To Location' :props.transferinarr[i].to_location !== undefined && props.transferinarr[i].to_location.title !=undefined ? props.transferinarr[i].to_location.title:'',
                    'Transfer Date': props.transferinarr[i].transfer_date!=undefined?reversefunction(props.transferinarr[i].transfer_date):"",
                    'Item ID': Data.medicine_id != null ? Data.medicine_id : '',
                    'Item Stock ID': Data.medicies_stocks_id != null ? Data.medicies_stocks_id : '',
                    'Item Name': Data.medicine_stock_details.medicine.name && Data.medicine_stock_details.medicine.name !== null ? Data.medicine_stock_details.medicine.name : '',
                    'HSN Code': Data.medicine_stock_details.medicine.hsn_code && Data.medicine_stock_details.medicine.hsn_code !== null ? Data.medicine_stock_details.medicine.hsn_code : '',
                    'Batch No.': Data.medicine_stock_details.batch_no && Data.medicine_stock_details.batch_no !== null ? Data.medicine_stock_details.batch_no : '',
                    'ExpiryDate': Data.medicine_stock_details.expiry_date !== null ? reversefunction(Data.medicine_stock_details.expiry_date) : '',
                    'MRP': Data.medicine_stock_details.mrp != null ? Data.medicine_stock_details.mrp : '',
                    'Rate': Data.medicine_stock_details.rate != null ? Data.medicine_stock_details.rate : '',
                    'Qty': Data.qty !==null ? Data.qty:'',
                    'Discount':  Data.medicine_stock_details.discount != null ?  Data.medicine_stock_details.discount : '',
                    'Trade Disc.':  Data.medicine_stock_details.trade_discount != null ?  Data.medicine_stock_details.trade_discount : '',
                    'CGST in Rs': Number( Data.medicine_stock_details.CGST) * Number(Data.qty),
                    'CGST %':  Data.medicine_stock_details.CGST_rate,
                    'SGST in Rs': Number(Data.medicine_stock_details.SGST) * Number(Data.qty),
                    'SGST %':  Data.medicine_stock_details.SGST_rate,
                    'IGST in Rs': Number( Data.medicine_stock_details.IGST) * Number(Data.qty),
                    'IGST %':  Data.medicine_stock_details.IGST_rate,
                    'Total Tax': TotalTax( Data.medicine_stock_details.CGST,  Data.medicine_stock_details.SGST,  Data.medicine_stock_details.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate( Data.medicine_stock_details.CGST_rate,  Data.medicine_stock_details.SGST_rate, Data.medicine_stock_details.IGST_rate),
                    'Cost in Rs':  Data.medicine_stock_details.cost,
                    'Total Rs':  Data.medicine_stock_details.total_amount ?  Data.medicine_stock_details.total_amount : '',
                }))
                obj.push(vendorsitems)
                var vendorsitems = props.transferinarr[i].vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'TO ID': props.transferinarr[i].id && props.transferinarr[i].id != null ? "TO-" + props.transferinarr[i].id : '',
                    'Channel' :props.transferinarr[i].channel !=undefined ? props.transferinarr[i].channel== 1 ? "Pharmacy" : "Clinic":'', 
                    'From Location' : props.transferinarr[i].from_location!=undefined && props.transferinarr[i].from_location.title !=undefined ? props.transferinarr[i].from_location.title:'',
                    'To Location' :  props.transferinarr[i].to_location!=undefined && props.transferinarr[i].to_location.title !=undefined ? props.transferinarr[i].to_location.title:'',
                    'Transfer Date': props.transferinarr[i].transfer_date!=undefined?reversefunction(props.transferinarr[i].transfer_date):"",
                    'Item ID': Data.vaccine_brand_id != null ? Data.vaccine_brand_id : '',
                    'Item Stock ID': Data.vaccine_stocks_id != null ? Data.vaccine_stocks_id : '',
                    'Item Name': Data.vaccine_stock_details.vaccine.name && Data.vaccine_stock_details.vaccine.name !== null ? Data.vaccine_stock_details.vaccine.name : '',
                    'HSN Code': Data.vaccine_stock_details.vaccine.hsn_code && Data.vaccine_stock_details.vaccine.hsn_code !== null ? Data.vaccine_stock_details.vaccine.hsn_code : '',
                    'Batch No.': Data.vaccine_stock_details.batch_no && Data.vaccine_stock_details.batch_no !== null ? Data.vaccine_stock_details.batch_no : '',
                    'ExpiryDate': Data.vaccine_stock_details.expiry_date !== null ? reversefunction(Data.vaccine_stock_details.expiry_date) : '',
                    'MRP': Data.vaccine_stock_details.mrp != null ? Data.vaccine_stock_details.mrp : '',
                    'Rate': Data.vaccine_stock_details.rate != null ? Data.vaccine_stock_details.rate : '',
                    'Qty': Data.qty !==null ? Data.qty:'',
                    'Discount':  Data.vaccine_stock_details.discount != null ?  Data.vaccine_stock_details.discount : '',
                    'Trade Disc.':  Data.vaccine_stock_details.trade_discount != null ?  Data.vaccine_stock_details.trade_discount : '',
                    'CGST in Rs': Number( Data.vaccine_stock_details.CGST) * Number(Data.qty),
                    'CGST %':  Data.vaccine_stock_details.CGST_rate,
                    'SGST in Rs': Number(Data.vaccine_stock_details.SGST) * Number(Data.qty),
                    'SGST %':  Data.vaccine_stock_details.SGST_rate,
                    'IGST in Rs': Number( Data.vaccine_stock_details.IGST) * Number(Data.qty),
                    'IGST %':  Data.vaccine_stock_details.IGST_rate,
                    'Total Tax': TotalTax( Data.vaccine_stock_details.CGST,  Data.vaccine_stock_details.SGST,  Data.vaccine_stock_details.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate( Data.vaccine_stock_details.CGST_rate,  Data.vaccine_stock_details.SGST_rate, Data.vaccine_stock_details.IGST_rate),
                    'Cost in Rs':  Data.vaccine_stock_details.cost,
                    'Total Rs':  Data.vaccine_stock_details.total_amount ?  Data.vaccine_stock_details.total_amount : '',

                }))
                obj.push(vendorsitems)
      
            }
            var obj2 = obj.flat()
            setExportTransferIn(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakeTransferInExport()
        }
        func()
    }, [props.transferinarr])
    return (
        <>
            <ExportExcel apiData={ExportTransferIn} fileName={fileName} />
        </>
    )
}
export {ExportTransferIn}

const ExportTransferOut=(props)=>{
    const [ExportTransferOut, setExportTransferOut] = useState([])
    const fileName = props.fromdate + '-' + props.todate + ' Transfer Out '

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }

    }
    function TotalTax(cgst, sgst, igst, qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    var obj = []
    async function MakeTransferOutExport() {
        if (props.transferoutarr.length !== 0) {
            for (let i = 0; i < props.transferoutarr.length; i++) {
                var vendorsitems = props.transferoutarr[i].medicines.map(Data => ({
                    'Type': 'Medicine', 
                    'TO ID': props.transferoutarr[i].id != undefined ? "TO-" + props.transferoutarr[i].id : '', 
                    'From Location' :props.transferoutarr[i].from_location != undefined && props.transferoutarr[i].from_location.title !=undefined ? props.transferoutarr[i].from_location.title:'',
                    'Channel' :props.transferoutarr[i].channel !=undefined ? props.transferoutarr[i].channel== 1 ? "Pharmacy" : "Clinic":'',
                    'To Location' :props.transferoutarr[i].to_location !== undefined && props.transferoutarr[i].to_location.title !=undefined ? props.transferoutarr[i].to_location.title:'',
                    'Transfer Date': props.transferoutarr[i].transfer_date!=undefined?reversefunction(props.transferoutarr[i].transfer_date):"",
                    'Item ID': Data.medicine_id != null ? Data.medicine_id : '',
                    'Item Stock ID': Data.medicies_stocks_id != null ? Data.medicies_stocks_id : '',
                    'Item Name': Data.medicine_stock_details.medicine.name && Data.medicine_stock_details.medicine.name !== null ? Data.medicine_stock_details.medicine.name : '',
                    'HSN Code': Data.medicine_stock_details.medicine.hsn_code && Data.medicine_stock_details.medicine.hsn_code !== null ? Data.medicine_stock_details.medicine.hsn_code : '',
                    'Batch No.': Data.medicine_stock_details.batch_no && Data.medicine_stock_details.batch_no !== null ? Data.medicine_stock_details.batch_no : '',
                    'ExpiryDate': Data.medicine_stock_details.expiry_date !== null ? reversefunction(Data.medicine_stock_details.expiry_date) : '',
                    'MRP': Data.medicine_stock_details.mrp != null ? Data.medicine_stock_details.mrp : '',
                    'Rate': Data.medicine_stock_details.rate != null ? Data.medicine_stock_details.rate : '',
                    'Qty': Data.qty !==null ? Data.qty:'',
                    'Discount':  Data.medicine_stock_details.discount != null ?  Data.medicine_stock_details.discount : '',
                    'Trade Disc.':  Data.medicine_stock_details.trade_discount != null ?  Data.medicine_stock_details.trade_discount : '',
                    'CGST in Rs': Number( Data.medicine_stock_details.CGST) * Number(Data.qty),
                    'CGST %':  Data.medicine_stock_details.CGST_rate,
                    'SGST in Rs': Number(Data.medicine_stock_details.SGST) * Number(Data.qty),
                    'SGST %':  Data.medicine_stock_details.SGST_rate,
                    'IGST in Rs': Number( Data.medicine_stock_details.IGST) * Number(Data.qty),
                    'IGST %':  Data.medicine_stock_details.IGST_rate,
                    'Total Tax': TotalTax( Data.medicine_stock_details.CGST,  Data.medicine_stock_details.SGST,  Data.medicine_stock_details.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate( Data.medicine_stock_details.CGST_rate,  Data.medicine_stock_details.SGST_rate, Data.medicine_stock_details.IGST_rate),
                    'Cost in Rs':  Data.medicine_stock_details.cost,
                    'Total Rs':  Data.medicine_stock_details.total_amount ?  Data.medicine_stock_details.total_amount : '',
                }))
                obj.push(vendorsitems)
                var vendorsitems = props.transferoutarr[i].vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'TO ID': props.transferoutarr[i].id && props.transferoutarr[i].id != null ? "TO-" + props.transferoutarr[i].id : '',
                    'Channel' :props.transferoutarr[i].channel !=undefined ? props.transferoutarr[i].channel== 1 ? "Pharmacy" : "Clinic":'', 
                    'From Location' : props.transferoutarr[i].from_location!=undefined && props.transferoutarr[i].from_location.title !=undefined ? props.transferoutarr[i].from_location.title:'',
                    'To Location' :  props.transferoutarr[i].to_location!=undefined && props.transferoutarr[i].to_location.title !=undefined ? props.transferoutarr[i].to_location.title:'',
                    'Transfer Date': props.transferoutarr[i].transfer_date!=undefined?reversefunction(props.transferoutarr[i].transfer_date):"",
                    'Item ID': Data.vaccine_brand_id != null ? Data.vaccine_brand_id : '',
                    'Item Stock ID': Data.vaccine_stocks_id != null ? Data.vaccine_stocks_id : '',
                    'Item Name': Data.vaccine_stock_details.vaccine.name && Data.vaccine_stock_details.vaccine.name !== null ? Data.vaccine_stock_details.vaccine.name : '',
                    'HSN Code': Data.vaccine_stock_details.vaccine.hsn_code && Data.vaccine_stock_details.vaccine.hsn_code !== null ? Data.vaccine_stock_details.vaccine.hsn_code : '',
                    'Batch No.': Data.vaccine_stock_details.batch_no && Data.vaccine_stock_details.batch_no !== null ? Data.vaccine_stock_details.batch_no : '',
                    'ExpiryDate': Data.vaccine_stock_details.expiry_date !== null ? reversefunction(Data.vaccine_stock_details.expiry_date) : '',
                    'MRP': Data.vaccine_stock_details.mrp != null ? Data.vaccine_stock_details.mrp : '',
                    'Rate': Data.vaccine_stock_details.rate != null ? Data.vaccine_stock_details.rate : '',
                    'Qty': Data.qty !==null ? Data.qty:'',
                    'Discount':  Data.vaccine_stock_details.discount != null ?  Data.vaccine_stock_details.discount : '',
                    'Trade Disc.':  Data.vaccine_stock_details.trade_discount != null ?  Data.vaccine_stock_details.trade_discount : '',
                    'CGST in Rs': Number( Data.vaccine_stock_details.CGST) * Number(Data.qty),
                    'CGST %':  Data.vaccine_stock_details.CGST_rate,
                    'SGST in Rs': Number(Data.vaccine_stock_details.SGST) * Number(Data.qty),
                    'SGST %':  Data.vaccine_stock_details.SGST_rate,
                    'IGST in Rs': Number( Data.vaccine_stock_details.IGST) * Number(Data.qty),
                    'IGST %':  Data.vaccine_stock_details.IGST_rate,
                    'Total Tax': TotalTax( Data.vaccine_stock_details.CGST,  Data.vaccine_stock_details.SGST,  Data.vaccine_stock_details.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate( Data.vaccine_stock_details.CGST_rate,  Data.vaccine_stock_details.SGST_rate, Data.vaccine_stock_details.IGST_rate),
                    'Cost in Rs':  Data.vaccine_stock_details.cost,
                    'Total Rs':  Data.vaccine_stock_details.total_amount ?  Data.vaccine_stock_details.total_amount : '',

                }))
                obj.push(vendorsitems)
            }
            var obj2 = obj.flat()
            setExportTransferOut(obj2)
        }
    }
    useEffect(() => {
        async function func() {
            await MakeTransferOutExport()
        }
        func()
    }, [props.transferoutarr])
    return (
        <>
            <ExportExcel apiData={ExportTransferOut} fileName={fileName} />
        </>
    )
}
export {ExportTransferOut}

const ExportDump = (props)=>{
    const [ExportTDump, setExportTDump] = useState([])
    const fileName = props.fromdate + '-' + props.todate + ' Transfer In '

    const reversefunction = (date) => {
        if (date) {
            date = date.split("-").reverse().join("-")
            return date
        }
    }
    function TotalTax(cgst, sgst, igst, qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst)) * Number(qty)
        }
    }
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
        }
    }
    var obj = []
    async function MakeDumpExport() {
        if (props.dumpsarr.length !== 0) {
            for (let i = 0; i < props.dumpsarr.length; i++) {
                var vendorsitems = props.dumpsarr[i].medicines.map(Data => ({
                    'Type': 'Medicine', 
                    'Dump ID': props.dumpsarr[i].id != undefined ? "D-" + props.dumpsarr[i].id : '', 
                    'Channel' :props.dumpsarr[i].channel !=undefined ? props.dumpsarr[i].channel== 1 ? "Pharmacy" : "Clinic":'',
                    'Dump Date': props.dumpsarr[i].dump_date!=undefined?reversefunction(props.dumpsarr[i].dump_date):"",
                    'Item ID': Data.medicine_id != null ? Data.medicine_id : '',
                    'Item Stock ID': Data.medicies_stocks_id != null ? Data.medicies_stocks_id : '',
                    'Item Name': Data.medicine_details.medicine.name && Data.medicine_details.medicine.name !== null ? Data.medicine_details.medicine.name : '',
                    'HSN Code': Data.medicine_details.medicine.hsn_code && Data.medicine_details.medicine.hsn_code !== null ? Data.medicine_details.medicine.hsn_code : '',
                    'Batch No.': Data.medicine_details.batch_no && Data.medicine_details.batch_no !== null ? Data.medicine_details.batch_no : '',
                    'ExpiryDate': Data.medicine_details.expiry_date !== null ? reversefunction(Data.medicine_details.expiry_date) : '',
                    'MRP': Data.medicine_details.mrp != null ? Data.medicine_details.mrp : '',
                    'Rate': Data.medicine_details.rate != null ? Data.medicine_details.rate : '',
                    'Qty': Data.qty !==null ? Data.qty:'',
                    'Discount':  Data.medicine_details.discount != null ?  Data.medicine_details.discount : '',
                    'Trade Disc.':  Data.medicine_details.trade_discount != null ?  Data.medicine_details.trade_discount : '',
                    'CGST in Rs': Number( Data.medicine_details.CGST) * Number(Data.qty),
                    'CGST %':  Data.medicine_details.CGST_rate,
                    'SGST in Rs': Number(Data.medicine_details.SGST) * Number(Data.qty),
                    'SGST %':  Data.medicine_details.SGST_rate,
                    'IGST in Rs': Number( Data.medicine_details.IGST) * Number(Data.qty),
                    'IGST %':  Data.medicine_details.IGST_rate,
                    'Total Tax': TotalTax( Data.medicine_details.CGST,  Data.medicine_details.SGST,  Data.medicine_details.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate( Data.medicine_details.CGST_rate,  Data.medicine_details.SGST_rate, Data.medicine_details.IGST_rate),
                    'Cost in Rs':  Data.medicine_details.cost,
                    'Total Rs':  Data.medicine_details.total_amount ?  Data.medicine_details.total_amount : '',
                }))
                obj.push(vendorsitems)
                var vendorsitems = props.dumpsarr[i].vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'Dump ID': props.dumpsarr[i].id && props.dumpsarr[i].id != null ? "D-" + props.dumpsarr[i].id : '',
                    'Channel' :props.dumpsarr[i].channel !=undefined ? props.dumpsarr[i].channel== 1 ? "Pharmacy" : "Clinic":'', 
                    'Dump Date': props.dumpsarr[i].dump_date!=undefined?reversefunction(props.dumpsarr[i].dump_date):"",
                    'Item ID': Data.vaccine_brand_id != null ? Data.vaccine_brand_id : '',
                    'Item Stock ID': Data.vaccine_stocks_id != null ? Data.vaccine_stocks_id : '',
                    'Item Name': Data.vaccine_details.vaccine.name && Data.vaccine_details.vaccine.name !== null ? Data.vaccine_details.vaccine.name : '',
                    'HSN Code': Data.vaccine_details.vaccine.hsn_code && Data.vaccine_details.vaccine.hsn_code !== null ? Data.vaccine_details.vaccine.hsn_code : '',
                    'Batch No.': Data.vaccine_details.batch_no && Data.vaccine_details.batch_no !== null ? Data.vaccine_details.batch_no : '',
                    'ExpiryDate': Data.vaccine_details.expiry_date !== null ? reversefunction(Data.vaccine_details.expiry_date) : '',
                    'MRP': Data.vaccine_details.mrp != null ? Data.vaccine_details.mrp : '',
                    'Rate': Data.vaccine_details.rate != null ? Data.vaccine_details.rate : '',
                    'Qty': Data.qty !==null ? Data.qty:'',
                    'Discount':  Data.vaccine_details.discount != null ?  Data.vaccine_details.discount : '',
                    'Trade Disc.':  Data.vaccine_details.trade_discount != null ?  Data.vaccine_details.trade_discount : '',
                    'CGST in Rs': Number( Data.vaccine_details.CGST) * Number(Data.qty),
                    'CGST %':  Data.vaccine_details.CGST_rate,
                    'SGST in Rs': Number(Data.vaccine_details.SGST) * Number(Data.qty),
                    'SGST %':  Data.vaccine_details.SGST_rate,
                    'IGST in Rs': Number( Data.vaccine_details.IGST) * Number(Data.qty),
                    'IGST %':  Data.vaccine_details.IGST_rate,
                    'Total Tax': TotalTax( Data.vaccine_details.CGST,  Data.vaccine_details.SGST,  Data.vaccine_details.IGST, Data.qty),
                    'Total Tax %': TotalTaxRate( Data.vaccine_details.CGST_rate,  Data.vaccine_details.SGST_rate, Data.vaccine_details.IGST_rate),
                    'Cost in Rs':  Data.vaccine_details.cost,
                    'Total Rs':  Data.vaccine_details.total_amount ?  Data.vaccine_details.total_amount : '',

                }))
                obj.push(vendorsitems)
      
            }
            var obj2 = obj.flat()
            setExportTDump(obj2)
        }
    }
    console.log(props.dumpsarr)
    useEffect(() => {
        async function func() {
            await MakeDumpExport()
        }
        func()
    }, [props.dumpsarr])
    return (
        <>
            <ExportExcel apiData={ExportTDump} fileName={fileName} />
        </>
    )
}
export {ExportDump}