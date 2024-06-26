/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import React, { useState, useEffect } from 'react';
import axios from 'axios';


function Tables() {
  const [households, setHouseholds] = useState([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20); // Number of records per page
  const [dataRows, setDataRows] = useState([]);
  const [hshdNum, setHshdNum] = useState('');
  const [householdsFile, setHouseholdsFile] = useState(null);
  const [transactionsFile, setTransactionsFile] = useState(null);
  const [productsFile, setProductsFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const fetchData = async () => {

    let url = ''

    if (hshdNum | hshdNum != 0) {
      url = `/getHouseholds/${hshdNum}?page=${page}&pageSize=${pageSize}`
    }
    else {
      url = `/getHouseholds?page=${page}&pageSize=${pageSize}`
    }

    try {
      const response = await axios.get(url);
      setDataRows(response.data);
    } catch (error) {
      setDataRows([])
      console.error('Error fetching data:', error);
    }
  };


  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPreviousPage = () => {
    setPage(page - 1);
  };


  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleFileHouseholds = async () => {
    if (householdsFile) {
      const formData = new FormData();
      formData.append('file', householdsFile);

      try {
        const response = await axios.post('/uploadHouseholdsFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          alert("Households File uploaded successfully!");
        } 

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFileTransactions = async () => {
    if (transactionsFile) {
      const formData = new FormData();
      formData.append('file', transactionsFile);

      try {
        const response = await axios.post('/uploadTransactionsFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          alert("Transactions File uploaded successfully!");
        } 

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleFileProducts = async () => {
    if (productsFile) {
      const formData = new FormData();
      formData.append('file', productsFile);

      try {
        const response = await axios.post('/uploadProductsFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          alert("Products File uploaded successfully!");
        } 

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const columns = [
    { name: 'Hshd_num', align: 'left', width: '100px' },
    { name: 'Basket_num', align: 'right', width: '100px' },
    { name: 'Purchase_date', align: 'left', width: '200px' },
    { name: 'Product_num', align: 'right', width: '100px' },
    { name: 'Brand_type', align: 'left', width: '150px' },
    { name: 'Natural_organic_flag', align: 'left', width: '150px' },
    { name: 'Department', align: 'left', width: '150px' },
    { name: 'Commodity', align: 'left', width: '150px' },
    { name: 'Spend', align: 'right', width: '100px' },
    { name: 'Units', align: 'right', width: '100px' },
    { name: 'Store_region', align: 'left', width: '150px' },
    { name: 'Week_num', align: 'right', width: '100px' },
    { name: 'Year', align: 'right', width: '100px' },
    { name: 'Loyalty_flag', align: 'left', width: '100px' },
    { name: 'Age_range', align: 'left', width: '150px' },
    { name: 'Marital_status', align: 'left', width: '150px' },
    { name: 'Income_range', align: 'left', width: '150px' },
    { name: 'Homeowner_desc', align: 'left', width: '150px' },
    { name: 'Hshd_composition', align: 'left', width: '200px' },
    { name: 'Children', align: 'left', width: '100px' },
    { name: 'Hshd_size', align: 'left', width: '100px' },
  ];
  
  const rows = dataRows.map((household) => ({
  Hshd_num: household.Hshd_num,
  Age_range: household.Age_range.trim(),
  Marital_status: household.Marital_status.trim(),
  Children: household.Children.trim(),
  Hshd_size: household.Hshd_size.trim(),
  Income_range: household.Income_range.trim(),
  Store_region: household.Store_region.trim(),
  Spend: household.Spend.toFixed(2),
  Purchase_date: new Date(household.Purchase_date).toLocaleDateString('en-US'),
  Basket_num: household.Basket_num,
  Brand_type: household.Brand_type.trim(),
  Commodity: household.Commodity.trim(),
  Department: household.Department.trim(),
  Homeowner_desc: household.Homeowner_desc.trim(),
  Hshd_composition: household.Hshd_composition.trim(),
  Loyalty_flag: household.Loyalty_flag.trim(),
  Natural_organic_flag: household.Natural_organic_flag.trim(),
  Product_num: household.Product_num,
  Units: household.Units,
  Week_num: household.Week_num,
  Year: household.Year,
}));


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            <Card style={{width:'30%', marginLeft: '-22px' }} display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <input type="file" onChange={(e) => setHouseholdsFile(e.target.files[0])} /> 
                <button onClick={handleFileHouseholds}  style={{ fontSize: '12px', padding: '8px 10px', marginLeft: '10px',backgroundColor: '#1cadad', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upload Households File</button>
              </SoftBox>
            </Card>
            <Card style={{width:'30%'}} display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <input type="file" onChange={(e) => setTransactionsFile(e.target.files[0])}/> 
                <button  onClick={handleFileTransactions} style={{ fontSize: '12px', padding: '8px 10px', marginLeft: '10px',backgroundColor: '#1cadad', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upload Transactions File</button>
              </SoftBox>
            </Card>
            <Card style={{width:'30%', marginRight: '-22px'}} display="flex" justifyContent="space-between" alignItems="center">
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <input type="file" onChange={(e) => setProductsFile(e.target.files[0])}/> 
                <button  onClick={handleFileProducts} style={{ fontSize: '12px', padding: '8px 10px', marginLeft: '10px',backgroundColor: '#1cadad', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Upload Products File</button>
              </SoftBox>
            </Card>
          </SoftBox>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Households table</SoftTypography>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search by HSHD_NUM"
                  style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '5px', cursor: 'pointer' }}
                  value={hshdNum}
                  onChange={(e) => setHshdNum(e.target.value)}
                />
                <button onClick={handleSearch} style={{ fontSize: '12px', padding: '8px 10px', marginLeft: '10px',backgroundColor: '#1cadad', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Search
                </button>
              </div>
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  style={{ fontSize: '12px', padding: '8px 10px', marginRight: '10px', marginBottom: '20px', backgroundColor: '#1cadad', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={goToPreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span style={{ fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' }}>Page {page}</span>
                <button
                  style={{ fontSize: '12px', padding: '8px 10px', marginLeft: '10px', marginBottom: '20px',backgroundColor: '#1cadad', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={goToNextPage}
                >
                  Next
                </button>
              </div>
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
