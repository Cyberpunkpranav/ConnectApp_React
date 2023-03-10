import axios from 'axios';
import React ,{useState,useEffect,useContext} from 'react';
import { URL } from '../../index';

import '../../css/pharmacy.css';
import Notiflix from 'notiflix';

function Purchaseorderarray(props){
    let purchaseorderarr =[{
        c1:'PO-14',
        c2:<button className="button button-lightblue rounded-5">Pharmacy</button>,
        c3:'Lucky Distributor',
        c4:'10/10/2022',
        c5:'Kabir S',
        c6:'30',
        c7:'10,000',
        c8:<button className="button button-lightgreen rounded-5">Approved</button>

    },
    {
        c1:'PO-14',
        c2:<button className="button button-lightyellow rounded-5">Consumables</button>,
        c3:'Lucky Distributor',
        c4:'10/10/2022',
        c5:'Kabir S',
        c6:'30',
        c7:'10,000',
        c8:<button className="button button-lightyellow rounded-5">Pending</button>
    },
    {
        c1:'PO-14',
        c2:<button className="button button-lightblue rounded-5">Pharmacy</button>,
        c3:'Lucky Distributor',
        c4:'10/10/2022',
        c5:'Kabir S',
        c6:'30',
        c7:'10,000',
        c8:<button className="button button-lightred rounded-5">Cancelled</button>
    },
    {
        c1:'PO-14',
        c2:<button className="button button-lightblue rounded-5">Pharmacy</button>,
        c3:'Lucky Distributor',
        c4:'10/10/2022',
        c5:'Kabir S',
        c6:'30',
        c7:'10,000',
        c8:<button className="button button-burntumber rounded-5">Rejected</button>
    },
    {
        c1:'PO-14',
        c2:<button className="button button-lightblue rounded-5">Pharmacy</button>,
        c3:'Lucky Distributor',
        c4:'10/10/2022',
        c5:'Kabir S',
        c6:'30',
        c7:'10,000',
        c8:<button className="button button-lightgreen rounded-5">Approved</button>
    }
];
    return(
        <>{
            purchaseorderarr.map((item,_key) => {
            return<tr key={_key}>
            <td>{item.c1}</td>
            <td>{item.c2}</td>
            <td>{item.c3}</td>
            <td>{item.c4}</td>
            <td>{item.c5}</td>
            <td>{item.c6}</td>
            <td>{item.c7}</td>  
            <td>{item.c8}</td>
            <td><button className='btn'><img src={process.env.PUBLIC_URL + "/images/enter.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></button>
              <button className='btn'onClick={props.itemdetails}><img src={process.env.PUBLIC_URL + "/images/archivebox.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></button></td>
            <td><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/delete.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
          </tr>
        })}
        </>
    )
}




function Pharmacystocktable(){
  let  pharmacystockarr = [{
        c1:'01',
        c2:'Dolo 650',
        c3:'04',
        c4:'600',
        c5:'Lucky Distributors'
    }]
    return(
        <>{
            pharmacystockarr.map((item,_key) => {
            return<tr key={_key}>
            <td>{item.c1}</td>
            <td>{item.c2}</td>
            <td>{item.c3}</td>
            <td>{item.c4}</td>
            <td>{item.c5}</td>
            <td><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /></td>
            <td><button className="btn position-relative cursor-pointer more p-0 m-0"><img src={process.env.PUBLIC_URL + "/images/more.png"} alt="displaying_image" style={{ width: "1.5rem" }} /></button></td>
          </tr>
        })}
        </>
    )
}



function POitemdetailsarray(){
    let POitemdetailsarr = [
        {
        c1:'01',
        c2:'Dolo 650',
        c3:'10',
        c4:'600'
        },
]
    return (
        <>

<table className="table datatable text-center">
        <thead>
          <tr>
     
            <th>No.</th>
            <th>Item Name</th>
            <th>Total Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
        {
            POitemdetailsarr.map((item, _key) => {
                return <tr key={item.id}>
                    <td>{item.c1}</td>
                    <td>{item.c2}</td>
                    <td>{item.c3}</td>
                    <td>{item.c4}</td>
                </tr>
            })
        }
        </tbody>
    </table>
       
        </>
    )
}

export{Purchaseorderarray};
export {Pharmacystocktable};
export{POitemdetailsarray};




function Stockvaccinearray(){
        let Stockvaccinearr = [{
            id: 1,
            c1: "M-12",
            c2: "Medicine Name 1",
            c3: 'LCY-12342',
            c4: '10/10/2022',
            c5: '230',
            c6: '200',
            c7: '12',
            c8:'20',
            c9:<img src='' alt='...'/>
        },
        {
            id: 2,
            c1: "M-12",
            c2: "Medicine Name 1",
            c3: 'LCY-12342',
            c4: '10/10/2022',
            c5: '230',
            c6: '200',
            c7: '12',
            c8:'20',
            c9:<img src='' alt='...'/>
        },
        {
            id: 3,
            c1: "M-12",
            c2: "Medicine Name 1",
            c3: 'LCY-12342',
            c4: '10/10/2022',
            c5: '230',
            c6: '200',
            c7: '12',
            c8:'20',
            c9:<img src='' alt='...'/>
        },
        {
            id: 4,
            c1: "M-12",
            c2: "Medicine Name 1",
            c3: 'LCY-12342',
            c4: '10/10/2022',
            c5: '230',
            c6: '200',
            c7: '12',
            c8:'20',
            c9:<img src='' alt='...'/>
        },
        {
            id: 5,
            c1: "M-12",
            c2: "Medicine Name 1",
            c3: 'LCY-12342',
            c4: '10/10/2022',
            c5: '230',
            c6: '200',
            c7: '12',
            c8:'20',
            c9:<img src='' alt='...'/>
        },
        {
            id: 6,
            c1: "M-12",
            c2: "Medicine Name 1",
            c3: 'LCY-12342',
            c4: '10/10/2022',
            c5: '230',
            c6: '200',
            c7: '12',
            c8:'20',
            c9:<img src='' alt='...'/>
        },
        ];
        return (
            <>{
                Stockvaccinearr.map((item, _key) => {
                    return <tr key={item.id}>
                        <td>{item.c1}</td>
                        <td>{item.c2}</td>
                        <td>{item.c3}</td>
                        <td>{item.c4}</td>
                        <td>{item.c5}</td>
                        <td>{item.c6}</td>
                        <td>{item.c7}</td>
                        <td>{item.c8}</td>
                        <td></td>
                        <td><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /><img src={process.env.PUBLIC_URL + "/images/medicine.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></td>
        
                    </tr>
                })
            }
            </>
    )
}

function Stockmedicinearray(){
    let Stockvaccinearr = [{
        id: 1,
        c1: "M-12",
        c2: "Medicine Name 1",
        c3: 'LCY-12342',
        c4: '10/10/2022',
        c5: '230',
        c6: '200',
        c7: '12',
        c8:'20',
        c9:<img src='' alt='...'/>
    },
    {
        id: 2,
        c1: "M-12",
        c2: "Medicine Name 1",
        c3: 'LCY-12342',
        c4: '10/10/2022',
        c5: '230',
        c6: '200',
        c7: '12',
        c8:'20',
        c9:<img src='' alt='...'/>
    },
    {
        id: 3,
        c1: "M-12",
        c2: "Medicine Name 1",
        c3: 'LCY-12342',
        c4: '10/10/2022',
        c5: '230',
        c6: '200',
        c7: '12',
        c8:'20',
        c9:<img src='' alt='...'/>
    },
    {
        id: 4,
        c1: "M-12",
        c2: "Medicine Name 1",
        c3: 'LCY-12342',
        c4: '10/10/2022',
        c5: '230',
        c6: '200',
        c7: '12',
        c8:'20',
        c9:<img src='' alt='...'/>
    },
    {
        id: 5,
        c1: "M-12",
        c2: "Medicine Name 1",
        c3: 'LCY-12342',
        c4: '10/10/2022',
        c5: '230',
        c6: '200',
        c7: '12',
        c8:'20',
        c9:<img src='' alt='...'/>
    },
    {
        id: 6,
        c1: "M-12",
        c2: "Medicine Name 1",
        c3: 'LCY-12342',
        c4: '10/10/2022',
        c5: '230',
        c6: '200',
        c7: '12',
        c8:'20',
        c9:<img src='' alt='...'/>
    },
    ];
    return (
        <>{
            Stockvaccinearr.map((item, _key) => {
                return <tr key={item.id}>
                    <td>{item.c1}</td>
                    <td>{item.c2}</td>
                    <td>{item.c3}</td>
                    <td>{item.c4}</td>
                    <td>{item.c5}</td>
                    <td>{item.c6}</td>
                    <td>{item.c7}</td>
                    <td>{item.c8}</td>
                    <td></td>
                    <td><img src={process.env.PUBLIC_URL + "/images/cart.png"} alt="displaying_image" style={{ width: "1.5rem" }} className="me-1" /><img src={process.env.PUBLIC_URL + "/images/medicine.png"} alt="displaying_image" className="ms-1" style={{ width: "1.5rem" }} /></td>
    
                </tr>
            })
        }
        </>
)
}
export{Stockvaccinearray};
export{Stockmedicinearray};
