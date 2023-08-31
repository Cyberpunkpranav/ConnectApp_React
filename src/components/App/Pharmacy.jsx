import { useState, useEffect, useContext, useRef } from "react"
import axios from "axios"
import ReactPaginate from 'react-paginate';
import { URL, TodayDate, DoctorsList, Doctorapi, Permissions, Secretkey } from '../../index'
import { Salesection, Purchasesection, Stocksection, Listsection,Transfersection,Dumpsection } from "../pharmacy/pharmacy"

//css
import '../../css/pharmacy.css'
function Pharmacy() {
  const permission = useContext(Permissions)
  let menu = [
    {
      option: "Sale",
      display: permission.sale_entry_view == undefined && permission.ale_return_view == undefined ? 0 : 1,
    },
    {
      option: "Stock Info",
      display: permission.purchase_entry_view == undefined && permission.purchase_orders_view == undefined && permission.purchase_return_view == undefined ? 0 : 1,
    },
    {
      option: "Purchase",
      display: permission.purchase_entry_view == undefined && permission.purchase_orders_view == undefined && permission.purchase_return_view == undefined ? 0 : 1,
    },
    {
      option: "Lists",
      display: permission.vaccine_view == undefined && permission.medicine_view == undefined ? 0 : 1,
    },
    {
      option: "Transfers",
      display: 1,
      // permission.transfer_view == undefined && permission.transfer_view == undefined ? 0 : 
    },
    {
      option: "Dumps",
      display: 1,
      // permission.transfer_view == undefined && permission.transfer_view == undefined ? 0 : 
    }
  ]
  const [menuindex, setmenuindex] = useState(0);
  const _selectedmenu = (_menu) => {
    if (_menu === 0) {
      return <Salesection />
    }
    if (_menu === 1) {
      return <Stocksection />
    }
    if (_menu === 2) {
      return <Purchasesection />;
    }
    if (_menu === 3) {
      return <Listsection />;
    }
    if (_menu === 4){
      return <Transfersection/>
    }
    if (_menu === 5){
      return <Dumpsection/>
    }
    return <div className="">Nothing Selected</div>;
  };
  return (
    <>
      <section className={`pharmacy position-relative mt-1`} >
        <div className="pharmacysection p-0 m-0">
          <div className="container-fluid pharmacytabsection shadow-sm rounded-bottom border-bottom pb-1">
            <div className="gap-3 d-flex p-0 m-0 ms-1 p-1 py-1 align-items-center ">
              {
                menu.map((e, i) => {
                  return (
                    <>
                      <div className={`col-auto p-0 m-0 d-${e.display == 1 ? '' : 'none'}`}>
                        <button className={`button animatebuttons rounded-1 col-auto shadow-none text-${i === menuindex ? 'light' : 'charcoal75 fw-bolder'} button-${i === menuindex ? "charcoal" : "seashell"} border-${i === menuindex ? 'secondary' : 'none'}`} onClick={(a) => setmenuindex(i)} > {e.option} </button>
                      </div>
                      <div className={`vr rounded-1 h-75 align-self-center d-${e.display == 1 ? '' : 'none'}`} style={{ padding: '0.8px' }}></div>
                    </>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div className="p-0 m-0">{_selectedmenu(menuindex)}</div>
      </section>

    </>
  );
}
export default Pharmacy