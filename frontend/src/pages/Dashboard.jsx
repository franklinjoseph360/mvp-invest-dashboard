import { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    padding: 10px;
    font-family: 'Segoe UI', sans-serif;
`;

const Heading = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const SubHeading = styled.h2`
  font-size: 1.2rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  @media (max-width: 600px) {
    font-size: 0.9rem;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const Th = styled.th`
  text-align: left;
  background: #f2f2f2;
  color: #333;
  padding: 0.75rem;
`;

const Td = styled.td`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
`;

const Loading = styled.p`
  font-style: italic;
`;

const ChartContainer = styled.div`
  margin-top: 2rem;

  @media (max-width: 600px) {
    height: 250px;
  }
`;


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authRes = await axios.get('/api/v1/auth/authorize', { withCredentials: true });
                setUser(authRes.data);

                const dashboardRes = await axios.get('/api/v1/dashboard', { withCredentials: true });
                setDashboardData(dashboardRes.data);

                setLoading(false);
            } catch (err) {
                console.error('Unauthorized');
                window.location.href = '/app/login';
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loading>Loading dashboard...</Loading>;

    const { name, role, portfolio } = dashboardData || {};
    const isChild = role === 'Child';
    const isParent = role === 'Parent';

    const parsedHistory = portfolio?.history?.length ? portfolio?.history
        .map((a) => JSON.parse(a) || []) : []
    
    const sortedHistory = [...(parsedHistory || [])].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    return (
        <Wrapper>
            <div>
                <Heading>Welcome, {name}</Heading>
                <SubHeading>Role, {role}</SubHeading>
            </div>

            {isChild && (
                <>
                    <SubHeading>You have ${portfolio.portfolioValue} today</SubHeading>
                    <SubHeading>Your money grew by ${portfolio.monthlyChange} this month</SubHeading>
                </>
            )}

            {isParent && portfolio && (
                <>
                    <SubHeading>Portfolio Summary</SubHeading>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Investor Name</Th>
                                <Th>Portfolio Value</Th>
                                <Th>Monthly Change</Th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <Td>{portfolio.name}</Td>
                                <Td>${portfolio.portfolioValue}</Td>
                                <Td>${portfolio.monthlyChange}</Td>
                            </tr>
                        </tbody>
                    </Table>

                    <SubHeading>Portfolio History</SubHeading>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Date</Th>
                                <Th>Value</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedHistory?.map((entry, i) => (
                                <tr key={i}>
                                    <Td>{entry.date}</Td>
                                    <Td>${entry.value}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <SubHeading>Investments</SubHeading>
                    <Table>
                        <thead>
                            <tr>
                                <Th>Company</Th>
                                <Th>Fun Fact</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.investments?.map((inv, i) => (
                                <tr key={i}>
                                    <Td>{inv.name}</Td>
                                    <Td>{inv.funFact}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            <SubHeading>Growth Over Time</SubHeading>
            <ChartContainer>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={parsedHistory}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#2d72d9" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </Wrapper>
    );
};

export default Dashboard;
