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
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Trade Disc.': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Data.CGST,
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Data.SGST,
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Data.IGST,
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTaxPercent(Data.CGST, Data.SGST, Data.IGST),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost in Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }

            for (let i = 0; i < props.purchaseentryarr.length; i++) {
                var vendorsitems = props.purchaseentryarr[i].vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': Data.purchase_entry.distributor.entity_name,
                    'GSTIN': Data.purchase_entry.distributor.GSTIN_no,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccines && Data.vaccines.name && Data.vaccines.name != null ? Data.medicine.name : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Trade Disc.': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Data.CGST,
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Data.SGST,
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Data.IGST,
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTaxPercent(Data.CGST, Data.SGST, Data.IGST),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.vaccines && Data.vaccines.hsn_code !== null ? Data.vaccines.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }

            console.log(obj)
            var obj2 = obj.flat()
            console.log(obj2)
            setExportPurchaseEntry(obj2)
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
    var obj = []
    async function MakePurchaseReturnExport() {
        if (props.purchasereturnarr.length !== 0) {
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
                    'CGST in Rs': Data.CGST,
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Data.SGST,
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Data.IGST,
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTaxPercent(Data.CGST, Data.SGST, Data.IGST),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }

            for (let i = 0; i < props.purchasereturnarr.length; i++) {
                let distributor = props.purchasereturnarr[i].distributor.entity_name
                let GST = props.purchasereturnarr[i].distributor.GSTIN_no
                var vendorsitems = props.purchasereturnarr[i].purchase_vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'PE ID': Data.purchase_entry.bill_id && Data.purchase_entry.bill_id != null ? "PE-" + Data.purchase_entry.bill_id : '',
                    'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': reversefunction(Data.purchase_entry.bill_date),
                    'Distributor': distributor,
                    'GSTIN': GST,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
                    'Batch No.': Data.batch_no != null ? Data.batch_no : '',
                    'ExpiryDate': Data.expiry_date !== null ? reversefunction(Data.expiry_date) : '',
                    'MRP': Data.mrp != null ? Data.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Discount %': Data.discount != null ? Data.discount : '',
                    'Trade Disc. %5': Data.trade_discount != null ? Data.trade_discount : '',
                    'CGST in Rs': Data.CGST,
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Data.SGST,
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Data.IGST,
                    'IGST %': Data.IGST_rate,
                    'Total Tax %': TotalTaxPercent(Data.CGST, Data.SGST, Data.IGST),
                    'Total Tax Rs': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Cost Rs': Data.cost,
                    'Qty': Data.qty,
                    'Total Rs': Data.total_amount ? Data.total_amount : '',
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : ''
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
    console.log(props.purchasereturnarr)
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
    function TotalTaxRate(cgst, sgst, igst) {
        if (cgst && sgst && igst !== null || undefined) {
            return Number(cgst) + Number(sgst) + Number(igst)
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
                    'Doctor Name': doctor,
                    // 'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': billdate,
                    'Item ID': Data.medicine_stocks.id != null ? Data.medicine_stocks.id : '',
                    'Item Name': Data.medicine && Data.medicine.name && Data.medicine.name != null ? Data.medicine.name : '',
                    'Batch No.': Data.medicine_stocks.batch_no != null ? Data.medicine_stocks.batch_no : '',
                    'Qty': Data.qty,
                    'ExpiryDate': Data.medicine_stocks.expiry_date !== null ? reversefunction(Data.medicine_stocks.expiry_date) : '',
                    'MRP': Data.medicine_stocks.mrp != null ? Data.medicine_stocks.mrp : '',
                    'Rate': Data.medicine_stocks.rate != null ? Data.medicine_stocks.rate : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Taxable Amount in Rs': Data.total_amount !== null ? Data.total_amount : '',
                    'CGST in Rs': Data.CGST,
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Data.SGST,
                    'SGST %': Data.CGST_rate,
                    'IGST in Rs': Data.IGST,
                    'IGST %': Data.CGST_rate,
                    'Total Tax in %': TotalTaxPercent(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total Tax in Rs': TotalTaxRate(Data.CGST, Data.CGST, Data.CGST),
                    'Grand Total Rs': Data.medicine_stocks.total_amount ? Data.medicine_stocks.total_amount : '',
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }

            for (let i = 0; i < props.saleentryarr.length; i++) {
                let billid = props.saleentryarr[i].bill_id ? props.saleentryarr[i].bill_id : ''
                let billdate = props.saleentryarr[i].bill_date ? reversefunction(props.saleentryarr[i].bill_date) : ''
                let name = props.saleentryarr[i].patient.full_name !== null ? props.saleentryarr[i].patient.full_name : ''
                let doctor = props.saleentryarr[i].doctor_name !== null ? props.saleentryarr[i].doctor_name : ''
                var vendorsitems = props.saleentryarr[i].sale_vaccines.map(Data => ({
                    'Type': 'Vaccine',
                    'Bill ID': billid,
                    'Name': name,
                    'Doctor Name': doctor,
                    // 'Invoice No.': Data.purchase_entry.invoice_no && Data.purchase_entry.invoice_no != null ? Data.purchase_entry.invoice_no : '',
                    'Bill Date': billdate,
                    'Item ID': Data.vaccine_stocks.id != null ? Data.vaccine_stocks.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
                    'Batch No.': Data.vaccine_stocks.batch_no != null ? Data.vaccine_stocks.batch_no : '',
                    'Qty': Data.qty,
                    'ExpiryDate': Data.vaccine_stocks.expiry_date !== null ? reversefunction(Data.vaccine_stocks.expiry_date) : '',
                    'MRP': Data.vaccine_stocks.mrp != null ? Data.vaccine_stocks.mrp : '',
                    'Rate': Data.vaccine_stocks.rate != null ? Data.vaccine_stocks.rate : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Taxable Amount in Rs': Data.total_amount !== null ? Data.total_amount : '',
                    'CGST in Rs': Data.CGST,
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Data.SGST,
                    'SGST %': Data.CGST_rate,
                    'IGST in Rs': Data.IGST,
                    'IGST %': Data.CGST_rate,
                    'Total Tax in %': TotalTaxPercent(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total Tax in Rs': TotalTaxRate(Data.CGST, Data.CGST, Data.CGST),
                    'Grand Total Rs': Data.vaccine_stocks.total_amount ? Data.vaccine_stocks.total_amount : '',
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : ''
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
    console.log(props.saleentryarr)
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
    function TotalTax(cgst, sgst, igst,qty) {
        if (cgst && sgst && igst !== null || undefined) {
            return (Number(cgst) + Number(sgst) + Number(igst))*Number(qty)
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
                console.log()
                var vendorsitems = props.salereturnarr[i].sale_medicines.map(Data => ({
                    'Return No.': srid,
                    'Name': name,
                    'Type': 'Medicine',
                    'SE ID': seid,
                    // 'Invoice No.': Data.sale_entry.invoice_no && Data.sale_entry.invoice_no != null ? Data.sale_entry.invoice_no : '',
                    'Return Date': returndate,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.medicine && Data.medicine.name && Data.medicine.name != null ? Data.medicine.name : '',
                    'Batch No.': Data.medicine_stocks.batch_no != null ? Data.medicine_stocks.batch_no : '',
                    'ExpiryDate': Data.medicine_stocks.expiry_date !== null ? reversefunction(Data.medicine_stocks.expiry_date) : '',
                    'MRP': Data.medicine_stocks.mrp != null ? Data.medicine_stocks.mrp : '',
                    'Rate': Data.rate != null ? Data.rate : '',
                    'Discount': Data.discount != null ? Data.discount : '',
                    'Selling Cost in Rs': Data.disc_mrp !== null ? Data.disc_mrp : '',
                    'Qty': Data.qty,
                    'CGST in Rs': Number(Data.CGST) * Number(Data.qty),
                    'CGST %': Data.CGST_rate,
                    'SGST in Rs': Number(Data.SGST) * Number(Data.qty),
                    'SGST %': Data.SGST_rate,
                    'IGST in Rs': Number(Data.IGST) * Number(Data.qty),
                    'IGST %': Data.IGST_rate,
                    'Total Tax in Rs': TotalTax(Data.CGST, Data.SGST, Data.IGST,Data.qty),
                    'Total Tax %': TotalTaxRate(Data.CGST_rate, Data.SGST_rate, Data.IGST_rate),
                    'Total in Rs': Data.total_amount ? Data.total_amount : '',
                    'Returned Amount': returnedamt,
                    'HSN Code': Data.medicine && Data.medicine.hsn_code !== null ? Data.medicine.hsn_code : ''
                }))
                obj.push(vendorsitems)

            }

            for (let i = 0; i < props.salereturnarr.length; i++) {
                let returndate = props.salereturnarr[i].return_date !== null ? reversefunction(props.salereturnarr[i].return_date) : ''
                let seid = props.salereturnarr[i].sale_entry_id !== null ? 'P-' + props.salereturnarr[i].sale_entry_id : ''
                let srid = props.salereturnarr[i].return_no !== null ? 'SR-' + props.salereturnarr[i].return_no : ''
                let name = props.salereturnarr[i].sale_entry.patient.full_name !== null ? props.salereturnarr[i].sale_entry.patient.full_name : ''
                let returnedamt = props.salereturnarr[i].grand_total !== null ? props.salereturnarr[i].grand_total : ''
                console.log()
                var vendorsitems = props.salereturnarr[i].sale_vaccines.map(Data => ({
                    'Return No.': srid,
                    'Name': name,
                    'Type': 'Vaccine',
                    'SE ID': seid,
                    // 'Invoice No.': Data.sale_entry.invoice_no && Data.sale_entry.invoice_no != null ? Data.sale_entry.invoice_no : '',
                    'Return Date': returndate,
                    'Item ID': Data.id != null ? Data.id : '',
                    'Item Name': Data.vaccine && Data.vaccine.name && Data.vaccine.name != null ? Data.vaccine.name : '',
                    'Batch No.': Data.vaccine_stocks.batch_no != null ? Data.vaccine_stocks.batch_no : '',
                    'ExpiryDate': Data.medicine_stocks.expiry_date !== null ? reversefunction(Data.vaccine_stocks.expiry_date) : '',
                    'MRP': Data.vaccine_stocks.mrp != null ? Data.vaccine_stocks.mrp : '',
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
                    'HSN Code': Data.vaccine && Data.vaccine.hsn_code !== null ? Data.vaccine.hsn_code : ''
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
    console.log(props.salereturnarr)
    return (
        <>
            <ExportExcel apiData={ReturnEntry} fileName={fileName} />
        </>
    )
}
export { ExportSaleReturn }