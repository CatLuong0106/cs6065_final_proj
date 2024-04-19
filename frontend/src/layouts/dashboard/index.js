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
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Soft UI Dashboard React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const { size } = typography;
  const [households, setHouseholds] = useState([]);
  const [hshdNum, setHshdNum] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [years, setYears] = useState([]);
  const [yearlyTransactions, setYearlyTransactions] = useState([]);
  const [chart, setChart] = useState('');
  const [items, setItems] = useState();
  const [gradientLineChartData_IR, setGradientLineChartData_IR] = useState('');
  const [gradientLineChartData_HS, setGradientLineChartData_HS] = useState('');


  useEffect(() => {
    processDataAndPopulateYearlyTrans();
  }, []);

  const fetchHouseholds = async () => {

    let url = 'http://localhost:5000/getHouseholds?page=1&pageSize=50000'

    try {
      const response = await axios.get(url);
      setHouseholds(response.data);
      return response.data;
    } catch (error) {
      setHouseholds([])
      console.error('Error fetching data:', error);
    }
  };

  const processDataAndPopulateYearlyTrans = async () => {
    try {
      const hhs = await fetchHouseholds(); // Wait for households data to be fetched
      
      const uniqueHouseholds = new Set();
      const incomeRanges = {};
      const yearlyTrans = {};
      let spend = 0;
  
      const groupedByIncomeRange = {};
      const groupedByHshdSize = {};

      // Process the fetched households data
      hhs.forEach(hh => {
        const range = hh['Income_range'].trim();
        const hhSize = hh['Hshd_size'].trim()
        const year = hh['Year'];
  
        if (yearlyTrans.hasOwnProperty(year)) {
          yearlyTrans[year] += 1; // Increment transaction count for existing year
        } else {
          yearlyTrans[year] = 1; // Initialize transaction count for new year
        }

        uniqueHouseholds.add(hh['Hshd_num']);

        spend += hh['Spend']
        
        // Process group by income range
        if (!groupedByIncomeRange[range]) {
          groupedByIncomeRange[range] = {};
        }

        if (!groupedByIncomeRange[range][year]) {
          groupedByIncomeRange[range][year] = spend;
        } else {
          groupedByIncomeRange[range][year] += spend;
        }

        // Process group by household size
        if (!groupedByHshdSize[hhSize]) {
          groupedByHshdSize[hhSize] = {};
        }

        if (!groupedByHshdSize[hhSize][year]) {
          groupedByHshdSize[hhSize][year] = spend;
        } else {
          groupedByHshdSize[hhSize][year] += spend;
        }
      });

      const years = Object.keys(yearlyTrans);
      const transactions = Object.values(yearlyTrans);

      const chart = {
        labels: years,
        datasets: { label: "Transactions", data: transactions },
      }

      const items =  [
        {
          icon: { color: "primary", component: "house" },
          label: "Households",
          progress: { content: uniqueHouseholds.size, percentage: 0 },
        },
        {
          icon: { color: "error", component: "wallet" },
          label: "Total Spend",
          progress: { content:"$"+(spend).toFixed(2), percentage: 0 },
        },
        {
          icon: { color: "info", component: "money" },
          label: "Average Houshold Spend",
          progress: { content: "$"+(spend/uniqueHouseholds.size).toFixed(2), percentage: 0 },
        },
        {
          icon: { color: "warning", component: "payment" },
          label: "Average Transaction",
          progress: { content: "$"+(spend/hhs.length).toFixed(2), percentage: 0 },
        },
      ]

      setChart(chart);
      setItems(items);


      console.log(groupedByIncomeRange);

      // Predefined list of Material UI colors
      const colors = [
        'primary',
        'light',
        'error',
        'warning',
        'info',
        'action',
        'success'
      ];

      const datasets = [];

      const incomeRangeOrder = [
        'UNDER 35K',
        '35-49K',
        '50-74K',
        '75K-99K',
        '100-150K',
        '150K+',
        'null'
      ];

      incomeRangeOrder.forEach(incomeRange => {
        if (groupedByIncomeRange[incomeRange]) {
          // Get a random color from the predefined Material UI colors
          const color = colors.pop();
      
          const data = {
            label: incomeRange,
            color: color,
            data: [],
          };
      
          // Populate data array with spending for specific years (2018, 2019, 2020, etc.)
          years.forEach(year => {
            const spending = groupedByIncomeRange[incomeRange][year] || 0;
            data.data.push(spending);
          });
          datasets.push(data);
        }
      });
      

      const gradientLineChartData_IR = {
        labels: years,
        datasets: datasets
      };

      setGradientLineChartData_IR(gradientLineChartData_IR);

      // Process chart Houshold Size
      const datasets_HS = [];
      
      const colors_2 = [
        'error',
        'info',
        'primary',
        'success',
        'warning'
      ];

      Object.keys(groupedByHshdSize).forEach((hshdSize) => {
        // Get a random color from the predefined Material UI colors
        const color = colors_2.pop()

        const data = {
          label: hshdSize,
          color: color,
          data: [],
        };

        years.forEach(year => {
          const spending = groupedByHshdSize[hshdSize][year] || 0;
          data.data.push(spending);
        });

        datasets_HS.push(data);
      });


      const gradientLineChartData_HS = {
        labels: years,
        datasets: datasets_HS
      };

      setGradientLineChartData_HS(gradientLineChartData_HS)
    
        // Now you can use yearlyTrans for further processing or rendering
        // For example, update state with this data if you're using React hooks
        // setYearlyTransactions(yearlyTrans);
    } catch (error) {
      console.error('Error processing data:', error);
      // Handle any errors that occur during processing
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
              <ReportsBarChart
                title="Household transactions"
                chart={chart}
                items={items}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={12} lg={6}>
              <GradientLineChart
                title="Spending for each Income range over the years"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      Individuals in the 50-75K income range often have more disposable income compared to lower-income groups. This increased income can lead to a higher propensity to spend on both necessities and discretionary items. While individuals in the under 35K income range may have lower overall income, they may spend a significant portion of their income on essential goods and services, leaving less room for discretionary spending. High-income individuals (top earners) may prioritize savings, investments, and asset accumulation over immediate consumption. They may have already satisfied many of their basic needs and may be more focused on wealth preservation or long-term financial goals
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData_IR}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <GradientLineChart
                title="Spending for each Household Size over the years"
                description={
                  <SoftBox display="flex" alignItems="center">
                    <SoftTypography variant="button" color="text" fontWeight="medium">
                      Smaller households, particularly singles or couples without children, may allocate a larger portion of their income to food expenses, including higher-quality groceries and indulgent treats. Larger households typically buy groceries in bulk or larger quantities to accommodate family needs. In contrast, smaller households may purchase smaller quantities more frequently, resulting in higher spending per visit. Smaller households may prioritize personalized shopping experiences and tailored purchases based on individual needs and dietary preferences. This can result in higher spending on specialized or premium products available at Kroger.
                    </SoftTypography>
                  </SoftBox>
                }
                height="20.25rem"
                chart={gradientLineChartData_HS}
              />
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
